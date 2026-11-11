import { getStroke } from "./vendor/perfect-freehand/perfect-freehand.mjs";
import { ANIMALS, CATEGORIES, animalSvg } from "./animals.js";

// Drawing happens in a 1000 x 1000 space that matches the animal outlines,
// so strokes stay lined up with the picture whatever the screen size.
const WORLD = 1000;

const COLORS = [
  "#ff4d4d", "#ff9f1c", "#ffd60a", "#7ed957", "#1fb36b",
  "#3ec5ff", "#2f6bff", "#9b5de5", "#ff70a6", "#8d5a3b", "#3a3f4b",
];
const SIZES = [14, 28, 56];
const IDLE_MS = 3 * 60_000;      // stop counting time after 3 minutes without a touch
const USAGE_FLUSH_MS = 30_000;   // send time spent to the server this often
const SAVE_DELAY_MS = 1200;      // save a drawing this long after the last change

const $ = (id) => document.getElementById(id);
const screens = ["signin", "hello", "home", "category", "history", "draw"].map($);
const draw = $("draw");
const stageWrap = $("stage-wrap");
const stage = $("stage");
const guide = $("guide");
const canvas = $("ink");
const ctx = canvas.getContext("2d");
const committed = document.createElement("canvas");
const cctx = committed.getContext("2d");

const state = {
  me: null,             // { kidName, email, stats }
  config: null,
  animal: null,
  drawingId: null,      // server id once the drawing has been saved
  drawingSeconds: 0,
  dirty: false,
  color: COLORS[0],
  size: SIZES[1],
  eraser: false,
  strokes: [],
  cleared: null,        // strokes kept after "clear", so undo can bring them back
  current: null,
  activePointer: null,
  penSeenAt: 0,
  lastActivity: Date.now(),
  pendingSeconds: 0,
};

// ---------- Small helpers ----------

const store = {
  get(key, fallback) {
    try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; } catch { return fallback; }
  },
  set(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* private browsing */ }
  },
};

class AuthError extends Error {}

async function api(path, { method = "GET", data, keepalive = false } = {}) {
  const res = await fetch(path, {
    method,
    keepalive,
    credentials: "same-origin",
    headers: data ? { "Content-Type": "application/json" } : undefined,
    body: data ? JSON.stringify(data) : undefined,
  });
  if (res.status === 401) throw new AuthError("Signed out");
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.error || `Request failed (${res.status})`);
  return body;
}

let toastTimer = 0;
function toast(text) {
  const t = $("toast");
  t.textContent = text;
  t.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { t.hidden = true; }, 3000);
}

function formatTime(total) {
  const s = Math.max(0, Math.floor(total));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  if (h) return `${h}h ${String(m).padStart(2, "0")}m`;
  if (m) return `${m}m`;
  return `${s}s`;
}

function show(id) {
  for (const s of screens) s.hidden = s.id !== id;
  $("topbar").hidden = !(state.me && state.me.kidName);
  const viewing = id === "draw" && draw.classList.contains("readonly");
  // Back button next to the name: drawing → its group, viewing → History, group → all groups.
  const back = $("topback");
  back.hidden = !(id === "draw" || id === "category");
  if (id === "category") back.href = "#";
  else if (viewing) back.href = "#history";
  else if (id === "draw" && state.animal) {
    const group = CATEGORIES.find((c) => c.id === state.lastCategory && c.animals.includes(state.animal.id))
      || CATEGORIES.find((c) => c.animals.includes(state.animal.id));
    back.href = group ? `#c/${group.id}` : "#";
  }
  $("tab-animals").classList.toggle("active", id === "home" || id === "category" || (id === "draw" && !viewing));
  $("tab-history").classList.toggle("active", id === "history" || viewing);
}

// ---------- Sign in ----------

async function boot() {
  try {
    state.config = await api("/api/config");
  } catch {
    state.config = { googleClientId: null, devLogin: false };
  }
  try {
    state.me = await api("/api/me");
  } catch (err) {
    state.me = null;
  }
  route();
}

