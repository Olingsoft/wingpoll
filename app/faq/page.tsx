import type { Metadata } from "next";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { JsonLd } from "@/components/JsonLd";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { buildBreadcrumbSchema, buildPageMetadata, SITE_URL } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Frequently Asked Questions (FAQ) — WingPoll",
  description:
    "Find answers to common questions about WingPoll microtasks, email verification, admin approval, task reviews, and M-Pesa withdrawals in Kenya.",
  path: "/faq",
  keywords: [
    "WingPoll FAQ",
    "WingPoll questions",
    "M-Pesa microtasks FAQ",
    "how WingPoll works",
  ],
});

const FAQ_GROUPS = [
  {
    category: "Getting Started & Account Approval",
    items: [
      {
        q: "How do I create a WingPoll earner account?",
        a: "Visit the Register page, sign up with your email and password or Google account, verify your email address via the verification link sent to your inbox, and wait for Admin activation.",
      },
      {
        q: "Why do I need to verify my email before accessing the dashboard?",
        a: "Email verification protects your account, ensures we can send important submission and payout notifications, and keeps our earner community authentic.",
      },
      {
        q: "How long does Admin approval take?",
        a: "Most new accounts are reviewed within 24 hours after email verification. Once approved, your dashboard unlocks full access to active microtasks.",
      },
    ],
  },
  {
    category: "Tasks & Submissions",
    items: [
      {
        q: "What types of microtasks are available on WingPoll?",
        a: "WingPoll offers structured digital microtasks including email extraction, image-to-text transcription, video extraction, data entry, document formatting, PDF creation, and simple online research.",
      },
      {
        q: "What happens after I submit a task?",
        a: "Your submission enters Pending Review. An Admin or Agent Admin inspects your work against the task instructions. Once approved, the KSh reward is credited directly to your available balance.",
      },
      {
        q: "What does 'Revision Required' mean?",
        a: "If a reviewer spots a minor formatting issue or missing entry, they may return the submission with specific feedback so you can fix and resubmit it instead of rejecting it outright.",
      },
    ],
  },
  {
    category: "Payments & M-Pesa Withdrawals",
    items: [
      {
        q: "What is the minimum withdrawal amount?",
        a: "You can request a withdrawal once your approved available balance reaches KSh 300.",
      },
      {
        q: "How do M-Pesa payouts work?",
        a: "Go to the Withdrawals page in your dashboard, confirm your Safaricom M-Pesa phone number, enter an amount of KSh 300 or more, and submit your request for processing.",
      },
      {
        q: "How does the WingPoll referral bonus work?",
        a: "Share your unique referral link from your dashboard. When a friend registers using your link, verifies their email, and is approved by Admin, you earn a KSh 50 referral reward.",
      },
    ],
  },
];

export default function FaqPage() {
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "FAQ", path: "/faq" },
  ]);

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    url: `${SITE_URL}/faq`,
    mainEntity: FAQ_GROUPS.flatMap((group) =>
      group.items.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.a,
        },
      }))
    ),
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={faqSchema} />
      <Navbar />

      <main className="flex-1">
        <section className="bg-white border-b border-slate-200 py-12 sm:py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
            <span className="inline-block px-3 py-1 rounded-md bg-[#F0FDF4] border border-emerald-200 text-xs font-semibold text-[#14532D]">
              FAQs
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
              Frequently Asked Questions
            </h1>
            <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto">
              Clear answers about WingPoll accounts, task quality reviews,
              referral rewards, and M-Pesa withdrawals.
            </p>
          </div>
        </section>

        <section className="py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            {FAQ_GROUPS.map((group) => (
              <div key={group.category} className="space-y-3">
                <h2 className="text-base sm:text-lg font-bold text-slate-900">
                  {group.category}
                </h2>
                <div className="space-y-2.5">
                  {group.items.map((item) => (
                    <details
                      key={item.q}
                      className="group bg-white border border-slate-200 rounded-lg p-5 shadow-[0_1px_2px_rgba(0,0,0,0.03)]"
                    >
                      <summary className="flex items-center justify-between gap-4 cursor-pointer list-none text-sm font-semibold text-slate-900">
                        <span>{item.q}</span>
                        <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 transition-transform group-open:rotate-180" />
                      </summary>
                      <p className="mt-3 pt-3 border-t border-slate-100 text-xs sm:text-sm text-slate-600 leading-relaxed">
                        {item.a}
                      </p>
                    </details>
                  ))}
                </div>
              </div>
            ))}

            <div className="bg-white border border-slate-200 rounded-lg p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  Still have a question?
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Visit our Help Center or send a message to our support team.
                </p>
              </div>
              <div className="flex flex-wrap gap-2.5">
                <Link
                  href="/help-center"
                  className="px-4 py-2 text-xs font-semibold border border-slate-200 text-slate-700 hover:border-[#16A34A] rounded-md"
                >
                  Help Center
                </Link>
                <Link
                  href="/contact"
                  className="px-4 py-2 text-xs font-semibold bg-[#16A34A] hover:bg-[#15803d] text-white rounded-md"
                >
                  Contact Support
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

