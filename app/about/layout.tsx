import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { buildBreadcrumbSchema, buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "About WingPoll — Digital Microtask Platform in Kenya",
  description:
    "Learn how WingPoll empowers everyday earners in Kenya with accessible data entry, image transcription, document formatting, and M-Pesa payouts.",
  path: "/about",
  keywords: [
    "About WingPoll",
    "WingPoll Kenya",
    "digital microtasks Kenya",
    "M-Pesa earning platform",
  ],
});

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "About Us", path: "/about" },
  ]);

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      {children}
    </>
  );
}