function showSignin() {
  state.me = null;
  show("signin");
  const { googleClientId, devLogin } = state.config || {};
  $("dev-login").hidden = !devLogin;
  if (!googleClientId) {
    if (!devLogin) $("signin-note").textContent = "Sign-in isn’t set up yet.";
    return;
  }
  loadGoogle().then(() => {
    google.accounts.id.initialize({
      client_id: googleClientId,
      callback: ({ credential }) => finishSignin(api("/api/auth/google", { method: "POST", data: { credential } })),
      auto_select: true,
    });
    google.accounts.id.renderButton($("google-btn"), { theme: "filled_blue", size: "large", shape: "pill", text: "signin_with" });
  }).catch(() => { $("signin-note").textContent = "Couldn’t reach Google. Check the internet and reload."; });
}

let googlePromise = null;
function loadGoogle() {
  googlePromise ??= new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = "https://accounts.google.com/gsi/client";
    s.async = true;
    s.onload = resolve;
    s.onerror = () => { googlePromise = null; reject(new Error("Google script failed")); };
    document.head.appendChild(s);
  });
  return googlePromise;
}

async function finishSignin(request) {
  try {
    state.me = await request;
    route();
  } catch (err) {
    toast("Sign-in didn’t work. Try again.");
  }
}

$("dev-login").addEventListener("click", () => {
  finishSignin(api("/api/auth/dev", { method: "POST", data: { email: "dev@example.com" } }));
});

$("name-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = $("name-input").value.trim();
  if (!name) return;
  try {
    state.me = await api("/api/me", { method: "PUT", data: { kidName: name } });
    location.hash = "";
    route();
  } catch (err) { handleError(err); }
});

// ---------- Top bar and profile ----------

function renderTopbar() {
  if (!state.me) return;
  const name = state.me.kidName || "";
  $("who-initial").textContent = name.slice(0, 1).toUpperCase();
  $("who-name").textContent = name;
  $("stat-drawings").textContent = state.me.stats.drawings;
  $("stat-time").textContent = formatTime(state.me.stats.seconds + state.pendingSeconds);
}

$("who").addEventListener("click", () => {
  $("profile-name").value = state.me.kidName || "";
  $("profile-today").textContent = `Today: ${formatTime(state.me.stats.todaySeconds + state.pendingSeconds)}`;
  $("profile-email").textContent = state.me.email ? `Signed in as ${state.me.email}` : "";
  $("profile").showModal();
});

// Cancel, or a tap outside the card, closes it without saving.
$("profile-cancel").addEventListener("click", () => $("profile").close());
$("profile").addEventListener("click", (e) => { if (e.target === $("profile")) $("profile").close(); });

$("profile-form").addEventListener("submit", async () => {
  const name = $("profile-name").value.trim();
  if (!name || name === state.me.kidName) return;
  try {
    state.me = await api("/api/me", { method: "PUT", data: { kidName: name } });
    renderTopbar();
  } catch (err) { handleError(err); }
});

$("signout").addEventListener("click", async () => {
  $("profile").close();
  await saveNow();
  await flushUsage();
  try { await api("/api/auth/logout", { method: "POST" }); } catch { /* already out */ }
  try { google.accounts.id.disableAutoSelect(); } catch { /* not loaded */ }
  location.hash = "";
  showSignin();
});

function handleError(err) {
  if (err instanceof AuthError) { showSignin(); return; }
  console.error(err);
  toast("Couldn’t save. Check the internet.");
}

// ---------- Time spent ----------

for (const type of ["pointerdown", "keydown"]) {
  window.addEventListener(type, () => { state.lastActivity = Date.now(); }, { capture: true, passive: true });
}

setInterval(() => {
  if (!state.me || !state.me.kidName || document.visibilityState !== "visible") return;
  if (Date.now() - state.lastActivity > IDLE_MS) return;
  state.pendingSeconds += 1;
  if (!draw.hidden && state.animal && !state.readOnly) state.drawingSeconds += 1;
  renderTopbar();
}, 1000);

setInterval(() => { flushUsage(); }, USAGE_FLUSH_MS);

async function flushUsage(keepalive = false) {
  const seconds = Math.min(120, state.pendingSeconds);
  if (!seconds || !state.me) return;
  state.pendingSeconds -= seconds;
  try {
    const stats = await api("/api/usage", { method: "POST", data: { seconds }, keepalive });
    state.me.stats = stats;
  } catch (err) {
    state.pendingSeconds += seconds; // try again next time
    if (err instanceof AuthError) showSignin();
  }
  renderTopbar();
}

