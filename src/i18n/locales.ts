export const LOCALES = ["pt-BR", "en"] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "pt-BR";

export const LOCALE_PARAM = "lang";

export const OG_LOCALES: Record<Locale, string> = {
  "pt-BR": "pt_BR",
  en: "en_US",
};

export const parseLocale = (value: string | string[] | undefined): Locale => {
  const raw = (Array.isArray(value) ? value[0] : value)?.trim().toLowerCase();
  if (!raw) return DEFAULT_LOCALE;
  if (raw === "en" || raw.startsWith("en-")) return "en";
  return DEFAULT_LOCALE;
};

export const getLocalePath = (locale: Locale) =>
  locale === DEFAULT_LOCALE ? "/" : `/?${LOCALE_PARAM}=${locale}`;
