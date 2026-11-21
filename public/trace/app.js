import { getStroke } from "./vendor/perfect-freehand/perfect-freehand.mjs";
import { ANIMALS, CATEGORIES, animalSvg } from "./animals.js";
import { AuthError, OfflineError, api, pullDrawings, pullMine, pushDrawings, pushMine, validMine } from "./sync.js";
import { allDrawings, allMine, countDrawings, deleteDrawingRecord, deleteMineRecord, getDrawing, getMine, keepStorage, newAnimalId, newId, putDrawing, putMine } from "./local.js";
import { NoAnimalError, photoToOutline, prepareModel } from "./photo.js";
import { closeStory, openStory } from "./story.js";
import { liveLine, serverMasks } from "./ai.js";
import { audio } from "./music.js";
import { appleButton, appleSignInFailed } from "/shared/apple.js";

// Drawing happens in a 1000 x 1000 space that matches the animal outlines,
// so strokes stay lined up with the picture whatever the screen size.
const WORLD = 1000;

const COLORS = [
  "#ff4d4d", "#ff9f1c", "#ffd60a", "#7ed957", "#1fb36b",
  "#3ec5ff", "#2f6bff", "#9b5de5", "#ff70a6", "#8d5a3b", "#3a3f4b",
];
const SIZES = [14, 28, 56];
const IDLE_MS = 3 * 60_000;      // stop counting time after 3 minutes without a touch
const SYNC_EVERY_MS = 30_000;    // send time spent and unsent drawings this often
const PULL_EVERY_MS = 5 * 60_000; // check for drawings from other devices this often
const SAVE_DELAY_MS = 1200;      // save a drawing this long after the last change

// The My Animals group: outlines made from the child's own photos. Its
// animals live in state.mine (from local.js), not in animals.js.
const MY_GROUP = {
  id: "mine",
  name: "My Animals",
  tint: "#ddf1ff",
  animals: [],
  shapes: [
    `<path d="M190 330 L360 330 L410 250 L590 250 L640 330 L810 330 Q870 330 870 390 L870 730 Q870 790 810 790 L190 790 Q130 790 130 730 L130 390 Q130 330 190 330 Z"/>`,
    `<circle cx="500" cy="555" r="165"/>`,
    `<ellipse class="dot" cx="500" cy="600" rx="58" ry="46"/>`,
    `<circle class="dot" cx="425" cy="535" r="24"/>`,
    `<circle class="dot" cx="468" cy="490" r="24"/>`,
    `<circle class="dot" cx="532" cy="490" r="24"/>`,
    `<circle class="dot" cx="575" cy="535" r="24"/>`,
    `<circle class="dot" cx="765" cy="420" r="26"/>`,
  ],
};
const GROUPS = [...CATEGORIES, MY_GROUP];

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
  me: null,             // { account, kidName, email, kids, stats }; kept on the device for offline use
  config: null,
  animal: null,
  cid: null,            // this drawing's id once it has been saved (made on the device)
  createdAt: null,
  drawingSeconds: 0,
  dirty: false,
  color: COLORS[0],
  size: SIZES[1],
  eraser: false,
  strokes: [],
  cleared: null,        // strokes kept after "clear", so undo can bring them back
  current: null,
  activePointer: null,
  lastInputAt: 0,       // when the line being drawn last moved
  penSeenAt: -Infinity, // no Pencil yet, so fingers draw straight away
  lastActivity: Date.now(),
  usage: {},            // seconds not sent yet, by UTC day: { "2026-11-15": 95 }
  localCount: null,     // drawings on this device for this account
  offline: false,
  mine: new Map(),      // My Animals for this account, by animal id
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
  else if (id === "draw" && state.animal?.mine) back.href = "#c/mine";
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
  keepStorage();
  if (appleSignInFailed()) setTimeout(() => toast("Sign-in didn’t work. Try again."), 300);
  try {
    state.config = await api("/api/config");
    store.set("trace:config", state.config);
  } catch {
    state.config = store.get("trace:config", { googleClientId: null, appleClientId: null, devLogin: false });
  }
  try {
    state.me = await api("/api/me");
    setOffline(false);
  } catch (err) {
    // No internet: carry on as whoever was signed in last time.
    state.me = err instanceof AuthError ? null : store.get("trace:me", null);
    if (!(err instanceof AuthError)) setOffline(true);
  }
  if (state.me) await enterAccount();
  route();
  if (state.me) syncNow({ pull: true });
}

// The account's id, used to keep each account's drawings apart on the device.
const owner = () => state.me && String(state.me.account ?? state.me.email);
const utcDay = () => new Date().toISOString().slice(0, 10);

async function enterAccount() {
  store.set("trace:me", state.me);
  await loadMine();
  state.usage = store.get(`trace:usage:${owner()}`, {});
  const pendingName = store.get(`trace:name:${owner()}`, null);
  if (pendingName) state.me.kidName = pendingName;
  await refreshCount();
}

