import { getStroke } from "./vendor/perfect-freehand/perfect-freehand.mjs";
import { ANIMALS, animalSvg } from "./animals.js";

// Drawing happens in a 1000 x 1000 space that matches the animal outlines,
// so strokes stay lined up with the picture whatever the screen size.
const WORLD = 1000;

const COLORS = [
  "#ff4d4d", "#ff9f1c", "#ffd60a", "#7ed957", "#1fb36b",
  "#3ec5ff", "#2f6bff", "#9b5de5", "#ff70a6", "#8d5a3b", "#3a3f4b",
];
const SIZES = [14, 28, 56];

const $ = (id) => document.getElementById(id);
const home = $("home");
const draw = $("draw");
const stageWrap = $("stage-wrap");
const stage = $("stage");
const guide = $("guide");
const canvas = $("ink");
const ctx = canvas.getContext("2d");
const committed = document.createElement("canvas");
const cctx = committed.getContext("2d");

const state = {
  animal: null,
  color: COLORS[0],
  size: SIZES[1],
  eraser: false,
  strokes: [],
  cleared: null, // strokes kept after "clear", so undo can bring them back
  current: null,
  activePointer: null,
  penSeenAt: 0,
};

// ---------- Storage (best effort: private browsing may block it) ----------

const store = {
  get(key, fallback) {
    try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch { return fallback; }
  },
  set(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* ignore */ }
  },
};

// ---------- Home ----------

function buildHome() {
  const list = $("animals");
  list.innerHTML = ANIMALS.map((a) => `
    <li><button class="card" style="--tint:${a.tint}" data-id="${a.id}" aria-label="${a.name}">
      ${animalSvg(a, "thumb")}
    </button></li>`).join("");
  list.addEventListener("click", (e) => {
    const card = e.target.closest(".card");
    if (card) location.hash = card.dataset.id;
  });
}

// ---------- Tools ----------

function buildTools() {
  const colors = $("colors");
  colors.innerHTML = COLORS.map((c) =>
    `<button class="swatch" role="radio" style="--c:${c}" data-color="${c}" aria-label="Colour ${c}"></button>`).join("");
  colors.addEventListener("click", (e) => {
    const b = e.target.closest(".swatch");
    if (!b) return;
    state.color = b.dataset.color;
    state.eraser = false;
    syncTools();
  });

  const sizes = $("sizes");
  sizes.innerHTML = SIZES.map((s, i) =>
    `<button class="size" role="radio" data-size="${s}" aria-label="${["Thin", "Medium", "Thick"][i]}">
      <span style="width:${10 + i * 11}px;height:${10 + i * 11}px"></span></button>`).join("");
  sizes.addEventListener("click", (e) => {
    const b = e.target.closest(".size");
    if (!b) return;
    state.size = Number(b.dataset.size);
    syncTools();
  });

  $("eraser").addEventListener("click", () => { state.eraser = !state.eraser; syncTools(); });
  $("undo").addEventListener("click", undo);
  $("star").addEventListener("click", celebrate);
  $("back").addEventListener("click", () => { location.hash = ""; });

  // Clear needs two taps so a stray tap doesn't wipe a drawing.
  const clear = $("clear");
  let armTimer = 0;
  clear.addEventListener("click", () => {
    if (!clear.classList.contains("armed")) {
      clear.classList.add("armed");
      armTimer = setTimeout(() => clear.classList.remove("armed"), 2500);
      return;
    }
    clearTimeout(armTimer);
    clear.classList.remove("armed");
    if (!state.strokes.length) return;
    state.cleared = state.strokes;
    state.strokes = [];
    afterChange();
  });
}

function syncTools() {
  document.querySelectorAll(".swatch").forEach((b) =>
    b.setAttribute("aria-checked", String(!state.eraser && b.dataset.color === state.color)));
  document.querySelectorAll(".size").forEach((b) =>
    b.setAttribute("aria-checked", String(Number(b.dataset.size) === state.size)));
  $("eraser").setAttribute("aria-pressed", String(state.eraser));
  $("sizes").style.setProperty("--current", state.eraser ? "#c9ced8" : state.color);
  store.set("trace:tools", { color: state.color, size: state.size });
}