document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden") {
    flushUsage(true);
    saveNow(true);
  }
});

// ---------- Screens ----------

function buildHome() {
  $("categories").innerHTML = CATEGORIES.map((c) => `
    <li><a class="card labelled" style="--tint:${c.tint}" href="#c/${c.id}">
      ${animalSvg(c, "thumb")}<span>${c.name}</span>
    </a></li>`).join("");
}

function showCategory(category) {
  state.lastCategory = category.id;
  $("category-name").textContent = category.name;
  $("animals").innerHTML = category.animals.map((id) => ANIMALS.find((a) => a.id === id)).map((a) => `
    <li><a class="card" style="--tint:${a.tint}" href="#${a.id}" aria-label="${a.name}">
      ${animalSvg(a, "thumb")}
    </a></li>`).join("");
  show("category");
}

// ---------- Analytics ----------

// The app is one page with #hash routes, so each route is sent to Google
// Analytics as its own page view with a readable path. Drawing ids are left
// out so every saved drawing doesn't become its own page.
let lastPageView = null;
function trackPage(path, title) {
  if (path === lastPageView || typeof gtag !== "function") return;
  lastPageView = path;
  gtag("event", "page_view", {
    page_location: location.origin + path,
    page_path: path,
    page_title: title ? `Trace: ${title}` : "Trace",
  });
}

function pageFor(hash) {
  if (!state.me) return ["/signin", "Sign in"];
  if (!state.me.kidName) return ["/name", "Name"];
  if (hash === "history") return ["/history", "History"];
  const group = hash.match(/^c\/(\w+)$/);
  const category = group && CATEGORIES.find((c) => c.id === group[1]);
  if (category) return [`/group/${category.id}`, category.name || category.id];
  const existing = hash.match(/^([de])\/\d+$/);
  if (existing) return existing[1] === "d" ? ["/drawing/view", "View drawing"] : ["/drawing/edit", "Drawing"];
  const animal = ANIMALS.find((a) => a.id === hash);
  if (animal) return [`/draw/${animal.id}`, animal.name || animal.id];
  return ["/", "Animals"];
}

async function route() {
  await saveNow();
  state.animal = null;
  trackPage(...pageFor(location.hash.slice(1)));

  if (!state.me) return showSignin();
  if (!state.me.kidName) {
    show("hello");
    setTimeout(() => $("name-input").focus(), 50);
    return;
  }
  renderTopbar();

  const hash = location.hash.slice(1);
  if (hash === "history") return showHistory();

  const group = hash.match(/^c\/(\w+)$/);
  const category = group && CATEGORIES.find((c) => c.id === group[1]);
  if (category) return showCategory(category);

  // #d/<id> views a saved drawing; #e/<id> keeps editing the drawing in progress.
  const existing = hash.match(/^([de])\/(\d+)$/);
  if (existing) return openDrawing(Number(existing[2]), existing[1] === "d");

  const animal = ANIMALS.find((a) => a.id === hash);
  if (animal) return startDrawing(animal, null, [], 0);

  show("home");
}

async function showHistory() {
  show("history");
  const list = $("history-list");
  list.innerHTML = "";
  let drawings = [];
  try {
    ({ drawings } = await api("/api/drawings"));
  } catch (err) { handleError(err); return; }
  $("history-empty").hidden = drawings.length > 0;

  const byDay = new Map();
  for (const d of drawings) {
    const label = dayLabel(new Date(d.createdAt));
    if (!byDay.has(label)) byDay.set(label, []);
    byDay.get(label).push(d);
  }
  list.innerHTML = [...byDay].map(([label, items]) => `
    <section class="day">
      <h2>${label}</h2>
      <ul class="grid">
        ${items.map((d) => {
          const animal = ANIMALS.find((a) => a.id === d.animal);
          const when = stamp(d.createdAt);
          const img = d.thumb ? `<img src="${d.thumb}" alt="">` : `<img alt="">`;
          return `<li class="past-item" data-id="${d.id}">
                    <a class="past" style="--tint:${animal?.tint || "#eee"}" href="#d/${d.id}"
                      aria-label="${animal?.name || d.animal}, ${when}">${img}<span>${when}</span></a>
                    <button class="icon-btn trash" aria-label="Delete drawing"><svg viewBox="0 0 24 24"><path d="M4 7 H20 M9 7 V4 H15 V7 M6 7 L7 21 H17 L18 7 M10 11 V17 M14 11 V17"/></svg></button>
                  </li>`;
        }).join("")}
      </ul>
    </section>`).join("");
}