function showSignin() {
  state.me = null;
  show("signin");
  const { googleClientId, appleClientId, devLogin } = state.config || {};
  $("dev-login").hidden = !devLogin;
  const note = $("signin-note");
  note.textContent = navigator.onLine ? "Grown-ups: sign in to save drawings." : "Connect to the internet to sign in.";
  if (appleClientId && !$("apple-btn").firstChild) $("apple-btn").appendChild(appleButton(appleClientId, "/trace/"));
  if (!googleClientId) {
    if (!devLogin && !appleClientId) note.textContent = "Sign-in isn’t set up yet.";
    return;
  }
  loadGoogle().then(() => {
    google.accounts.id.initialize({
      client_id: googleClientId,
      callback: ({ credential }) => finishSignin(api("/api/auth/google", { method: "POST", data: { credential } })),
      auto_select: true,
    });
    google.accounts.id.renderButton($("google-btn"), { theme: "filled_blue", size: "large", shape: "pill", text: "signin_with" });
  }).catch(() => { note.textContent = "Couldn’t reach Google. Check the internet and reload."; });
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
    setOffline(false);
    await enterAccount();
    route();
    syncNow({ pull: true });
  } catch (err) {
    toast(err instanceof OfflineError ? "Connect to the internet to sign in." : "Sign-in didn’t work. Try again.");
  }
}

$("dev-login").addEventListener("click", () => {
  finishSignin(api("/api/auth/dev", { method: "POST", data: { email: "dev@example.com" } }));
});

$("name-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = $("name-input").value.trim();
  if (!name) return;
  setKidName(name);
  location.hash = "";
  route();
});

// Names are saved on the device straight away and sent with the next sync.
function setKidName(name) {
  state.me.kidName = name;
  store.set("trace:me", state.me);
  store.set(`trace:name:${owner()}`, name);
  renderTopbar();
  syncNow();
}

// ---------- Top bar and profile ----------

function renderTopbar() {
  if (!state.me) return;
  const name = state.me.kidName || "";
  $("who-initial").textContent = name.slice(0, 1).toUpperCase();
  $("who-initial").style.background = kidColor(state.me.account);
  $("who-name").textContent = name;
  // Until this device has fetched the account's drawings once, the server's count is the right one.
  const pulled = store.get(`trace:pulled:${owner()}`, false);
  $("stat-drawings").textContent = pulled && state.localCount !== null ? state.localCount : state.me.stats.drawings;
  $("stat-time").textContent = formatTime(state.me.stats.seconds + pendingSeconds());
}

$("who").addEventListener("click", () => {
  renderKids();
  $("profile-name").value = state.me.kidName || "";
  $("profile-today").textContent = `Today: ${formatTime(state.me.stats.todaySeconds + (state.usage[utcDay()] || 0))}`;
  $("profile-email").textContent = state.me.email ? `Signed in as ${state.me.email}` : "";
  // Already opened from the Home Screen icon: no need for the install tip.
  $("tip-install").hidden = navigator.standalone === true || matchMedia("(display-mode: standalone)").matches;
  $("profile").showModal();
});

// Cancel, or a tap outside the card, closes it without saving.
$("profile-cancel").addEventListener("click", () => $("profile").close());
$("profile").addEventListener("click", (e) => { if (e.target === $("profile")) $("profile").close(); });

$("profile-form").addEventListener("submit", async () => {
  const name = $("profile-name").value.trim();
  if (!name || name === state.me.kidName) return;
  setKidName(name);
});

// ---------- Kids: switch between them, or add one ----------

// Each child has their own colour, so a child who can't read yet can still
// find their own circle.
const KID_COLORS = ["#ff9f1c", "#2f6bff", "#1fb36b", "#9b5de5", "#ff70a6", "#3ec5ff", "#8d5a3b", "#d6455d"];
function kidList() {
  const kids = state.me?.kids?.length ? state.me.kids : [{ id: state.me?.account, name: state.me?.kidName }];
  // This child's name as typed here, even before it has been sent.
  return kids.map((k) => (String(k.id) === owner() ? { ...k, name: state.me.kidName } : k)).filter((k) => k.name);
}
function kidColor(id) {
  const i = (state.me?.kids || []).findIndex((k) => String(k.id) === String(id));
  return KID_COLORS[Math.max(0, i) % KID_COLORS.length];
}
const escapeHtml = (text) => String(text).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

function renderKids() {
  $("kids").innerHTML = kidList().map((k) => {
    const on = String(k.id) === owner();
    return `<li><button type="button" class="kid${on ? " on" : ""}" data-kid="${escapeHtml(k.id)}"${on ? ' aria-current="true"' : ""}>
      <span class="initial" style="background:${kidColor(k.id)}">${escapeHtml(k.name.slice(0, 1).toUpperCase())}</span>
      <span class="kid-name">${escapeHtml(k.name)}</span></button></li>`;
  }).join("") + `<li><button type="button" class="kid add" id="kid-add">
      <span class="initial"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5 V19 M5 12 H19"/></svg></span>
      <span class="kid-name">Add</span></button></li>`;
}

$("kids").addEventListener("click", (e) => {
  const button = e.target.closest("button");
  if (!button) return;
  if (button.id === "kid-add") addKid();
  else switchKid(button.dataset.kid);
});

