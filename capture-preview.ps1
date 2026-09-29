$ErrorActionPreference = "Stop"
$out = Join-Path $env:TEMP "bouquet-preview"
New-Item -ItemType Directory -Force -Path $out | Out-Null
$log = Join-Path $out "log.txt"
function Log($m) { Add-Content -Path $log -Value $m }

$chrome = "C:\Program Files\Google\Chrome\Application\chrome.exe"
$profile = Join-Path $env:TEMP "bouquet-cdp-profile"
if (Test-Path $profile) { Remove-Item $profile -Recurse -Force -ErrorAction SilentlyContinue }
New-Item -ItemType Directory -Force -Path $profile | Out-Null

$proc = Start-Process -FilePath $chrome -ArgumentList @(
  "--headless=new",
  "--disable-gpu",
  "--hide-scrollbars",
  "--window-size=1360,920",
  "--remote-debugging-port=9333",
  "--user-data-dir=$profile",
  "about:blank"
) -PassThru -WindowStyle Hidden

try {
  $targets = $null
  for ($i = 0; $i -lt 30; $i++) {
    try {
      $targets = Invoke-RestMethod "http://127.0.0.1:9333/json/list"
      if ($targets) { break }
    } catch { Start-Sleep -Milliseconds 300 }
  }
  if (-not $targets) { throw "Chrome DevTools did not start" }

  $wsUrl = @($targets)[0].webSocketDebuggerUrl
  $client = [System.Net.WebSockets.ClientWebSocket]::new()
  $cts = [System.Threading.CancellationTokenSource]::new()
  $cts.CancelAfter(60000)
  $client.ConnectAsync([Uri]$wsUrl, $cts.Token).GetAwaiter().GetResult() | Out-Null

  $script:msgId = 0
  function Invoke-Cdp($method, $params) {
    $script:msgId++
    $id = $script:msgId
    $payload = @{ id = $id; method = $method }
    if ($null -ne $params) { $payload.params = $params }
    $json = $payload | ConvertTo-Json -Compress -Depth 30
    $bytes = [System.Text.Encoding]::UTF8.GetBytes($json)
    $seg = [System.ArraySegment[byte]]::new($bytes)
    $client.SendAsync($seg, [System.Net.WebSockets.WebSocketMessageType]::Text, $true, $cts.Token).GetAwaiter().GetResult() | Out-Null

    while ($true) {
      $ms = New-Object System.IO.MemoryStream
      do {
        $buffer = New-Object byte[] 262144
        $segIn = [System.ArraySegment[byte]]::new($buffer)
        $result = $client.ReceiveAsync($segIn, $cts.Token).GetAwaiter().GetResult()
        $ms.Write($buffer, 0, $result.Count)
        $end = $result.EndOfMessage
      } while (-not $end)
      $text = [System.Text.Encoding]::UTF8.GetString($ms.ToArray())
      $parsed = $text | ConvertFrom-Json
      if ($parsed.id -eq $id) { return $parsed }
    }
  }

  function Eval($expression) {
    $response = Invoke-Cdp "Runtime.evaluate" @{ expression = $expression; awaitPromise = $true; returnByValue = $true }
    if ($response.exceptionDetails) { throw ($response.exceptionDetails | ConvertTo-Json -Depth 6) }
    return $response.result.result.value
  }

  function Shot($name) {
    $response = Invoke-Cdp "Page.captureScreenshot" @{ format = "png" }
    $data = $response.result.data
    Log ("shot $name type=$($data.GetType().FullName) len=$($data.Length)")
    $path = Join-Path $out "$name.png"
    [IO.File]::WriteAllBytes($path, [Convert]::FromBase64String($data))
    Log "wrote $path $((Get-Item $path).Length)"
  }

  Invoke-Cdp "Page.enable" $null | Out-Null
  Log "navigate"
  Invoke-Cdp "Page.navigate" @{ url = "http://127.0.0.1:8765/" } | Out-Null
  Start-Sleep -Seconds 1
  $title = Eval "document.fonts.ready.then(() => document.querySelector('h1')?.textContent || 'no-h1')"
  Log "title=$title"
  Start-Sleep -Milliseconds 400
  Log "before shot 1"
  Shot "01-occasion" | Out-Null
  Log "after shot 1"

  Eval @"
document.querySelector('[data-id=""birthday""]').click();
document.querySelector('[data-action=""next""]').click();
document.querySelector('h1')?.textContent
"@ | Write-Output

  Start-Sleep -Milliseconds 300
  Shot "02-palette" | Out-Null

  Eval @"
document.querySelector('[data-id=""pastel""]').click();
document.querySelector('[data-action=""next""]').click();
document.querySelector('[data-id=""lush""]').click();
document.querySelector('[data-action=""next""]').click();
['tulip','rose','ranunculus'].forEach(id => document.querySelector('[data-id=""'+id+'""]').click());
document.querySelector('[data-action=""next""]').click();
document.querySelector('h1')?.textContent + ' ' + document.querySelector('.price')?.textContent
"@ | Write-Output

  Start-Sleep -Milliseconds 500
  Shot "03-result" | Out-Null
  Log "all shots done"
} catch {
  Log ("FAIL " + $_.Exception.Message)
  throw
} finally {
  if ($proc -and -not $proc.HasExited) { Stop-Process -Id $proc.Id -Force -ErrorAction SilentlyContinue }
}
