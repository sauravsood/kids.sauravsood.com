// Pocket Money: a grown-up adds coins to the tray, the child sorts them into
// Save, Spend and Share, and the Save jar fills up towards one goal.
// Everything is saved to the family's account as one small document.
import { signedIn, loadState, saveState } from "/shared/account.js";

const $ = (id) => document.getElementById(id);
const JARS = [
  { id: "save", name: "Save", what: "For something big, later.", color: "#9fd8c4" },
  { id: "spend", name: "Spend", what: "For little things, soon.", color: "#ffc59a" },
  { id: "share", name: "Share", what: "For giving to others.", color: "#f6b6c8" },
];
const GOALS = [
  ["🚲", "A bike"], ["📚", "A book"], ["🧸", "A toy"], ["⚽", "A ball"],
  ["🎨", "Art things"], ["🧩", "A puzzle"], ["🎁", "A present"], ["🛴", "A scooter"],
];
const MAX_COINS = 9999;

let state = { v: 1, tray: 0, jars: { save: 0, spend: 0, share: 0 }, goal: null };

function clean(data) {
  const n = (x) => Math.max(0, Math.min(MAX_COINS, Math.round(Number(x) || 0)));
  const out = { v: 1, tray: n(data?.tray), jars: {}, goal: null };
  for (const j of JARS) out.jars[j.id] = n(data?.jars?.[j.id]);
  const g = data?.goal;
  if (g && GOALS.some(([pic]) => pic === g.pic)) {
    out.goal = { pic: g.pic, name: GOALS.find(([pic]) => pic === g.pic)[1], cost: Math.max(5, n(g.cost)) };
  }
  return out;
}

function save() { saveState("money", state); }

// ---------- Drawing ----------

function coins(n, max) {
  const shown = Math.min(n, max);
  let html = "";
  for (let i = 0; i < shown; i++) html += '<span class="coin"></span>';
  if (n > max) html += `<span class="coin more">+${n - max}</span>`;
  return html;
}

function jarSvg(count, color) {
  // Coins stack in rows of five from the bottom of the jar.
  let dots = "";
  const shown = Math.min(count, 30);
  for (let i = 0; i < shown; i++) {
    const row = Math.floor(i / 5), col = i % 5;
    const x = 55 + col * 21 + (row % 2 ? 6 : 0), y = 198 - row * 20;
    dots += `<circle cx="${x}" cy="${y}" r="10" fill="#ffd166" stroke="#f2b632" stroke-width="3"/>`;
  }
  return `<svg viewBox="0 0 200 230" aria-hidden="true">
    <rect x="52" y="8" width="96" height="22" rx="8" fill="${color}"/>
    <path d="M40 44 Q40 30 60 30 H140 Q160 30 160 44 V200 Q160 220 140 220 H60 Q40 220 40 200 Z" fill="#fbfdff" stroke="#3a3f4b" stroke-width="4"/>
    ${dots}
    <path d="M56 56 V120" stroke="#fff" stroke-width="8" stroke-linecap="round" opacity="0.8"/>
  </svg>`;
}

function render() {
  const { tray, jars, goal } = state;
  $("tray-coins").innerHTML = coins(tray, 12);
  $("tray-text").textContent = tray
    ? `${tray} ${tray === 1 ? "coin" : "coins"} to sort. Tap a jar to drop one in.`
    : "All sorted. Nice work!";

  $("jars").innerHTML = JARS.map((j) => `
    <div class="jar ${tray ? "ready" : ""}">
      <h2>${j.name}</h2>
      <button class="put" data-put="${j.id}" ${tray ? "" : "disabled"} aria-label="Put one coin in ${j.name}">
        ${jarSvg(jars[j.id], j.color)}
      </button>
      <div class="count">${jars[j.id]}</div>
      <p class="what">${j.what}</p>
      <button class="takeout" data-take="${j.id}" ${jars[j.id] ? "" : "disabled"}>Take one out</button>
    </div>`).join("");

  if (!goal) {
    $("goal").innerHTML = `
      <div class="pic">🌟</div>
      <div class="words"><h2>Saving for something?</h2><p>Pick a goal and watch your Save jar get there.</p></div>
      <button class="pillbtn dark" id="goal-pick">Pick a goal</button>`;
  } else {
    const have = Math.min(jars.save, goal.cost);
    const left = goal.cost - have;
    let steps = "";
    const per = Math.max(1, Math.ceil(goal.cost / 40)); // at most 40 dots
    for (let c = per; c <= goal.cost; c += per) steps += `<i class="${have >= c ? "on" : ""}"></i>`;
    $("goal").innerHTML = `
      <div class="pic">${goal.pic}</div>
      <div class="words">
        <h2>Saving for: ${goal.name}</h2>
        <p>${left ? `${have} of ${goal.cost} coins. ${left} to go.` : `You have all ${goal.cost} coins. You did it!`}</p>
        <div class="steps">${steps}</div>
      </div>
      <button class="pillbtn" id="goal-pick">Change</button>`;
  }
}