// Switching is for the children too (like picking your own peg). It needs
// the internet, so everything made by this child is sent first.
async function switchKid(id) {
  $("profile").close();
  if (String(id) === owner()) return;
  if (!navigator.onLine) { toast("Connect to the internet to switch."); return; }
  await saveNow();
  await syncNow();
  try {
    await becomeKid(await api("/api/kids/switch", { method: "POST", data: { kid: Number(id) } }));
  } catch (err) {
    if (err instanceof AuthError) showSignin();
    else toast(err instanceof OfflineError ? "Connect to the internet to switch." : "Couldn’t switch. Try again.");
  }
}

// Adding a child is for grown-ups: the same sum as links that leave the site.
async function addKid() {
  $("profile").close();
  if (!navigator.onLine) { toast("Connect to the internet to add a kid."); return; }
  if (typeof window.askGrownUp === "function") await window.askGrownUp("Adding a kid is for grown-ups.", "Next");
  $("kid-new-name").value = "";
  $("kid-new").showModal();
  setTimeout(() => $("kid-new-name").focus(), 50);
}

$("kid-new-cancel").addEventListener("click", () => $("kid-new").close());
$("kid-new").addEventListener("click", (e) => { if (e.target === $("kid-new")) $("kid-new").close(); });
$("kid-new-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = $("kid-new-name").value.trim();
  if (!name) return;
  $("kid-new").close();
  await saveNow();
  await syncNow();
  try {
    await becomeKid(await api("/api/kids", { method: "POST", data: { name } }));
  } catch (err) {
    if (err instanceof AuthError) showSignin();
    else if (err instanceof OfflineError) toast("Connect to the internet to add a kid.");
    else toast(err.status === 409 ? "That’s the most kids for one account." : "Couldn’t add. Try again.");
  }
});

// Carries on as another child: their drawings, animals and time, from the top.
async function becomeKid(me) {
  await saveNow();
  state.me = me;
  state.mine = new Map();
  state.localCount = null;
  setOffline(false);
  await enterAccount();
  if (location.hash) location.hash = "";
  else route();
  syncNow({ pull: true });
}

$("signout").addEventListener("click", async () => {
  $("profile").close();
  // Signing out has to reach the server, or the next visit would sign straight back in.
  if (!navigator.onLine) { toast("Connect to the internet to sign out."); return; }
  await saveNow();
  await syncNow();
  const who = owner();
  const everyone = [...new Set([who, ...(state.me.kids || []).map((k) => String(k.id))])];
  try {
    await api("/api/auth/logout", { method: "POST" });
  } catch (err) {
    if (err instanceof OfflineError) { toast("Connect to the internet to sign out."); return; }
  }
  try { google.accounts.id.disableAutoSelect(); } catch { /* not loaded */ }
  // Drawings already on the server leave this device. Anything not sent yet
  // stays (only this account can see it) and goes up when they sign in again.
  // Every child in the family leaves this device the same way.
  for (const kid of everyone) {
    for (const record of await allDrawings(kid)) {
      if (!record.dirty) await deleteDrawingRecord(record.cid);
    }
    for (const record of await allMine(kid)) {
      if (!record.dirty) await deleteMineRecord(record.cid);
    }
    store.set(`trace:pulled:${kid}`, false);
  }
  state.mine = new Map();
  store.set("trace:me", null);
  state.localCount = null;
  location.hash = "";
  showSignin();
});

function handleError(err) {
  if (err instanceof AuthError) { showSignin(); return; }
  if (err instanceof OfflineError) { setOffline(true); return; }
  console.error(err);
  toast("Couldn’t save. Try again.");
}

// The little cloud in the top bar: shown while there's no internet.
function setOffline(offline) {
  state.offline = offline;
  $("offline").hidden = !offline;
}

async function refreshCount() {
  if (!state.me) return;
  try { state.localCount = await countDrawings(owner()); } catch { state.localCount = null; }
  renderTopbar();
}

// ---------- Syncing with the account ----------

let syncing = null;
let syncAgain = false;
let syncTimer = 0;
let lastPull = 0;

function scheduleSync(ms = 1500) {
  clearTimeout(syncTimer);
  syncTimer = setTimeout(() => syncNow(), ms);
}

async function syncNow({ pull = false } = {}) {
  if (!state.me) return;
  if (syncing) {
    syncAgain = true;
    return syncing;
  }
  const who = owner();
  syncing = (async () => {
    try {
      await sendName(who);
      await pushMine(who);
      const stats = await pushDrawings(who);
      if (stats && owner() === who) state.me.stats = stats;
      if (pull || Date.now() - lastPull > PULL_EVERY_MS) {
        lastPull = Date.now();
        if (await pullMine(who) && owner() === who) {
          await loadMine();
          if (!$("category").hidden && state.lastCategory === "mine") showCategory(MY_GROUP);
        }
        const changed = await pullDrawings(who);
        store.set(`trace:pulled:${who}`, true);
        if (changed && owner() === who && !$("history").hidden) showHistory();
      }
      await flushUsage(who);
      if (owner() === who) store.set("trace:me", state.me);
      setOffline(false);
    } catch (err) {
      if (err instanceof OfflineError) setOffline(true);
      else if (err instanceof AuthError) showSignin();
      else console.error(err);
    } finally {
      syncing = null;
      await refreshCount();
      if (syncAgain) { syncAgain = false; scheduleSync(0); }
    }
  })();
  return syncing;
}

