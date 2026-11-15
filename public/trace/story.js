// "Animate now": the child's own traced animal becomes the star of a little
// picture book of an old nursery rhyme (all public domain).
//
// Calm by design: pages only turn when the child taps, each page plays one
// slow move and then the animal just breathes, there's no sound, and the
// book ends with "The end" as a natural stopping point.

import { ANIMALS, CATEGORIES } from "./animals.js";

const W = 1600;
const H = 1000;

const $ = (id) => document.getElementById(id);
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

// A built-in outline as a little prop in a scene.
function prop(id, x, y, size, cls = "") {
  const a = ANIMALS.find((item) => item.id === id) || CATEGORIES.find((item) => item.id === id);
  if (!a) return "";
  return `<g transform="translate(${x - size / 2} ${y - size / 2}) scale(${size / 1000})"><g class="prop ${cls}">${a.shapes.join("")}</g></g>`;
}

// The child's animal. `move` plays once, `idle` loops gently after it.
function actor(img, x, y, size, move = "", idle = "breathe", flip = false) {
  const w = size;
  const h = size;
  return `<g transform="translate(${x} ${y})"><g class="move ${move}"><g class="idle ${idle}">
    <g transform="scale(${flip ? -1 : 1} 1)"><image href="${img.url}" x="${-w / 2}" y="${-h / 2}" width="${w}" height="${h}" preserveAspectRatio="xMidYMid meet"/></g>
  </g></g></g>`;
}

const stars = (n, seed, top = 0, bottom = 520) => {
  let s = seed;
  const rand = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
  let out = "";
  for (let i = 0; i < n; i++) {
    const r = 4 + rand() * 6;
    out += `<circle class="twinkle" style="animation-delay:${(rand() * 4).toFixed(2)}s" cx="${Math.round(rand() * W)}" cy="${Math.round(top + rand() * (bottom - top))}" r="${r.toFixed(1)}" fill="#fff6c9"/>`;
  }
  return out;
};

const nightSky = (seed) => `
  <defs><linearGradient id="night${seed}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#25335e"/><stop offset="1" stop-color="#4d5f9c"/></linearGradient></defs>
  <rect width="${W}" height="${H}" fill="url(#night${seed})"/>${stars(26, seed)}`;
const daySky = `<defs><linearGradient id="day" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#bfe6ff"/><stop offset="1" stop-color="#eaf7ff"/></linearGradient></defs>
  <rect width="${W}" height="${H}" fill="url(#day)"/>`;
const hill = (color = "#7fb77e") => `<path d="M-50 1050 L-50 820 Q400 690 800 790 Q1200 890 1650 760 L1650 1050 Z" fill="${color}" stroke="#3a3f4b" stroke-width="6"/>`;
const moon = (x, y, r) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff4c2" stroke="#3a3f4b" stroke-width="6"/>
  <circle cx="${x - r * 0.3}" cy="${y - r * 0.2}" r="${r * 0.14}" fill="#f1e2a0"/><circle cx="${x + r * 0.32}" cy="${y + r * 0.3}" r="${r * 0.1}" fill="#f1e2a0"/>`;
const cloud = (x, y, s = 1) => `<path transform="translate(${x} ${y}) scale(${s})" d="M-190 60 C-280 60 -290 -40 -200 -50 C-190 -140 -50 -150 -20 -70 C10 -150 160 -140 160 -40 C250 -40 250 60 170 60 Z" fill="#fff" stroke="#3a3f4b" stroke-width="6"/>`;
const water = `<rect x="0" y="720" width="${W}" height="${H - 720}" fill="#8fd3f4" stroke="#3a3f4b" stroke-width="6"/>
  <g class="waves"><path d="M-100 800 Q-50 770 0 800 T100 800 T200 800 T300 800 T400 800 T500 800 T600 800 T700 800 T800 800 T900 800 T1000 800 T1100 800 T1200 800 T1300 800 T1400 800 T1500 800 T1600 800 T1700 800 T1800 800 T1900 800 T2000 800" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round"/>
  <path d="M-100 900 Q-50 870 0 900 T100 900 T200 900 T300 900 T400 900 T500 900 T600 900 T700 900 T800 900 T900 900 T1000 900 T1100 900 T1200 900 T1300 900 T1400 900 T1500 900 T1600 900 T1700 900 T1800 900 T1900 900 T2000 900" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" opacity="0.7"/></g>`;
// The boat is drawn in front of the animal, so the animal sits in it.
const hull = `<path d="M-280 -20 L280 -20 L210 110 L-210 110 Z" fill="#d8955f" stroke="#3a3f4b" stroke-width="8" stroke-linejoin="round"/>
  <path d="M-250 25 L250 25" stroke="#3a3f4b" stroke-width="6"/>`;
