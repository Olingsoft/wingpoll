import React from "react";
import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { BlogsClient } from "@/components/BlogsClient";
import { JsonLd } from "@/components/JsonLd";
import { getPublishedBlogs } from "@/lib/blogs";
import { buildBreadcrumbSchema, buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Blogs & Earner Guides — Microtask Tips & M-Pesa Payouts",
  description:
    "Read practical WingPoll guides on image transcription, PDF document formatting, data entry accuracy, referral commissions, and M-Pesa withdrawals in Kenya.",
  path: "/blogs",
  keywords: [
    "WingPoll blog",
    "microtask tips Kenya",
    "image transcription guide",
    "M-Pesa withdrawal guide",
    "online data entry Kenya",
  ],
});

export default async function BlogsPage() {
  const posts = await getPublishedBlogs();
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Blogs & Guides", path: "/blogs" },
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <JsonLd data={breadcrumbSchema} />
      <Navbar />
      <main className="flex-1">
        <BlogsClient posts={posts} />
      </main>
      <Footer />
    </div>
  );
}