async function sendName(who) {
  const name = store.get(`trace:name:${who}`, null);
  if (!name) return;
  const me = await api("/api/me", { method: "PUT", data: { kidName: name }, kid: who });
  if (store.get(`trace:name:${who}`, null) === name) store.set(`trace:name:${who}`, null);
  if (owner() === who) state.me = { ...me, kidName: state.me.kidName };
}

window.addEventListener("online", () => syncNow({ pull: true }));
window.addEventListener("offline", () => setOffline(true));
setInterval(() => syncNow(), SYNC_EVERY_MS);

// ---------- Time spent ----------

for (const type of ["pointerdown", "keydown"]) {
  window.addEventListener(type, () => { state.lastActivity = Date.now(); }, { capture: true, passive: true });
}

setInterval(() => {
  if (!state.me || !state.me.kidName || document.visibilityState !== "visible") return;
  if (Date.now() - state.lastActivity > IDLE_MS) return;
  const day = utcDay();
  state.usage[day] = (state.usage[day] || 0) + 1;
  store.set(`trace:usage:${owner()}`, state.usage);
  if (!draw.hidden && state.animal && !state.readOnly) state.drawingSeconds += 1;
  renderTopbar();
}, 1000);

function pendingSeconds() {
  return Object.values(state.usage).reduce((a, b) => a + b, 0);
}

// Sends time spent, in chunks the server accepts, with the day it was spent on.
async function flushUsage(who) {
  for (const day of Object.keys(state.usage)) {
    while (owner() === who && (state.usage[day] || 0) > 0) {
      const seconds = Math.min(120, state.usage[day]);
      const stats = await api("/api/usage", { method: "POST", data: { seconds, day }, kid: who });
      if (owner() !== who) return;
      state.usage[day] -= seconds;
      if (state.usage[day] <= 0) delete state.usage[day];
      store.set(`trace:usage:${who}`, state.usage);
      state.me.stats = stats;
    }
  }
  renderTopbar();
}

document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden") putAway();
  else {
    resetInput();
    syncNow({ pull: Date.now() - lastPull > 30_000 });
  }
});
// A tab switch, swipe home or app switch: keep the line being drawn, write a
// quick copy that survives Safari closing the page, then save properly.
window.addEventListener("pagehide", putAway);
window.addEventListener("blur", () => finishStroke(true));
window.addEventListener("pageshow", (e) => {
  if (!e.persisted) return;
  resetInput();
  layout();
});

// ---------- Screens ----------

function buildHome() {
  $("categories").innerHTML = GROUPS.map((c) => `
    <li><a class="card labelled" style="--tint:${c.tint}" href="#c/${c.id}">
      ${animalSvg(c, "thumb")}<span>${c.name}</span>
    </a></li>`).join("");
}

function showCategory(category) {
  state.lastCategory = category.id;
  $("category-name").textContent = category.name;
  const mine = category.id === "mine";
  $("mine-top").hidden = !mine;
  $("animals").classList.toggle("mine-grid", mine);
  if (mine) {
    // Newest first, each with the photo it was made from in its corner.
    const list = [...state.mine.values()].filter((a) => !a.hidden).sort((a, b) => b.createdAt - a.createdAt);
    $("animals").innerHTML = list.map((a) => `
      <li class="mine-item" data-id="${a.id}">
        <a class="card" style="--tint:${a.tint}" href="#${a.id}" aria-label="${a.name}">
          ${animalSvg(a, "thumb")}
        </a>
        ${a.photo ? `<img class="photo-badge" src="${a.photo}" alt="">` : ""}
        <button class="icon-btn trash" aria-label="Remove"><svg viewBox="0 0 24 24"><path d="M4 7 H20 M9 7 V4 H15 V7 M6 7 L7 21 H17 L18 7 M10 11 V17 M14 11 V17"/></svg></button>
      </li>`).join("");
    if (navigator.onLine) prepareModel().catch(() => {}); // get the outline maker ready
  } else {
    $("animals").innerHTML = category.animals.map((id) => ANIMALS.find((a) => a.id === id)).map((a) => `
      <li><a class="card" style="--tint:${a.tint}" href="#${a.id}" aria-label="${a.name}">
        ${animalSvg(a, "thumb")}
      </a></li>`).join("");
  }
  show("category");
}

// ---------- My Animals ----------

function mineAnimal(record) {
  return {
    id: record.cid,
    name: "My animal",
    tint: record.tint,
    shapes: record.shapes,
    photo: record.photo,
    hidden: !!record.hidden,
    createdAt: record.createdAt,
    mine: true,
  };
}

