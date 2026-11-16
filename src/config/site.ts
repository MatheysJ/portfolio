const DEFAULT_SITE_URL = "https://portfolio.matheus-junior.xyz";

/**
 * URL pública do site, usada na URL canônica, no og:url e no JSON-LD. Pode ser
 * sobrescrita com NEXT_PUBLIC_SITE_URL no ambiente de build (ex.: previews).
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL
).replace(/\/$/, "");
