import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { PublicInfoPage } from "@/components/PublicInfoPage";
import { buildBreadcrumbSchema, buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Careers at WingPoll — Build Kenya's Microtask Economy",
  description:
    "Explore career opportunities and contributor roles at WingPoll in Nairobi, Kenya. Join our mission to create accessible digital work across East Africa.",
  path: "/careers",
  keywords: [
    "WingPoll careers",
    "digital jobs Nairobi",
    "WingPoll Kenya jobs",
    "microtask platform careers",
  ],
});

export default function CareersPage() {
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Careers", path: "/careers" },
  ]);

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <PublicInfoPage
        badge="Careers"
        title="Join the WingPoll Team"
        subtitle="We are building reliable, transparent digital work opportunities for everyday earners and businesses across Kenya."
        breadcrumbLabel="Careers"
        ctaTitle="Interested in working with us?"
        ctaDescription="Send your CV or portfolio and tell us how you can help grow WingPoll's operations, engineering, or quality assurance."
        ctaHref="/contact"
        ctaLabel="Get in Touch"
        sections={[
          {
            heading: "Why Work at WingPoll?",
            paragraphs: [
              "WingPoll connects organizations that need structured digital operations with verified contributors across Kenya. Our team values clarity, speed, fairness, and practical problem-solving.",
            ],
            bullets: [
              "Remote-friendly and Nairobi-based collaboration.",
              "Direct impact on digital income opportunities across Kenya.",
              "High-ownership culture with transparent metrics and clear goals.",
            ],
          },
          {
            heading: "Areas We Hire For",
            bullets: [
              "Task Quality & Agent Admin Operations — Designing clear microtask briefs and auditing earner submissions.",
              "Full-Stack Web Engineering — Next.js, TypeScript, Firebase, and M-Pesa payment integrations.",
              "Business Partnerships — Onboarding Kenyan SMEs and enterprises with data extraction and formatting needs.",
              "Community & Earner Support — Helping new earners succeed and maintain high approval rates.",
            ],
          },
          {
            heading: "Looking to Earn Immediately as a Contributor?",
            paragraphs: [
              "If you are looking for flexible, task-based digital work rather than a full-time staff position, you can register as a WingPoll Earner today and start completing available microtasks once your account is approved.",
            ],
          },
        ]}
      />
    </>
  );
}

