import type { MetadataRoute } from "next";
import { ROOT_DOMAIN, SITE_URL } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/en-ke",
          "/en-ke/",
          "/about",
          "/blogs",
          "/blogs/",
          "/contact",
          "/faq",
          "/help-center",
          "/careers",
          "/privacy-policy",
          "/terms-and-conditions",
          "/cookie-policy",
          "/community-guidelines",
          "/task-guidelines",
          "/disclaimer",
          "/feedback",
        ],
        disallow: [
          "/admin",
          "/admin/",
          "/en-ke/admin",
          "/en-ke/admin/",
          "/agent-admin",
          "/agent-admin/",
          "/en-ke/agent-admin",
          "/en-ke/agent-admin/",
          "/dashboard",
          "/dashboard/",
          "/en-ke/dashboard",
          "/en-ke/dashboard/",
          "/api/",
          "/login",
          "/register",
          "/forgot-password",
          "/verify-email",
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: ROOT_DOMAIN,
  };
}

