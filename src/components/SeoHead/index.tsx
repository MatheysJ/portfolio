import React from "react";
import Head from "next/head";
import { PERSON_JSON_LD, SEO } from "@/config/seo";
import { SITE_URL } from "@/config/site";
import { PROFILE } from "@/constants/content";
import { serializeJsonLd } from "@/utils/jsonLd";

const SeoHead: React.FC = () => (
  <Head>
    <title>{SEO.title}</title>
    <meta name="description" content={SEO.description} />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="icon" href="/favicon.ico" />
    <link rel="canonical" href={`${SITE_URL}/`} />

    <meta property="og:type" content="profile" />
    <meta property="og:locale" content="pt_BR" />
    <meta property="og:title" content={SEO.title} />
    <meta property="og:description" content={SEO.description} />
    <meta property="og:url" content={`${SITE_URL}/`} />
    <meta property="profile:first_name" content={PROFILE.givenName} />
    <meta name="twitter:card" content="summary" />

    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(PERSON_JSON_LD) }}
    />
  </Head>
);

export default SeoHead;