async function loadMine() {
  const who = owner();
  let records = [];
  try { records = await allMine(who); } catch (err) { console.error(err); }
  if (owner() !== who) return;
  state.mine = new Map(records.filter(validMine).map((r) => [r.cid, mineAnimal(r)]));
}

// Built-in animals, then this account's own (removed ones too, so old drawings still open).
function findAnimal(id) {
  return ANIMALS.find((a) => a.id === id) || state.mine.get(id) || null;
}

$("camera").addEventListener("click", () => {
  prepareModel().catch(() => {});
  $("camera-input").value = "";
  $("camera-input").click();
});

$("camera-input").addEventListener("change", () => {
  const file = $("camera-input").files && $("camera-input").files[0];
  if (file) makeOutline(file);
});

let snapRun = 0;
let snapResult = null;
let snapUrl = null;

function setSnap(stateName) {
  $("snap").dataset.state = stateName;
  $("snap-keep").disabled = stateName !== "done";
}

async function makeOutline(file) {
  const run = ++snapRun;
  snapResult = null;
  if (snapUrl) URL.revokeObjectURL(snapUrl);
  snapUrl = URL.createObjectURL(file);
  $("snap-photo").src = snapUrl;
  $("snap-outline").innerHTML = "";
  setSnap("busy");
  if (!$("snap").open) $("snap").showModal();
  try {
    const result = await photoToOutline(file);
    if (run !== snapRun) return;
    snapResult = result;
    const view = $("snap-outline");
    view.style.setProperty("--tint", result.tint);
    view.innerHTML = `<svg class="thumb" viewBox="0 0 1000 1000" aria-hidden="true">${result.shapes.join("")}</svg>
      <img class="photo-badge" src="${result.photo}" alt="">`;
    setSnap("done");
  } catch (err) {
    if (run !== snapRun) return;
    setSnap("oops");
    if (!(err instanceof NoAnimalError)) {
      console.error(err);
      toast(navigator.onLine ? "That didn’t work. Try again." : "Connect to the internet once to use the camera.");
    }
  }
}

function closeSnap() {
  snapRun++;
  snapResult = null;
  if ($("snap").open) $("snap").close();
  if (snapUrl) { URL.revokeObjectURL(snapUrl); snapUrl = null; }
  $("snap-photo").removeAttribute("src");
}

$("snap-close").addEventListener("click", closeSnap);
$("snap").addEventListener("cancel", (e) => { e.preventDefault(); closeSnap(); });
$("snap-retake").addEventListener("click", () => {
  $("camera-input").value = "";
  $("camera-input").click();
});

// Keeps the new animal for good (on the device now, on the account with the
// next sync) and opens it to trace.
$("snap-keep").addEventListener("click", async () => {
  if (!snapResult || !state.me) return;
  const { shapes, photo, tint } = snapResult;
  const now = Date.now();
  const record = {
    cid: newAnimalId(),
    owner: owner(),
    shapes,
    photo,
    tint,
    hidden: false,
    createdAt: now,
    updatedAt: now,
    rev: 1,
    dirty: 1,
    onServer: false,
  };
  try {
    await putMine(record);
  } catch (err) { handleError(err); return; }
  state.mine.set(record.cid, mineAnimal(record));
  closeSnap();
  scheduleSync(0);
  location.hash = record.cid;
});

// Removing a My Animal (two taps) hides it here and on the account.
$("animals").addEventListener("click", (e) => {
  const button = e.target.closest(".trash");
  if (!button) return;
  e.preventDefault();
  const item = button.closest(".mine-item");
  twoTap(button, async () => {
    try {
      const record = await getMine(item.dataset.id);
      if (record) {
        await putMine({ ...record, hidden: true, dirty: 1, rev: record.rev + 1, updatedAt: Date.now() });
        const animal = state.mine.get(record.cid);
        if (animal) animal.hidden = true;
      }
      item.remove();
      scheduleSync(0);
    } catch (err) { handleError(err); }
  });
});

// ---------- Analytics ----------

// Trace is one page with #hash routes, so each route is sent to Google
// Analytics as its own page view with a readable path under /trace. Drawing
// ids are left out so every saved drawing doesn't become its own page.
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
  if (!state.me) return ["/trace/signin", "Sign in"];
  if (!state.me.kidName) return ["/trace/name", "Name"];
  if (hash === "history") return ["/trace/history", "History"];
  const group = hash.match(/^c\/(\w+)$/);
  const category = group && GROUPS.find((c) => c.id === group[1]);
  if (category) return [`/trace/group/${category.id}`, category.name || category.id];
  const existing = hash.match(/^([de])\/[\w-]+$/);
  if (existing) return existing[1] === "d" ? ["/trace/drawing/view", "View drawing"] : ["/trace/drawing/edit", "Drawing"];
  if (state.mine.has(hash)) return ["/trace/draw/my-animal", "My animal"];
  const animal = ANIMALS.find((a) => a.id === hash);
  if (animal) return [`/trace/draw/${animal.id}`, animal.name || animal.id];
  return ["/trace/", "Animals"];
}

