import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/about", "/blogs", "/blogs/", "/contact"],
        disallow: [
          "/admin",
          "/admin/",
          "/agent-admin",
          "/agent-admin/",
          "/dashboard",
          "/dashboard/",
          "/api/",
          "/login",
          "/register",
          "/forgot-password",
          "/verify-email",
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}