// "11 Nov · 3:28 PM"
function stamp(ms) {
  const d = new Date(ms);
  const date = d.toLocaleDateString([], { day: "numeric", month: "short",
    year: d.getFullYear() === new Date().getFullYear() ? undefined : "numeric" });
  return `${date} · ${d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}`;
}

// Delete needs two taps: the first turns the button red, the second deletes.
function twoTap(button, action) {
  if (!button.classList.contains("armed")) {
    document.querySelectorAll(".armed").forEach((b) => b !== button && b.classList.remove("armed"));
    button.classList.add("armed");
    clearTimeout(button._disarm);
    button._disarm = setTimeout(() => button.classList.remove("armed"), 2500);
    return;
  }
  clearTimeout(button._disarm);
  button.classList.remove("armed");
  action();
}

async function deleteDrawing(id) {
  const res = await api(`/api/drawings/${id}`, { method: "DELETE" });
  state.me.stats = res.stats;
  renderTopbar();
}

$("history-list").addEventListener("click", (e) => {
  const button = e.target.closest(".trash");
  if (!button) return;
  const item = button.closest(".past-item");
  twoTap(button, async () => {
    try {
      await deleteDrawing(Number(item.dataset.id));
      const day = item.closest(".day");
      item.remove();
      if (!day.querySelector(".past-item")) day.remove();
      $("history-empty").hidden = !!$("history-list").querySelector(".past-item");
    } catch (err) { handleError(err); }
  });
});

function dayLabel(date) {
  const start = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const days = Math.round((start(new Date()) - start(date)) / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  return date.toLocaleDateString([], { weekday: "short", day: "numeric", month: "short",
    year: date.getFullYear() === new Date().getFullYear() ? undefined : "numeric" });
}

async function openDrawing(id, readOnly) {
  try {
    const { drawing } = await api(`/api/drawings/${id}`);
    const animal = ANIMALS.find((a) => a.id === drawing.animal);
    if (!animal) throw new Error("Unknown animal");
    startDrawing(animal, drawing.id, drawing.strokes, drawing.seconds, readOnly);
    $("view-date").textContent = stamp(drawing.createdAt);
  } catch (err) {
    handleError(err);
    location.hash = "history";
  }
}

function startDrawing(animal, id, strokes, seconds, readOnly = false) {
  state.readOnly = readOnly;
  draw.classList.toggle("readonly", readOnly);
  state.animal = animal;
  state.drawingId = id;
  state.strokes = strokes;
  state.drawingSeconds = seconds;
  state.cleared = null;
  state.current = null;
  state.dirty = false;
  guide.innerHTML = animalSvg(animal, "guide");
  stage.setAttribute("aria-label", `Trace the ${animal.name.toLowerCase()}`);
  show("draw");
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
  if (canvas.width !== px) canvas.width = canvas.height = committed.width = committed.height = px;
  redrawAll();
}

$("view-delete").addEventListener("click", (e) => {
  twoTap(e.currentTarget, async () => {
    try {
      await deleteDrawing(state.drawingId);
      state.animal = null;
      location.hash = "history";
    } catch (err) { handleError(err); }
  });
});

// ---------- Saving drawings ----------

let saveTimer = 0;
let saving = null;

function scheduleSave() {
  state.dirty = true;
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => saveNow(), SAVE_DELAY_MS);
}

