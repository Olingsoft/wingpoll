import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { PublicInfoPage } from "@/components/PublicInfoPage";
import { buildBreadcrumbSchema, buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Community Guidelines — WingPoll",
  description:
    "Read the WingPoll Community Guidelines to understand our standards for honesty, respect, fair referrals, and safe collaboration across our earner network.",
  path: "/community-guidelines",
  keywords: [
    "WingPoll community guidelines",
    "earner code of conduct",
    "WingPoll rules",
  ],
});

export default function CommunityGuidelinesPage() {
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Community Guidelines", path: "/community-guidelines" },
  ]);

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <PublicInfoPage
        badge="Community"
        title="Community Guidelines"
        subtitle="WingPoll thrives on trust, accuracy, and mutual respect. Every earner, Agent Admin, and partner is expected to uphold these standards."
        lastUpdated="November 15, 2026"
        breadcrumbLabel="Community Guidelines"
        sections={[
          {
            heading: "1. One Authentic Account Per Person",
            paragraphs: [
              "Every contributor may operate only one verified WingPoll account. Creating multiple accounts to claim extra task slots or abuse the KSh 25 referral bonus is strictly prohibited and leads to permanent suspension.",
            ],
          },
          {
            heading: "2. Honest Work & Zero Fabrication",
            bullets: [
              "Only submit work you have genuinely completed by reviewing the provided task materials.",
              "Never submit placeholder text, guessed phone numbers/emails, or AI-fabricated entries where exact extraction is required.",
              "Respect confidentiality: do not redistribute or publish proprietary client documents or task attachments outside WingPoll.",
            ],
          },
          {
            heading: "3. Respectful Communication",
            paragraphs: [
              "When contacting Support, responding to revision feedback, or submitting platform feedback, keep all communication constructive and respectful. Abusive language toward reviewers or support staff will not be tolerated.",
            ],
          },
          {
            heading: "4. Ethical Referrals",
            paragraphs: [
              "Share your referral link honestly with friends, classmates, or colleagues. Do not spam unrelated groups or misrepresent WingPoll payouts.",
            ],
          },
        ]}
      />
    </>
  );
}

