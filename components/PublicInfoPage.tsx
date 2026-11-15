import React from "react";
import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export interface InfoSection {
  id?: string;
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
}

interface PublicInfoPageProps {
  badge: string;
  title: string;
  subtitle: string;
  lastUpdated?: string;
  breadcrumbLabel: string;
  sections: InfoSection[];
  ctaTitle?: string;
  ctaDescription?: string;
  ctaHref?: string;
  ctaLabel?: string;
  extraContent?: React.ReactNode;
}

export function PublicInfoPage({
  badge,
  title,
  subtitle,
  lastUpdated,
  breadcrumbLabel,
  sections,
  ctaTitle = "Need personalized assistance?",
  ctaDescription = "Our Nairobi-based support team is ready to help with your WingPoll account, task submissions, or M-Pesa withdrawals.",
  ctaHref = "/contact",
  ctaLabel = "Contact Support",
  extraContent,
}: PublicInfoPageProps) {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-white border-b border-slate-200 py-12 sm:py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
            <nav
              aria-label="Breadcrumb"
              className="flex items-center gap-1.5 text-xs text-slate-500"
            >
              <Link href="/" className="hover:text-[#16A34A]">
                Home
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-medium text-slate-700">
                {breadcrumbLabel}
              </span>
            </nav>

            <div className="space-y-3">
              <span className="inline-block px-3 py-1 rounded-md bg-[#F0FDF4] border border-emerald-200 text-xs font-semibold text-[#14532D]">
                {badge}
              </span>
              <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
                {title}
              </h1>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl">
                {subtitle}
              </p>
              {lastUpdated && (
                <p className="text-xs text-slate-400">
                  Last updated: {lastUpdated}
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Body */}
        <section className="py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            {extraContent}

            {sections.map((section, idx) => (
              <article
                key={section.id || idx}
                id={section.id}
                className="bg-white border border-slate-200 rounded-lg p-6 sm:p-7 space-y-3 shadow-[0_1px_2px_rgba(0,0,0,0.03)]"
              >
                <h2 className="text-base sm:text-lg font-bold text-slate-900">
                  {section.heading}
                </h2>
                {section.paragraphs?.map((p, pIdx) => (
                  <p
                    key={pIdx}
                    className="text-xs sm:text-sm text-slate-600 leading-relaxed"
                  >
                    {p}
                  </p>
                ))}
                {section.bullets && section.bullets.length > 0 && (
                  <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-slate-600">
                    {section.bullets.map((b, bIdx) => (
                      <li key={bIdx} className="leading-relaxed">
                        {b}
                      </li>
                    ))}
                  </ul>
                )}
              </article>
            ))}

            {/* Bottom CTA */}
            <div className="bg-[#14532D] text-white rounded-lg p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <h2 className="text-base sm:text-lg font-bold">{ctaTitle}</h2>
                <p className="text-xs sm:text-sm text-emerald-100 max-w-xl">
                  {ctaDescription}
                </p>
              </div>
              <Link
                href={ctaHref}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-semibold bg-white text-[#14532D] hover:bg-emerald-50 rounded-md transition-colors shrink-0"
              >
                <span>{ctaLabel}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

