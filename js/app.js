import { BUDGETS, FLOWERS, OCCASIONS, PALETTES, findById } from "./data.js";
import { bouquetSvg } from "./draw.js";
import { buildBouquet, formatPrice, orderText } from "./engine.js";

const config = {
  shopName: "Тюльпановый сад",
  city: "Москва",
  tagline: "тюльпаны из Москвы",
  phone: "+7 (495) 000-00-00",
  phoneHref: "+74950000000",
  email: "hello@tulpanovy-sad.ru",
  address: "Москва, ул. Цветочная, 12",
  hours: "Ежедневно, 8:00–21:00",
  legalName: "ИП Иванова Мария Сергеевна",
  inn: "770000000000",
  deliveryZone: "Москва и до 20 км за МКАД",
  onSubmit: null,
  ...(window.BOUQUET_CONFIG || {})
};

const STEP_LABELS = ["Повод", "Гамма", "Бюджет", "Состав"];
const STORAGE_KEY = "ideal-bouquet-v1";

const PRIZES = [
  {
    id: "off10",
    kind: "percent",
    value: 10,
    title: "Скидка 10% на этот букет",
    text: "Назовите код, когда перезвоним — пересчитаем сумму до подтверждения.",
    code: "POLE10"
  },
  {
    id: "off15",
    kind: "percent",
    value: 15,
    title: "Скидка 15% на этот букет",
    text: "Редкая сборка. Код действует на эту заявку и сгорает после звонка.",
    code: "POLE15"
  },
  {
    id: "delivery",
    kind: "gift",
    title: "Доставка по городу — в подарок",
    text: "Если букет повезут курьером, дорогу оплачивает ателье.",
    code: "POLEGO"
  },
  {
    id: "card",
    kind: "gift",
    title: "Открытка каллиграфа",
    text: "Текст с букета перепишут от руки, отдельно от упаковки.",
    code: "POLEPEN"
  },
  {
    id: "stems",
    kind: "gift",
    title: "Три стебля сверху",
    text: "Флорист добавит три цветка той же гаммы — сверх состава и сметы.",
    code: "POLE3"
  },
  {
    id: "ribbon",
    kind: "gift",
    title: "Упаковка за счёт ателье",
    text: "Бумага и лента не войдут в итоговую сумму.",
    code: "POLERIBBON"
  }
];

const state = {
  step: 0,
  maxStep: 0,
  occasion: null,
  palette: null,
  budget: null,
  composition: [],
  seed: 1,
  cardShift: 0,
  cardTouched: false,
  orderOpen: false,
  submitted: false,
  prize: null,
  form: {
    name: "",
    phone: "",
    date: "",
    delivery: "pickup",
    address: "",
    card: ""
  },
  error: ""
};

const app = document.querySelector("#app");

function esc(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[char]);
}

function icon(body) {
  return `<svg class="icon" viewBox="0 0 32 32" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`;
}

const ICONS = {
  birthday: icon('<path d="M8 21h16v4.5a2 2 0 0 1-2 2h-12a2 2 0 0 1-2-2Z"/><path d="M8 21c1.5-3 3-3 4-6 1 3 2.5 3 4 0 1.4 3 3 3 4 6"/><path d="M16 8.5V6"/><circle cx="16" cy="5" r="1" fill="currentColor" stroke="none"/>'),
  date: icon('<path d="M16 26s-8.5-5.2-8.5-11A4.8 4.8 0 0 1 16 11a4.8 4.8 0 0 1 8.5 4c0 5.8-8.5 11-8.5 11Z"/>'),
  confession: icon('<path d="M6 9h20v14H6Z"/><path d="m6 10 10 8L26 10"/>'),
  wedding: icon('<circle cx="12" cy="18" r="5"/><circle cx="20" cy="18" r="5"/><path d="M16 7.2 16.8 9.4 19.1 9.6 17.4 11.1 17.9 13.4 16 12.2 14.1 13.4 14.6 11.1 12.9 9.6 15.2 9.4 Z" fill="currentColor" stroke="none"/>'),
  anniversary: icon('<path d="M10 12a4 4 0 1 0 0 8c2.4 0 4-1.6 6-4 2 2.4 3.6 4 6 4a4 4 0 1 0 0-8c-2.4 0-4 1.6-6 4-2-2.4-3.6-4-6-4Z"/>'),
  thanks: icon('<path d="M8 16h16"/><path d="M16 8v16"/><circle cx="16" cy="16" r="9"/>'),
  apology: icon('<path d="M16 27c6-3.2 9-7.2 9-12a9 9 0 0 0-18 0c0 4.8 3 8.8 9 12Z"/><path d="M16 12v6"/><path d="M16 21h.1"/>'),
  baby: icon('<circle cx="16" cy="13" r="4"/><path d="M10 26c.8-3.6 3-5.5 6-5.5S21.2 22.4 22 26"/>'),
  mom: icon('<path d="M16 27V14"/><path d="M16 18c4-1 7-5 6-8-3 .2-5 2-6 5-1-3-3-4.8-6-5 0 3 2 7 6 8Z"/>'),
  sympathy: icon('<path d="M16 24V10"/><path d="M16 12c2.2-3 5.5-2.4 5.5.2 0 2.8-5.5 6.2-5.5 6.2S10.5 15 10.5 12.2C10.5 9.6 13.8 9 16 12Z"/>'),
  mark: icon('<circle cx="16" cy="12" r="4" fill="#e7b4b8" stroke="none"/><path d="M16 16v9M12 21h8"/>')
};