async function route() {
  closeStory();
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
  const category = group && GROUPS.find((c) => c.id === group[1]);
  if (category) return showCategory(category);

  // #d/<id> views a saved drawing; #e/<id> keeps editing the drawing in progress.
  // Plain numbers are links from before drawings had device ids.
  const existing = hash.match(/^([de])\/([\w-]+)$/);
  if (existing) return openDrawing(/^\d+$/.test(existing[2]) ? `s${existing[2]}` : existing[2], existing[1] === "d");

  const animal = findAnimal(hash);
  if (animal) return startDrawing(animal);

  show("home");
}

async function showHistory() {
  show("history");
  const list = $("history-list");
  list.innerHTML = "";
  let drawings = [];
  try {
    drawings = (await allDrawings(owner())).filter((d) => !d.deleted).sort((a, b) => b.createdAt - a.createdAt);
  } catch (err) { handleError(err); return; }
  if ($("history").hidden) return;
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
          const animal = findAnimal(d.animal);
          const when = stamp(d.createdAt);
          const img = d.thumb ? `<img src="${d.thumb}" alt="">` : `<img alt="">`;
          return `<li class="past-item" data-id="${d.cid}">
                    <a class="past" style="--tint:${animal?.tint || "#eee"}" href="#d/${d.cid}"
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

// Marked as deleted here; the next sync deletes it on the server too.
async function deleteDrawing(cid) {
  const record = await getDrawing(cid);
  if (record && !record.deleted) {
    await putDrawing({ ...record, deleted: true, dirty: 1, rev: record.rev + 1, updatedAt: Date.now() });
  }
  await refreshCount();
  scheduleSync(0);
}

$("history-list").addEventListener("click", (e) => {
  const button = e.target.closest(".trash");
  if (!button) return;
  const item = button.closest(".past-item");
  twoTap(button, async () => {
    try {
      await deleteDrawing(item.dataset.id);
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

async function openDrawing(cid, readOnly) {
  try {
    let record = await getDrawing(cid);
    if ((!record || !findAnimal(record.animal)) && !state.offline) {
      await syncNow({ pull: true }); // made on another device, not fetched yet
      record = await getDrawing(cid);
    }
    const draft = readDraft(cid);
    let fromDraft = false;
    if (draft && !readOnly && (!record || (!record.deleted && draft.at > record.updatedAt))) {
      record = { ...(record || {}), ...draft, updatedAt: draft.at, deleted: false };
      fromDraft = true;
    }
    const animal = record && findAnimal(record.animal);
    if (!animal || record.deleted || record.owner !== owner()) throw new Error("Drawing not found");
    startDrawing(animal, record, readOnly);
    if (fromDraft) scheduleSave();
    $("view-date").textContent = stamp(record.createdAt);
  } catch (err) {
    handleError(err);
    location.hash = "history";
  }
}

function startDrawing(animal, record = null, readOnly = false) {
  state.readOnly = readOnly;
  draw.classList.toggle("readonly", readOnly);
  state.animal = animal;
  state.cid = record ? record.cid : null;
  state.createdAt = record ? record.createdAt : null;
  state.strokes = record ? record.strokes : [];
  state.drawingSeconds = record ? record.seconds : 0;
  state.cleared = null;
  state.current = null;
  state.dirty = false;
  guide.innerHTML = animalSvg(animal, "guide");
  const photo = $("stage-photo");
  photo.hidden = !animal.photo;
  if (animal.photo) photo.src = animal.photo;
  else photo.removeAttribute("src");
  stage.setAttribute("aria-label", `Trace the ${animal.name.toLowerCase()}`);
  $("say-name-text").textContent = animal.name;
  $("say-name").setAttribute("aria-label", `Say ${animal.name.toLowerCase()}`);
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
      await deleteDrawing(state.cid);
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

// A new drawing gets its id, and its own address so a reload reopens it.
function ensureId() {
  if (state.cid || !state.animal || !state.strokes.length) return;
  state.cid = newId();
  state.createdAt = Date.now();
  if (location.hash === `#${state.animal.id}`) history.replaceState(null, "", `#e/${state.cid}`);
}

// IndexedDB writes are slow and can be cut off when Safari hides or closes
// the page, so a copy of the drawing in progress also goes to localStorage,
// which writes straight away. openDrawing() uses it if it is newer.
const DRAFT_KEY = "trace:draft";
function writeDraft() {
  if (!(state.dirty || saving) || !state.animal || !state.me || state.readOnly) return;
  ensureId();
  if (!state.cid) return;
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify({
      cid: state.cid,
      owner: owner(),
      animal: state.animal.id,
      strokes: state.strokes,
      seconds: state.drawingSeconds,
      createdAt: state.createdAt,
      at: Date.now(),
    }));
  } catch { /* full or blocked: the normal save still runs */ }
}
function readDraft(cid) {
  try {
    const d = JSON.parse(localStorage.getItem(DRAFT_KEY) || "null");
    return d && d.cid === cid ? d : null;
  } catch { return null; }
}
function clearDraft(cid, strokes) {
  const d = readDraft(cid);
  if (d && d.strokes.length <= strokes.length) {
    try { localStorage.removeItem(DRAFT_KEY); } catch { /* ignore */ }
  }
}

