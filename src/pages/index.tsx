import { Box } from "@chakra-ui/react";
import { Share_Tech_Mono } from "next/font/google";
import { Outdoor } from "@/components/Common";
import SeoHead from "@/components/SeoHead";

const mainFont = Share_Tech_Mono({
  weight: "400",
  subsets: ["latin"],
  adjustFontFallback: false,
});

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