function boat(img, x, y, move = "", idle = "rock") {
  return `<g transform="translate(${x} ${y})"><g class="move ${move}"><g class="idle ${idle}">
    <g transform="translate(0 -150)"><image href="${img.url}" x="-170" y="-170" width="340" height="340" preserveAspectRatio="xMidYMid meet"/></g>
    ${hull}
    <path d="M140 -10 L330 -170" stroke="#8d5a3b" stroke-width="12" stroke-linecap="round"/>
  </g></g></g>`;
}
const fiddle = (x, y) => `<g transform="translate(${x} ${y}) rotate(-25)">
  <path d="M0 -80 C45 -80 50 -40 30 -20 C55 0 55 60 0 70 C-55 60 -55 0 -30 -20 C-50 -40 -45 -80 0 -80 Z" fill="#c9773a" stroke="#3a3f4b" stroke-width="6"/>
  <path d="M0 -80 L0 -190" stroke="#3a3f4b" stroke-width="12" stroke-linecap="round"/>
  <path d="M-12 -10 L12 -10 M-12 20 L12 20" stroke="#3a3f4b" stroke-width="5"/></g>`;
const dishAndSpoon = `<g class="runaway"><g transform="translate(560 800)">
  <g class="idle hop-small"><ellipse cx="0" cy="0" rx="110" ry="40" fill="#fff" stroke="#3a3f4b" stroke-width="6"/>
  <circle cx="-30" cy="-5" r="7" fill="#3a3f4b"/><circle cx="30" cy="-5" r="7" fill="#3a3f4b"/><path d="M-20 15 Q0 28 20 15" fill="none" stroke="#3a3f4b" stroke-width="5" stroke-linecap="round"/>
  <path d="M-50 38 L-65 90 M50 38 L65 90" stroke="#3a3f4b" stroke-width="7" stroke-linecap="round"/></g>
  <g transform="translate(170 -40)"><g class="idle hop-small" style="animation-delay:0.4s"><ellipse cx="0" cy="-60" rx="38" ry="52" fill="#d9dde6" stroke="#3a3f4b" stroke-width="6"/>
  <path d="M0 -8 L0 110" stroke="#3a3f4b" stroke-width="12" stroke-linecap="round"/></g></g>
</g></g>`;
const zzz = (x, y) => `<g class="zzz" font-size="60" font-weight="800" fill="#fff"><text x="${x}" y="${y}">z</text><text x="${x + 40}" y="${y - 50}" font-size="46" style="animation-delay:1s">z</text><text x="${x + 70}" y="${y - 95}" font-size="34" style="animation-delay:2s">z</text></g>`;
const bigStar = (x, y, r, cls = "twinkle-big") => {
  let d = "";
  for (let i = 0; i < 10; i++) {
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    const rr = i % 2 ? r * 0.45 : r;
    d += `${i ? "L" : "M"}${Math.round(x + Math.cos(a) * rr)} ${Math.round(y + Math.sin(a) * rr)} `;
  }
  return `<path class="${cls}" d="${d}Z" fill="#ffd60a" stroke="#3a3f4b" stroke-width="6" stroke-linejoin="round"/>`;
};

// Who the rhyme is about: "the cat", or "Mia’s animal" for a My Animal.
function who(animal, kidName) {
  if (!animal.mine) return `the ${animal.name.toLowerCase()}`;
  return kidName ? `${kidName}’s animal` : "my animal";
}

