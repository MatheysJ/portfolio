import React, { createContext, useContext } from "react";

import en from "./dictionaries/en";
import pt, { Dictionary } from "./dictionaries/pt";
import { DEFAULT_LOCALE, Locale } from "./locales";

export * from "./locales";
export type { Dictionary };

const DICTIONARIES: Record<Locale, Dictionary> = { "pt-BR": pt, en };

export const getDictionary = (locale: Locale) => DICTIONARIES[locale];

const LocaleContext = createContext<Locale>(DEFAULT_LOCALE);

export const LocaleProvider: React.FC<{
  locale?: Locale;
  children: React.ReactNode;
}> = ({ locale = DEFAULT_LOCALE, children }) => (
  <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>
);

export const useLocale = () => useContext(LocaleContext);

export const useDictionary = () => getDictionary(useLocale());
