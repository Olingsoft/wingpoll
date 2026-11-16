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
        permanent: true,
      },
      {
        source: "/robots.txt",
        destination: "/en-ke/robots.txt",
        basePath: false,
        permanent: true,
      },
      {
        source: "/sitemap.xml",
        destination: "/en-ke/sitemap.xml",
        basePath: false,
        permanent: true,
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
