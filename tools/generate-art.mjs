/**
 * Generates every SVG illustration used by the site.
 *
 * The reference site is built on commissioned studio photography. This repository
 * ships original, licence-free vector artwork in the same palette instead, so the
 * layout and motion can be evaluated without borrowing anyone's photographs.
 * Swap the files in assets/img/** for real .webp shots when they are available.
 *
 *   node tools/generate-art.mjs
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const write = (rel, svg) => {
  const file = resolve(ROOT, rel);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, `${svg.trim()}\n`, 'utf8');
  console.log('  ✓', rel);
};

const rad = (deg) => (deg * Math.PI) / 180;

/* ------------------------------------------------------------------ helpers */

/** Deterministic PRNG so regenerating the art never churns the diff. */
const seeded = (seed) => () => {
  seed = (seed * 1664525 + 1013904223) % 4294967296;
  return seed / 4294967296;
};

/** A phalaenopsis bloom: three back petals, two side petals, a lip and a column. */
const orchid = ({ x, y, r, rot = 0, light = '#FFFFFF', shade = '#E4DAC9', core = '#D8C89F', opacity = 1 }) => {
  const petal = (angle, rx, ry, dist, fill, op) => {
    const a = rad(angle + rot);
    const px = x + Math.cos(a) * dist * r;
    const py = y + Math.sin(a) * dist * r;
    return `<ellipse cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" rx="${(rx * r).toFixed(1)}" ry="${(ry * r).toFixed(1)}" fill="${fill}" fill-opacity="${op}" transform="rotate(${(angle + rot + 90).toFixed(1)} ${px.toFixed(1)} ${py.toFixed(1)})"/>`;
  };
  return `<g opacity="${opacity}">
      ${petal(-90, 0.38, 0.52, 0.52, shade, 0.95)}
      ${petal(-18, 0.46, 0.56, 0.55, light, 0.96)}
      ${petal(-162, 0.46, 0.56, 0.55, light, 0.96)}
      ${petal(54, 0.42, 0.5, 0.58, shade, 0.9)}
      ${petal(126, 0.42, 0.5, 0.58, shade, 0.9)}
      <ellipse cx="${x}" cy="${y}" rx="${(r * 0.3).toFixed(1)}" ry="${(r * 0.26).toFixed(1)}" fill="${light}" fill-opacity="0.9"/>
      <ellipse cx="${x}" cy="${(y + r * 0.06).toFixed(1)}" rx="${(r * 0.15).toFixed(1)}" ry="${(r * 0.17).toFixed(1)}" fill="${core}" fill-opacity="0.85"/>
    </g>`;
};

/** An unopened bud on a stem. */
const bud = ({ x, y, r, rot = 0, fill = '#EFE7D8' }) =>
  `<ellipse cx="${x}" cy="${y}" rx="${(r * 0.52).toFixed(1)}" ry="${r}" fill="${fill}" fill-opacity="0.92" transform="rotate(${rot} ${x} ${y})"/>`;

/** Soft out-of-focus discs that read as depth of field. */
const bokeh = (seed, count, w, h, tint, maxR = 120) => {
  const rnd = seeded(seed);
  let out = '';
  for (let i = 0; i < count; i += 1) {
    const cx = (rnd() * 1.2 - 0.1) * w;
    const cy = (rnd() * 1.2 - 0.1) * h;
    const r = (0.25 + rnd() * 0.75) * maxR;
    out += `<circle cx="${cx.toFixed(0)}" cy="${cy.toFixed(0)}" r="${r.toFixed(0)}" fill="${tint}" fill-opacity="${(0.04 + rnd() * 0.09).toFixed(3)}"/>`;
  }
  return out;
};

const grain = (id, opacity = 0.16) => `
    <filter id="${id}" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" stitchTiles="stitch"/>
      <feColorMatrix type="saturate" values="0"/>
      <feComponentTransfer><feFuncA type="linear" slope="${opacity}"/></feComponentTransfer>
    </filter>`;

/* ------------------------------------------------------------------- bottle */

const BOTTLE_W = 340;
const BOTTLE_H = 760;

