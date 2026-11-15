// "Animate now": the child's own traced animal becomes the star of a little
// picture book of an old nursery rhyme (all public domain).
//
// Calm by design: pages only turn when the child taps, each page plays one
// slow move and then the animal just breathes, there's no sound, and the
// book ends with "The end" as a natural stopping point.

import { ANIMALS } from "./animals.js";

const W = 1600;
const H = 1000;

const $ = (id) => document.getElementById(id);
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

// A built-in outline as a little prop in a scene.
function prop(id, x, y, size, cls = "") {
  const a = ANIMALS.find((item) => item.id === id);
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
  $("story-shelf").innerHTML = BOOKS.map((b) => `
    <li><button class="book-cover" data-book="${b.id}">
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
    ? `<div class="story-scene end">${sceneSvg(`${nightSky(29)}${moon(1300, 200, 80)}${hill()}${actor(img, 800, 640, 380, "", "breathe-slow")}`)}</div>
       <p class="story-text">The end</p>`
    : `<div class="story-scene">${sceneSvg(book.pages[n].scene(img))}</div>
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
