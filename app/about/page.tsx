"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  Award,
  CheckCircle2,
  Globe,
  Layers,
  ShieldCheck,
  Smartphone,
  Target,
  Users,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const CORE_VALUES = [
  {
    title: "Accessible Digital Work",
    description:
      "Tasks are structured around everyday computer and smartphone skills—no complex technical background or bidding wars required.",
    icon: Layers,
  },
  {
    title: "Transparent KSh Rewards",
    description:
      "Every assignment displays its fixed Kenyan Shilling reward, estimated completion time, and clear step-by-step instructions upfront.",
    icon: Award,
  },
  {
    title: "Quality & Accuracy First",
    description:
      "Dedicated moderation ensures high-quality data outputs for business partners and fair, timely feedback for contributors.",
    icon: ShieldCheck,
  },
  {
    title: "Reliable M-Pesa Payouts",
    description:
      "With a low KSh 550 withdrawal threshold, earners can transfer their approved balance straight to their Safaricom M-Pesa wallet.",
    icon: Smartphone,
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <Navbar />

      <main className="flex-1">
        {/* Hero Banner */}
        <section className="bg-white border-b border-slate-200 py-14 sm:py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
            <span className="inline-block px-3 py-1 rounded-md bg-[#F0FDF4] border border-emerald-200 text-xs font-semibold text-[#14532D]">
              About WingPoll
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
              Empowering Everyday Earners Through Simple Digital Microtasks
            </h1>
            <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
              WingPoll bridges the gap between organizations that need clean,
              structured digital information and skilled individuals across
              Kenya looking to turn their free time into reliable rewards.
            </p>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-14 border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white border border-slate-200 rounded-lg p-6 sm:p-8 space-y-3 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
                <div className="w-10 h-10 rounded-md bg-[#F0FDF4] border border-emerald-200 text-[#16A34A] flex items-center justify-center">
                  <Target className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-bold text-slate-900">
                  Our Mission
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  To make online earning straightforward, trustworthy, and
                  accessible to anyone with basic digital literacy. By breaking
                  large document processing and data entry workloads into clear
                  micro-assignments, we help people earn extra income on their
                  own schedule.
                </p>
              </div>

              <div className="bg-white border border-slate-200 rounded-lg p-6 sm:p-8 space-y-3 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
                <div className="w-10 h-10 rounded-md bg-[#F0FDF4] border border-emerald-200 text-[#16A34A] flex items-center justify-center">
                  <Globe className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-bold text-slate-900">
                  What We Do
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Businesses, researchers, and SMEs constantly work with scanned
                  receipts, handwritten delivery notes, unformatted documents,
                  and directories. WingPoll distributes these assignments to
                  verified contributors who transcribe, extract, and format the
                  data accurately.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Core Values */}
        <section className="py-14 bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            <div className="text-center max-w-2xl mx-auto">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#16A34A]">
                Why Choose WingPoll
              </span>
              <h2 className="text-2xl font-bold text-slate-900 mt-1">
                Built for Simplicity, Fairness, and Trust
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {CORE_VALUES.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className="bg-[#F8FAFC] border border-slate-200 rounded-lg p-5 space-y-3"
                  >
                    <div className="w-9 h-9 rounded-md bg-white border border-slate-200 text-[#16A34A] flex items-center justify-center">
                      <Icon className="w-4 h-4" />
                    </div>
                    <h3 className="text-sm font-bold text-slate-900">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* How Quality & Payouts Work */}
        <section className="py-14 border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-[#14532D] text-white rounded-lg p-8 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8 space-y-4">
                <h2 className="text-xl sm:text-2xl font-bold">
                  Ready to Start Completing Digital Tasks?
                </h2>
                <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed max-w-2xl">
                  Create your free earner account today, browse available tasks
                  in data entry, email extraction, and document formatting, and
                  withdraw your rewards via M-Pesa once your balance reaches KSh
                  550.
                </p>
                <div className="flex flex-wrap gap-4 pt-1 text-xs text-emerald-200">
                  <span className="inline-flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-[#4ade80]" />
                    Free Account Registration
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-[#4ade80]" />
                    KSh 25 Referral Bonus
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Smartphone className="w-4 h-4 text-[#4ade80]" />
                    Direct M-Pesa Withdrawals
                  </span>
                </div>
              </div>

              <div className="lg:col-span-4 flex lg:justify-end">
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-[#16A34A] hover:bg-[#15803d] rounded-md transition-colors"
                >
                  <span>Create Free Account</span>
                  <ArrowRight className="w-4 h-4" />
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