// ---------- Screens ----------

function route() {
  const animal = ANIMALS.find((a) => a.id === location.hash.slice(1));
  if (!animal) {
    state.animal = null;
    draw.hidden = true;
    home.hidden = false;
    return;
  }
  state.animal = animal;
  state.strokes = store.get(`trace:${animal.id}`, []);
  state.cleared = null;
  state.current = null;
  guide.innerHTML = animalSvg(animal, "guide");
  stage.setAttribute("aria-label", `Trace the ${animal.name.toLowerCase()}`);
  home.hidden = true;
  draw.hidden = false;
  layout();
}

// Keep the paper square and as big as the space allows.
function layout() {
  if (draw.hidden) return;
  const { width, height } = stageWrap.getBoundingClientRect();
  const side = Math.floor(Math.min(width, height));
  if (side <= 0) return;
  stage.style.width = stage.style.height = `${side}px`;
  const dpr = Math.min(window.devicePixelRatio || 1, 3);
  const px = Math.round(side * dpr);
  if (canvas.width !== px) {
    canvas.width = canvas.height = committed.width = committed.height = px;
  }
  redrawAll();
}

// ---------- Rendering ----------

function average(a, b) { return (a + b) / 2; }

// From the perfect-freehand README: turn outline points into a smooth path.
function pathFromStroke(points) {
  const len = points.length;
  if (len < 4) return null;
  let a = points[0];
  let b = points[1];
  const c = points[2];
  let d = `M${a[0]},${a[1]} Q${b[0]},${b[1]} ${average(b[0], c[0])},${average(b[1], c[1])} T`;
  for (let i = 2; i < len - 1; i++) {
    a = points[i];
    b = points[i + 1];
    d += `${average(a[0], b[0])},${average(a[1], b[1])} `;
  }
  return new Path2D(d + "Z");
}

function strokeOptions(stroke, last) {
  return {
    size: stroke.size,
    thinning: stroke.pen ? 0.55 : 0.35,
    smoothing: 0.55,
    streamline: 0.45,
    simulatePressure: !stroke.pen,
    start: { cap: true },
    end: { cap: true },
    last,
  };
}

function paintStroke(target, stroke, last = true) {
  const scale = target.canvas.width / WORLD;
  target.save();
  target.setTransform(scale, 0, 0, scale, 0, 0);
  target.globalCompositeOperation = stroke.eraser ? "destination-out" : "source-over";
  target.fillStyle = stroke.eraser ? "#000" : stroke.color;
  const path = pathFromStroke(getStroke(stroke.points, strokeOptions(stroke, last)));
  if (path) {
    target.fill(path);
  } else {
    const [x, y] = stroke.points[0];
    target.beginPath();
    target.arc(x, y, stroke.size / 2, 0, Math.PI * 2);
    target.fill();
  }
  target.restore();
}

function redrawAll() {
  cctx.clearRect(0, 0, committed.width, committed.height);
  for (const s of state.strokes) paintStroke(cctx, s);
  frame();
}

let framePending = false;
function requestFrame() {
  if (framePending) return;
  framePending = true;
  requestAnimationFrame(() => { framePending = false; frame(); });
}

function frame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(committed, 0, 0);
  if (state.current) paintStroke(ctx, state.current, false);
}

// ---------- Input (Pencil first, fingers when no Pencil is around) ----------

// Once the Pencil has been used, finger and palm touches are ignored, so a
// resting hand doesn't leave marks. Fingers work again after a minute without the Pencil.
const PEN_MEMORY_MS = 60_000;
const penRecently = () => performance.now() - state.penSeenAt < PEN_MEMORY_MS;

function toWorld(e) {
  const r = canvas.getBoundingClientRect();
  return [
    ((e.clientX - r.left) / r.width) * WORLD,
    ((e.clientY - r.top) / r.height) * WORLD,
    e.pointerType === "pen" ? Math.max(0.05, e.pressure || 0.5) : 0.5,
  ];
}

