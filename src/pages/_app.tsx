import "@/styles/globals.css";
import { ChakraProvider } from "@chakra-ui/react";
import { ThemeProvider } from "next-themes";
import type { AppProps } from "next/app";
import system from "@/config/theme";
import { Toaster } from "@/components/ui/toaster";
import { LocaleProvider } from "@/i18n";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider value={system}>
      <ThemeProvider attribute="class" disableTransitionOnChange>
        <LocaleProvider locale={pageProps.locale}>
          <Component {...pageProps} />
          <Toaster />
        </LocaleProvider>
      </ThemeProvider>
    </ChakraProvider>
  );
}
