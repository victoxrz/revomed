import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  allowedDevOrigins: ["*"],
  logging: {
    fetches: {
      fullUrl: false, // it does anything??
    },
  },
  typedRoutes: true,
  serverExternalPackages: ["@soniox/soniox-node"],
  // reactStrictMode: false,
  /* config options here */
};

export default nextConfig;
