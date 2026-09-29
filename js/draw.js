function leafShape(x, y, rot, fill, vein) {
  return `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${rot.toFixed(1)})">
    <path d="M0 2 C14 -18 32 -16 40 0 C30 16 14 18 0 2 Z" fill="${fill}"/>
    <path d="M6 2 C16 -4 28 -4 36 0" fill="none" stroke="${vein}" stroke-width="0.7" opacity="0.45"/>
  </g>`;
}

function flowerMarkup(type, primary, secondary, center) {
  if (type === "rose") {
    return `
      <ellipse cx="-10" cy="2" rx="12" ry="14" fill="${secondary}" transform="rotate(-24)"/>
      <ellipse cx="10" cy="2" rx="12" ry="14" fill="${secondary}" transform="rotate(24)"/>
      <ellipse cx="0" cy="8" rx="12" ry="10" fill="${primary}"/>
      <ellipse cx="0" cy="-2" rx="9" ry="11" fill="${primary}"/>
      <ellipse cx="-4" cy="1" rx="5" ry="7" fill="${center}"/>
      <ellipse cx="3" cy="2" rx="4" ry="6" fill="${secondary}"/>
      <circle cx="0" cy="2" r="3.2" fill="${center}"/>
    `;
  }
  if (type === "peony") {
    let petals = "";
    for (let index = 0; index < 12; index += 1) {
      const color = index % 2 ? secondary : primary;
      petals += `<ellipse cx="0" cy="-12" rx="7" ry="14" fill="${color}" transform="rotate(${index * 30})" opacity="0.95"/>`;
    }
    return `${petals}<circle r="8" fill="${center}"/><circle r="4" fill="${secondary}"/>`;
  }
  if (type === "tulip") {
    return `
      <path d="M0 18 C-16 10 -16 -8 -7 -20 C-2 -10 2 -10 7 -20 C16 -8 16 10 0 18 Z" fill="${primary}"/>
      <path d="M0 16 C-6 8 -5 -2 0 -12 C5 -2 6 8 0 16 Z" fill="${secondary}" opacity="0.85"/>
      <path d="M0 14 C-2 4 -1 -4 0 -8" fill="none" stroke="${center}" stroke-width="1" opacity="0.6"/>
    `;
  }
  if (type === "ranunculus") {
    let rings = "";
    for (let index = 0; index < 10; index += 1) {
      rings += `<ellipse cx="0" cy="-8" rx="${6 - index * 0.25}" ry="${10 - index * 0.4}" fill="${index % 2 ? secondary : primary}" transform="rotate(${index * 36})" opacity="0.92"/>`;
    }
    return `${rings}<circle r="4" fill="${center}"/>`;
  }
  if (type === "eustoma") {
    return `
      <ellipse cx="0" cy="4" rx="14" ry="16" fill="${primary}"/>
      <ellipse cx="-8" cy="-2" rx="8" ry="11" fill="${secondary}" transform="rotate(-18)"/>
      <ellipse cx="8" cy="-2" rx="8" ry="11" fill="${secondary}" transform="rotate(18)"/>
      <ellipse cx="0" cy="-4" rx="6" ry="9" fill="${center}"/>
      <circle cy="-1" r="2.4" fill="${secondary}"/>
    `;
  }
  if (type === "hydrangea") {
    const florets = [
      [0, 0],
      [-12, 6],
      [12, 6],
      [-7, -10],
      [8, -9],
      [0, 12]
    ];
    return florets
      .map(([x, y], index) => {
        const fill = index % 2 ? secondary : primary;
        return `<g transform="translate(${x} ${y})">
          <circle cx="-3.2" cy="0" r="3.4" fill="${fill}"/>
          <circle cx="3.2" cy="0" r="3.4" fill="${fill}"/>
          <circle cx="0" cy="-3.2" r="3.4" fill="${fill}"/>
          <circle cx="0" cy="3.2" r="3.4" fill="${center}"/>
        </g>`;
      })
      .join("");
  }
  if (type === "lily") {
    let petals = "";
    for (let index = 0; index < 6; index += 1) {
      const fill = index % 2 ? secondary : primary;
      petals += `<path d="M0 -4 C8 -14 10 -24 0 -32 C-10 -24 -8 -14 0 -4 Z" fill="${fill}" transform="rotate(${index * 60})" opacity="0.95"/>`;
    }
    return `${petals}
      <circle r="3.5" fill="${center}"/>
      <path d="M0 0 L5 10 M0 0 L-5 10 M0 0 L0 11" stroke="${center}" stroke-width="1" fill="none"/>
    `;
  }
  if (type === "gerbera" || type === "sunflower") {
    const count = type === "sunflower" ? 16 : 13;
    const length = type === "sunflower" ? 16 : 13;
    let petals = "";
    for (let index = 0; index < count; index += 1) {
      petals += `<ellipse cx="0" cy="-${length}" rx="${type === "sunflower" ? 3.2 : 4}" ry="${length * 0.72}" fill="${index % 2 ? secondary : primary}" transform="rotate(${(360 / count) * index})"/>`;
    }
    const disk = type === "sunflower" ? "#6B4520" : center;
    return `${petals}<circle r="${type === "sunflower" ? 8 : 6.5}" fill="${disk}"/><circle r="3" fill="${secondary}" opacity="0.45"/>`;
  }
  if (type === "chrysanthemum") {
    let petals = "";
    for (let index = 0; index < 18; index += 1) {
      petals += `<ellipse cx="0" cy="-12" rx="2.4" ry="12" fill="${index % 2 ? secondary : primary}" transform="rotate(${index * 20})" opacity="0.94"/>`;
    }
    return `${petals}<circle r="5" fill="${center}"/>`;
  }
  if (type === "matthiola") {
    let blossoms = "";
    for (let index = 0; index < 7; index += 1) {
      const y = -18 + index * 6;
      const fill = index % 2 ? secondary : primary;
      blossoms += `<circle cx="${index % 2 ? -3 : 3}" cy="${y}" r="4.2" fill="${fill}"/>`;
    }
    return `<path d="M0 18 V-18" stroke="${center}" stroke-width="1.4"/>${blossoms}`;
  }
  if (type === "anemone") {
    let petals = "";
    for (let index = 0; index < 7; index += 1) {
      petals += `<ellipse cx="0" cy="-13" rx="6" ry="12" fill="${index % 2 ? secondary : primary}" transform="rotate(${index * (360 / 7)})"/>`;
    }
    return `${petals}<circle r="6" fill="#2A2428"/><circle r="2.5" fill="${center}"/>`;
  }
  let dots = "";
  for (let index = 0; index < 14; index += 1) {
    const angle = index * 1.7;
    const radius = 4 + (index % 5) * 3.4;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius * 0.72;
    dots += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${index % 3 === 0 ? 2.4 : 1.6}" fill="${index % 2 ? secondary : primary}"/>`;
  }
  return dots;
}