function currentRecipe() {
  return buildBouquet({
    occasion: state.occasion,
    palette: state.palette,
    budget: state.budget,
    composition: state.composition,
    seed: state.seed,
    cardShift: state.cardShift
  });
}

function cardMessage(recipe) {
  if (state.cardTouched && state.form.card.trim()) return state.form.card.trim();
  return recipe?.message || "";
}

function persist() {
  const snapshot = {
    step: state.step,
    maxStep: state.maxStep,
    occasion: state.occasion,
    palette: state.palette,
    budget: state.budget,
    composition: state.composition,
    seed: state.seed,
    cardShift: state.cardShift
  };
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
  } catch {
    /* приватный режим */
  }
}

function restore() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const saved = JSON.parse(raw);
    if (saved.occasion && !findById(OCCASIONS, saved.occasion)) return;
    if (saved.palette && !findById(PALETTES, saved.palette)) return;
    if (saved.budget && !findById(BUDGETS, saved.budget)) return;
    state.step = Math.min(4, Number(saved.step) || 0);
    state.maxStep = Math.min(4, Number(saved.maxStep) || state.step);
    state.occasion = saved.occasion || null;
    state.palette = saved.palette || null;
    state.budget = saved.budget || null;
    state.composition = Array.isArray(saved.composition)
      ? saved.composition.filter((id) => findById(FLOWERS, id)).slice(0, 4)
      : [];
    state.seed = Number(saved.seed) || 1;
    state.cardShift = Number(saved.cardShift) || 0;
    if (state.step > 3 && state.composition.length === 0) state.step = 3;
  } catch {
    /* начинаем заново */
  }
}

function drawPrize() {
  if (state.occasion === "sympathy") return null;
  return PRIZES[Math.floor(Math.random() * PRIZES.length)];
}

function prizePrice(recipe, prize) {
  if (!recipe || !prize || prize.kind !== "percent") return null;
  const off = Math.round(recipe.price * prize.value / 100);
  return { off, next: Math.max(0, recipe.price - off) };
}

function move(step) {
  state.step = step;
  state.maxStep = Math.max(state.maxStep, step);
  state.orderOpen = false;
  state.submitted = false;
  state.prize = null;
  persist();
  render();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function canContinue() {
  if (state.step === 0) return Boolean(state.occasion);
  if (state.step === 1) return Boolean(state.palette);
  if (state.step === 2) return Boolean(state.budget);
  if (state.step === 3) return state.composition.length > 0;
  return false;
}

function shuffle(list) {
  const copy = [...list];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swap = Math.floor(Math.random() * (index + 1));
    [copy[index], copy[swap]] = [copy[swap], copy[index]];
  }
  return copy;
}

