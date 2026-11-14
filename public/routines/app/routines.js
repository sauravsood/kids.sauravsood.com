// My Routines: a grown-up picks a few routines, the child taps a picture when
// it's done. "This week" shows what was done, with no streaks, scores or
// marks for days that were missed. Saved to the family's account.
import { signedIn, loadState, saveState } from "/shared/account.js";

const $ = (id) => document.getElementById(id);
const ALL = [
  ["teeth", "🪥", "Brush teeth"], ["dress", "👕", "Get dressed"], ["bed", "🛏️", "Make my bed"],
  ["breakfast", "🥣", "Breakfast"], ["bag", "🎒", "Pack my bag"], ["water", "💧", "Drink water"],
  ["read", "📖", "Read"], ["tidy", "🧸", "Tidy up"], ["outside", "🌳", "Play outside"],
  ["music", "🎵", "Practise music"], ["homework", "✏️", "Homework"], ["plants", "🪴", "Water plants"],
  ["pet", "🐾", "Feed my pet"], ["table", "🍽️", "Set the table"], ["bath", "🛁", "Bath"],
  ["sleep", "🌙", "Bedtime"],
];
const BY_ID = new Map(ALL.map(([id, pic, name]) => [id, { id, pic, name }]));
const KEEP_DAYS = 60;

let state = { v: 1, routines: [], done: {} };

const pad = (n) => String(n).padStart(2, "0");
const dayKey = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const today = () => dayKey(new Date());

function clean(data) {
  const out = { v: 1, routines: [], done: {} };
  for (const id of Array.isArray(data?.routines) ? data.routines : []) {
    if (BY_ID.has(id) && !out.routines.includes(id)) out.routines.push(id);
  }
  const oldest = new Date();
  oldest.setDate(oldest.getDate() - KEEP_DAYS);
  const cutoff = dayKey(oldest);
  for (const [day, ids] of Object.entries(data?.done || {})) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(day) || day < cutoff || !Array.isArray(ids)) continue;
    const kept = ids.filter((id) => BY_ID.has(id));
    if (kept.length) out.done[day] = [...new Set(kept)];
  }
  return out;
}

function save() { saveState("routines", state); }

function renderToday() {
  const done = new Set(state.done[today()] || []);
  if (!state.routines.length) {
    $("cheer").textContent = "";
    $("today").innerHTML = `<div class="empty">No routines yet. Ask a grown-up to tap <b>Grown-ups</b> and pick a few.</div>`;
    return;
  }
  $("today").innerHTML = state.routines.map((id) => {
    const r = BY_ID.get(id);
    const on = done.has(id);
    return `<button class="card ${on ? "done" : ""}" data-id="${id}" aria-pressed="${on}">
      <span class="tick" aria-hidden="true">✓</span>
      <span class="pic" aria-hidden="true">${r.pic}</span>
      <span class="name">${r.name}</span>
    </button>`;
  }).join("");
  const n = state.routines.filter((id) => done.has(id)).length;
  $("cheer").textContent = n === state.routines.length ? "All done for today. Time to play! 🌟" : "";
}

function renderWeek() {
  // Monday to Sunday of the current week.
  const now = new Date();
  const monday = new Date(now);
  monday.setDate(now.getDate() - ((now.getDay() + 6) % 7));
  const days = [...Array(7)].map((_, i) => { const d = new Date(monday); d.setDate(monday.getDate() + i); return d; });
  const names = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const t = today();
  if (!state.routines.length) { $("week").innerHTML = `<p class="hint">Nothing here yet.</p>`; return; }
  $("week").innerHTML = `<table>
    <tr><th></th>${days.map((d, i) => `<th class="${dayKey(d) === t ? "now" : ""}">${names[i]}</th>`).join("")}</tr>
    ${state.routines.map((id) => {
      const r = BY_ID.get(id);
      return `<tr><td class="what"><span aria-hidden="true">${r.pic}</span>${r.name}</td>${days.map((d) => {
        const k = dayKey(d);
        const on = (state.done[k] || []).includes(id);
        return `<td><i class="${on ? "on" : k > t ? "later" : ""}" aria-label="${on ? "done" : ""}"></i></td>`;
      }).join("")}</tr>`;
    }).join("")}
  </table>`;
}

function render() { renderToday(); renderWeek(); }

$("today").addEventListener("click", (e) => {
  const card = e.target.closest("[data-id]");
  if (!card) return;
  const t = today();
  const set = new Set(state.done[t] || []);
  set.has(card.dataset.id) ? set.delete(card.dataset.id) : set.add(card.dataset.id);
  if (set.size) state.done[t] = [...set]; else delete state.done[t];
  render();
  save();
});

function showTab(week) {
  $("tab-today").setAttribute("aria-selected", String(!week));
  $("tab-week").setAttribute("aria-selected", String(week));
  $("today").hidden = week;
  $("cheer").hidden = week;
  $("week").hidden = !week;
}
$("tab-today").addEventListener("click", () => showTab(false));
$("tab-week").addEventListener("click", () => showTab(true));

// ---------- Grown-up setup (behind the sum check) ----------

function renderPicks() {
  $("setup-picks").innerHTML = ALL.map(([id, pic, name]) =>
    `<button type="button" data-pick="${id}" aria-pressed="${state.routines.includes(id)}"><span>${pic}</span>${name}</button>`).join("");
}
$("grownup").addEventListener("click", async () => {
  await window.askGrownUp("Choosing the routines is for grown-ups.");
  renderPicks();
  $("setup-sheet").showModal();
});
$("setup-picks").addEventListener("click", (e) => {
  const b = e.target.closest("[data-pick]");
  if (!b) return;
  const id = b.dataset.pick;
  // Keep the order of the full list, so morning things come before bedtime.
  const chosen = new Set(state.routines);
  chosen.has(id) ? chosen.delete(id) : chosen.add(id);
  state.routines = ALL.map(([x]) => x).filter((x) => chosen.has(x));
  renderPicks();
  render();
  save();
});

document.addEventListener("kids-save-failed", () => {
  $("cheer").hidden = false;
  $("cheer").textContent = "Couldn't save just now. Check the internet.";
});

// A new day starts fresh if the page was left open overnight.
let shownDay = today();
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible" && today() !== shownDay) { shownDay = today(); render(); }
});

const me = await signedIn();
if (me.kidName) $("title").textContent = `${me.kidName}'s Routines`;
state = clean(await loadState("routines"));
render();
