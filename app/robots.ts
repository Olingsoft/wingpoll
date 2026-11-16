import type { MetadataRoute } from "next";
import { ROOT_DOMAIN, SITE_URL } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/en-ke",
          "/en-ke/",
          "/en-ke/_next/static/",
          "/_next/static/",
        ],
        disallow: [
          "/en-ke/dashboard",
          "/en-ke/dashboard/",
          "/en-ke/login",
          "/en-ke/register",
          "/en-ke/forgot-password",
          "/en-ke/verify-email",
          "/en-ke/api/",
          "/dashboard",
          "/dashboard/",
          "/login",
          "/register",
          "/forgot-password",
          "/verify-email",
          "/api/",
          "/admin",
          "/agent-admin",
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: ROOT_DOMAIN,
  };
}