function surprise() {
  const occasion = shuffle(OCCASIONS.filter((item) => item.id !== "sympathy"))[0];
  const palette = shuffle(PALETTES.filter((item) => occasion.palettes.includes(item.id)))[0];
  const budget = BUDGETS[1 + Math.floor(Math.random() * 3)];
  const pool = FLOWERS.filter((flower) => flower.palettes.includes(palette.id));
  const preferred = [
    ...pool.filter((flower) => occasion.favorites.includes(flower.id)),
    ...pool
  ];
  const composition = [];
  for (const flower of shuffle(preferred)) {
    if (!composition.includes(flower.id)) composition.push(flower.id);
    if (composition.length === 3) break;
  }
  state.occasion = occasion.id;
  state.palette = palette.id;
  state.budget = budget.id;
  state.composition = composition;
  state.seed = 1 + Math.floor(Math.random() * 9);
  state.cardShift = 0;
  state.cardTouched = false;
  state.form.card = "";
  move(4);
}

function flowerWord(count) {
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod10 === 1 && mod100 !== 11) return "цветок";
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return "цветка";
  return "цветков";
}

function todayIso() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

function formatDate(iso) {
  if (!iso) return "";
  const [year, month, day] = iso.split("-");
  return `${day}.${month}.${year}`;
}

function header() {
  return `
    <header class="top">
      <div class="brand">
        <span class="mark">${ICONS.mark}</span>
        <div>
          <p class="brand-name">${esc(config.shopName)}</p>
          <p class="brand-city">${esc(config.tagline || config.city)}</p>
        </div>
      </div>
      <div class="contacts">
        <a class="phone" href="tel:${esc(config.phoneHref)}">${esc(config.phone)}</a>
        ${config.email ? `<a class="mail" href="mailto:${esc(config.email)}">${esc(config.email)}</a>` : ""}
        <p>${esc(config.address)}</p>
        <p>${esc(config.hours)}</p>
        ${config.legalName ? `<p class="legal">${esc(config.legalName)}${config.inn ? ` · ИНН ${esc(config.inn)}` : ""}</p>` : ""}
      </div>
    </header>
  `;
}

function progress() {
  return `
    <ol class="progress">
      ${STEP_LABELS.map((label, index) => {
        const done = index < state.step;
        const current = index === state.step;
        const className = `${done ? "is-done" : ""} ${current ? "is-current" : ""}`;
        const content = done
          ? `<button type="button" data-action="goto" data-step="${index}">${label}</button>`
          : `<span>${label}</span>`;
        return `<li class="${className}">${content}</li>`;
      }).join("")}
    </ol>
  `;
}

function choiceCard({ group, id, title, text, selected, extra = "" }) {
  return `
    <button type="button" class="card ${selected ? "is-selected" : ""}" data-group="${group}" data-id="${esc(id)}" aria-pressed="${selected ? "true" : "false"}">
      <span class="check" aria-hidden="true"></span>
      ${extra}
      <span class="card-body">
        <span class="card-title">${esc(title)}</span>
        <span class="card-text">${esc(text)}</span>
      </span>
    </button>
  `;
}

