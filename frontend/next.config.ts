import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['media.formula1.com']
  },

  eslint: {
    ignoreDuringBuilds: true,
  }
};

export default nextConfig;