export const BOOKS = [
  {
    id: "diddle",
    title: "Hey Diddle Diddle",
    credit: "Traditional nursery rhyme",
    cover: `${moon(50, 46, 26)}<path d="M18 80 Q50 64 82 80" fill="none" stroke="#3a3f4b" stroke-width="3"/>`,
    pages: [
      { text: () => "Hey diddle diddle, the cat and the fiddle,",
        scene: (img) => `${nightSky(3)}${moon(1250, 230, 110)}${hill()}${prop("cat", 420, 640, 330)}${fiddle(600, 640)}${actor(img, 1120, 690, 340, "", "sway")}` },
      { text: (a, k) => `${cap(who(a, k))} jumped over the moon;`,
        scene: (img) => `${nightSky(5)}${moon(1050, 440, 110)}${hill()}${actor(img, 330, 700, 300, "jump-moon", "breathe")}` },
      { text: () => "the little dog laughed to see such sport,",
        scene: (img) => `${nightSky(7)}${moon(1300, 200, 90)}${hill()}${prop("dog", 420, 650, 320, "giggle")}${actor(img, 1100, 690, 320, "hop3", "breathe")}` },
      { text: () => "and the dish ran away with the spoon.",
        scene: (img) => `${nightSky(9)}${moon(1300, 200, 90)}${hill()}${dishAndSpoon}${actor(img, 300, 690, 300, "", "sway")}` },
    ],
  },
  {
    id: "boat",
    title: "Row, Row, Row Your Boat",
    credit: "Traditional nursery rhyme",
    cover: `<path d="M14 60 L86 60 L74 80 L26 80 Z" fill="#d8955f" stroke="#3a3f4b" stroke-width="3" stroke-linejoin="round"/><path d="M8 88 Q20 82 32 88 T56 88 T80 88 T94 88" fill="none" stroke="#3ec5ff" stroke-width="3" stroke-linecap="round"/><circle cx="72" cy="26" r="12" fill="#ffd60a" stroke="#3a3f4b" stroke-width="3"/>`,
    pages: [
      { text: () => "Row, row, row your boat,",
        scene: (img) => `${daySky}<circle cx="1350" cy="180" r="90" fill="#ffd60a" stroke="#3a3f4b" stroke-width="6"/>${cloud(380, 200)}${water}${boat(img, 800, 760)}` },
      { text: () => "Gently down the stream.",
        scene: (img) => `${daySky}${cloud(1200, 180, 0.8)}${cloud(300, 260, 0.6)}${water}${boat(img, 330, 760, "drift")}` },
      { text: () => "Merrily, merrily, merrily, merrily,",
        scene: (img) => `${daySky}<circle cx="250" cy="170" r="80" fill="#ffd60a" stroke="#3a3f4b" stroke-width="6"/>${water}
          <g class="fish-jump">${prop("fish", 1250, 790, 190)}</g><g class="fish-jump" style="animation-delay:1.6s">${prop("fish", 380, 820, 150)}</g>${boat(img, 800, 760)}` },
      { text: () => "Life is but a dream.",
        scene: (img) => `${nightSky(11)}${moon(1300, 200, 80)}<rect x="0" y="720" width="${W}" height="${H - 720}" fill="#3f6f9a" stroke="#3a3f4b" stroke-width="6"/>${boat(img, 800, 770, "", "rock-slow")}${zzz(980, 480)}` },
    ],
  },
  {
    id: "star",
    title: "Twinkle, Twinkle, Little Star",
    credit: "Jane Taylor, 1806",
    cover: bigStar(50, 50, 34, ""),
    pages: [
      { text: () => "Twinkle, twinkle, little star,",
        scene: (img) => `${nightSky(13)}${bigStar(1000, 260, 90)}${hill("#6fa57e")}${actor(img, 450, 700, 330, "", "breathe")}` },
      { text: () => "How I wonder what you are!",
        scene: (img) => `${nightSky(15)}${bigStar(1200, 220, 80)}${hill("#6fa57e")}${actor(img, 700, 700, 330, "", "sway")}` },
      { text: () => "Up above the world so high,",
        scene: (img) => `${nightSky(17)}${bigStar(1250, 180, 70)}${hill("#6fa57e")}<g class="move rise">${cloud(700, 720, 1.25)}${actor(img, 700, 610, 300, "", "breathe")}</g>` },
      { text: () => "Like a diamond in the sky.",
        scene: (img) => `${nightSky(19)}${stars(40, 21, 0, 900)}${bigStar(380, 300, 60)}${bigStar(1250, 250, 75)}${cloud(800, 520, 1.25)}${actor(img, 800, 410, 300, "", "breathe")}` },
      { text: () => "Twinkle, twinkle, little star, how I wonder what you are!",
        scene: (img) => `${nightSky(23)}${bigStar(1250, 200, 70)}<g transform="translate(760 620)"><circle r="230" fill="#fff4c2" stroke="#3a3f4b" stroke-width="6"/><circle cx="-60" cy="60" r="34" fill="#f1e2a0"/><circle cx="90" cy="110" r="22" fill="#f1e2a0"/></g>${actor(img, 760, 380, 280, "", "breathe-slow")}${zzz(930, 300)}` },
    ],
  },
];


// ---------- More props ----------

const INK = `stroke="#3a3f4b" stroke-width="6" stroke-linejoin="round" stroke-linecap="round"`;
const fence = (y = 760) => {
  let posts = "";
  for (let x = 40; x < W; x += 160) posts += `<path d="M${x} ${y + 90} L${x} ${y - 40} L${x + 20} ${y - 60} L${x + 40} ${y - 40} L${x + 40} ${y + 90} Z" fill="#f4e1c1" ${INK}/>`;
  return `<path d="M0 ${y - 10} H${W} M0 ${y + 40} H${W}" stroke="#3a3f4b" stroke-width="14"/><path d="M0 ${y - 10} H${W} M0 ${y + 40} H${W}" stroke="#f4e1c1" stroke-width="6"/>${posts}`;
};
const sack = (x, y, s = 1, cls = "", delay = 0) => `<g transform="translate(${x} ${y}) scale(${s})"><g class="${cls}" style="animation-delay:${delay}s">
  <path d="M-60 60 C-80 0 -50 -50 -20 -60 L20 -60 C50 -50 80 0 60 60 Q0 80 -60 60 Z" fill="#f6e7c8" ${INK}/>
  <path d="M-25 -60 L-35 -85 M25 -60 L35 -85 M-28 -62 Q0 -50 28 -62" fill="none" ${INK}/>
  <path d="M-30 10 Q-20 0 -10 10 Q0 0 10 10 Q20 0 30 10" fill="none" stroke="#c9b48a" stroke-width="5" stroke-linecap="round"/></g></g>`;
