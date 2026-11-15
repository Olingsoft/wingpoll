import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { PublicInfoPage } from "@/components/PublicInfoPage";
import { buildBreadcrumbSchema, buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Task Guidelines — How to Get Approved Faster on WingPoll",
  description:
    "Follow WingPoll's official Task Guidelines for data entry, email extraction, image transcription, video extraction, and PDF formatting to maintain a high approval rate.",
  path: "/task-guidelines",
  keywords: [
    "WingPoll task guidelines",
    "microtask quality standards",
    "how to pass task review",
  ],
});

export default function TaskGuidelinesPage() {
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Task Guidelines", path: "/task-guidelines" },
  ]);

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <PublicInfoPage
        badge="Platform"
        title="Task Guidelines & Quality Standards"
        subtitle="Follow these best practices when completing microtasks on WingPoll to maximize your approval rate and avoid unnecessary revisions."
        breadcrumbLabel="Task Guidelines"
        ctaTitle="Ready to start earning?"
        ctaDescription="Browse active digital microtasks in your dashboard and put these quality guidelines into practice."
        ctaHref="/dashboard/tasks"
        ctaLabel="Explore Tasks"
        sections={[
          {
            heading: "1. Read Instructions & Inspect Source Files First",
            bullets: [
              "Review every numbered instruction before extracting or typing your answer.",
              "Open or preview the full attached image, PDF, spreadsheet, or video clip—do not rely only on thumbnails.",
              "Check the expected submission format (single line, multiline text, structured table, or file upload).",
            ],
          },
          {
            heading: "2. Accuracy & Formatting Checklist",
            bullets: [
              "Double-check spelling of names, email addresses (e.g., .co.ke vs .com), and Kenyan phone numbers.",
              "Preserve requested numbering, line breaks, or table columns.",
              "Remove extra spaces, typos, or unrelated commentary unless requested in the notes field.",
            ],
          },
          {
            heading: "3. Handling 'Revision Required' Feedback",
            paragraphs: [
              "If an Admin or Agent Admin marks your submission as Revision Required, read the reviewer note carefully, fix the exact missing or misformatted items, and resubmit promptly to receive full reward credit.",
            ],
          },
          {
            heading: "4. Common Reasons Submissions Are Rejected",
            bullets: [
              "Blank, random, or copied placeholder submissions.",
              "Extracting data from the wrong document or skipping major sections of the source file.",
              "Submitting unverified or fabricated contact details.",
            ],
          },
        ]}
      />
    </>
  );
}

