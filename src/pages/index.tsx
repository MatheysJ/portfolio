import Head from "next/head";
import { Box } from "@chakra-ui/react";
import { Outdoor } from "@/components/Common";
import { Share_Tech_Mono } from "next/font/google";
import { useEffect, useState } from "react";

const mainFont = Share_Tech_Mono({
  weight: "400",
  subsets: ["latin"],
  adjustFontFallback: false,
});

export default function Home() {
  const [isClient, setIsClient] = useState<boolean>(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient ? (
    <>
      <Head>
        <title>Matheus Júnior · Software Engineer</title>
        <meta name="description" content="Matheus Júnior, Engenheiro de Software Full Stack em e-commerce: React, Next.js, TypeScript, Java/Spring Boot e Node.js/NestJS." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Box className={mainFont.className}>
        <Outdoor />
      </Box>
    </>
  ) : null;
}
