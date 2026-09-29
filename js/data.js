export const OCCASIONS = [
  {
    id: "birthday",
    title: "День рождения",
    text: "Праздник, который хочется рассмотреть вблизи",
    palettes: ["pastel", "sun", "contrast", "wine"],
    favorites: ["rose", "peony", "gerbera", "sunflower"],
    names: ["Именинный сад", "Счастливый круг", "Тёплый тост", "Букет к столу"],
    messages: [
      "С днём рождения. Пусть этот год будет светлым и неспешным.",
      "Празднуем тебя. Пусть впереди будет больше поводов улыбнуться.",
      "С днём рождения. Этот букет — просто чтобы день начался красиво."
    ]
  },
  {
    id: "date",
    title: "Свидание",
    text: "Первое, пятое или уже привычное",
    palettes: ["red", "wine", "pastel"],
    favorites: ["rose", "ranunculus", "anemone", "tulip"],
    names: ["Тихий вечер", "Между делом", "Письмо без конверта", "Встреча"],
    messages: [
      "До встречи. Хочется прийти не с пустыми руками.",
      "Пусть этот вечер будет только нашим.",
      "С нетерпением жду встречи."
    ]
  },
  {
    id: "confession",
    title: "Признание",
    text: "Когда слов мало, а сказать нужно",
    palettes: ["red", "pastel", "wine"],
    favorites: ["rose", "peony", "ranunculus", "anemone"],
    names: ["Сказать вслух", "Тихое да", "Без черновика", "Открытый текст"],
    messages: [
      "Мне важно сказать это лично. Я рядом и не тороплюсь.",
      "Это сказано прямо: ты мне очень нравишься.",
      "Это не намёк. Это признание."
    ]
  },
  {
    id: "wedding",
    title: "Свадьба",
    text: "Для невесты, пары или гостей",
    palettes: ["white", "pastel", "green"],
    favorites: ["rose", "peony", "hydrangea", "eustoma"],
    names: ["Светлый день", "Обет", "Садовый круг", "Тихая клятва"],
    messages: [
      "Поздравляем со свадьбой. Пусть дом будет спокойным и тёплым.",
      "С днём свадьбы. Пусть любовь останется привычкой, а не подвигом.",
      "Для вас двоих — светло и без лишнего шума."
    ]
  },
  {
    id: "anniversary",
    title: "Годовщина",
    text: "Напомнить, с чего всё началось",
    palettes: ["wine", "red", "pastel"],
    favorites: ["rose", "anemone", "ranunculus", "peony"],
    names: ["Годы рядом", "Первый адрес", "Снова да", "Наша дата"],
    messages: [
      "С годовщиной. Спасибо, что вы до сих пор выбираете друг друга.",
      "Ещё один год рядом. Хорошо, что это по-прежнему вы.",
      "Вашей дате. Пусть следующий год будет таким же надёжным."
    ]
  },
  {
    id: "thanks",
    title: "Благодарность",
    text: "Тёплый жест без лишней торжественности",
    palettes: ["sun", "pastel", "white"],
    favorites: ["tulip", "gerbera", "matthiola", "sunflower"],
    names: ["Спасибо", "Тёплые руки", "За заботу", "Простое спасибо"],
    messages: [
      "Спасибо. Эта забота была очень вовремя.",
      "Небольшая благодарность — за помощь, время и тепло.",
      "Спасибо. Это хочется сказать не только словами."
    ]
  },
  {
    id: "apology",
    title: "Извинение",
    text: "Мягко, честно и без театра",
    palettes: ["pastel", "white", "lavender"],
    favorites: ["tulip", "eustoma", "matthiola", "rose"],
    names: ["Давай сначала", "Мне жаль", "Тихий разговор", "После ссоры"],
    messages: [
      "Прости. Мне правда жаль, и я хочу поговорить спокойно.",
      "Мне жаль. Если можно, давай начнём этот разговор заново.",
      "Это моя ошибка. Цветы не вместо извинения — они вместе с ним."
    ]
  },
  {
    id: "baby",
    title: "Рождение малыша",
    text: "Встреча, к которой долго шли",
    palettes: ["pastel", "white", "lavender"],
    favorites: ["hydrangea", "matthiola", "eustoma", "gypsophila"],
    names: ["Новый человек", "Добро пожаловать", "Тихий дом", "Первый день"],
    messages: [
      "Добро пожаловать. Пусть дом будет спокойным, а ночи — добрее, чем обещают.",
      "С рождением. Мы очень рады новому человеку в вашей семье.",
      "Для вас троих. Пусть эти дни будут тихими и счастливыми."
    ]
  },
  {
    id: "mom",
    title: "Для мамы",
    text: "Забота, которой не нужен отдельный календарь",
    palettes: ["pastel", "wine", "lavender"],
    favorites: ["rose", "peony", "eustoma", "tulip"],
    names: ["Мамин сад", "За всё", "К чаю", "Тёплый дом"],
    messages: [
      "Спасибо, мама. За дом, терпение и за то, что ты есть.",
      "Маме — просто так. Потому что повод не обязателен.",
      "С любовью. Поставь в ту вазу, которую любишь больше всего."
    ]
  },
  {
    id: "sympathy",
    title: "Соболезнование",
    text: "Сдержанно, тихо и с уважением",
    even: true,
    palettes: ["white", "green", "lavender"],
    favorites: ["lily", "rose", "chrysanthemum", "eustoma"],
    names: ["Тихая память", "Светлая память", "Белый покой"],
    messages: [
      "Светлая память. Мы рядом.",
      "Соболезнуем. Пусть память останется тёплой.",
      "С уважением и тихой памятью."
    ]
  }
];

