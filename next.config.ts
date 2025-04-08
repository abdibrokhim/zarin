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
})

export default nextConfig
