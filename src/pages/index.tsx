import { Box } from "@chakra-ui/react";
import type { GetServerSideProps } from "next";
import { Share_Tech_Mono } from "next/font/google";
import { Outdoor } from "@/components/Common";
import SeoHead from "@/components/SeoHead";
import { LOCALE_PARAM, Locale, parseLocale } from "@/i18n";

const mainFont = Share_Tech_Mono({
  weight: "400",
  subsets: ["latin"],
  adjustFontFallback: false,
});

export interface HomeProps {
  locale: Locale;
}

// Rendered per request so ?lang=en ships English HTML to crawlers and AI agents.
export const getServerSideProps: GetServerSideProps<HomeProps> = async ({
  query,
  res,
}) => {
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=3600, stale-while-revalidate=86400",
  );
  return { props: { locale: parseLocale(query[LOCALE_PARAM]) } };
};

export default function Home() {
  return (
    <>
      <SeoHead />
      <Box className={mainFont.className}>
        <Outdoor />
      </Box>
    </>
  );
}
