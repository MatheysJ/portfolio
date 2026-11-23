import React from "react";
import Head from "next/head";
import { ALTERNATE_URLS, buildPersonJsonLd, getPageUrl } from "@/config/seo";
import { DEFAULT_LOCALE, OG_LOCALES, useDictionary, useLocale } from "@/i18n";
import { serializeJsonLd } from "@/utils/jsonLd";

const SeoHead: React.FC = () => {
  const locale = useLocale();
  const dictionary = useDictionary();
  const { seo, profile } = dictionary;
  const url = getPageUrl(locale);

  return (
    <Head>
      <title>{seo.title}</title>
      <meta name="description" content={seo.description} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="/favicon.ico" />
      <link rel="canonical" href={url} />
      {ALTERNATE_URLS.map(({ locale: alternate, href }) => (
        <link
          key={`alternate-${alternate}`}
          rel="alternate"
          hrefLang={alternate}
          href={href}
        />
      ))}
      <link
        key="alternate-x-default"
        rel="alternate"
        hrefLang="x-default"
        href={getPageUrl(DEFAULT_LOCALE)}
      />

      <meta property="og:type" content="profile" />
      <meta property="og:locale" content={OG_LOCALES[locale]} />
      {Object.entries(OG_LOCALES)
        .filter(([key]) => key !== locale)
        .map(([key, value]) => (
          <meta
            key={`og-locale-${key}`}
            property="og:locale:alternate"
            content={value}
          />
        ))}
      <meta property="og:title" content={seo.title} />
      <meta property="og:description" content={seo.description} />
      <meta property="og:url" content={url} />
      <meta property="profile:first_name" content={profile.givenName} />
      <meta name="twitter:card" content="summary" />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: serializeJsonLd(buildPersonJsonLd(dictionary, locale)),
        }}
      />
    </Head>
  );
};

export default SeoHead;