async function saveNow(keepalive = false) {
  clearTimeout(saveTimer);
  if (saving) await saving;
  if (!state.dirty || !state.animal || !state.me) return;
  state.dirty = false;
  const animal = state.animal;
  const strokes = state.strokes;
  const id = state.drawingId;
  saving = (async () => {
    try {
      if (!strokes.length) {
        // Cleared drawings are removed rather than kept as blank pages.
        if (id) {
          const res = await api(`/api/drawings/${id}`, { method: "DELETE", keepalive });
          if (state.drawingId === id) state.drawingId = null;
          state.me.stats = res.stats;
        }
        return;
      }
      const data = { animal: animal.id, strokes, seconds: state.drawingSeconds, thumb: await thumbnail(animal, strokes) };
      const res = id
        ? await api(`/api/drawings/${id}`, { method: "PUT", data, keepalive })
        : await api("/api/drawings", { method: "POST", data, keepalive });
      state.me.stats = res.stats;
      // Still on this new drawing: give it its own address so a reload reopens it.
      if (!id && state.animal === animal && state.drawingId === null && location.hash === `#${animal.id}`) {
        state.drawingId = res.drawing.id;
        history.replaceState(null, "", `#e/${res.drawing.id}`);
      }
    } catch (err) {
      if (state.animal === animal) state.dirty = true;
      handleError(err);
    } finally {
      saving = null;
      renderTopbar();
    }
  })();
  return saving;
}

const guideImages = new Map();
function guideImage(animal) {
  if (!guideImages.has(animal.id)) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" width="256" height="256">
      <style>path,circle,ellipse{fill:#fff;stroke:#c5cbd6;stroke-width:14;stroke-linecap:round;stroke-linejoin:round}.dot{fill:#c5cbd6;stroke:none}</style>
      ${animal.shapes.join("")}</svg>`;
    guideImages.set(animal.id, new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => resolve(null);
      img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
    }));
  }
  return guideImages.get(animal.id);
}

async function thumbnail(animal, strokes) {
  const size = 256;
  const ink = document.createElement("canvas");
  ink.width = ink.height = size;
  const ictx = ink.getContext("2d");
  for (const s of strokes) paintStroke(ictx, s);
  const out = document.createElement("canvas");
  out.width = out.height = size;
  const octx = out.getContext("2d");
  octx.fillStyle = "#fff";
  octx.fillRect(0, 0, size, size);
  const img = await guideImage(animal);
  if (img) octx.drawImage(img, 0, 0, size, size);
  octx.drawImage(ink, 0, 0);
  return out.toDataURL("image/jpeg", 0.82);
}

// ---------- Tools ----------

function buildTools() {
  $("colors").innerHTML = COLORS.map((c) =>
    `<button class="swatch" role="radio" style="--c:${c}" data-color="${c}" aria-label="Colour ${c}"></button>`).join("");
  $("colors").addEventListener("click", (e) => {
    const b = e.target.closest(".swatch");
    if (!b) return;
    state.color = b.dataset.color;
    state.eraser = false;
    syncTools();
  });

  $("sizes").innerHTML = SIZES.map((s, i) =>
    `<button class="size" role="radio" data-size="${s}" aria-label="${["Thin", "Medium", "Thick"][i]}">
      <span style="width:${10 + i * 11}px;height:${10 + i * 11}px"></span></button>`).join("");
  $("sizes").addEventListener("click", (e) => {
    const b = e.target.closest(".size");
    if (!b) return;
    state.size = Number(b.dataset.size);
    syncTools();
  });

  $("eraser").addEventListener("click", () => { state.eraser = !state.eraser; syncTools(); });
  $("undo").addEventListener("click", undo);
  $("star").addEventListener("click", () => { celebrate(); saveNow(); });

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
    redrawAll();
    scheduleSave();
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

function undo() {
  if (state.strokes.length) state.strokes = state.strokes.slice(0, -1);
  else if (state.cleared) { state.strokes = state.cleared; state.cleared = null; }
  else return;
  redrawAll();
  scheduleSave();
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
  if (state.readOnly) return;
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
  state.strokes = [...state.strokes, stroke];
  state.cleared = null;
  paintStroke(cctx, stroke);
  frame();
  scheduleSave();
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

// ---------- Celebrate ----------

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

const savedTools = store.get("trace:tools", null);
if (savedTools && COLORS.includes(savedTools.color)) state.color = savedTools.color;
if (savedTools && SIZES.includes(savedTools.size)) state.size = savedTools.size;

buildHome();
buildTools();
syncTools();
window.addEventListener("hashchange", route);
new ResizeObserver(layout).observe(stageWrap);
boot();