function putAway() {
  finishStroke(true);
  writeDraft();
  saveNow();
}

// Drawings are saved on the device first, then sent by the next sync.
async function saveNow() {
  clearTimeout(saveTimer);
  if (saving) await saving;
  if (!state.dirty || !state.animal || !state.me) return;
  state.dirty = false;
  const animal = state.animal;
  const strokes = state.strokes;
  const who = owner();
  ensureId();
  const cid = state.cid;
  const createdAt = state.createdAt;
  const seconds = state.drawingSeconds;
  if (!cid) return;
  saving = (async () => {
    try {
      const existing = await getDrawing(cid);
      if (!strokes.length) {
        // Cleared drawings are removed rather than kept as blank pages
        // (undo brings it back under the same id).
        if (existing && !existing.deleted) {
          await putDrawing({ ...existing, deleted: true, dirty: 1, rev: existing.rev + 1, updatedAt: Date.now() });
        }
      } else {
        await putDrawing({
          cid,
          owner: who,
          animal: animal.id,
          strokes,
          thumb: await thumbnail(animal, strokes),
          seconds,
          createdAt,
          updatedAt: Date.now(),
          rev: (existing?.rev || 0) + 1,
          dirty: 1,
          deleted: false,
          onServer: existing?.onServer || false,
        });
      }
      clearDraft(cid, strokes);
      await refreshCount();
      scheduleSync();
    } catch (err) {
      if (state.animal === animal) state.dirty = true;
      handleError(err);
    } finally {
      saving = null;
    }
  })();
  return saving;
}

