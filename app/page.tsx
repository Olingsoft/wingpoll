"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Award,
  CheckCircle2,
  ChevronDown,
  Clock,
  Database,
  FileSpreadsheet,
  FileText,
  Image as ImageIcon,
  Layers,
  Search,
  ShieldCheck,
  Smartphone,
  Sparkles,
  UserPlus,
  Users,
  Wallet,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { AdvertisementBanner } from "@/components/AdvertisementBanner";
import { useApp } from "@/context/AppContext";

const HOW_IT_WORKS_STEPS = [
  {
    step: "01",
    title: "Create an account",
    description:
      "Sign up in under a minute using your email and Kenyan M-Pesa phone number.",
    icon: UserPlus,
  },
  {
    step: "02",
    title: "Choose a task",
    description:
      "Browse available microtasks filtered by category, time required, and KSh reward.",
    icon: Layers,
  },
  {
    step: "03",
    title: "Complete the task",
    description:
      "Download the task attachment, extract information or format text following clear instructions.",
    icon: FileText,
  },
  {
    step: "04",
    title: "Submit for review",
    description:
      "Enter your structured output or upload the formatted file for quality verification.",
    icon: CheckCircle2,
  },
  {
    step: "05",
    title: "Receive your reward",
    description:
      "Approved task rewards are credited to your wallet. Withdraw via M-Pesa from KSh 300.",
    icon: Wallet,
  },
];

const LANDING_CATEGORIES = [
  {
    title: "Data Entry",
    description:
      "Enter receipt items, invoices, and business records into clean structured tables.",
    rewardRange: "KSh 50 – KSh 110 / task",
    icon: Database,
  },
  {
    title: "Image Transcription",
    description:
      "Read scanned notices, handwritten delivery notes, and signs and type them accurately.",
    rewardRange: "KSh 60 – KSh 95 / task",
    icon: ImageIcon,
  },
  {
    title: "Document Processing",
    description:
      "Convert raw meeting notes or drafts into neatly structured Word or PDF documents.",
    rewardRange: "KSh 80 – KSh 150 / task",
    icon: FileSpreadsheet,
  },
  {
    title: "Information Extraction",
    description:
      "Extract email addresses, phone contacts, and company names from business directories.",
    rewardRange: "KSh 55 – KSh 90 / task",
    icon: Sparkles,
  },
  {
    title: "Text Formatting",
    description:
      "Standardize product descriptions, headings, bullet points, and capitalization rules.",
    rewardRange: "KSh 65 – KSh 120 / task",
    icon: FileText,
  },
  {
    title: "Research Tasks",
    description:
      "Verify county postal codes, business sectors, and public directory details.",
    rewardRange: "KSh 45 – KSh 85 / task",
    icon: Search,
  },
];

const FAQS = [
  {
    question: "How much does it cost to join Wingpoll?",
    answer:
      "Creating an account on Wingpoll is 100% free. Simply register with your details, browse available microtasks, and start submitting work for review.",
  },
  {
    question: "What equipment do I need to complete tasks?",
    answer:
      "Most tasks such as Email Extraction, Image Transcription, and Simple Research can be completed using a standard smartphone or basic laptop with internet access.",
  },
  {
    question: "How long does task review take?",
    answer:
      "Submitted tasks are reviewed by quality moderators within 2 to 12 hours. Once approved, the KSh reward moves immediately from Pending Earnings to your Available Balance.",
  },
  {
    question: "How do M-Pesa withdrawals work?",
    answer:
      "Once your Available Balance reaches at least KSh 300, go to the Withdrawals page, enter the amount and your Safaricom M-Pesa phone number, and confirm your payout.",
  },
  {
    question: "How does the referral program work?",
    answer:
      "Every registered user gets a unique referral code and link. When a friend signs up with your link and completes their first 3 approved tasks, you earn a KSh 50 referral reward.",
  },
];