const house = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})">
  <path d="M-110 0 L-110 -150 L110 -150 L110 0 Z" fill="#fff3e0" ${INK}/>
  <path d="M-140 -140 L0 -260 L140 -140 Z" fill="#ff8a7a" ${INK}/>
  <path d="M-30 0 L-30 -80 L30 -80 L30 0" fill="#c98b5a" ${INK}/>
  <rect x="50" y="-125" width="40" height="40" fill="#bfe6ff" ${INK}/></g>`;
const stall = (x, y) => `<g transform="translate(${x} ${y})">
  <path d="M-150 0 L-150 -170 M150 0 L150 -170" ${INK}/><rect x="-160" y="-90" width="320" height="90" fill="#f4e1c1" ${INK}/>
  <path d="M-180 -170 L180 -170 L160 -230 L-160 -230 Z" fill="#fff" ${INK}/>
  <path d="M-120 -230 L-130 -170 M-40 -230 L-45 -170 M40 -230 L45 -170 M120 -230 L130 -170" stroke="#ff4d6d" stroke-width="24"/>
  <circle cx="-90" cy="-110" r="26" fill="#ff4d4d" ${INK}/><circle cx="-30" cy="-110" r="26" fill="#ffd60a" ${INK}/><circle cx="30" cy="-110" r="26" fill="#7ed957" ${INK}/><circle cx="90" cy="-110" r="26" fill="#ff9f1c" ${INK}/></g>`;
const table = (x, y, full) => `<g transform="translate(${x} ${y})">
  <rect x="-170" y="-20" width="340" height="30" rx="10" fill="#c98b5a" ${INK}/><path d="M-140 10 L-140 120 M140 10 L140 120" ${INK} stroke-width="12"/>
  <ellipse cx="0" cy="-30" rx="110" ry="26" fill="#fff" ${INK}/>
  ${full ? `<ellipse cx="0" cy="-58" rx="62" ry="34" fill="#b5653a" ${INK}/><path d="M-30 -70 Q0 -80 30 -70" fill="none" stroke="#e7a77a" stroke-width="6" stroke-linecap="round"/>` : ""}</g>`;
const bubble = (x, y, text, cls = "pop-in", delay = 0) => `<g transform="translate(${x} ${y})"><g class="${cls}" style="animation-delay:${delay}s">
  <rect x="${-Math.max(110, text.length * 17 + 50)}" y="-60" width="${2 * Math.max(110, text.length * 17 + 50)}" height="110" rx="55" fill="#fff" ${INK}/><path d="M-20 48 L-40 95 L20 48" fill="#fff" ${INK}/><path d="M-18 46 L18 46" stroke="#fff" stroke-width="10"/>
  <text x="0" y="16" text-anchor="middle" font-size="54" font-weight="800" fill="#3a3f4b">${esc(text)}</text></g></g>`;
const brickWall = (y) => {
  let bricks = "";
  for (let row = 0; row < 4; row++) {
    for (let x = row % 2 ? -60 : 0; x < W; x += 120) bricks += `<rect x="${x}" y="${y + row * 55}" width="120" height="55" fill="#d9825b" ${INK}/>`;
  }
  return `<rect x="0" y="${y}" width="${W}" height="${H - y}" fill="#c4704b"/>${bricks}`;
};
const honey = (x, y) => `<g transform="translate(${x} ${y})"><path d="M-55 -50 L55 -50 C75 0 70 50 0 60 C-70 50 -75 0 -55 -50 Z" fill="#ffc94d" ${INK}/>
  <rect x="-62" y="-72" width="124" height="26" rx="10" fill="#c98b5a" ${INK}/><text x="0" y="20" text-anchor="middle" font-size="34" font-weight="800" fill="#8a5a00">honey</text></g>`;
const greenBoat = (x, y, img, friends = "") => `<g transform="translate(${x} ${y})"><g class="idle rock">
  <g transform="translate(-90 -140)"><image href="${img.url}" x="-140" y="-140" width="280" height="280" preserveAspectRatio="xMidYMid meet"/></g>
  ${friends}
  <path d="M-320 -20 L320 -20 L240 110 L-240 110 Z" fill="#9ccc65" ${INK} stroke-width="8"/><path d="M-290 25 L290 25" ${INK}/>
  <path d="M60 -20 L60 -330" ${INK} stroke-width="10"/><path d="M70 -320 L250 -60 L70 -60 Z" fill="#fff" ${INK}/></g></g>`;
const stoneCross = (x, y) => `<g transform="translate(${x} ${y})"><path d="M-70 0 L70 0 L50 -60 L-50 -60 Z" fill="#d8d3c8" ${INK}/>
  <path d="M-18 -60 L-18 -200 L-60 -200 L-60 -240 L-18 -240 L-18 -280 L18 -280 L18 -240 L60 -240 L60 -200 L18 -200 L18 -60 Z" fill="#e8e3d8" ${INK}/></g>`;
const notes = (x, y) => `<g class="notes" fill="#3a3f4b">${[0, 1, 2].map((i) => `<g transform="translate(${x + i * 90} ${y - i * 40})"><g style="animation-delay:${i * 1.2}s"><ellipse cx="0" cy="0" rx="22" ry="16"/><path d="M20 -2 L20 -80 L50 -66" fill="none" stroke="#3a3f4b" stroke-width="8" stroke-linecap="round"/></g></g>`).join("")}</g>`;
const bells = (x, y) => `<g transform="translate(${x} ${y})"><g class="jingle">${[-120, 0, 120].map((dx) => `<g transform="translate(${dx} 0)"><path d="M-26 20 C-26 -20 -16 -34 0 -34 C16 -34 26 -20 26 20 Z" fill="#ffd60a" ${INK}/><circle cx="0" cy="26" r="8" fill="#3a3f4b"/></g>`).join("")}</g></g>`;
const sun = (x, y, r = 90) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#ffd60a" stroke="#3a3f4b" stroke-width="6"/>`;
const farmDay = (extra = "") => `${daySky}${sun(1380, 170)}${cloud(380, 190, 0.8)}${hill("#9fd17f")}${extra}`;