const guideImages = new Map();
function guideImage(animal) {
  if (!guideImages.has(animal.id)) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" width="256" height="256">
      <style>path,circle,ellipse{fill:#fff;stroke:#c5cbd6;stroke-width:14;stroke-linecap:round;stroke-linejoin:round}.dot{fill:#c5cbd6;stroke:none}.line{fill:none}</style>
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

// ---------- Say the name ----------

// The button before Animate now shows the animal's name; tapping it says
// the name in the same recorded voice as the storybooks
// (voice/names/<id>.mp3, made by scripts/voice/build.py), or the device's
// own voice if the recording can't be loaded. A My Animal is "Maya’s
// animal", spoken live in the same voice by the AI server (ai.js), with the
// "My animal" recording when the server can't be reached.
let nameClip = null;

function sayName() {
  const animal = state.animal;
  if (!animal) return;
  const btn = $("say-name");
  if (nameClip) { nameClip.pause(); nameClip = null; }
  try { window.speechSynthesis?.cancel(); } catch { /* none */ }
  const done = () => btn.classList.remove("saying");
  btn.classList.add("saying");
  const recorded = `voice/names/${animal.mine ? "mine" : animal.id}.mp3`;
  const kid = state.me?.kidName;
  const clip = new Audio();
  nameClip = clip;
  const c = animal.mine && kid ? audio() : null; // unlocked here, inside the tap
  if (c) {
    // The live line arrives after the tap, so it plays through Web Audio,
    // which iPads allow once the context was started by a tap.
    const decode = (bytes) => new Promise((ok, no) => c.decodeAudioData(bytes, ok, no));
    liveLine(`${kid}’s animal.`)
      .catch(() => fetch(recorded).then((r) => { if (!r.ok) throw new Error(r.status); return r.arrayBuffer(); }))
      .then(decode)
      .then((buf) => {
        if (nameClip !== clip) return;
        const src = c.createBufferSource();
        src.buffer = buf;
        src.connect(c.destination);
        src.onended = done;
        src.start();
        clip.pause = () => { try { src.stop(); } catch { /* done */ } };
      })
      .catch(() => fallback());
  } else clip.src = recorded;
  clip.onended = done;
  const fallback = () => {
    if (nameClip !== clip) return;
    nameClip = null;
    const synth = window.speechSynthesis;
    if (!synth || typeof SpeechSynthesisUtterance === "undefined") return done();
    const u = new SpeechSynthesisUtterance(animal.name.replace(/T-rex/i, "tee rex").replace("-", " "));
    u.rate = 0.85;
    u.onend = done;
    u.onerror = done;
    synth.speak(u);
  };
  clip.onerror = fallback;
  if (clip.src) clip.play().catch(fallback);
}

$("say-name").addEventListener("click", sayName);

// ---------- Animate now ----------

// The child's animal as a picture for the storybook: the outline in solid
// lines, their crayon on top, cut out on a clear background.
function solidOutline(animal) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" width="800" height="800">
    <style>path,circle,ellipse{fill:#fff;stroke:#3a3f4b;stroke-width:16;stroke-linecap:round;stroke-linejoin:round}.dot{fill:#3a3f4b;stroke:none}.line{fill:none}</style>
    ${animal.shapes.join("")}</svg>`;
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  });
}

async function storyCharacter(animal, strokes) {
  const size = 800;
  const [ink, ictx] = (() => { const c = document.createElement("canvas"); c.width = c.height = size; return [c, c.getContext("2d")]; })();
  for (const s of strokes) paintStroke(ictx, s);
  const full = document.createElement("canvas");
  full.width = full.height = size;
  const fctx = full.getContext("2d", { willReadFrequently: true });
  const outline = await solidOutline(animal);
  if (outline) fctx.drawImage(outline, 0, 0, size, size);
  fctx.drawImage(ink, 0, 0);
  // Trim the empty edges so the animal fills its spot in each scene.
  const { data } = fctx.getImageData(0, 0, size, size);
  let x0 = size, y0 = size, x1 = 0, y1 = 0;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (data[(y * size + x) * 4 + 3] < 10) continue;
      if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y;
    }
  }
  if (x1 <= x0) return { url: full.toDataURL("image/png") };
  const side = Math.max(x1 - x0, y1 - y0) + 16;
  const out = document.createElement("canvas");
  out.width = out.height = side;
  out.getContext("2d").drawImage(full, (x0 + x1) / 2 - side / 2, (y0 + y1) / 2 - side / 2, side, side, 0, 0, side, side);
  return { url: out.toDataURL("image/png") };
}

$("animate").addEventListener("click", async () => {
  const animal = state.animal;
  if (!animal) return;
  const strokes = state.strokes;
  saveNow();
  const img = await storyCharacter(animal, strokes);
  if (state.animal !== animal) return;
  openStory(img, animal, state.me?.kidName || "", (book) =>
    trackPage(`/trace/story/${book}`, book === "shelf" ? "Stories" : `Story: ${book}`));
});

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
  state.lastInputAt = performance.now();
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
    // The old line never got its "lift": iPadOS took the touch for a swipe
    // (the Home bar, Dock, Control Centre) and didn't say so. Keep that line
    // and start the new one, so the paper never stays stuck.
    else if (inputStuck(isPen)) finishStroke(true);
    else return;
  }
  e.preventDefault();
  startStroke(e);
});

canvas.addEventListener("pointermove", (e) => {
  if (e.pointerId !== state.activePointer || !state.current) return;
  state.lastInputAt = performance.now();
  if (state.current.pen) state.penSeenAt = performance.now();
  const events = e.getCoalescedEvents ? e.getCoalescedEvents() : [];
  for (const ev of events.length ? events : [e]) state.current.points.push(toWorld(ev));
  requestFrame();
});

// There's only one Pencil, so a second Pencil touch means the first one ended
// unseen. A finger line that hasn't moved for a moment is treated the same way.
function inputStuck(isPen) {
  if (!state.current) return true;
  if (isPen && state.current.pen) return true;
  return performance.now() - (state.lastInputAt || 0) > 400;
}

function endStroke(e) {
  if (e.pointerId !== state.activePointer) return;
  // A cancelled finger line is usually a palm or a swipe, so it is dropped.
  finishStroke(e.type !== "pointercancel" || !!state.current?.pen);
}

// Ends the line being drawn, keeping it or dropping it, and frees the paper
// for the next touch.
function finishStroke(keep) {
  if (state.activePointer === null && !state.current) return;
  const id = state.activePointer;
  state.activePointer = null;
  const stroke = state.current;
  state.current = null;
  try { if (id !== null && canvas.hasPointerCapture(id)) canvas.releasePointerCapture(id); } catch { /* ignore */ }
  if (!stroke) { frame(); return; }
  if (!keep || state.readOnly || !state.animal) { frame(); return; }
  stroke.points = stroke.points.map(([x, y, p]) => [Math.round(x * 10) / 10, Math.round(y * 10) / 10, Math.round(p * 100) / 100]);
  state.strokes = [...state.strokes, stroke];
  state.cleared = null;
  paintStroke(cctx, stroke);
  frame();
  scheduleSave();
}
canvas.addEventListener("pointerup", endStroke);
canvas.addEventListener("pointercancel", endStroke);
// Safari can drop the capture without a pointerup (a system swipe, an alert).
canvas.addEventListener("lostpointercapture", (e) => {
  if (e.pointerId === state.activePointer) finishStroke(true);
});

// Back from another tab or app: nothing is held down any more.
function resetInput() {
  if (state.activePointer !== null || state.current) finishStroke(true);
}

// iPad Safari: block scrolling, pinch zoom, double-tap zoom and the Pencil
// magnifier while drawing.
for (const type of ["touchstart", "touchmove", "touchend"]) {
  stage.addEventListener(type, (e) => e.preventDefault(), { passive: false });
}
// Around the paper too: a finger sliding on the tools or the empty space
// shouldn't drag the page, pull it down or bounce it.
draw.addEventListener("touchmove", (e) => { if (e.cancelable) e.preventDefault(); }, { passive: false });
// More than one finger anywhere is never a drawing: stop pinch zoom.
document.addEventListener("touchmove", (e) => {
  if (e.touches.length > 1 && e.cancelable) e.preventDefault();
}, { passive: false });
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
// Keeps Trace working with no internet (see sw.js).
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js").catch((err) => console.warn("Offline mode unavailable", err));
}
new ResizeObserver(layout).observe(stageWrap);
boot();