export default function HomePage() {
  const { tasks } = useApp();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const previewTasks = tasks.filter((t) => t.active).slice(0, 4);

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <Navbar />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="bg-white border-b border-slate-200 py-14 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Left Column */}
              <div className="lg:col-span-7 space-y-6">
                <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-slate-900 leading-[1.15]">
                  Turn Your Free Time{" "}
                  <span className="text-[#16A34A]">Into Rewards.</span>
                </h1>

                <p className="text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed">
                  Complete simple digital tasks—from image transcription and
                  email extraction to structured data entry—using your phone or
                  computer. Get paid reliably in Kenyan Shillings via M-Pesa.
                </p>

                <div className="flex flex-wrap items-center gap-3.5 pt-2">
                  <Link
                    href="/register"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-[#16A34A] hover:bg-[#15803d] rounded-md shadow-xs transition-colors"
                  >
                    <span>Get Started</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/dashboard/tasks"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-slate-800 bg-white hover:bg-slate-50 border border-slate-300 rounded-md transition-colors"
                  >
                    <span>Explore Tasks</span>
                  </Link>
                </div>

                {/* Key Trust Indicators */}
                <div className="pt-4 grid grid-cols-3 gap-4 border-t border-slate-100 max-w-lg">
                  <div>
                    <p className="text-lg font-bold text-slate-900">KSh 300</p>
                    <p className="text-xs text-slate-500">Min. M-Pesa Payout</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-slate-900">50–150</p>
                    <p className="text-xs text-slate-500">KSh Per Microtask</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-[#16A34A]">Instant</p>
                    <p className="text-xs text-slate-500">Mobile Withdrawals</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS SECTION */}
        <section id="how-it-works" className="py-16 border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#16A34A]">
                Simple 5-Step Process
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
                How Wingpoll Works
              </h2>
              <p className="text-sm text-slate-600 mt-2">
                Designed for anyone with basic computer or smartphone skills. No
                complex bidding or long proposals required.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {HOW_IT_WORKS_STEPS.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.step}
                    className="bg-white border border-slate-200 rounded-lg p-5 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-9 h-9 rounded-md bg-[#F0FDF4] border border-emerald-100 text-[#16A34A] flex items-center justify-center">
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-mono font-bold text-slate-400">
                          STEP {item.step}
                        </span>
                      </div>
                      <h3 className="text-sm font-semibold text-slate-900 mb-1.5">
                        {item.title}
                      </h3>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* TASK CATEGORIES SECTION */}
        <section
          id="available-tasks"
          className="py-16 bg-white border-b border-slate-200"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#16A34A]">
                  Digital Microtasks
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
                  Task Categories
                </h2>
                <p className="text-sm text-slate-600 mt-1 max-w-xl">
                  Choose from a variety of structured microtasks tailored to
                  your skills and available time.
                </p>
              </div>
              <Link
                href="/dashboard/tasks"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#16A34A] hover:text-[#14532D]"
              >
                <span>Browse All Available Tasks</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {LANDING_CATEGORIES.map((cat) => {
                const Icon = cat.icon;
                return (
                  <div
                    key={cat.title}
                    className="bg-[#F8FAFC] border border-slate-200 rounded-lg p-5 hover:border-emerald-300 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-9 h-9 rounded-md bg-white border border-slate-200 text-[#16A34A] flex items-center justify-center">
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-semibold text-[#14532D] bg-[#F0FDF4] px-2.5 py-1 rounded border border-emerald-200">
                        {cat.rewardRange}
                      </span>
                    </div>
                    <h3 className="text-base font-semibold text-slate-900 mb-1">
                      {cat.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {cat.description}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Live Marketplace Preview */}
            <div className="pt-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-slate-900">
                  Featured Live Tasks on Wingpoll
                </h3>
                <Link
                  href="/dashboard/tasks"
                  className="text-xs font-semibold text-[#16A34A] hover:underline"
                >
                  View all {tasks.length} tasks →
                </Link>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {previewTasks.map((task) => (
                  <div
                    key={task.id}
                    className="bg-white border border-slate-200 rounded-lg p-4 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-[11px] font-medium px-2 py-0.5 bg-slate-100 text-slate-700 rounded">
                          {task.category}
                        </span>
                        <span className="text-xs font-bold text-[#16A34A]">
                          KSh {task.reward}
                        </span>
                      </div>
                      <h4 className="text-xs font-semibold text-slate-900 mb-1 line-clamp-1">
                        {task.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 line-clamp-2 mb-3">
                        {task.shortDescription}
                      </p>
                    </div>
                    <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                      <span className="inline-flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {task.estimatedTime}
                      </span>
                      <Link
                        href={`/dashboard/tasks/${task.id}`}
                        className="font-semibold text-[#16A34A] hover:text-[#14532D]"
                      >
                        Start Task →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Homepage Sponsored Ad Slot */}
            <AdvertisementBanner position="homepage_promo" />
          </div>
        </section>

        {/* EARNINGS, REFERRALS & WITHDRAWALS EXPLANATION */}
        <section id="about-us" className="py-16 border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* 1. Earnings Explanation */}
              <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-3">
                <div className="w-10 h-10 rounded-md bg-[#F0FDF4] border border-emerald-200 text-[#16A34A] flex items-center justify-center">
                  <Award className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  Transparent Task Earnings
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Task rewards vary depending on task complexity, estimated
                  time, and accuracy requirements. Every task clearly displays
                  its exact KSh reward upfront before you begin.
                </p>
                <ul className="space-y-2 pt-2 text-xs text-slate-700">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0" />
                    <span>Simple Research & Sorting: KSh 45 – KSh 75</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0" />
                    <span>Image & Receipt Data Entry: KSh 65 – KSh 95</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0" />
                    <span>Document & PDF Formatting: KSh 95 – KSh 150</span>
                  </li>
                </ul>
              </div>

              {/* 2. Referral Section */}
              <div className="bg-[#F0FDF4] border border-emerald-200 rounded-lg p-6 space-y-3">
                <div className="w-10 h-10 rounded-md bg-[#16A34A] text-white flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-[#14532D]">
                  Referral Rewards Program
                </h3>
                <p className="text-xs text-slate-700 leading-relaxed">
                  Invite friends using your personal referral code or link and
                  earn commission bonuses when they become active contributors on
                  the platform.
                </p>
                <ul className="space-y-2 pt-2 text-xs text-[#14532D]">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0" />
                    <span>Earn KSh 50 per qualified referred user</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0" />
                    <span>Reward unlocks after friend completes 3 tasks</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0" />
                    <span>Real-time referral tracking in your dashboard</span>
                  </li>
                </ul>
              </div>

              {/* 3. Withdrawal Section */}
              <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-3">
                <div className="w-10 h-10 rounded-md bg-[#F0FDF4] border border-emerald-200 text-[#16A34A] flex items-center justify-center">
                  <Smartphone className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">
                  Fast M-Pesa Withdrawals
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Access your earnings easily once your available balance
                  reaches our low minimum threshold of{" "}
                  <strong>KSh 300</strong>. Payouts are sent straight to your
                  Kenyan M-Pesa number.
                </p>
                <ul className="space-y-2 pt-2 text-xs text-slate-700">
                  <li className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#16A34A] shrink-0" />
                    <span>Minimum withdrawal threshold: KSh 300</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#16A34A] shrink-0" />
                    <span>Supported method: Safaricom M-Pesa</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#16A34A] shrink-0" />
                    <span>Full transaction history & reference receipts</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ SECTION */}
        <section className="py-16 bg-white border-b border-slate-200">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#16A34A]">
                Got Questions?
              </span>
              <h2 className="text-2xl font-bold text-slate-900 mt-1">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="space-y-3">
              {FAQS.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div
                    key={idx}
                    className="border border-slate-200 rounded-lg overflow-hidden"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="w-full px-5 py-4 text-left bg-white hover:bg-slate-50 flex items-center justify-between gap-4 cursor-pointer"
                    >
                      <span className="text-sm font-semibold text-slate-900">
                        {faq.question}
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 text-slate-500 transition-transform ${isOpen ? "rotate-180 text-[#16A34A]" : ""
                          }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-4 pt-1 text-xs text-slate-600 leading-relaxed bg-slate-50/50 border-t border-slate-100">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-white border-t border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-slate-100">
            <div className="space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-md bg-[#16A34A] flex items-center justify-center text-white font-bold text-base">
                  W
                </div>
                <span className="text-base font-bold text-slate-900">
                  wing<span className="text-[#16A34A]">poll</span>
                </span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Clean, reliable digital microtask platform empowering earners to
                complete simple online tasks and withdraw rewards via M-Pesa.
              </p>
            </div>

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 mb-3">
                Platform
              </h4>
              <ul className="space-y-2 text-xs text-slate-600">
                <li>
                  <Link href="/#about-us" className="hover:text-[#16A34A]">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/#how-it-works" className="hover:text-[#16A34A]">
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard/tasks" className="hover:text-[#16A34A]">
                    Available Tasks
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="hover:text-[#16A34A]">
                    Earner Dashboard
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 mb-3">
                Legal & Policies
              </h4>
              <ul className="space-y-2 text-xs text-slate-600">
                <li>
                  <Link href="/dashboard/help" className="hover:text-[#16A34A]">
                    Terms and Conditions
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard/help" className="hover:text-[#16A34A]">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/admin" className="hover:text-[#16A34A]">
                    Admin Portal
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 mb-3">
                Support
              </h4>
              <ul className="space-y-2 text-xs text-slate-600">
                <li>
                  <Link href="/dashboard/help" className="hover:text-[#16A34A]">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard/help" className="hover:text-[#16A34A]">
                    Contact Us (support@wingpoll.co.ke)
                  </Link>
                </li>
                <li className="text-slate-400">Nairobi, Kenya</li>
              </ul>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
            <p>© 2026 Wingpoll Microtask Platform. Frontend UI Demonstration.</p>
            <p className="text-slate-400">
              All balances and M-Pesa transactions shown are simulated demo data.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
