const DEFAULT_SITE_URL = "https://matheus-junior.xyz";

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL
).replace(/\/$/, "");
