import type { Metadata } from "next";
import { HomeClient, HOME_FAQS } from "@/components/HomeClient";
import { JsonLd } from "@/components/JsonLd";
import {
  buildPageMetadata,
  buildWebPageSchema,
  SITE_URL,
} from "@/lib/seo";

const HOME_TITLE =
  "WingPoll — Online Tasks in Kenya & Microtask Earning Platform";
const HOME_DESCRIPTION =
  "Discover simple online microtasks in Kenya—data entry, image transcription, document formatting, and research assignments—and withdraw KSh rewards via M-Pesa.";

export const metadata: Metadata = buildPageMetadata({
  title: HOME_TITLE,
  description: HOME_DESCRIPTION,
  path: "/",
  keywords: [
    "online tasks in Kenya",
    "earn rewards online in Kenya",
    "digital assignments",
    "online microtasks",
    "computer skills assignments",
    "digital earning opportunities",
    "M-Pesa microtasks",
    "WingPoll",
  ],
});

export default function HomePage() {
  const webPageSchema = buildWebPageSchema({
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    path: "/",
  });

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    url: SITE_URL,
    mainEntity: HOME_FAQS.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <>
      <JsonLd data={[webPageSchema, faqSchema]} />
      <HomeClient />
    </>
  );
}