function stepView() {
  if (state.step === 0) {
    return `
      <section class="hero panel">
        <p class="eyebrow">Игра-подбор</p>
        <h1 tabindex="-1">Собери идеальный букет</h1>
        <p class="lead">Четыре коротких шага: повод, гамма, бюджет и цветы. В конце — готовая сборка, которую можно отдать флористу или сразу оформить.</p>
        <div class="cards">
          ${OCCASIONS.map((item) => choiceCard({
            group: "occasion",
            id: item.id,
            title: item.title,
            text: item.text,
            selected: state.occasion === item.id,
            extra: `<span class="card-icon">${ICONS[item.id] || ""}</span>`
          })).join("")}
        </div>
      </section>
    `;
  }

  if (state.step === 1) {
    return `
      <section class="panel">
        <div class="step-head">
          <p class="kicker">Шаг 2 из 4</p>
          <h1 tabindex="-1">Какая цветовая гамма?</h1>
          <p>Она задаёт окраску бутонов, ленту и бумагу. На последнем экране гамму будет видно в эскизе.</p>
        </div>
        <div class="cards">
          ${PALETTES.map((item) => choiceCard({
            group: "palette",
            id: item.id,
            title: item.title,
            text: item.text,
            selected: state.palette === item.id,
            extra: `<span class="swatches">${item.swatches.map((color) => `<i style="background:${color}"></i>`).join("")}</span>`
          })).join("")}
        </div>
      </section>
    `;
  }

  if (state.step === 2) {
    return `
      <section class="panel">
        <div class="step-head">
          <p class="kicker">Шаг 3 из 4</p>
          <h1 tabindex="-1">На какую сумму собираем?</h1>
          <p>В сумму уже входят цветы, зелень и упаковка. Флорист держит сборку внутри выбранного диапазона.</p>
        </div>
        <div class="cards">
          ${BUDGETS.map((item) => `
            <button type="button" class="card ${state.budget === item.id ? "is-selected" : ""}" data-group="budget" data-id="${item.id}" aria-pressed="${state.budget === item.id}">
              <span class="check" aria-hidden="true"></span>
              <span class="card-body">
                <span class="budget-range">${esc(item.range)}</span>
                <span class="card-title">${esc(item.title)}</span>
                <span class="card-text">${esc(item.text)}</span>
              </span>
            </button>
          `).join("")}
        </div>
      </section>
    `;
  }

  const palette = findById(PALETTES, state.palette);
  const flowers = [...FLOWERS].sort((a, b) => {
    const score = (flower) => {
      if (state.composition.includes(flower.id)) return 0;
      if (palette && flower.palettes.includes(palette.id)) return 1;
      return 2;
    };
    return score(a) - score(b) || a.name.localeCompare(b.name, "ru");
  });

  return `
    <section class="panel">
      <div class="step-head">
        <p class="kicker">Шаг 4 из 4</p>
        <h1 tabindex="-1">Какие цветы положить в букет?</h1>
        <p>От одного до четырёх видов. Один вид — это монобукет. Зелень, ленту и бумагу ателье подберёт само.</p>
      </div>
      <div class="cards">
        ${flowers.map((flower) => {
          const inPalette = palette && flower.palettes.includes(palette.id);
          const badge = inPalette
            ? `<span class="badge">В вашей гамме</span>`
            : `<span class="badge is-muted">Акцент</span>`;
          return `
            <button type="button" class="card ${state.composition.includes(flower.id) ? "is-selected" : ""}" data-group="composition" data-id="${flower.id}" aria-pressed="${state.composition.includes(flower.id)}">
              <span class="check" aria-hidden="true"></span>
              <span class="card-body">
                <span class="card-title">${esc(flower.name)}</span>
                <span class="card-text">${formatPrice(flower.price)} за стебель${flower.seasonal ? " · сезонный" : ""}</span>
                ${badge}
              </span>
            </button>
          `;
        }).join("")}
      </div>
    </section>
  `;
}

function resultView() {
  const recipe = currentRecipe();
  if (!recipe) {
    return `<section class="panel"><h1>Сначала выберите состав</h1></section>`;
  }
  const fit = recipe.within
    ? `Попадает в диапазон ${recipe.budget.range}`
    : recipe.price < recipe.budget.min
      ? `Компактнее диапазона ${recipe.budget.range}`
      : `Выше диапазона ${recipe.budget.range}`;
  const message = cardMessage(recipe);

  return `
    <section class="result panel">
      <div class="stage" style="--stage:${recipe.palette.paper}">
        <div class="stage-kicker">
          <p class="kicker">${esc(recipe.palette.title)}</p>
          <p class="pill">${esc(recipe.style.title)} букет</p>
        </div>
        ${bouquetSvg(recipe)}
        <p class="stage-copy">${esc(recipe.style.text)}</p>
      </div>
      <article class="recipe">
        <p class="kicker">${esc(recipe.occasion.title)} · ${esc(config.shopName)}</p>
        <h1 tabindex="-1">«${esc(recipe.name)}»</h1>
        <p class="price">${formatPrice(recipe.price)}</p>
        <p class="fit">${esc(fit)} · ${recipe.stems} ${flowerWord(recipe.stems)}</p>
        ${recipe.warnings.length ? `<div class="warnings">${recipe.warnings.map((item) => `<p>${esc(item)}</p>`).join("")}</div>` : ""}
        <ul class="lines">
          ${recipe.lines.map((line) => `
            <li>
              <span class="line-name">${esc(line.name)}</span>
              <span class="line-sum">${formatPrice(line.sum)}</span>
              <span class="line-meta">${line.kind === "pack" ? "упаковка" : `${line.count} × ${formatPrice(line.unit)}`}</span>
            </li>
          `).join("")}
          <li class="total">
            <span class="line-name">Итого</span>
            <span class="line-sum">${formatPrice(recipe.price)}</span>
          </li>
        </ul>
        <blockquote class="note">
          <strong>Заметка флориста</strong>
          ${esc(recipe.note)}
        </blockquote>
        <div class="card-box">
          <h2>Текст открытки</h2>
          <p data-card>${esc(message)}</p>
          <button type="button" class="btn btn-ghost" data-action="shuffle-card">Другой текст</button>
        </div>
        <h2 class="care-title">Как простоять дольше</h2>
        <ul class="care">
          ${recipe.care.map((item) => `<li>${esc(item)}</li>`).join("")}
        </ul>
        <div class="actions">
          <button type="button" class="btn btn-primary" data-action="order">Оформить заказ</button>
          <button type="button" class="btn btn-ghost" data-action="copy">Скопировать состав</button>
          <button type="button" class="btn btn-ghost" data-action="variant">Другой вариант</button>
          <button type="button" class="btn btn-ghost" data-action="back">К составу</button>
          <button type="button" class="btn btn-ghost" data-action="restart">Начать заново</button>
        </div>
      </article>
    </section>
  `;
}