export const PALETTES = [
  {
    id: "pastel",
    title: "Пудровая",
    text: "Румянец, крем и пыльная роза",
    swatches: ["#E7B4B8", "#F3D5C6", "#C98996", "#F7EFE7"],
    blooms: ["#E8B4B8", "#F4D3C4", "#D08A96", "#C56E7C"],
    centers: ["#F7E7D8", "#E7B3A2", "#F3D3C8"],
    paper: "#F8EBE6",
    paperDeep: "#E7D2CC",
    ribbon: "#C96B78",
    leaf: "#7E9A84",
    leafDark: "#3E5C49"
  },
  {
    id: "red",
    title: "Классический красный",
    text: "Глубокий красный и тёплый румянец",
    swatches: ["#B4232A", "#E07A6E", "#F2C7C1", "#6E1418"],
    blooms: ["#C43232", "#9E1D24", "#E07A6E", "#F0B2A8"],
    centers: ["#5C1216", "#F2C7C1", "#7A1A22"],
    paper: "#F6E4E2",
    paperDeep: "#E4C8C4",
    ribbon: "#8E1B22",
    leaf: "#6E8B74",
    leafDark: "#2C4636"
  },
  {
    id: "sun",
    title: "Солнечная",
    text: "Мёд, лимон и тёплый крем",
    swatches: ["#F0C94D", "#F6E27A", "#E39B2B", "#FFF6D8"],
    blooms: ["#F0C83E", "#E39B2B", "#F6E7A4", "#F2D48A"],
    centers: ["#8A5A12", "#FFF6D8", "#C47A1A"],
    paper: "#FBF3DF",
    paperDeep: "#EAD9AE",
    ribbon: "#D9782D",
    leaf: "#7F9558",
    leafDark: "#3E4A28"
  },
  {
    id: "white",
    title: "Белая",
    text: "Чистота, мел и тихая зелень",
    swatches: ["#FFFEFB", "#F3F0EA", "#E4E8EA", "#D5DDD6"],
    blooms: ["#FFFEFB", "#F4F1EA", "#E7EEEA", "#F7F4EF"],
    centers: ["#E7D7A8", "#F7F4EF", "#D9E2DC"],
    paper: "#F7F5F1",
    paperDeep: "#E3DDD4",
    ribbon: "#9AAB9A",
    leaf: "#8AA88A",
    leafDark: "#3E5644"
  },
  {
    id: "wine",
    title: "Винная",
    text: "Бордо, слива и состаренное золото",
    swatches: ["#6E2436", "#8C3A4E", "#C4A484", "#E7D3C5"],
    blooms: ["#6E2436", "#8E3A4B", "#C4A484", "#E4C8BE"],
    centers: ["#E7D3B0", "#4A1824", "#D7B59A"],
    paper: "#F3E6DC",
    paperDeep: "#DCC4B4",
    ribbon: "#6E2436",
    leaf: "#7C8A72",
    leafDark: "#3A4638"
  },
  {
    id: "lavender",
    title: "Лавандовая",
    text: "Сирень, черничный и холодный крем",
    swatches: ["#CDB4DB", "#A48BC2", "#E7DDF2", "#F7F1EA"],
    blooms: ["#CDB4DB", "#A48BC2", "#E4D4F0", "#B9A0D4"],
    centers: ["#F7F1EA", "#6E5A86", "#E7DDF2"],
    paper: "#F4EEF6",
    paperDeep: "#DDD0E6",
    ribbon: "#8E7AAE",
    leaf: "#8EA392",
    leafDark: "#3E5248"
  },
  {
    id: "green",
    title: "Садовая зелень",
    text: "Травы, белый акцент и много воздуха",
    swatches: ["#D5E2C8", "#F4F7F2", "#7E9A78", "#E7F0D8"],
    blooms: ["#F7F6F1", "#E7F0D8", "#D5E2C8", "#F4F1E6"],
    centers: ["#E7D7A1", "#F7F6F1", "#C5D6B8"],
    paper: "#F3F5EF",
    paperDeep: "#D5DDD0",
    ribbon: "#5E7A62",
    leaf: "#5F8F62",
    leafDark: "#24402C"
  },
  {
    id: "contrast",
    title: "Яркий контраст",
    text: "Чистые цвета и графичная сборка",
    swatches: ["#F4F1EA", "#E85D4C", "#F2C14E", "#243038"],
    blooms: ["#F6F3EC", "#E85D4C", "#F2C14E", "#2C3A44"],
    centers: ["#243038", "#F6F3EC", "#C4473A"],
    paper: "#F7F4EF",
    paperDeep: "#DED8CF",
    ribbon: "#243038",
    leaf: "#3E6B4F",
    leafDark: "#1C3326"
  }
];

