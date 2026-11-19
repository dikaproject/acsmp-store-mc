// Skin render URLs for leaderboard avatars. Plain images only (no WebGL), so
// the page stays light on phones. Each helper returns a fallback chain: the
// <SkinImage> component walks it on error, ending on a default Steve render.

const JAVA_NAME = /^[A-Za-z0-9_]{3,16}$/;

// Bedrock/Geyser names (prefixed with "." or containing spaces) have no Java
// skin to look up, so they go straight to the default Steve render.
export const isJavaName = (name = "") => JAVA_NAME.test(name);

const enc = (name) => encodeURIComponent(name);

export const getHeadUrls = (name, size = 64) =>
  isJavaName(name)
    ? [`https://mc-heads.net/avatar/${enc(name)}/${size}`, `https://mc-heads.net/avatar/MHF_Steve/${size}`]
    : [`https://mc-heads.net/avatar/MHF_Steve/${size}`];

// Real 3D full-body render (NMSR, transparent PNG, cached 4h), then an
// isometric body from mc-heads, then default Steve.
export const getBodyUrls = (name) =>
  isJavaName(name)
    ? [
        `https://nmsr.nickac.dev/fullbody/${enc(name)}`,
        `https://mc-heads.net/body/${enc(name)}/240`,
        `https://nmsr.nickac.dev/fullbody/MHF_Steve`,
      ]
    : [`https://nmsr.nickac.dev/fullbody/MHF_Steve`, `https://mc-heads.net/body/MHF_Steve/240`];