// ---------- Child actions ----------

$("jars").addEventListener("click", (e) => {
  const put = e.target.closest("[data-put]");
  const take = e.target.closest("[data-take]");
  if (put && state.tray > 0) {
    state.tray--;
    state.jars[put.dataset.put]++;
  } else if (take && state.jars[take.dataset.take] > 0) {
    state.jars[take.dataset.take]--;
    state.tray++;
  } else {
    return;
  }
  render();
  save();
});

let goalPic = GOALS[0][0];
let goalCost = 20;
function renderGoalPicks() {
  $("goal-picks").innerHTML = GOALS.map(([pic, name]) =>
    `<button type="button" data-pic="${pic}" aria-pressed="${pic === goalPic}"><span>${pic}</span>${name}</button>`).join("");
  $("goal-n").textContent = goalCost;
}
$("goal").addEventListener("click", (e) => {
  if (!e.target.closest("#goal-pick")) return;
  goalPic = state.goal?.pic || GOALS[0][0];
  goalCost = state.goal?.cost || 20;
  renderGoalPicks();
  $("goal-sheet").showModal();
});
$("goal-picks").addEventListener("click", (e) => {
  const b = e.target.closest("[data-pic]");
  if (b) { goalPic = b.dataset.pic; renderGoalPicks(); }
});
$("goal-sheet").addEventListener("click", (e) => {
  const b = e.target.closest("[data-gstep]");
  if (b) { goalCost = Math.max(5, Math.min(500, goalCost + Number(b.dataset.gstep))); renderGoalPicks(); }
});
$("goal-save").addEventListener("click", () => {
  state.goal = { pic: goalPic, name: GOALS.find(([pic]) => pic === goalPic)[1], cost: goalCost };
  $("goal-sheet").close();
  render();
  save();
});

// ---------- Grown-up actions (behind the sum check) ----------

let addN = 5;
$("grownup").addEventListener("click", async () => {
  await window.askGrownUp("Adding or taking away pocket money is for grown-ups.");
  $("add-n").textContent = addN;
  $("grown-sheet").showModal();
});
$("grown-sheet").addEventListener("click", (e) => {
  const step = e.target.closest("[data-step]");
  const out = e.target.closest("[data-out]");
  if (step) {
    addN = Math.max(1, Math.min(50, addN + Number(step.dataset.step)));
    $("add-n").textContent = addN;
  } else if (out && state.jars[out.dataset.out] > 0) {
    state.jars[out.dataset.out]--;
    render();
    save();
  }
});
$("add-go").addEventListener("click", () => {
  state.tray = Math.min(MAX_COINS, state.tray + addN);
  $("grown-sheet").close();
  render();
  save();
});
$("goal-bought").addEventListener("click", () => {
  if (!state.goal) return;
  state.jars.save = Math.max(0, state.jars.save - state.goal.cost);
  state.goal = null;
  $("grown-sheet").close();
  render();
  save();
});

document.addEventListener("kids-save-failed", () => {
  $("tray-text").textContent = "Couldn't save just now. Check the internet.";
});

// ---------- Start ----------

const me = await signedIn();
if (me.kidName) $("title").textContent = `${me.kidName}'s Pocket Money`;
state = clean(await loadState("money"));
render();
