import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";

const config = defineConfig({
  globalCss: {
    html: {
      colorPalette: "cyan",
      background: "bg.muted",
    },
  },
});

export default createSystem(defaultConfig, config);
