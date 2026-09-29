import { BUDGETS, FLOWERS, GREENS, OCCASIONS, PALETTES, findById } from "./data.js";

export function formatPrice(value) {
  return `${new Intl.NumberFormat("ru-RU").format(value)} ₽`;
}

function hash(value) {
  return [...String(value)].reduce((sum, char) => sum + char.charCodeAt(0), 0);
}

function sum(counts) {
  return counts.reduce((total, count) => total + count, 0);
}

const STYLES = [
  {
    id: "round",
    title: "Круглый",
    text: "Классический купол: букет одинаково хорош со всех сторон."
  },
  {
    id: "airy",
    title: "Воздушный",
    text: "Больше шага между головками, чтобы каждый цветок читался отдельно."
  },
  {
    id: "garden",
    title: "Садовый",
    text: "Свободная сборка, похожая на букет, только что срезанный в саду."
  }
];

export function buildBouquet(input) {
  const occasion = findById(OCCASIONS, input.occasion);
  const palette = findById(PALETTES, input.palette);
  const budget = findById(BUDGETS, input.budget);
  const flowers = (input.composition || [])
    .map((id) => findById(FLOWERS, id))
    .filter(Boolean);
  const seed = Number.isFinite(input.seed) ? input.seed : 1;

  if (!occasion || !palette || !budget || flowers.length === 0) return null;

  const weights = flowers.map((flower) => {
    let weight = 1;
    if (occasion.favorites.includes(flower.id)) weight += 1.15;
    if (flower.palettes.includes(palette.id)) weight += 0.4;
    weight += ((hash(flower.id) + seed) % 5) * 0.06;
    return weight;
  });

  const counts = flowers.map(() => 1);
  if (flowers.length === 1) counts[0] = occasion.even ? 2 : 3;

  const greenCount = (source) => Math.max(2, Math.round(sum(source) * 0.35));
  const bloomPrice = (source) =>
    source.reduce((total, count, index) => total + count * flowers[index].price, 0);
  const total = (source) =>
    bloomPrice(source) + greenCount(source) * GREENS.price + budget.packaging.price;

  if (total(counts) > budget.max && flowers.length === 1) {
    counts[0] = occasion.even ? 2 : 1;
  }

  let guard = 0;
  while (guard++ < 240) {
    const before = total(counts);
    if (before > budget.max) break;
    if (before >= budget.min && Math.abs(before - budget.target) < 120) break;

    let best = null;
    flowers.forEach((_, index) => {
      const nextShare = (counts[index] + 1) / (sum(counts) + 1);
      const crowded = flowers.length > 1 && nextShare > 0.42 && before >= budget.min;
      counts[index] += 1;
      const after = total(counts);
      counts[index] -= 1;
      if (after > budget.max) return;
      const distance = Math.abs(after - budget.target) + (crowded ? 4000 : 0);
      const rank = distance - weights[index] * 15;
      if (!best || rank < best.rank) best = { index, rank, distance, after };
    });

    if (!best) break;
    if (before >= budget.min && Math.abs(before - budget.target) <= Math.abs(best.after - budget.target)) break;
    counts[best.index] += 1;
  }

  fixParity(counts, flowers, occasion.even, total, budget.max);

  const price = total(counts);
  const stems = sum(counts);
  const greens = greenCount(counts);
  const paletteIndex = Math.max(0, PALETTES.findIndex((item) => item.id === palette.id));
  const style = occasion.even
    ? {
        id: "quiet",
        title: "Сдержанный",
        text: "Ровный купол без лишнего декора. Спокойная сборка для церемонии."
      }
    : flowers.length === 1
      ? {
          id: "mono",
          title: "Монобукет",
          text: "Один вид цветка: характер держат разные раскрытия бутонов и одна гамма."
        }
      : STYLES[(seed + paletteIndex) % STYLES.length];

  const outside = flowers.filter((flower) => !flower.palettes.includes(palette.id));
  const flowerSentence = flowers
    .map((flower, index) => `${flower.name.toLowerCase()} — ${counts[index]} шт.`)
    .join(", ");
  const parityText = occasion.even
    ? "Число цветков чётное: так принято в траурной флористике."
    : "Число цветков нечётное: так принято дарить, когда повод праздничный.";

  const warnings = [];
  if (price > budget.max) {
    warnings.push(
      `Даже компактная связка выходит на ${formatPrice(price - budget.max)} выше верхней границы бюджета. Можно заменить дорогой цветок или выбрать следующий диапазон.`
    );
  } else if (price < budget.min) {
    warnings.push(
      `В этом составе не получается добрать сумму до нижней границы, не выходя за верхнюю. Сейчас букет собран максимально близко к диапазону.`
    );
  }
  if (flowers.some((flower) => flower.seasonal)) {
    warnings.push(
      "Пион зависит от сезона. Если в поставке его не будет, флорист предложит пионовидную розу или ранункулюс того же оттенка."
    );
  }
  if (outside.length) {
    warnings.push(
      `${outside.map((flower) => flower.name).join(", ")} ${outside.length === 1 ? "стоит" : "стоят"} вне основной гаммы. В сборке ${outside.length === 1 ? "этот цветок работает" : "эти цветы работают"} как спокойный акцент, не как новый цвет.`
    );
  }

  const care = [];
  care.push("По приходе подрежьте стебли на сантиметр и поставьте букет в прохладную воду на час, не снимая упаковку полностью.");
  for (const flower of flowers) {
    if (care.length >= 3) break;
    care.push(flower.care);
  }
  if (care.length < 3) care.push(GREENS.care);

  const lines = [
    ...flowers.map((flower, index) => ({
      kind: "flower",
      id: flower.id,
      name: flower.name,
      draw: flower.draw,
      count: counts[index],
      unit: flower.price,
      sum: flower.price * counts[index]
    })),
    {
      kind: "green",
      id: GREENS.id,
      name: GREENS.name,
      count: greens,
      unit: GREENS.price,
      sum: greens * GREENS.price
    },
    {
      kind: "pack",
      id: budget.packaging.id,
      name: budget.packaging.title,
      count: 1,
      unit: budget.packaging.price,
      sum: budget.packaging.price
    }
  ];

  return {
    name: occasion.names[(seed + paletteIndex) % occasion.names.length],
    style,
    message: occasion.messages[(seed + (input.cardShift || 0)) % occasion.messages.length],
    note: `Для повода «${occasion.title.toLowerCase()}» в гамме «${palette.title.toLowerCase()}» собран ${style.title.toLowerCase()} букет. В составе ${flowerSentence}. Зелень — ${greens} ${greensWord(greens)}: она держит форму и не даёт цветкам слипнуться. ${parityText}`,
    warnings,
    care,
    stems,
    greens,
    price,
    lines,
    within: price >= budget.min && price <= budget.max,
    occasion,
    palette,
    budget
  };
}

