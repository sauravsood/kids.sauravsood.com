// Checks sign-in tokens (OpenID Connect ID tokens) from Google and Apple.
// Both are RS256 JWTs signed with keys the provider publishes as a JWKS.

export const GOOGLE = {
  jwks: "https://www.googleapis.com/oauth2/v3/certs",
  issuers: ["accounts.google.com", "https://accounts.google.com"],
};
export const APPLE = {
  jwks: "https://appleid.apple.com/auth/keys",
  issuers: ["https://appleid.apple.com"],
};

export class TokenError extends Error {
  constructor(status, message) { super(message); this.status = status; }
}

const jwksCache = new Map(); // url -> { keys, expires }

async function keysFor(url, { refresh = false } = {}) {
  const hit = jwksCache.get(url);
  if (!refresh && hit && Date.now() < hit.expires) return hit.keys;
  const res = await fetch(url);
  if (!res.ok) throw new TokenError(502, "Could not reach the sign-in provider");
  const { keys } = await res.json();
  const maxAge = Number((res.headers.get("cache-control") || "").match(/max-age=(\d+)/)?.[1] || 3600);
  jwksCache.set(url, { keys, expires: Date.now() + Math.min(maxAge, 86400) * 1000 });
  return keys;
}

// Returns the token's claims, or throws a TokenError.
export async function verifyIdToken(token, provider, { audience, nonce } = {}) {
  if (!audience) throw new TokenError(503, "This sign-in is not set up");
  if (typeof token !== "string" || token.split(".").length !== 3) throw new TokenError(400, "Bad sign-in token");
  const [h, p, s] = token.split(".");
  let header, claims;
  try {
    header = JSON.parse(b64urlText(h));
    claims = JSON.parse(b64urlText(p));
  } catch {
    throw new TokenError(400, "Bad sign-in token");
  }
  if (header.alg !== "RS256") throw new TokenError(401, "Unknown sign-in key");
  let jwk = (await keysFor(provider.jwks)).find((k) => k.kid === header.kid);
  // Providers rotate keys; look again once before giving up.
  if (!jwk) jwk = (await keysFor(provider.jwks, { refresh: true })).find((k) => k.kid === header.kid);
  if (!jwk) throw new TokenError(401, "Unknown sign-in key");
  const key = await crypto.subtle.importKey("jwk", jwk, { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" }, false, ["verify"]);
  const ok = await crypto.subtle.verify("RSASSA-PKCS1-v1_5", key, b64urlBytes(s), new TextEncoder().encode(`${h}.${p}`));
  const now = Date.now() / 1000;
  const aud = Array.isArray(claims.aud) ? claims.aud : [claims.aud];
  if (!ok
    || !provider.issuers.includes(claims.iss)
    || !aud.includes(audience)
    || !(claims.exp > now)
    || !claims.sub
    || (nonce !== undefined && claims.nonce !== nonce)) {
    throw new TokenError(401, "Sign-in could not be verified");
  }
  return claims;
}

// Apple and Google send email_verified as true or "true".
export function emailVerified(claims) {
  return claims.email_verified === true || claims.email_verified === "true";
}

function b64urlBytes(s) {
  const bin = atob(s.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((s.length + 3) % 4));
  return Uint8Array.from(bin, (c) => c.charCodeAt(0));
}

function b64urlText(s) {
  return new TextDecoder().decode(b64urlBytes(s));
}
