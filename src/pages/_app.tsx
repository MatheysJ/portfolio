import "@/styles/globals.css";
import { ChakraProvider } from "@chakra-ui/react";
import { ThemeProvider } from "next-themes";
import type { AppProps } from "next/app";
import system from "@/config/theme";
import { Toaster } from "@/components/ui/toaster";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider value={system}>
      <ThemeProvider attribute="class" disableTransitionOnChange>
        <Component {...pageProps} />
        <Toaster />
      </ThemeProvider>
    </ChakraProvider>
  );
}