function footer() {
  const recipe = state.step === 3 && canContinue() ? currentRecipe() : null;
  let note = "Выберите карточку, чтобы продолжить.";
  if (state.step === 0 && state.occasion) note = "Можно идти дальше или доверить выбор ателье.";
  if (state.step === 1 && state.palette) note = "Эта гамма окрасит бутоны, ленту и бумагу.";
  if (state.step === 2 && state.budget) note = "Упаковка уже заложена в сумму.";
  if (state.step === 3) {
    note = state.composition.length
      ? `Выбрано ${state.composition.length} из 4${recipe ? ` · ориентир ${formatPrice(recipe.price)}` : ""}`
      : "Выбрано 0 из 4. Одного вида достаточно для монобукета.";
  }
  if (state.error) note = state.error;

  return `
    <footer class="nav">
      <button type="button" class="btn btn-ghost" data-action="back" ${state.step === 0 ? "disabled" : ""}>Назад</button>
      <p class="nav-note" id="nav-note">${esc(note)}</p>
      ${state.step === 0 ? `<button type="button" class="btn btn-ghost" data-action="surprise">Собрать сюрприз</button>` : ""}
      <button type="button" class="btn btn-primary" data-action="next" ${canContinue() ? "" : "disabled"}>${state.step === 3 ? "Показать букет" : "Дальше"}</button>
    </footer>
  `;
}

function dialogView() {
  if (!state.orderOpen) return "";
  const recipe = currentRecipe();
  if (!recipe) return "";
  if (state.submitted) {
    const prize = state.prize;
    const priced = prizePrice(recipe, prize);
    const prizeBlock = prize
      ? `
        <aside class="prize">
          <p class="kicker">Ваш приз</p>
          <h3>${esc(prize.title)}</h3>
          ${priced ? `<p class="prize-price"><s>${formatPrice(recipe.price)}</s> <strong>${formatPrice(priced.next)}</strong></p>` : ""}
          <p>${esc(prize.text)}</p>
          <p class="prize-code">${esc(prize.code)}</p>
        </aside>
      `
      : "";
    return `
      <dialog id="order">
        <div class="order success">
          <p class="kicker">Готово</p>
          <h2>Заказ принят</h2>
          <p class="order-lead">Вам перезвонят в течение 15 минут.</p>
          <p>Букет «${esc(recipe.name)}» записан в ${esc(config.shopName)}. Менеджер подтвердит состав и время.</p>
          ${prizeBlock}
          <div class="form-actions">
            <button type="button" class="btn btn-ghost" data-action="close-order">Закрыть</button>
            <button type="button" class="btn btn-primary" data-action="copy">Скопировать заявку</button>
          </div>
        </div>
      </dialog>
    `;
  }

  const message = cardMessage(recipe);
  return `
    <dialog id="order">
      <form class="order" id="order-form">
        <p class="kicker">Оформление</p>
        <h2>«${esc(recipe.name)}»</h2>
        <p class="order-lead">${formatPrice(recipe.price)} · ${esc(recipe.budget.range)}</p>
        <div class="fields">
          <label>Имя
            <input name="name" autocomplete="name" required value="${esc(state.form.name)}" />
          </label>
          <label>Телефон
            <input name="phone" type="tel" autocomplete="tel" required placeholder="+7 900 000-00-00" value="${esc(state.form.phone)}" />
          </label>
          <label>Когда нужен букет
            <input name="date" type="date" required min="${todayIso()}" value="${esc(state.form.date)}" />
          </label>
          <div class="choice">
            <label><input type="radio" name="delivery" value="pickup" ${state.form.delivery !== "courier" ? "checked" : ""} /> Самовывоз</label>
            <label><input type="radio" name="delivery" value="courier" ${state.form.delivery === "courier" ? "checked" : ""} /> Доставка</label>
            <p class="delivery-note">${esc(config.deliveryZone)}. Самовывоз: ${esc(config.address)}.</p>
          </div>
          <label data-address ${state.form.delivery === "courier" ? "" : "hidden"}>Адрес доставки
            <input name="address" autocomplete="street-address" value="${esc(state.form.address)}" ${state.form.delivery === "courier" ? "required" : ""} />
          </label>
          <label>Текст открытки
            <textarea name="card">${esc(message)}</textarea>
          </label>
          ${state.error ? `<p class="error">${esc(state.error)}</p>` : ""}
        </div>
        <div class="form-actions">
          <button type="button" class="btn btn-ghost" data-action="close-order">Отмена</button>
          <button type="submit" class="btn btn-primary">Оформить заказ</button>
        </div>
      </form>
    </dialog>
  `;
}