export const BUDGETS = [
  {
    id: "mini",
    title: "Комплимент",
    range: "2 000–3 500 ₽",
    text: "Небольшой жест, который приятно получить сразу в руки",
    min: 2000,
    max: 3500,
    target: 2900,
    packaging: { id: "kraft", title: "Крафт и узкая лента", price: 290 }
  },
  {
    id: "classic",
    title: "Классика",
    range: "3 500–6 000 ₽",
    text: "Уверенный букет на встречу, в гости и к празднику",
    min: 3500,
    max: 6000,
    target: 4900,
    packaging: { id: "matte", title: "Матовая плёнка и лента", price: 450 }
  },
  {
    id: "lush",
    title: "Пышный",
    range: "6 000–10 000 ₽",
    text: "Заметный объём и воздух между головками",
    min: 6000,
    max: 10000,
    target: 8200,
    packaging: { id: "silk", title: "Шёлковая бумага в несколько слоёв", price: 690 }
  },
  {
    id: "festive",
    title: "Праздничный",
    range: "10 000–18 000 ₽",
    text: "Для дня, который будут вспоминать",
    min: 10000,
    max: 18000,
    target: 14000,
    packaging: { id: "box", title: "Шляпная коробка и атлас", price: 1600 }
  },
  {
    id: "signature",
    title: "Авторский",
    range: "18 000–32 000 ₽",
    text: "Крупная работа без компромисса по цветку",
    min: 18000,
    max: 32000,
    target: 24000,
    packaging: { id: "author", title: "Авторская упаковка ателье", price: 2400 }
  }
];

