import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { buildBreadcrumbSchema, buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Share Feedback — WingPoll",
  description:
    "Send product feedback, feature suggestions, or task experience reports directly to the WingPoll team in Nairobi, Kenya.",
  path: "/feedback",
  keywords: [
    "WingPoll feedback",
    "WingPoll suggestions",
    "report issue WingPoll",
  ],
});

export default function FeedbackLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Feedback", path: "/feedback" },
  ]);

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      {children}
    </>
  );
}