function render() {
  const titles = [
    "Собери идеальный букет",
    "Цветовая гамма",
    "Бюджет букета",
    "Состав букета",
    "Готовый букет"
  ];
  app.innerHTML = `
    <div class="page">
      ${header()}
      ${progress()}
      <main>${state.step === 4 ? resultView() : stepView()}</main>
      ${state.step < 4 ? footer() : ""}
      <p class="sr-only" id="live" aria-live="polite">${esc(titles[state.step] || "")}</p>
    </div>
    ${dialogView()}
  `;
  const heading = app.querySelector("h1");
  if (heading) heading.focus({ preventScroll: true });
  const dialog = document.querySelector("#order");
  if (state.orderOpen && dialog && !dialog.open) {
    dialog.showModal();
    dialog.addEventListener("close", () => {
      state.orderOpen = false;
    });
  }
}

function selectSingle(group, id) {
  state[group] = id;
  state.error = "";
  document.querySelectorAll(`[data-group="${group}"]`).forEach((card) => {
    const selected = card.dataset.id === id;
    card.classList.toggle("is-selected", selected);
    card.setAttribute("aria-pressed", selected ? "true" : "false");
  });
  persist();
  refreshFooter();
}

function toggleFlower(id) {
  const index = state.composition.indexOf(id);
  if (index >= 0) {
    state.composition.splice(index, 1);
    state.error = "";
  } else if (state.composition.length >= 4) {
    state.error = "Четыре вида — предел для цельной сборки. Уберите один, чтобы добавить другой.";
    refreshFooter();
    return;
  } else {
    state.composition.push(id);
    state.error = "";
  }
  const card = document.querySelector(`[data-group="composition"][data-id="${CSS.escape(id)}"]`);
  if (card) {
    const selected = state.composition.includes(id);
    card.classList.toggle("is-selected", selected);
    card.setAttribute("aria-pressed", selected ? "true" : "false");
  }
  persist();
  refreshFooter();
}

function refreshFooter() {
  const footerNode = app.querySelector(".nav");
  if (!footerNode || state.step > 3) return;
  footerNode.outerHTML = footer();
}

function orderPayload(recipe) {
  return {
    shop: config.shopName,
    bouquet: recipe.name,
    price: recipe.price,
    occasion: recipe.occasion.title,
    palette: recipe.palette.title,
    budget: recipe.budget.range,
    style: recipe.style.title,
    lines: recipe.lines.map((line) => ({
      name: line.name,
      count: line.count,
      sum: line.sum
    })),
    customer: {
      name: state.form.name.trim(),
      phone: state.form.phone.trim(),
      date: state.form.date,
      delivery: state.form.delivery,
      address: state.form.delivery === "courier" ? state.form.address.trim() : ""
    },
    card: cardMessage(recipe),
    prize: state.prize
      ? {
          id: state.prize.id,
          title: state.prize.title,
          code: state.prize.code,
          price: prizePrice(recipe, state.prize)?.next ?? recipe.price
        }
      : null,
    createdAt: new Date().toISOString()
  };
}

