import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: "/en-ke",
  trailingSlash: false,
  async redirects() {
    return [
      {
        source: "/",
        destination: "/en-ke",
        basePath: false,
        permanent: false,
      },
    ];
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
  experimental: {
    agentFeedback: true,
  },
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