const bottle = ({ id, eyebrow, name, actives, volume, ounces, top, bottom, ink = '#2E4356' }) => {
  const cx = BOTTLE_W / 2;
  const activeLines = actives
    .map((line, i) => `<text x="${cx}" y="${492 + i * 24}" class="a">${line}</text>`)
    .join('');

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${BOTTLE_W} ${BOTTLE_H}" role="img" aria-label="${name}">
  <defs>
    <linearGradient id="body-${id}" x1="0" y1="0" x2="1" y2="0.35">
      <stop offset="0" stop-color="${top}"/>
      <stop offset="0.42" stop-color="${top}"/>
      <stop offset="1" stop-color="${bottom}"/>
    </linearGradient>
    <linearGradient id="cap-${id}" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#FFFFFF" stop-opacity="0.72"/>
      <stop offset="0.3" stop-color="#FFFFFF" stop-opacity="0.98"/>
      <stop offset="0.72" stop-color="#EFEFEF" stop-opacity="0.95"/>
      <stop offset="1" stop-color="#CFD3D6" stop-opacity="0.9"/>
    </linearGradient>
    <linearGradient id="gloss-${id}" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#FFFFFF" stop-opacity="0"/>
      <stop offset="0.5" stop-color="#FFFFFF" stop-opacity="0.5"/>
      <stop offset="1" stop-color="#FFFFFF" stop-opacity="0"/>
    </linearGradient>
    <radialGradient id="shadow-${id}" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="#3A332A" stop-opacity="0.34"/>
      <stop offset="1" stop-color="#3A332A" stop-opacity="0"/>
    </radialGradient>
    <style>
      text { font-family: 'Jost', 'Futura', 'Century Gothic', 'Trebuchet MS', sans-serif; fill: #FFFFFF; text-anchor: middle; }
      .eyebrow { font-size: 25px; letter-spacing: 3px; font-weight: 300; }
      .name { font-size: 54px; letter-spacing: 4px; font-weight: 400; }
      .sub { font-size: 25px; font-style: italic; font-family: 'Cormorant Garamond', Georgia, serif; fill-opacity: 0.92; }
      .badge { font-size: 14px; letter-spacing: 1.6px; fill: ${ink}; font-weight: 500; }
      .a { font-size: 14px; letter-spacing: 1.8px; fill-opacity: 0.86; }
      .vol { font-size: 20px; letter-spacing: 1px; }
      .oz { font-size: 15px; letter-spacing: 1px; fill-opacity: 0.85; }
      .brand { font-size: 26px; letter-spacing: 0.4px; font-weight: 400; }
    </style>
  </defs>

  <ellipse cx="${cx}" cy="741" rx="150" ry="19" fill="url(#shadow-${id})"/>

  <!-- pump actuator + cap -->
  <path d="M152 44h36a8 8 0 0 1 8 8v12h-52V52a8 8 0 0 1 8-8z" fill="#E9EBEC" fill-opacity="0.95"/>
  <rect x="104" y="62" width="132" height="126" rx="13" fill="url(#cap-${id})"/>
  <rect x="104" y="170" width="132" height="18" rx="9" fill="#D5D9DC" fill-opacity="0.85"/>
  <rect x="118" y="186" width="104" height="18" rx="6" fill="#C3C9CE" fill-opacity="0.9"/>

  <!-- body -->
  <rect x="66" y="200" width="208" height="536" rx="34" fill="url(#body-${id})"/>
  <rect x="84" y="214" width="26" height="508" rx="13" fill="url(#gloss-${id})" opacity="0.55"/>
  <rect x="238" y="214" width="14" height="508" rx="7" fill="#1F2A33" opacity="0.07"/>

  <!-- label -->
  <g transform="translate(0,-6)">
    <path d="M${cx - 63} 300 l14-22 14 22z" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-opacity="0.9"/>
    <text x="${cx + 14}" y="302" class="eyebrow">${eyebrow}</text>
    <text x="${cx}" y="358" class="name">${name}</text>
    <text x="${cx}" y="398" class="sub">Dafne</text>
    <rect x="${cx - 96}" y="420" width="192" height="32" rx="16" fill="#FFFFFF" fill-opacity="0.92"/>
    <text x="${cx}" y="442" class="badge">CON LATTE D'ASINA</text>
    ${activeLines}
    <text x="${cx}" y="578" class="vol">${volume}</text>
    <text x="${cx}" y="602" class="oz">${ounces}</text>
    <rect x="${cx - 74}" y="640" width="148" height="46" rx="23" fill="${ink}"/>
    <text x="${cx}" y="671" class="brand">nymphai</text>
  </g>
</svg>`;
};

/* ------------------------------------------------------------------- scenes */

/**
 * An "editorial still life": stone plinth, orchid branch, warm falloff.
 * Stands in for the campaign photography.
 */
const stillLife = ({
  id, w = 1200, h = 1500, sky, floor, plinth, plinthTop, petalLight, petalShade,
  core = '#D8C89F', vignette = '#2A241B', seed = 7, budTint = '#EFE7D8',
}) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" role="img" aria-label="Nymphai still life">
  <defs>
    <linearGradient id="bg-${id}" x1="0.15" y1="0" x2="0.85" y2="1">
      <stop offset="0" stop-color="${sky}"/>
      <stop offset="1" stop-color="${floor}"/>
    </linearGradient>
    <radialGradient id="key-${id}" cx="0.34" cy="0.26" r="0.72">
      <stop offset="0" stop-color="#FFFFFF" stop-opacity="0.4"/>
      <stop offset="1" stop-color="#FFFFFF" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="vig-${id}" cx="0.5" cy="0.46" r="0.74">
      <stop offset="0.46" stop-color="${vignette}" stop-opacity="0"/>
      <stop offset="1" stop-color="${vignette}" stop-opacity="0.55"/>
    </radialGradient>
    <linearGradient id="plinth-${id}" x1="0" y1="0" x2="1" y2="0.2">
      <stop offset="0" stop-color="${plinthTop}"/>
      <stop offset="0.55" stop-color="${plinth}"/>
      <stop offset="1" stop-color="${plinthTop}" stop-opacity="0.72"/>
    </linearGradient>
    ${grain(`grain-${id}`, 0.13)}
  </defs>

  <rect width="${w}" height="${h}" fill="url(#bg-${id})"/>
  ${bokeh(seed, 16, w, h, '#FFFFFF', 220)}
  <rect width="${w}" height="${h}" fill="url(#key-${id})"/>

  <!-- soft leaf shadows raking across the backdrop -->
  <g opacity="0.2" fill="${vignette}">
    <path d="M${w * 0.62} -40 q140 260 -10 520 q-120 200 40 420" stroke="${vignette}" stroke-width="90" stroke-opacity="0.16" fill="none" stroke-linecap="round"/>
    <path d="M${w * 0.86} 60 q90 300 -40 560" stroke="${vignette}" stroke-width="56" stroke-opacity="0.12" fill="none" stroke-linecap="round"/>
  </g>

  <!-- plinth -->
  <g>
    <ellipse cx="${w * 0.5}" cy="${h * 0.845}" rx="${w * 0.42}" ry="46" fill="${vignette}" fill-opacity="0.16"/>
    <rect x="${w * 0.1}" y="${h * 0.8}" width="${w * 0.8}" height="${h * 0.12}" rx="16" fill="url(#plinth-${id})"/>
    <rect x="${w * 0.1}" y="${h * 0.8}" width="${w * 0.8}" height="16" rx="8" fill="#FFFFFF" fill-opacity="0.28"/>
    <g fill="${vignette}" fill-opacity="0.12">
      <ellipse cx="${w * 0.24}" cy="${h * 0.855}" rx="34" ry="11"/>
      <ellipse cx="${w * 0.41}" cy="${h * 0.885}" rx="22" ry="8"/>
      <ellipse cx="${w * 0.66}" cy="${h * 0.848}" rx="41" ry="12"/>
      <ellipse cx="${w * 0.79}" cy="${h * 0.888}" rx="18" ry="7"/>
    </g>
  </g>

  <!-- orchid branch -->
  <path d="M${w * 0.06} ${h * 0.9} C ${w * 0.3} ${h * 0.82}, ${w * 0.42} ${h * 0.6}, ${w * 0.5} ${h * 0.35}"
        stroke="${vignette}" stroke-opacity="0.34" stroke-width="7" fill="none" stroke-linecap="round"/>
  <path d="M${w * 0.97} ${h * 0.62} C ${w * 0.8} ${h * 0.6}, ${w * 0.7} ${h * 0.5}, ${w * 0.62} ${h * 0.3}"
        stroke="${vignette}" stroke-opacity="0.28" stroke-width="6" fill="none" stroke-linecap="round"/>

  ${orchid({ x: w * 0.2, y: h * 0.74, r: 96, rot: 14, light: petalLight, shade: petalShade, core })}
  ${orchid({ x: w * 0.36, y: h * 0.61, r: 78, rot: -22, light: petalLight, shade: petalShade, core, opacity: 0.94 })}
  ${orchid({ x: w * 0.83, y: h * 0.66, r: 112, rot: -8, light: petalLight, shade: petalShade, core })}
  ${orchid({ x: w * 0.71, y: h * 0.44, r: 70, rot: 26, light: petalLight, shade: petalShade, core, opacity: 0.9 })}
  ${bud({ x: w * 0.1, y: h * 0.82, r: 30, rot: 24, fill: budTint })}
  ${bud({ x: w * 0.15, y: h * 0.87, r: 24, rot: -12, fill: budTint })}
  ${bud({ x: w * 0.93, y: h * 0.53, r: 27, rot: 32, fill: budTint })}

  <rect width="${w}" height="${h}" fill="url(#vig-${id})"/>
  <rect width="${w}" height="${h}" filter="url(#grain-${id})" opacity="0.5"/>
</svg>`;

/**
 * A "ritual" still: warm light, a silk fold, a swipe of cream.
 * Deliberately abstract — it stands in for campaign photography without
 * attempting to depict a person.
 */
const ritual = ({ id, w = 1000, h = 1400, back, mid, glow, silk, seed = 11, vignette = '#2A241B' }) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" role="img" aria-label="Nymphai skincare ritual">
  <defs>
    <linearGradient id="rb-${id}" x1="0.15" y1="0" x2="0.9" y2="1">
      <stop offset="0" stop-color="${back}"/>
      <stop offset="0.62" stop-color="${mid}"/>
      <stop offset="1" stop-color="${back}"/>
    </linearGradient>
    <linearGradient id="rs-${id}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${silk}" stop-opacity="0.95"/>
      <stop offset="0.55" stop-color="${silk}" stop-opacity="0.55"/>
      <stop offset="1" stop-color="${silk}" stop-opacity="0.85"/>
    </linearGradient>
    <radialGradient id="rk-${id}" cx="0.34" cy="0.22" r="0.66">
      <stop offset="0" stop-color="${glow}" stop-opacity="0.55"/>
      <stop offset="1" stop-color="${glow}" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="rv-${id}" cx="0.5" cy="0.44" r="0.78">
      <stop offset="0.48" stop-color="${vignette}" stop-opacity="0"/>
      <stop offset="1" stop-color="${vignette}" stop-opacity="0.5"/>
    </radialGradient>
    <filter id="rblur-${id}"><feGaussianBlur stdDeviation="40"/></filter>
    <filter id="rsoft-${id}"><feGaussianBlur stdDeviation="9"/></filter>
    ${grain(`rg-${id}`, 0.13)}
  </defs>

  <rect width="${w}" height="${h}" fill="url(#rb-${id})"/>

  <!-- raking light through a window -->
  <g filter="url(#rblur-${id})" opacity="0.5">
    <path d="M-${w * 0.2} ${h * 0.1} L${w * 0.55} -${h * 0.05} L${w * 0.95} ${h * 0.5} L${w * 0.15} ${h * 0.78}Z" fill="${glow}" fill-opacity="0.3"/>
    <path d="M${w * 0.1} ${h * 0.62} L${w * 1.1} ${h * 0.3} L${w * 1.2} ${h * 0.95} L${w * 0.3} ${h * 1.1}Z" fill="${vignette}" fill-opacity="0.22"/>
  </g>

  ${bokeh(seed, 14, w, h, '#FFFFFF', 200)}

  <!-- folded silk, kept low and soft so it never reads as a figure -->
  <path d="M-40 ${h * 1.08} C ${w * 0.1} ${h * 0.86}, ${w * 0.34} ${h * 0.79}, ${w * 0.58} ${h * 0.83}
           C ${w * 0.82} ${h * 0.87}, ${w * 0.98} ${h * 0.94}, ${w + 40} ${h * 0.9}
           L ${w + 40} ${h + 40} L -40 ${h + 40}Z"
        fill="url(#rs-${id})" opacity="0.8" filter="url(#rsoft-${id})"/>

  <!-- a single brushed swipe of cream, the signature of every Nymphai frame -->
  <g filter="url(#rsoft-${id})" opacity="0.72">
    <path d="M${w * 0.34} ${h * 0.45} q${w * 0.14} -${h * 0.045} ${w * 0.3} -${h * 0.006}
             q-${w * 0.1} ${h * 0.055} -${w * 0.31} ${h * 0.026}Z" fill="#FFFFFF" fill-opacity="0.8"/>
    <path d="M${w * 0.38} ${h * 0.51} q${w * 0.12} -${h * 0.028} ${w * 0.22} ${h * 0.006}"
          stroke="#FFFFFF" stroke-opacity="0.34" stroke-width="9" fill="none" stroke-linecap="round"/>
  </g>

  <rect width="${w}" height="${h}" fill="url(#rk-${id})"/>
  <rect width="${w}" height="${h}" fill="url(#rv-${id})"/>
  <rect width="${w}" height="${h}" filter="url(#rg-${id})" opacity="0.5"/>
</svg>`;

/** A flat texture swatch — whipped cream, milk, stone. */
const swatch = ({ id, w = 1200, h = 900, base, high, low, waves = 7, seed = 3, mode = 'wave' }) => {
  const rnd = seeded(seed);
  let body = '';
  if (mode === 'wave') {
    for (let i = 0; i < waves; i += 1) {
      const y = (i + 0.6) * (h / (waves + 0.6));
      const amp = 26 + rnd() * 46;
      body += `<path d="M-20 ${y.toFixed(0)} C ${w * 0.25} ${(y - amp).toFixed(0)}, ${w * 0.55} ${(y + amp).toFixed(0)}, ${w + 20} ${(y - amp * 0.4).toFixed(0)}"
        stroke="${i % 2 ? high : low}" stroke-opacity="${(0.3 + rnd() * 0.35).toFixed(2)}" stroke-width="${(38 + rnd() * 46).toFixed(0)}" fill="none" stroke-linecap="round"/>`;
    }
  } else {
    for (let i = 0; i < waves; i += 1) {
      const cx = rnd() * w;
      const cy = rnd() * h;
      body += `<ellipse cx="${cx.toFixed(0)}" cy="${cy.toFixed(0)}" rx="${(90 + rnd() * 240).toFixed(0)}" ry="${(70 + rnd() * 170).toFixed(0)}"
        fill="${i % 2 ? high : low}" fill-opacity="${(0.24 + rnd() * 0.3).toFixed(2)}" transform="rotate(${(rnd() * 90 - 45).toFixed(0)} ${cx.toFixed(0)} ${cy.toFixed(0)})"/>`;
    }
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" role="img" aria-label="Texture">
  <defs>
    <linearGradient id="sw-${id}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${base}"/>
      <stop offset="1" stop-color="${low}"/>
    </linearGradient>
    <filter id="soft-${id}"><feGaussianBlur stdDeviation="14"/></filter>
    ${grain(`sg-${id}`, 0.14)}
  </defs>
  <rect width="${w}" height="${h}" fill="url(#sw-${id})"/>
  <g filter="url(#soft-${id})">${body}</g>
  <rect width="${w}" height="${h}" filter="url(#sg-${id})" opacity="0.55"/>
</svg>`;
};

/**
 * The line-up: three bottles standing on the plinth of a still life.
 * The bottle SVGs are nested verbatim, so the two stay in sync automatically.
 */
const lineup = ({ id, w, h, scene, bottles }) => {
  const placed = bottles.map(({ svg, x, y, height }) => {
    const width = (height * BOTTLE_W) / BOTTLE_H;
    return svg.replace(
      /^<svg xmlns="[^"]*" viewBox="[^"]*"/,
      `<svg x="${(x - width / 2).toFixed(1)}" y="${y.toFixed(1)}" width="${width.toFixed(1)}" height="${height.toFixed(1)}" viewBox="0 0 ${BOTTLE_W} ${BOTTLE_H}"`
    );
  }).join('\n');

  return scene.replace('</svg>', `${placed}\n</svg>`);
};

/* --------------------------------------------------------------------- run */

console.log('Generating artwork…');

const BOTTLES = {
  comfort: bottle({
  id: 'comfort', eyebrow: 'CREMA', name: 'VISO', actives: ['VITAMINA E'],
  volume: '50ml ℮', ounces: '1.69 fl.oz', top: '#CFE0EC', bottom: '#9FBBD2',
}),
  hidraLift: bottle({
  id: 'hidra', eyebrow: 'CREMA', name: 'VISO', actives: ['COLLAGENE E', 'ACIDO IALURONICO'],
  volume: '50ml ℮', ounces: '1.69 fl.oz', top: '#D2D8DE', bottom: '#9BA7B2',
}),
  siero: bottle({
  id: 'siero', eyebrow: 'SIERO', name: 'VISO', actives: ['ILLUMINANTE'],
  volume: '30ml ℮', ounces: '1.01 fl.oz', top: '#C9D3DC', bottom: '#93A2AE',
}),
};

write('assets/img/products/bottle-comfort.svg', BOTTLES.comfort);
write('assets/img/products/bottle-hidra-lift.svg', BOTTLES.hidraLift);
write('assets/img/products/bottle-siero.svg', BOTTLES.siero);

write('assets/img/scenes/still-travertine.svg', stillLife({
  id: 'trav', sky: '#D9C7AE', floor: '#B79E7E', plinth: '#CBB89C', plinthTop: '#E6D8C1',
  petalLight: '#FBF6EC', petalShade: '#E3D6C1', seed: 21,
}));
write('assets/img/scenes/still-emerald.svg', stillLife({
  id: 'emer', sky: '#1F4436', floor: '#0F281F', plinth: '#2F5A47', plinthTop: '#487361',
  petalLight: '#F6F2E8', petalShade: '#DCD3BF', core: '#E0C271', vignette: '#07150F', seed: 34, budTint: '#E7E0CE',
}));
const lineaScene = stillLife({
  id: 'linea', w: 1600, h: 1000, sky: '#E0CEB4', floor: '#B08F6C', plinth: '#D2BFA3',
  plinthTop: '#EEE2CE', petalLight: '#FCF8F0', petalShade: '#E7DCC8', seed: 55,
});
write('assets/img/scenes/still-linea.svg', lineup({
  id: 'linea', w: 1600, h: 1000, scene: lineaScene,
  bottles: [
    { svg: BOTTLES.comfort,   x: 640,  y: 250, height: 560 },
    { svg: BOTTLES.hidraLift, x: 830,  y: 205, height: 615 },
    { svg: BOTTLES.siero,     x: 1010, y: 300, height: 505 },
  ],
}));

write('assets/img/scenes/ritual-comfort.svg', ritual({
  id: 'comf', back: '#E4D3B8', mid: '#8A7051', glow: '#FFF6E4', silk: '#F7F2E8', seed: 12,
}));
write('assets/img/scenes/ritual-hidra.svg', ritual({
  id: 'hid', back: '#33584A', mid: '#12291F', glow: '#CFE4CF', silk: '#E7E2D4', seed: 29, vignette: '#07150F',
}));
write('assets/img/scenes/ritual-siero.svg', ritual({
  id: 'sier', back: '#D2DEE4', mid: '#6E8794', glow: '#FAFDFF', silk: '#F7F4ED', seed: 41, vignette: '#16232B',
}));

write('assets/img/scenes/texture-cream.svg', swatch({
  id: 'cream', base: '#F6F1E6', high: '#FFFFFF', low: '#DED3C0', waves: 8, seed: 5,
}));
write('assets/img/scenes/texture-milk.svg', swatch({
  id: 'milk', base: '#F2EDE3', high: '#FFFFFF', low: '#D8CDB9', waves: 9, seed: 17, mode: 'blob',
}));
write('assets/img/scenes/texture-stone.svg', swatch({
  id: 'stone', base: '#DCCFB8', high: '#F0E7D6', low: '#B9A88C', waves: 11, seed: 23, mode: 'blob',
}));
write('assets/img/scenes/texture-leaf.svg', swatch({
  id: 'leaf', base: '#27503E', high: '#4A7C62', low: '#12291F', waves: 8, seed: 31, mode: 'blob',
}));

console.log('Done.');
