import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, CheckCircle2, CreditCard, ShieldCheck } from "lucide-react";
import { JsonLd } from "@/components/JsonLd";
import { PublicInfoPage } from "@/components/PublicInfoPage";
import { buildBreadcrumbSchema, buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Help Center — WingPoll Support & Guides",
  description:
    "Explore step-by-step WingPoll Help Center guides covering account verification, completing microtasks accurately, and requesting M-Pesa payouts.",
  path: "/help-center",
  keywords: [
    "WingPoll Help Center",
    "WingPoll support",
    "how to withdraw M-Pesa WingPoll",
    "WingPoll earner guide",
  ],
});

const HELP_CARDS = [
  {
    title: "Account & Verification",
    description: "Email verification, Google Sign-In, and Admin approval.",
    href: "/faq",
    icon: ShieldCheck,
  },
  {
    title: "Task Quality Standards",
    description: "Formatting rules and tips for fast submission approval.",
    href: "/task-guidelines",
    icon: CheckCircle2,
  },
  {
    title: "M-Pesa Withdrawals",
    description: "Minimum KSh 550 threshold, payout timing, and number setup.",
    href: "/faq",
    icon: CreditCard,
  },
  {
    title: "Guides & Tutorials",
    description: "Detailed walkthroughs on our official WingPoll blog.",
    href: "/blogs",
    icon: BookOpen,
  },
];

export default function HelpCenterPage() {
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Help Center", path: "/help-center" },
  ]);

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <PublicInfoPage
        badge="Help Center"
        title="WingPoll Help Center"
        subtitle="Everything you need to know to get verified, complete digital microtasks accurately, and withdraw your earnings smoothly."
        breadcrumbLabel="Help Center"
        extraContent={
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {HELP_CARDS.map((card) => {
              const Icon = card.icon;
              return (
                <Link
                  key={card.title}
                  href={card.href}
                  className="bg-white border border-slate-200 hover:border-[#16A34A] rounded-lg p-5 flex items-start gap-3.5 transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.03)]"
                >
                  <div className="w-9 h-9 rounded-md bg-[#F0FDF4] border border-emerald-200 text-[#16A34A] flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-slate-900">
                      {card.title}
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">
                      {card.description}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        }
        sections={[
          {
            heading: "1. Verifying Your Email & Activating Your Account",
            paragraphs: [
              "After registering on WingPoll, check your email inbox (and spam folder) for a verification link from WingPoll. Clicking the link verifies your email address immediately.",
              "Once verified, your account enters Admin Approval. You can sign in to view your status banner and use the Refresh Status button to check when your account is activated.",
            ],
          },
          {
            heading: "2. Completing & Submitting Microtasks",
            bullets: [
              "Read every step in the task instructions and inspect any attached image, PDF, or video before starting.",
              "Enter accurate, properly formatted information matching the requested submission format.",
              "If a submission is returned with 'Revision Required', read the reviewer's feedback note and update your work promptly.",
            ],
          },
          {
            heading: "3. Managing Earnings & M-Pesa Withdrawals",
            paragraphs: [
              "Approved task rewards and KSh 25 referral bonuses are added to your Available Balance. Once your balance reaches KSh 550 or higher, you can submit a withdrawal request to your registered Safaricom M-Pesa number from the Withdrawals page.",
            ],
          },
        ]}
      />
    </>
  );
}