function startStroke(e) {
  state.activePointer = e.pointerId;
  state.current = {
    color: state.color,
    size: state.eraser ? state.size * 1.6 : state.size,
    eraser: state.eraser,
    pen: e.pointerType === "pen",
    points: [toWorld(e)],
  };
  try { canvas.setPointerCapture(e.pointerId); } catch { /* ignore */ }
  requestFrame();
}

canvas.addEventListener("pointerdown", (e) => {
  const isPen = e.pointerType === "pen";
  if (isPen) state.penSeenAt = performance.now();
  if (e.pointerType === "touch" && penRecently()) return;
  if (state.activePointer !== null) {
    // A palm landed first and the Pencil came down second: drop the palm mark.
    if (isPen && state.current && !state.current.pen) state.current = null;
    else return;
  }
  e.preventDefault();
  startStroke(e);
});

canvas.addEventListener("pointermove", (e) => {
  if (e.pointerId !== state.activePointer || !state.current) return;
  if (state.current.pen) state.penSeenAt = performance.now();
  const events = e.getCoalescedEvents ? e.getCoalescedEvents() : [];
  for (const ev of events.length ? events : [e]) state.current.points.push(toWorld(ev));
  requestFrame();
});

function endStroke(e) {
  if (e.pointerId !== state.activePointer) return;
  state.activePointer = null;
  const stroke = state.current;
  state.current = null;
  if (!stroke) return;
  if (e.type === "pointercancel" && !stroke.pen) { frame(); return; }
  stroke.points = stroke.points.map(([x, y, p]) => [Math.round(x * 10) / 10, Math.round(y * 10) / 10, Math.round(p * 100) / 100]);
  state.strokes.push(stroke);
  state.cleared = null;
  paintStroke(cctx, stroke);
  frame();
  save();
}
canvas.addEventListener("pointerup", endStroke);
canvas.addEventListener("pointercancel", endStroke);

// iPad Safari: block scrolling, pinch zoom, double-tap zoom and the Pencil
// magnifier while drawing.
for (const type of ["touchstart", "touchmove", "touchend"]) {
  stage.addEventListener(type, (e) => e.preventDefault(), { passive: false });
}
for (const type of ["gesturestart", "gesturechange", "gestureend"]) {
  document.addEventListener(type, (e) => e.preventDefault(), { passive: false });
}
document.addEventListener("contextmenu", (e) => { if (!draw.hidden) e.preventDefault(); });

// ---------- Undo, save, celebrate ----------

function undo() {
  if (state.strokes.length) state.strokes.pop();
  else if (state.cleared) { state.strokes = state.cleared; state.cleared = null; }
  else return;
  afterChange();
}

function afterChange() {
  redrawAll();
  save();
}

function save() {
  if (state.animal) store.set(`trace:${state.animal.id}`, state.strokes);
}

function celebrate() {
  const box = $("confetti");
  const r = $("star").getBoundingClientRect();
  const x = r.left + r.width / 2;
  const y = r.top + r.height / 2;
  box.innerHTML = "";
  for (let i = 0; i < 36; i++) {
    const dot = document.createElement("i");
    const angle = Math.random() * Math.PI * 2;
    const dist = 140 + Math.random() * 320;
    dot.style.left = `${x - 9}px`;
    dot.style.top = `${y - 9}px`;
    dot.style.background = COLORS[i % COLORS.length];
    dot.style.setProperty("--dx", `${Math.cos(angle) * dist}px`);
    dot.style.setProperty("--dy", `${Math.sin(angle) * dist}px`);
    dot.style.animationDelay = `${Math.random() * 0.15}s`;
    box.appendChild(dot);
  }
  setTimeout(() => { box.innerHTML = ""; }, 1700);
}

// ---------- Start ----------

const saved = store.get("trace:tools", null);
if (saved && COLORS.includes(saved.color)) state.color = saved.color;
if (saved && SIZES.includes(saved.size)) state.size = saved.size;

buildHome();
buildTools();
syncTools();
window.addEventListener("hashchange", route);
new ResizeObserver(layout).observe(stageWrap);
route();
