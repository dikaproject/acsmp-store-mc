// Client-side helpers for the player JWT. The signature is NOT verified here
// (the server stays the source of truth); this only lets us notice an expired
// or broken token before sending it.

export const SESSION_EXPIRED_TOAST_ID = "session-expired";
export const SESSION_EXPIRED_MESSAGE = "Sesi kamu berakhir, silakan login ulang";

// Returns the `exp` claim (seconds since epoch) or null when the token is malformed.
export const getTokenExp = (token) => {
  if (typeof token !== "string") return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;

  try {
    // base64url -> base64 (+ padding), then decode as UTF-8
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");
    const bytes = Uint8Array.from(atob(padded), (char) => char.charCodeAt(0));
    const payload = JSON.parse(new TextDecoder().decode(bytes));
    return typeof payload?.exp === "number" ? payload.exp : null;
  } catch {
    return null;
  }
};

// Missing, malformed or exp-less tokens count as expired. `skewSeconds` makes a
// token that is about to expire count as expired so it dies before the request does.
export const isTokenExpired = (token, skewSeconds = 30) => {
  const exp = getTokenExp(token);
  if (exp === null) return true;
  return exp - skewSeconds <= Date.now() / 1000;
};

// Only allow same-origin relative paths as a post-login redirect target
// (blocks "//evil.com", "/\evil.com", absolute URLs, javascript: etc.).
export const getSafeRedirectPath = (path) => {
  if (typeof path !== "string" || !path.startsWith("/")) return null;

  try {
    const base = "http://same-origin.invalid";
    const url = new URL(path, base);
    if (url.origin !== base) return null;
    return url.pathname + url.search + url.hash;
  } catch {
    return null;
  }
};
