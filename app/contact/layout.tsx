import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { buildBreadcrumbSchema, buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Contact WingPoll Support — Nairobi, Kenya",
  description:
    "Get in touch with WingPoll support for help with microtask submissions, account activation, M-Pesa withdrawals, or business partnerships in Kenya.",
  path: "/contact",
  keywords: [
    "Contact WingPoll",
    "WingPoll support",
    "support@wingpoll.co.ke",
    "WingPoll Nairobi",
  ],
});

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Contact Us", path: "/contact" },
  ]);

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      {children}
    </>
  );
}

