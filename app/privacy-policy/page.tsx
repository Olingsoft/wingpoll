import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { PublicInfoPage } from "@/components/PublicInfoPage";
import { buildBreadcrumbSchema, buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Privacy Policy — WingPoll",
  description:
    "Read the WingPoll Privacy Policy to understand how we collect, use, store, and protect your personal information, task submissions, and M-Pesa payout details.",
  path: "/privacy-policy",
  keywords: [
    "WingPoll privacy policy",
    "data protection Kenya",
    "WingPoll user data",
  ],
});

export default function PrivacyPolicyPage() {
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Privacy Policy", path: "/privacy-policy" },
  ]);

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <PublicInfoPage
        badge="Legal"
        title="Privacy Policy"
        subtitle="Your privacy matters to us. This policy explains what information WingPoll collects, why we collect it, and how we keep it secure."
        lastUpdated="November 15, 2026"
        breadcrumbLabel="Privacy Policy"
        sections={[
          {
            heading: "1. Information We Collect",
            paragraphs: [
              "When you create a WingPoll account or complete microtasks, we collect information necessary to operate the platform securely and pay out your rewards:",
            ],
            bullets: [
              "Account Details: Your full name, email address, phone number, and Safaricom M-Pesa payout number.",
              "Authentication Data: Sign-in credentials and email verification status managed through Firebase Authentication.",
              "Task & Submission Records: Work you submit for review, reviewer feedback, balance history, and withdrawal requests.",
              "Technical & Usage Data: Basic device, browser, and session telemetry used to prevent fraud and improve site performance.",
            ],
          },
          {
            heading: "2. How We Use Your Information",
            bullets: [
              "To verify your identity, activate your earner account, and prevent duplicate or automated spam accounts.",
              "To review your task submissions, credit approved rewards, and process M-Pesa withdrawals.",
              "To send essential account notices, verification links, and task review updates.",
              "To monitor platform security, enforce our Terms and Conditions, and comply with applicable Kenyan laws.",
            ],
          },
          {
            heading: "3. Data Sharing & Storage",
            paragraphs: [
              "WingPoll does not sell your personal contact information to third-party marketers. Your data is stored using trusted cloud infrastructure (such as Google Firebase and Cloudinary for uploaded task media) with access restricted to authorized administrators and systems.",
            ],
          },
          {
            heading: "4. Your Rights & Contact",
            paragraphs: [
              "You may review and update your profile details from your dashboard or request account deletion or data clarification by contacting support@wingpoll.co.ke.",
            ],
          },
        ]}
      />
    </>
  );
}

