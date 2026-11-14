// Shared by the apps that save to the family's account (Pocket Money,
// My Routines). Uses the same Google sign-in and session cookie as Trace.
//
//   import { signedIn, loadState, saveState } from "/shared/account.js";
//   await signedIn();                    // shows a sign-in panel if needed
//   const data = await loadState("money");
//   saveState("money", data);            // saves a moment later, last write wins

export async function api(path, { method = "GET", data, keepalive = false } = {}) {
  const res = await fetch(path, {
    method,
    keepalive,
    credentials: "same-origin",
    headers: data ? { "Content-Type": "application/json" } : undefined,
    body: data ? JSON.stringify(data) : undefined,
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(body.error || `Request failed (${res.status})`);
    err.status = res.status;
    throw err;
  }
  return body;
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

// Resolves with the profile ({ kidName, email, … }) once someone is signed in.
export async function signedIn() {
  try {
    return await api("/api/me");
  } catch (err) {
    if (err.status !== 401) throw err;
  }
  const config = await api("/api/config").catch(() => ({ googleClientId: null, devLogin: false }));
  return new Promise((resolve) => {
    const panel = document.createElement("div");
    panel.className = "signin-panel";
    panel.innerHTML = `
      <div class="signin-card">
        <h2>Grown-ups: sign in</h2>
        <p class="signin-note">Sign in with Google to keep this saved. It's the same sign-in as Trace.</p>
        <div class="signin-google"></div>
        <button class="signin-dev" hidden>Dev sign-in</button>
      </div>`;
    document.body.appendChild(panel);
    const note = panel.querySelector(".signin-note");
    const finish = async (request) => {
      try {
        const me = await request;
        panel.remove();
        resolve(me);
      } catch {
        note.textContent = "That didn't work. Please try again.";
      }
    };
    const dev = panel.querySelector(".signin-dev");
    dev.hidden = !config.devLogin;
    dev.addEventListener("click", () => finish(api("/api/auth/dev", { method: "POST", data: { email: "dev@example.com" } })));
    if (!config.googleClientId) {
      if (!config.devLogin) note.textContent = "Sign-in isn't set up yet.";
      return;
    }
    loadGoogle().then(() => {
      google.accounts.id.initialize({
        client_id: config.googleClientId,
        callback: ({ credential }) => finish(api("/api/auth/google", { method: "POST", data: { credential } })),
      });
      google.accounts.id.renderButton(panel.querySelector(".signin-google"),
        { theme: "filled_blue", size: "large", shape: "pill", text: "signin_with" });
    }).catch(() => { note.textContent = "Couldn't reach Google. Check the internet and reload."; });
  });
}

export async function loadState(app) {
  return (await api(`/api/state/${app}`)).data;
}

// Saves shortly after the last change, and straight away when the page is hidden.
const pending = new Map();
export function saveState(app, data) {
  const entry = pending.get(app) || {};
  clearTimeout(entry.timer);
  entry.data = data;
  entry.timer = setTimeout(() => flush(app), 600);
  pending.set(app, entry);
}
function flush(app, keepalive = false) {
  const entry = pending.get(app);
  if (!entry) return;
  clearTimeout(entry.timer);
  pending.delete(app);
  api(`/api/state/${app}`, { method: "PUT", data: { data: entry.data }, keepalive })
    .catch(() => document.dispatchEvent(new CustomEvent("kids-save-failed")));
}
addEventListener("pagehide", () => { for (const app of [...pending.keys()]) flush(app, true); });
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden") for (const app of [...pending.keys()]) flush(app, true);
});