function headsFor(flower, index, totalGroups) {
  if (flower.draw === "gypsophila") return 1;
  if (flower.draw === "hydrangea" || flower.draw === "sunflower") return Math.min(flower.count, 3);
  const cap = totalGroups > 3 ? 4 : 6;
  return Math.min(flower.count, cap);
}

export function bouquetSvg(recipe) {
  const palette = recipe.palette;
  const flowers = recipe.lines.filter((line) => line.kind === "flower");
  const boxed = recipe.budget.packaging.id === "box" || recipe.budget.packaging.id === "author";
  const groups = flowers.map((flower, index) => {
    const spread = flowers.length <= 1 ? 0 : 56 + (flowers.length - 2) * 18;
    const cx = flowers.length === 1 ? 200 : 200 - spread / 2 + (spread * index) / (flowers.length - 1);
    const middle = Math.floor((flowers.length - 1) / 2);
    const cy = 168 + (index === middle ? -18 : index % 2 ? 16 : 4);
    return { flower, cx, cy, shown: headsFor(flower, index, flowers.length), index };
  });

  const place = (group, copy) => {
    const angle = -1.2 + copy * 1.25 + group.index * 0.35;
    const radius = copy === 0 ? 0 : 16 + (copy % 3) * 7;
    return {
      x: group.cx + Math.cos(angle) * radius * 0.8,
      y: group.cy + Math.sin(angle) * radius * 0.48
    };
  };

  const leaves = [
    [118, 236, -40],
    [286, 240, 36],
    [96, 268, -18],
    [304, 270, 16],
    [146, 288, -8],
    [252, 286, 10]
  ]
    .map(([x, y, rot]) => leafShape(x, y, rot, palette.leaf, palette.leafDark))
    .join("");

  const stems = groups
    .flatMap((group) =>
      Array.from({ length: Math.min(group.shown, 4) }, (_, copy) => {
        const { x, y } = place(group, copy);
        return `<path d="M${x.toFixed(1)} ${(y + 8).toFixed(1)} C${((x + 200) / 2).toFixed(1)} ${(y + 70).toFixed(1)}, 200 250, 200 318" fill="none" stroke="${palette.leafDark}" stroke-width="1.7" stroke-linecap="round" opacity="0.8"/>`;
      })
    )
    .join("");

  const blooms = groups
    .flatMap((group) =>
      Array.from({ length: group.shown }, (_, copy) => {
        const { x, y } = place(group, copy);
        const scale = (group.flower.draw === "hydrangea" ? 1.02 : 0.96) + (copy % 2) * 0.05;
        const primary = palette.blooms[(group.index + copy) % palette.blooms.length];
        const secondary = palette.blooms[(group.index + copy + 1) % palette.blooms.length];
        const center = palette.centers[(group.index + copy) % palette.centers.length];
        return `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${scale.toFixed(2)})" filter="url(#petal)">${flowerMarkup(group.flower.draw, primary, secondary, center)}</g>`;
      })
    )
    .join("");

  const bow = `
    <path d="M200 292 C186 270 158 274 164 298 C170 316 190 308 200 292 Z" fill="${palette.ribbon}"/>
    <path d="M200 292 C214 270 242 274 236 298 C230 316 210 308 200 292 Z" fill="${palette.ribbon}"/>
    <circle cx="200" cy="294" r="5" fill="${palette.paper}"/>
    <circle cx="200" cy="294" r="3" fill="${palette.ribbon}"/>
    <path d="M193 304 C182 336 172 368 164 404" fill="none" stroke="${palette.ribbon}" stroke-width="3.4" stroke-linecap="round"/>
    <path d="M207 304 C218 336 230 368 240 404" fill="none" stroke="${palette.ribbon}" stroke-width="3.4" stroke-linecap="round"/>
  `;

  const wrap = boxed
    ? `
      <ellipse cx="200" cy="418" rx="118" ry="22" fill="${palette.paperDeep}"/>
      <path d="M82 312 H318 V400 C318 422 270 438 200 438 C130 438 82 422 82 400 Z" fill="${palette.paper}"/>
      <ellipse cx="200" cy="312" rx="118" ry="22" fill="${palette.paper}"/>
      <ellipse cx="200" cy="312" rx="100" ry="14" fill="${palette.paperDeep}" opacity="0.35"/>
      <path d="M90 352 H310" stroke="${palette.ribbon}" stroke-width="9" stroke-linecap="round"/>
      <path d="M200 344 C186 332 168 336 170 352 C172 366 190 362 200 352 C210 342 228 346 230 352 C232 368 214 372 200 360 Z" fill="${palette.ribbon}"/>
    `
    : `
      <path d="M136 268 C108 308 118 392 158 452 C178 478 222 478 242 452 C282 392 292 308 264 268 C236 286 164 286 136 268 Z" fill="${palette.paper}"/>
      <path d="M150 286 C132 330 140 400 172 446" fill="none" stroke="${palette.paperDeep}" stroke-width="8" stroke-linecap="round" opacity="0.55"/>
      <path d="M248 292 C262 340 258 400 228 446" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" opacity="0.35"/>
      ${bow}
    `;

  const cloud = `
    <ellipse cx="200" cy="214" rx="126" ry="78" fill="${palette.paper}" opacity="0.45"/>
  `;

  return `
    <svg class="bouquet" viewBox="0 0 400 520" role="img" aria-label="Эскиз букета «${recipe.name}»">
      <defs>
        <filter id="petal" x="-40%" y="-40%" width="180%" height="180%">
          <feDropShadow dx="0" dy="3" stdDeviation="1.6" flood-color="#1c1915" flood-opacity="0.14"/>
        </filter>
      </defs>
      <ellipse cx="200" cy="470" rx="86" ry="12" fill="#1c1915" opacity="0.08"/>
      ${cloud}
      ${leaves}
      ${boxed ? "" : stems}
      ${wrap}
      ${blooms}
    </svg>
  `;
}