// "a cow", "an owl", or "Mia’s animal".
function aName(animal, kidName) {
  if (animal.mine) return kidName ? `${kidName}’s animal` : "my animal";
  const n = animal.name.toLowerCase();
  return `${/^[aeiou]/.test(n) ? "an" : "a"} ${n}`;
}
const SOUNDS = {
  cow: "moo", horse: "neigh", pig: "oink", sheep: "baa", chicken: "cluck", dog: "woof", cat: "meow",
  owl: "hoo", bee: "buzz", bird: "tweet", lion: "roar", elephant: "toot", trex: "roar", hippo: "grunt",
  whale: "whoosh", beluga: "whoosh", dolphin: "click", zebra: "neigh", giraffe: "hum",
};
const sound = (animal) => SOUNDS[animal.id] || "la";

const MORE_BOOKS = [
  {
    id: "baa",
    title: "Baa, Baa, Black Sheep",
    credit: "Traditional nursery rhyme",
    for: ["sheep"],
    cover: `<path d="M20 70 C10 50 25 30 40 34 C45 18 65 20 68 34 C85 32 92 52 82 68 Z" fill="#fff" stroke="#3a3f4b" stroke-width="3"/><rect x="34" y="66" width="6" height="14" fill="#3a3f4b"/><rect x="60" y="66" width="6" height="14" fill="#3a3f4b"/>`,
    pages: [
      { text: () => "Baa, baa, black sheep, have you any wool?",
        scene: (img) => `${farmDay(fence())}${actor(img, 800, 700, 360, "", "sway")}` },
      { text: () => "Yes sir, yes sir, three bags full;",
        scene: (img) => `${farmDay(fence())}${actor(img, 520, 700, 340, "", "breathe")}${sack(900, 800, 1.2, "bag-pop", 0.4)}${sack(1080, 800, 1.2, "bag-pop", 1)}${sack(1260, 800, 1.2, "bag-pop", 1.6)}` },
      { text: () => "One for the master, and one for the dame,",
        scene: (img) => `${farmDay(fence())}${house(260, 790, 0.9)}${actor(img, 800, 700, 320, "", "sway")}<g class="slide-left">${sack(560, 820, 1.1)}</g><g class="slide-right">${sack(1040, 820, 1.1)}</g>` },
      { text: () => "And one for the little boy who lives down the lane.",
        scene: (img) => `${farmDay()}${house(1340, 800, 0.85)}${actor(img, 380, 700, 320, "", "breathe")}<g class="carry">${sack(560, 820, 1.1)}</g>` },
    ],
  },
  {
    id: "piggy",
    title: "This Little Piggy",
    credit: "Traditional nursery rhyme",
    for: ["pig"],
    cover: `<circle cx="50" cy="52" r="30" fill="#ffc1cf" stroke="#3a3f4b" stroke-width="3"/><ellipse cx="50" cy="60" rx="12" ry="9" fill="#ff9fb4" stroke="#3a3f4b" stroke-width="3"/><circle cx="40" cy="44" r="3"/><circle cx="60" cy="44" r="3"/>`,
    pages: [
      { text: () => "This little piggy went to market,",
        scene: (img) => `${farmDay()}${stall(1250, 820)}${actor(img, 300, 720, 300, "walk-right", "breathe")}` },
      { text: () => "This little piggy stayed home,",
        scene: (img) => `${farmDay()}${house(560, 820, 1.2)}${actor(img, 1000, 720, 300, "", "sway")}` },
      { text: () => "This little piggy had roast beef,",
        scene: (img) => `${farmDay()}${table(880, 800, true)}${actor(img, 520, 700, 300, "", "breathe")}` },
      { text: () => "This little piggy had none,",
        scene: (img) => `${farmDay()}${table(880, 800, false)}${actor(img, 520, 700, 300, "", "sway")}` },
      { text: () => "And this little piggy cried “Wee, wee, wee!” all the way home.",
        scene: (img) => `${farmDay()}${house(1350, 820, 0.9)}${actor(img, 260, 720, 280, "hop-home", "breathe")}${bubble(380, 420, "wee!", "pop-in", 0.6)}` },
    ],
  },
  {
    id: "macdonald",
    title: "Old MacDonald Had a Farm",
    credit: "Traditional song",
    for: ["cow", "horse", "pig", "sheep", "chicken"],
    cover: `<path d="M20 82 L20 46 L50 22 L80 46 L80 82 Z" fill="#ff8a7a" stroke="#3a3f4b" stroke-width="3" stroke-linejoin="round"/><path d="M40 82 L40 60 L60 60 L60 82" fill="#fff" stroke="#3a3f4b" stroke-width="3"/>`,
    pages: [
      { text: () => "Old MacDonald had a farm, E-I-E-I-O!",
        scene: (img) => `${farmDay()}${prop("farm", 1150, 640, 460)}${actor(img, 480, 700, 320, "", "sway")}` },
      { text: (a, k) => `And on that farm he had ${aName(a, k)}, E-I-E-I-O!`,
        scene: (img) => `${farmDay()}${prop("farm", 1250, 640, 380)}${actor(img, 700, 720, 340, "hop3", "breathe")}` },
      { text: (a) => `With a ${sound(a)}-${sound(a)} here, and a ${sound(a)}-${sound(a)} there,`,
        scene: (img, a) => `${farmDay()}${actor(img, 800, 720, 340, "", "sway")}${bubble(420, 380, `${sound(a)}-${sound(a)}`, "pop-in", 0.4)}${bubble(1180, 380, `${sound(a)}-${sound(a)}`, "pop-in", 1.6)}` },
      { text: (a) => `Here a ${sound(a)}, there a ${sound(a)}, everywhere a ${sound(a)}-${sound(a)}!`,
        scene: (img, a) => `${farmDay()}${actor(img, 800, 740, 320, "", "breathe")}${[[300, 300], [800, 260], [1300, 300], [480, 560], [1120, 560]].map(([x, y], i) => bubble(x, y, sound(a), "pop-in", 0.3 + i * 0.6)).join("")}` },
      { text: () => "Old MacDonald had a farm, E-I-E-I-O!",
        scene: (img) => `${daySky}${sun(1350, 250, 110)}${hill("#9fd17f")}${prop("farm", 1100, 640, 420)}${actor(img, 480, 700, 320, "", "breathe-slow")}` },
    ],
  },
  {
    id: "dickie",
    title: "Two Little Dickie Birds",
    credit: "Traditional nursery rhyme",
    for: ["bird", "owl", "butterfly", "bee", "chicken"],
    cover: `<rect x="10" y="62" width="80" height="26" fill="#d9825b" stroke="#3a3f4b" stroke-width="3"/><circle cx="34" cy="50" r="12" fill="#3ec5ff" stroke="#3a3f4b" stroke-width="3"/><circle cx="66" cy="50" r="12" fill="#ffd60a" stroke="#3a3f4b" stroke-width="3"/>`,
    pages: [
      { text: () => "Two little dickie birds sitting on a wall;",
        scene: (img) => `${daySky}${cloud(300, 200, 0.7)}${brickWall(720)}${actor(img, 560, 580, 280, "", "breathe")}${actor(img, 1040, 580, 280, "", "breathe", true)}` },
      { text: () => "One named Peter, one named Paul.",
        scene: (img) => `${daySky}${cloud(1200, 180, 0.7)}${brickWall(720)}${actor(img, 560, 580, 280, "", "sway")}${actor(img, 1040, 580, 280, "", "sway", true)}${bubble(560, 300, "Peter", "pop-in", 0.4)}${bubble(1040, 300, "Paul", "pop-in", 1.4)}` },
      { text: () => "Fly away, Peter! Fly away, Paul!",
        scene: (img) => `${daySky}${cloud(800, 200, 0.7)}${brickWall(720)}${actor(img, 560, 580, 280, "fly-left", "breathe")}${actor(img, 1040, 580, 280, "fly-right", "breathe", true)}` },
      { text: () => "Come back, Peter! Come back, Paul!",
        scene: (img) => `${daySky}${cloud(800, 200, 0.7)}${brickWall(720)}${actor(img, 560, 580, 280, "back-left", "breathe")}${actor(img, 1040, 580, 280, "back-right", "breathe", true)}` },
    ],
  },
  {
    id: "owlcat",
    title: "The Owl and the Pussy-cat",
    credit: "Edward Lear, 1871",
    for: ["owl", "cat"],
    cover: `<path d="M14 64 L86 64 L74 84 L26 84 Z" fill="#9ccc65" stroke="#3a3f4b" stroke-width="3" stroke-linejoin="round"/><circle cx="38" cy="50" r="12" fill="#fff" stroke="#3a3f4b" stroke-width="3"/><circle cx="64" cy="50" r="12" fill="#fff" stroke="#3a3f4b" stroke-width="3"/><circle cx="78" cy="20" r="8" fill="#fff4c2" stroke="#3a3f4b" stroke-width="3"/>`,
    pages: [
      { text: () => "The Owl and the Pussy-cat went to sea in a beautiful pea-green boat.",
        scene: (img, a) => `${daySky}${sun(1350, 180)}${water}${greenBoat(800, 760, img, friendsFor(a))}` },
      { text: () => "They took some honey, and plenty of money, wrapped up in a five-pound note.",
        scene: (img, a) => `${daySky}${cloud(300, 200, 0.7)}${water}<g class="move drift-short">${greenBoat(600, 760, img, `${friendsFor(a)}<g transform="translate(200 -90)">${honey(0, 0)}</g>`)}</g>` },
      { text: () => "The Owl looked up to the stars above, and sang to a small guitar.",
        scene: (img, a) => `${nightSky(31)}${moon(1300, 200, 80)}<rect x="0" y="720" width="${W}" height="${H - 720}" fill="#3f6f9a" stroke="#3a3f4b" stroke-width="6"/>${greenBoat(760, 770, img, friendsFor(a))}${notes(1000, 420)}` },
      { text: () => "And hand in hand, on the edge of the sand, they danced by the light of the moon.",
        scene: (img, a) => `${nightSky(33)}${moon(800, 220, 120)}<path d="M-50 1050 L-50 800 Q800 740 1650 800 L1650 1050 Z" fill="#f2d99a" stroke="#3a3f4b" stroke-width="6"/>${actor(img, 600, 680, 300, "", "sway")}${a.id === "owl" ? `<g class="idle sway self">${prop("cat", 1000, 690, 280)}</g>` : a.id === "cat" ? `<g class="idle sway self">${prop("owl", 1000, 690, 280)}</g>` : `<g class="idle sway self">${prop("owl", 950, 700, 240)}${prop("cat", 1230, 700, 240)}</g>`}` },
    ],
  },
  {
    id: "fishalive",
    title: "One, Two, Three, Four, Five",
    credit: "Traditional counting rhyme",
    for: ["fish", "shark", "hammerhead", "sawshark", "dolphin", "whale", "beluga", "octopus", "jellyfish", "crab", "starfish", "turtle"],
    cover: `<rect x="8" y="50" width="84" height="40" fill="#8fd3f4" stroke="#3a3f4b" stroke-width="3"/><path d="M30 66 C42 54 62 54 70 66 C62 78 42 78 30 66 Z M70 66 L82 58 L82 74 Z" fill="#ff9f1c" stroke="#3a3f4b" stroke-width="3" stroke-linejoin="round"/><text x="50" y="36" text-anchor="middle" font-size="22" font-weight="800">1 2 3</text>`,
    pages: [
      { text: () => "One, two, three, four, five, once I caught a fish alive;",
        scene: (img) => `${daySky}${sun(250, 170, 80)}${water}${actor(img, 800, 820, 300, "", "swim")}` },
      { text: () => "Six, seven, eight, nine, ten, then I let it go again.",
        scene: (img) => `${daySky}${cloud(1200, 180, 0.7)}${water}${actor(img, 500, 840, 280, "leap", "breathe")}` },
      { text: () => "Why did you let it go? Because it bit my finger so.",
        scene: (img) => `${daySky}${sun(1350, 170, 80)}${water}${actor(img, 700, 830, 280, "drift-short", "swim")}` },
    ],
  },
  {
    id: "banbury",
    title: "Ride a Cock-Horse",
    credit: "Traditional nursery rhyme",
    for: ["horse", "zebra"],
    cover: `<path d="M40 86 L60 86 L56 74 L44 74 Z M46 74 L46 30 M54 74 L54 30 M34 44 L66 44" fill="#e8e3d8" stroke="#3a3f4b" stroke-width="3" stroke-linejoin="round"/>`,
    pages: [
      { text: () => "Ride a cock-horse to Banbury Cross,",
        scene: (img) => `${daySky}${cloud(500, 200, 0.7)}${hill("#9fd17f")}${stoneCross(1300, 780)}${actor(img, 280, 700, 300, "trot", "breathe")}` },
      { text: () => "To see a fine lady upon a white horse;",
        scene: (img) => `${daySky}${sun(1350, 170, 80)}${hill("#9fd17f")}${stoneCross(800, 760)}${prop("horse", 1200, 680, 300)}${actor(img, 420, 700, 300, "", "sway")}` },
      { text: () => "Rings on her fingers and bells on her toes,",
        scene: (img) => `${daySky}${cloud(1200, 200, 0.7)}${hill("#9fd17f")}${actor(img, 800, 680, 340, "", "breathe")}${bells(800, 900)}` },
      { text: () => "She shall have music wherever she goes.",
        scene: (img) => `${daySky}${sun(300, 180, 80)}${hill("#9fd17f")}${actor(img, 700, 700, 320, "", "sway")}${notes(950, 420)}` },
    ],
  },
];

