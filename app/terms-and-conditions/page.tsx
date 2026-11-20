import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { PublicInfoPage } from "@/components/PublicInfoPage";
import { buildBreadcrumbSchema, buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Terms and Conditions — WingPoll",
  description:
    "Review the WingPoll Terms and Conditions governing account registration, task eligibility, quality reviews, referral bonuses, and M-Pesa withdrawals.",
  path: "/terms-and-conditions",
  keywords: [
    "WingPoll terms and conditions",
    "WingPoll terms of service",
    "microtask platform rules",
  ],
});

export default function TermsAndConditionsPage() {
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Terms and Conditions", path: "/terms-and-conditions" },
  ]);

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <PublicInfoPage
        badge="Legal"
        title="Terms and Conditions"
        subtitle="By creating an account or using WingPoll, you agree to comply with the following terms governing tasks, payouts, and platform conduct."
        lastUpdated="November 15, 2026"
        breadcrumbLabel="Terms and Conditions"
        sections={[
          {
            heading: "1. Account Eligibility & Verification",
            bullets: [
              "You must provide accurate personal information and maintain only one active earner account per person.",
              "You must verify your email address and receive Admin approval before accessing paid microtasks.",
              "WingPoll reserves the right to suspend or reject accounts suspected of duplicate registration, impersonation, or automated abuse.",
            ],
          },
          {
            heading: "2. Task Submissions & Review Decisions",
            paragraphs: [
              "Rewards are only earned when a task submission is marked Approved by an Admin or Agent Admin. Submissions that are incomplete, inaccurate, plagiarized, or fail to follow task instructions may be returned for revision or rejected without payout.",
            ],
          },
          {
            heading: "3. Earnings, Referrals & Withdrawals",
            bullets: [
              "The minimum withdrawal threshold is KSh 550 in approved available balance.",
              "Referral rewards (KSh 25) are credited only after the referred user verifies their email and receives Admin account activation.",
              "You are responsible for ensuring your registered M-Pesa number is accurate before requesting a payout.",
            ],
          },
          {
            heading: "4. Prohibited Conduct & Account Termination",
            paragraphs: [
              "Submitting fabricated data, using bots or scripts to scrape or submit tasks, harassing staff or community members, or attempting to bypass security controls will result in immediate account suspension and forfeiture of unapproved balances.",
            ],
          },
        ]}
      />
    </>
  );
}