function textForCopy() {
  const recipe = currentRecipe();
  if (!recipe) return "";
  return orderText({
    config,
    recipe,
    form: {
      ...state.form,
      date: formatDate(state.form.date),
      card: cardMessage(recipe),
      prize: state.prize
    }
  });
}

async function copyOrder(button) {
  const text = textForCopy();
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const area = document.createElement("textarea");
    area.value = text;
    document.body.append(area);
    area.select();
    document.execCommand("copy");
    area.remove();
  }
  if (button) {
    const previous = button.textContent;
    button.textContent = "Скопировано";
    window.setTimeout(() => {
      button.textContent = previous;
    }, 1600);
  }
}

async function submitOrder(form) {
  const data = new FormData(form);
  const phone = String(data.get("phone") || "");
  const digits = phone.replace(/\D/g, "");
  state.form.name = String(data.get("name") || "");
  state.form.phone = phone;
  state.form.date = String(data.get("date") || "");
  state.form.delivery = String(data.get("delivery") || "pickup");
  state.form.address = String(data.get("address") || "");
  state.form.card = String(data.get("card") || "");
  state.cardTouched = true;
  if (digits.length < 10) {
    state.error = "Введите телефон, по которому можно подтвердить заказ.";
    render();
    return;
  }
  state.error = "";
  state.prize = drawPrize();
  const recipe = currentRecipe();
  const payload = orderPayload(recipe);
  try {
    if (typeof config.onSubmit === "function") await config.onSubmit(payload);
    state.submitted = true;
    render();
    await copyOrder();
  } catch {
    state.prize = null;
    state.error = "Не удалось отправить заявку. Состав можно скопировать и передать флористу вручную.";
    render();
  }
}

app.addEventListener("click", (event) => {
  const actionNode = event.target.closest("[data-action]");
  if (!actionNode || !app.contains(actionNode) && !actionNode.closest("#order")) return;
  const action = actionNode.dataset.action;

  if (action === "goto") {
    move(Number(actionNode.dataset.step));
    return;
  }
  if (action === "back") {
    if (state.step === 0) return;
    state.error = "";
    move(state.step - 1);
    return;
  }
  if (action === "next") {
    if (!canContinue()) return;
    state.error = "";
    move(state.step + 1);
    return;
  }
  if (action === "surprise") {
    surprise();
    return;
  }
  if (action === "restart") {
    state.occasion = null;
    state.palette = null;
    state.budget = null;
    state.composition = [];
    state.seed = 1;
    state.cardShift = 0;
    state.maxStep = 0;
    state.cardTouched = false;
    state.form = { name: "", phone: "", date: "", delivery: "pickup", address: "", card: "" };
    state.prize = null;
    state.error = "";
    move(0);
    return;
  }
  if (action === "variant") {
    state.seed += 1;
    if (!state.cardTouched) state.form.card = "";
    persist();
    render();
    return;
  }
  if (action === "shuffle-card") {
    state.cardShift += 1;
    if (!state.cardTouched) state.form.card = "";
    const recipe = currentRecipe();
    const node = document.querySelector("[data-card]");
    if (node && recipe) node.textContent = recipe.message;
    persist();
    return;
  }
  if (action === "copy") {
    copyOrder(actionNode);
    return;
  }
  if (action === "order") {
    state.orderOpen = true;
    state.submitted = false;
    state.prize = null;
    state.error = "";
    render();
    return;
  }
  if (action === "close-order") {
    state.orderOpen = false;
    state.submitted = false;
    render();
  }
});

app.addEventListener("click", (event) => {
  const card = event.target.closest("[data-group]");
  if (!card) return;
  const { group, id } = card.dataset;
  if (group === "composition") toggleFlower(id);
  else selectSingle(group, id);
});

app.addEventListener("change", (event) => {
  if (event.target.name !== "delivery") return;
  state.form.delivery = event.target.value;
  const address = document.querySelector("[data-address]");
  const field = address?.querySelector("input");
  if (!address || !field) return;
  const courier = state.form.delivery === "courier";
  address.hidden = !courier;
  field.required = courier;
});

app.addEventListener("submit", (event) => {
  if (event.target.id !== "order-form") return;
  event.preventDefault();
  submitOrder(event.target);
});

document.querySelector("#order")?.addEventListener("close", () => {
  state.orderOpen = false;
});

restore();
render();