// The other of the Owl and the Pussy-cat rides along in the boat.
function friendsFor(a) {
  const ride = (id) => `<g transform="translate(-120 -260) scale(0.24)"><g class="prop">${(ANIMALS.find((x) => x.id === id) || { shapes: [] }).shapes.join("")}</g></g>`;
  if (a.id === "owl") return `<g transform="translate(230 0)">${ride("cat")}</g>`;
  if (a.id === "cat") return `<g transform="translate(230 0)">${ride("owl")}</g>`;
  return `<g transform="translate(230 0)">${ride("owl")}</g><g transform="translate(-260 0)">${ride("cat")}</g>`;
}

BOOKS.push(...MORE_BOOKS);
for (const b of BOOKS) b.for ??= [];
BOOKS.find((b) => b.id === "diddle").for.push("cow", "cat", "dog");
BOOKS.find((b) => b.id === "boat").for.push("turtle", "dolphin");
BOOKS.find((b) => b.id === "star").for.push("owl", "butterfly", "bird");

const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

// ---------- The book ----------

let current = null; // { book, page, img, animal, kidName }
let clipId = 0;

// Scenes are clipped to their frame, so nothing pokes out on narrow screens.
function sceneSvg(inner) {
  const id = `scene${++clipId}`;
  return `<svg viewBox="0 0 ${W} ${H}" aria-hidden="true"><defs><clipPath id="${id}"><rect width="${W}" height="${H}"/></clipPath></defs><g clip-path="url(#${id})">${inner}</g></svg>`;
}

