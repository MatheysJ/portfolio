import Head from "next/head";
import { Box } from "@chakra-ui/react";
import { Outdoor } from "@/components/Common";
import { Share_Tech_Mono } from "next/font/google";
import { PERSON_JSON_LD, SEO, SITE_URL, serializeJsonLd } from "@/config/seo";

const mainFont = Share_Tech_Mono({
  weight: "400",
  subsets: ["latin"],
  adjustFontFallback: false,
});

export default function Home() {
  return (
    <>
      <Head>
        <title>{SEO.title}</title>
        <meta name="description" content={SEO.description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />

        <meta property="og:type" content="profile" />
        <meta property="og:locale" content="pt_BR" />
        <meta property="og:title" content={SEO.title} />
        <meta property="og:description" content={SEO.description} />
        <meta property="profile:first_name" content="Matheus" />
        <meta name="twitter:card" content="summary" />
        {SITE_URL && (
          <>
            <link rel="canonical" href={`${SITE_URL}/`} />
            <meta property="og:url" content={`${SITE_URL}/`} />
          </>
        )}

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(PERSON_JSON_LD) }}
        />
      </Head>
      <Box className={mainFont.className}>
        <Outdoor />
      </Box>
    </>
  );
}
