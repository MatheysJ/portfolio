import React from "react";
import {
  LOCALES,
  LOCALE_OPTIONS,
  getLocalePath,
  useDictionary,
  useLocale,
} from "@/i18n";

import * as S from "./styles";

const LocaleSwitcher: React.FC = () => {
  const current = useLocale();
  const { ui } = useDictionary();

  return (
    <S.Nav aria-label={ui.languageNav}>
      {LOCALES.map((locale) => {
        const { short, name } = LOCALE_OPTIONS[locale];
        const isActive = locale === current;
        const href = getLocalePath(locale);

        return (
          <S.Option
            key={locale}
            href={href}
            hrefLang={locale}
            lang={locale}
            title={name}
            aria-label={name}
            aria-current={isActive ? "true" : undefined}
            $isActive={isActive}
            onClick={(event) => {
              event.preventDefault();
              // Keeps the current face (#hash) when switching languages.
              if (!isActive) {
                window.location.assign(`${href}${window.location.hash}`);
              }
            }}
          >
            {short}
          </S.Option>
        );
      })}
    </S.Nav>
  );
};

export default LocaleSwitcher;