// Shows the shelf of books. img = { url } of the child's animal, made by app.js.
export function openStory(img, animal, kidName, onPage) {
  current = { book: null, page: 0, img, animal, kidName, onPage };
  const dialog = $("story");
  showShelf();
  if (!dialog.open) dialog.showModal();
}

function showShelf() {
  current.book = null;
  const dialog = $("story");
  dialog.dataset.view = "shelf";
  // Books about this animal come first, with the child's animal on the cover.
  const id = current.animal.id;
  // The most specific match first (Baa, Baa before Old MacDonald for a sheep).
  const matched = BOOKS.filter((b) => b.for.includes(id)).sort((a, b) => a.for.length - b.for.length);
  const books = [...matched, ...BOOKS.filter((b) => !b.for.includes(id))];
  $("story-shelf").innerHTML = books.map((b) => `
    <li><button class="book-cover${b.for.includes(id) ? " matched" : ""}" data-book="${b.id}">
      ${b.for.includes(id) ? `<img class="book-me" src="${current.img.url}" alt="">` : ""}
      <svg viewBox="0 0 100 100" aria-hidden="true">${b.cover}</svg>
      <span class="book-title">${esc(b.title)}</span>
      <span class="book-credit">${esc(b.credit)}</span>
    </button></li>`).join("");
  $("story-me").src = current.img.url;
  current.onPage?.("shelf");
}

