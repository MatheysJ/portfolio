import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import en from "./dictionaries/en";
import pt, { Dictionary } from "./dictionaries/pt";
import { DEFAULT_LOCALE, LOCALE_PARAM, Locale } from "./locales";

export * from "./locales";
export type { Dictionary };

const DICTIONARIES: Record<Locale, Dictionary> = { "pt-BR": pt, en };

export const getDictionary = (locale: Locale) => DICTIONARIES[locale];

interface LocaleContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

const LocaleContext = createContext<LocaleContextValue>({
  locale: DEFAULT_LOCALE,
  setLocale: () => {},
});

const replaceLocaleInUrl = (locale: Locale) => {
  const url = new URL(window.location.href);

  if (locale === DEFAULT_LOCALE) {
    url.searchParams.delete(LOCALE_PARAM);
  } else {
    url.searchParams.set(LOCALE_PARAM, locale);
  }

  window.history.replaceState(window.history.state, "", url);
};

export const LocaleProvider: React.FC<{
  locale?: Locale;
  children: React.ReactNode;
}> = ({ locale: initialLocale = DEFAULT_LOCALE, children }) => {
  const [locale, setLocaleState] = useState(initialLocale);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    replaceLocaleInUrl(next);
  }, []);

  const value = useMemo(() => ({ locale, setLocale }), [locale, setLocale]);

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
};

export const useLocale = () => useContext(LocaleContext).locale;

export const useSetLocale = () => useContext(LocaleContext).setLocale;

export const useDictionary = () => getDictionary(useLocale());