export const FLOWERS = [
  {
    id: "rose",
    name: "Пионовидная роза",
    price: 280,
    palettes: ["pastel", "red", "white", "wine", "contrast"],
    draw: "rose",
    care: "Розам каждый день обновляйте срез по диагонали и не ставьте вазу рядом с фруктами."
  },
  {
    id: "peony",
    name: "Пион",
    price: 520,
    palettes: ["pastel", "white", "wine"],
    draw: "peony",
    seasonal: true,
    care: "Пион любит глубокую воду. Если бутон плотный, дайте ему несколько часов в тёплой комнате."
  },
  {
    id: "tulip",
    name: "Тюльпан",
    price: 160,
    palettes: ["pastel", "red", "sun", "white"],
    draw: "tulip",
    care: "Тюльпаны продолжают расти в вазе. Оставьте им запас высоты и чуть-чуть воды, не полный кувшин."
  },
  {
    id: "ranunculus",
    name: "Ранункулюс",
    price: 340,
    palettes: ["pastel", "sun", "white"],
    draw: "ranunculus",
    care: "Ранункулюс любит прохладу. На ночь букет можно переставить ближе к окну."
  },
  {
    id: "eustoma",
    name: "Эустома",
    price: 260,
    palettes: ["pastel", "white", "lavender", "wine"],
    draw: "eustoma",
    care: "У эустомы снимайте увядшие нижние цветки — тогда верхние будут открываться ещё несколько дней."
  },
  {
    id: "hydrangea",
    name: "Гортензия",
    price: 620,
    palettes: ["pastel", "white", "lavender", "green"],
    draw: "hydrangea",
    care: "Гортензию обильно поите и опрыскивайте шапку. Если она подвяла, поможет короткое погружение стебля в тёплую воду."
  },
  {
    id: "lily",
    name: "Лилия",
    price: 360,
    palettes: ["white", "sun", "wine", "green"],
    draw: "lily",
    care: "У лилии уберите пыльники, пока пыльца не осыпалась: так цветок простоит дольше и не испачкает скатерть."
  },
  {
    id: "gerbera",
    name: "Гербера",
    price: 180,
    palettes: ["red", "sun", "contrast", "pastel"],
    draw: "gerbera",
    care: "Гербере нужна чистая вода каждый день: стебель быстро мутнеет, если вазу не промыть."
  },
  {
    id: "chrysanthemum",
    name: "Кустовая хризантема",
    price: 200,
    palettes: ["sun", "white", "green", "wine", "contrast"],
    draw: "chrysanthemum",
    care: "Хризантема стойкая. Достаточно менять воду через день и убирать листья ниже ватерлинии."
  },
  {
    id: "matthiola",
    name: "Маттиола",
    price: 210,
    palettes: ["pastel", "lavender", "white"],
    draw: "matthiola",
    care: "Маттиола пахнет сильнее к вечеру. Держите воду свежей, чтобы аромат остался мягким."
  },
  {
    id: "anemone",
    name: "Анемон",
    price: 330,
    palettes: ["wine", "white", "contrast", "pastel"],
    draw: "anemone",
    care: "Анемон закрывается в холоде и открывается в тепле. Не ставьте его у кондиционера."
  },
  {
    id: "gypsophila",
    name: "Гипсофила",
    price: 150,
    palettes: ["white", "pastel", "lavender"],
    draw: "gypsophila",
    care: "Гипсофила почти не пьёт. Ей достаточно общей вазы, отдельно подрезать её каждый день не нужно."
  },
  {
    id: "sunflower",
    name: "Подсолнух",
    price: 240,
    palettes: ["sun", "contrast"],
    draw: "sunflower",
    care: "Подсолнух тяжелый. Нужна устойчивая ваза и каждый день свежий срез."
  }
];

export const GREENS = {
  id: "greens",
  name: "Эвкалипт и сезонные травы",
  price: 90,
  care: "Листья, которые оказались в воде, снимите сразу: так букет не зацветёт раньше времени."
};

export function findById(list, id) {
  return list.find((item) => item.id === id) || null;
}