function showPage(n, direction = 1) {
  const { book, img, animal, kidName } = current;
  current.page = n;
  const dialog = $("story");
  dialog.dataset.view = "page";
  const end = n >= book.pages.length;
  const html = end
    ? `<div class="story-scene end">${sceneSvg(["boat", "owlcat", "fishalive"].includes(book.id)
        ? `${nightSky(29)}${moon(1300, 200, 80)}<rect x="0" y="720" width="${W}" height="${H - 720}" fill="#3f6f9a" stroke="#3a3f4b" stroke-width="6"/>${actor(img, 800, 700, 340, "", "rock-slow")}`
        : `${nightSky(29)}${moon(1300, 200, 80)}${hill()}${actor(img, 800, 640, 380, "", "breathe-slow")}`)}</div>
       <p class="story-text">The end</p>`
    : `<div class="story-scene">${sceneSvg(book.pages[n].scene(img, animal))}</div>
       <p class="story-text">${esc(book.pages[n].text(animal, kidName))}</p>`;
  const stage = $("story-pages");
  const old = stage.querySelector(".story-page:not(.leaving)");
  const page = document.createElement("div");
  page.className = "story-page";
  page.innerHTML = html;
  if (old && direction > 0) {
    // The old page turns over like paper, showing the new one under it.
    stage.insertBefore(page, old);
    old.classList.add("leaving", "turn");
    old.addEventListener("animationend", () => old.remove(), { once: true });
    setTimeout(() => old.remove(), 1200);
  } else {
    if (old) old.remove();
    page.classList.add("fade-in");
    stage.appendChild(page);
  }
  $("story-prev").disabled = n === 0;
  dialog.classList.toggle("at-end", end);
  current.onPage?.(book.id);
}

export function closeStory() {
  const dialog = $("story");
  if (dialog.open) dialog.close();
  $("story-pages").innerHTML = "";
  current = null;
}

$("story-shelf").addEventListener("click", (e) => {
  const b = e.target.closest(".book-cover");
  if (!b || !current) return;
  current.book = BOOKS.find((x) => x.id === b.dataset.book);
  $("story-pages").innerHTML = "";
  showPage(0);
});
$("story-next").addEventListener("click", () => {
  if (!current?.book) return;
  if (current.page >= current.book.pages.length) { showShelf(); return; }
  showPage(current.page + 1, 1);
});
$("story-prev").addEventListener("click", () => {
  if (current?.book && current.page > 0) showPage(current.page - 1, -1);
});
$("story-again").addEventListener("click", () => { if (current?.book) { $("story-pages").innerHTML = ""; showPage(0); } });
$("story-shelf-btn").addEventListener("click", () => { if (current) { $("story-pages").innerHTML = ""; showShelf(); } });
$("story-close").addEventListener("click", closeStory);
$("story").addEventListener("cancel", (e) => { e.preventDefault(); closeStory(); });