function greensWord(count) {
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod10 === 1 && mod100 !== 11) return "ветка";
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return "ветки";
  return "веток";
}

function fixParity(counts, flowers, even, total, max) {
  const isEven = () => sum(counts) % 2 === 0;
  if (isEven() === Boolean(even)) return;

  const byPrice = flowers
    .map((flower, index) => ({ index, price: flower.price }))
    .sort((a, b) => a.price - b.price);

  for (const item of byPrice) {
    counts[item.index] += 1;
    if (total(counts) <= max) return;
    counts[item.index] -= 1;
  }

  const byCount = flowers
    .map((_, index) => index)
    .sort((a, b) => counts[b] - counts[a]);
  const minKeep = flowers.length === 1 ? 2 : 1;
  for (const index of byCount) {
    if (counts[index] > minKeep) {
      counts[index] -= 1;
      return;
    }
  }
}

export function orderText({ config, recipe, form }) {
  const lines = recipe.lines
    .map((line) => {
      const amount = line.kind === "pack" ? "" : `${line.count} × ${formatPrice(line.unit)}`;
      const left = line.kind === "pack" ? line.name : `${line.name} — ${line.count}`;
      return `• ${left}${amount ? ` (${amount})` : ` (${formatPrice(line.sum)})`}`;
    })
    .join("\n");

  const delivery =
    form.delivery === "courier"
      ? `Доставка: ${form.address || "адрес уточнит менеджер"}`
      : "Самовывоз из ателье";

  return [
    `Заказ — ${config.shopName}`,
    `Букет «${recipe.name}»`,
    `Повод: ${recipe.occasion.title}`,
    `Гамма: ${recipe.palette.title}`,
    `Бюджет: ${recipe.budget.range}`,
    `Сборка: ${recipe.style.title}`,
    "",
    "Состав:",
    lines,
    "",
    `Итого: ${formatPrice(recipe.price)}`,
    `Открытка: ${form.card || recipe.message}`,
    "",
    form.name ? `Имя: ${form.name}` : "",
    form.phone ? `Телефон: ${form.phone}` : "",
    form.date ? `Когда нужен: ${form.date}` : "",
    delivery
  ]
    .filter((line) => line !== "")
    .join("\n");
}
