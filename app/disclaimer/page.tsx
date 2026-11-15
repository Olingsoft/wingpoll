import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { PublicInfoPage } from "@/components/PublicInfoPage";
import { buildBreadcrumbSchema, buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Disclaimer — WingPoll",
  description:
    "Read the WingPoll Disclaimer regarding platform earnings, independent contributor status, task availability, and information accuracy.",
  path: "/disclaimer",
  keywords: [
    "WingPoll disclaimer",
    "WingPoll earnings disclaimer",
    "microtask platform disclaimer",
  ],
});

export default function DisclaimerPage() {
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Disclaimer", path: "/disclaimer" },
  ]);

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <PublicInfoPage
        badge="Legal"
        title="Platform Disclaimer"
        subtitle="Important information regarding earnings, task availability, independent contributor status, and external resources on WingPoll."
        lastUpdated="November 15, 2026"
        breadcrumbLabel="Disclaimer"
        sections={[
          {
            heading: "1. No Guaranteed Income",
            paragraphs: [
              "Earnings on WingPoll depend entirely on task availability, the number of tasks you accurately complete, and submission approval by Admins or Agent Admins. WingPoll does not guarantee a fixed daily or monthly salary.",
            ],
          },
          {
            heading: "2. Independent Contributor Relationship",
            paragraphs: [
              "Registered earners on WingPoll participate as independent digital contributors, not as employees, agents, or partners of WingPoll.",
            ],
          },
          {
            heading: "3. Accuracy of Information & Third-Party Links",
            paragraphs: [
              "While we strive to keep all guides, blog articles, and task instructions accurate and up to date, WingPoll makes no warranties regarding third-party websites or external references linked within tasks or blog posts.",
            ],
          },
          {
            heading: "4. Platform Availability",
            paragraphs: [
              "WingPoll may update, pause, or discontinue specific tasks, reward rates, or features at any time to maintain platform quality and security.",
            ],
          },
        ]}
      />
    </>
  );
}

