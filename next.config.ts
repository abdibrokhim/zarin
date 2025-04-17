import type { NextConfig } from "next"

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
})

const nextConfig: NextConfig = withBundleAnalyzer({
  experimental: {
    optimizePackageImports: ["@phosphor-icons/react"],
  },
  eslint: {
    // @todo: remove before going live
    ignoreDuringBuilds: true,
  },
  env: {
    AIML_API_KEY: process.env.AIML_API_KEY,
  },
  images: {
    remotePatterns: [
      {
        hostname: "**",
      },
    ],
  },
})

export default nextConfig
