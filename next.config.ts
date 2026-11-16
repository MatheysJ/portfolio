import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  compiler: {
    styledComponents: true,
  },
  // Mantém o Emotion (usado pelo Chakra) fora do bundle do servidor no Worker.
  serverExternalPackages: [
    "@emotion/cache",
    "@emotion/react",
    "@emotion/utils",
    "@emotion/use-insertion-effect-with-fallbacks",
  ],
};

export default nextConfig;
