// Sign in with Apple, web flow, shared by Trace, Pocket Money and My Routines.
// No Apple script is loaded: the page goes to Apple, and Apple posts the
// result back to /api/auth/apple/callback, which sets the session cookie and
// returns to this page. Needs APPLE_CLIENT_ID (a Services ID) on the Worker.

const APPLE_LOGO = `<svg viewBox="0 0 17 20" aria-hidden="true"><path fill="currentColor" d="M14.1 10.6c0-2.6 2.1-3.8 2.2-3.9-1.2-1.8-3.1-2-3.7-2-1.6-.2-3.1.9-3.9.9-.8 0-2-.9-3.3-.9-1.7 0-3.3 1-4.2 2.5-1.8 3.1-.5 7.7 1.3 10.2.9 1.2 1.9 2.6 3.2 2.6 1.3-.1 1.8-.8 3.3-.8 1.6 0 2 .8 3.3.8 1.4 0 2.3-1.3 3.1-2.5 1-1.4 1.4-2.8 1.4-2.9 0 0-2.7-1-2.7-4zM11.6 3c.7-.9 1.2-2 1-3.2-1 0-2.2.7-3 1.5-.6.7-1.2 1.9-1 3.1 1.1.1 2.2-.6 3-1.4z"/></svg>`;

// A black "Sign in with Apple" pill, sized to sit with Google's button.
export function appleButton(clientId, returnTo = location.pathname) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "apple-btn";
  button.innerHTML = `${APPLE_LOGO}<span>Sign in with Apple</span>`;
  button.addEventListener("click", () => startAppleSignIn(clientId, returnTo));
  return button;
}

export function startAppleSignIn(clientId, returnTo = location.pathname) {
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  const nonce = [...bytes].map((b) => b.toString(16).padStart(2, "0")).join("");
  // Apple's reply is a cross-site POST, so this cookie must be SameSite=None.
  document.cookie = `apple_state=${nonce}; Path=/api/auth/apple; Max-Age=600; Secure; SameSite=None`;
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: `${location.origin}/api/auth/apple/callback`,
    response_type: "code id_token",
    response_mode: "form_post",
    scope: "email",
    state: `${nonce}~${returnTo}`,
    nonce,
  });
  location.href = `https://appleid.apple.com/auth/authorize?${params}`;
}

// True once, right after Apple sign-in failed (the callback adds ?signin=failed).
export function appleSignInFailed() {
  const url = new URL(location.href);
  if (url.searchParams.get("signin") !== "failed") return false;
  url.searchParams.delete("signin");
  history.replaceState(null, "", url.pathname + url.search + url.hash);
  return true;
}

