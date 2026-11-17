import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  compiler: {
    styledComponents: true,
  },
  serverExternalPackages: [
    "@emotion/cache",
    "@emotion/react",
    "@emotion/utils",
    "@emotion/use-insertion-effect-with-fallbacks",
  ],
};

export default nextConfig;
