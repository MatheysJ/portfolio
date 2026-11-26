import React from "react";
import {
  LOCALES,
  LOCALE_OPTIONS,
  getLocalePath,
  parseLocale,
  useDictionary,
  useLocale,
  useSetLocale,
} from "@/i18n";

import * as S from "./styles";

const LocaleSwitcher: React.FC = () => {
  const current = useLocale();
  const setLocale = useSetLocale();
  const { ui } = useDictionary();

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    const locale = parseLocale(event.currentTarget.hreflang);
    if (locale !== current) setLocale(locale);
  };

  return (
    <S.Nav aria-label={ui.languageNav}>
      {LOCALES.map((locale) => {
        const { short, name } = LOCALE_OPTIONS[locale];
        const isActive = locale === current;

        return (
          <S.Option
            key={locale}
            href={getLocalePath(locale)}
            hrefLang={locale}
            lang={locale}
            title={name}
            aria-label={name}
            aria-current={isActive ? "true" : undefined}
            $isActive={isActive}
            onClick={handleClick}
          >
            {short}
          </S.Option>
        );
      })}
    </S.Nav>
  );
};

export default LocaleSwitcher;
