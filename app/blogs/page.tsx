"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Calendar,
  Clock,
  Search,
  User,
  X,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  content: string[];
}

const BLOG_POSTS: BlogPost[] = [
  {
    id: "blog-1",
    title:
      "How to Achieve a 98% Approval Rate on Image Transcription & Email Extraction Tasks",
    excerpt:
      "Learn the simple verification habits top WingPoll contributors use to make sure every submission passes quality review on the first try.",
    category: "Task Tips",
    author: "WingPoll Quality Team",
    date: "10 Nov 2026",
    readTime: "4 min read",
    content: [
      "Image transcription and email extraction are among the most popular tasks on WingPoll because they can be completed quickly from either a laptop or a smartphone.",
      "1. Always Download and Zoom In: Before typing your entries, download the full-resolution attachment so you don't misread similar characters like 'rn' vs 'm' or '0' vs 'O' in email domains.",
      "2. Follow Line-by-Line Order: Enter extracted records from top to bottom as they appear on the scanned page. This helps moderators verify your submission much faster.",
      "3. Double-Check Domain Extensions: Many Kenyan directory scans include '.co.ke', '.or.ke', and '.ac.ke' addresses. Take 30 seconds before hitting Submit to review your list.",
    ],
  },
  {
    id: "blog-2",
    title:
      "Step-by-Step Guide: Formatting Raw Meeting Notes into Clean PDF Documents",
    excerpt:
      "Document formatting and PDF creation tasks pay some of the highest rewards on the platform (up to KSh 120–150). Here is how to structure them cleanly.",
    category: "Document Formatting",
    author: "Grace Wanjiku",
    date: "06 Nov 2026",
    readTime: "5 min read",
    content: [
      "PDF Creation and Document Formatting tasks offer higher KSh rewards because they turn messy raw notes into polished documents ready for business use.",
      "1. Use Consistent Headings: Start with a clear Document Title, Date, and Attendance list at the top of the page.",
      "2. Convert Long Paragraphs into Bullet Points: When formatting product catalogs or committee notes, use clean bulleted lists for specifications and action items.",
      "3. Export Directly to A4 PDF: Whether you use Microsoft Word, Google Docs, or WPS Office on your phone, use the 'Export as PDF' option so fonts and spacing remain intact.",
    ],
  },
  {
    id: "blog-3",
    title:
      "Understanding WingPoll M-Pesa Withdrawals and Referral Commissions",
    excerpt:
      "Everything you need to know about pending vs. available balances, the KSh 300 withdrawal threshold, and earning KSh 50 per referred friend.",
    category: "Earnings & Payouts",
    author: "WingPoll Support",
    date: "01 Nov 2026",
    readTime: "3 min read",
    content: [
      "When you submit a task on WingPoll, its reward is immediately reflected in your Pending Earnings while our moderators verify your work.",
      "Once approved, the reward moves directly into your Available Balance. As soon as your Available Balance reaches KSh 300 or more, you can head to the Withdrawals tab and request an M-Pesa transfer.",
      "Want to boost your balance faster? Share your unique referral link from the Referrals page. Every time a friend registers with your code and completes their first 3 approved tasks, KSh 50 is credited to your account.",
    ],
  },
  {
    id: "blog-4",
    title:
      "5 Everyday Smartphone Skills That Help You Complete Structured Table Entry Faster",
    excerpt:
      "Completing supermarket receipt and SME directory categorization tasks accurately using your mobile browser or desktop.",
    category: "Productivity",
    author: "David Kiptoo",
    date: "25 Oct 2026",
    readTime: "4 min read",
    content: [
      "Structured table tasks ask you to read rows from a receipt or CSV batch and enter each column (such as Item Description, Quantity, and Unit Price in KSh).",
      "1. Verify Totals Row by Row: Check that Quantity multiplied by Unit Price matches the Total column before adding the next row.",
      "2. Keep Capitalization Uniform: If the instructions ask for Title Case or UPPERCASE item names, apply the same style across every row.",
      "3. Use the Reviewer Notes Field: If a receipt scan has a faded digit, mention it briefly in the optional notes box so the moderator knows you inspected it carefully.",
    ],
  },
  {
    id: "blog-5",
    title:
      "Avoiding Common Reasons for 'Revision Required' on Microtask Submissions",
    excerpt:
      "What happens when a moderator requests a correction on your submission, and how to quickly revise and get your reward approved.",
    category: "Task Tips",
    author: "WingPoll Quality Team",
    date: "18 Oct 2026",
    readTime: "3 min read",
    content: [
      "Occasionally, you may see a 'Revision Required' status on your submission in the My Submissions tab. Don't worry—this means your work is close to approval and just needs a small fix.",
      "Click 'View Details' on the submission row to read the moderator's exact feedback (for example, a missing bullet point on item 9 or a typo in a waybill number).",
      "Then click the 'Revise' button to open the task, update your entry, and resubmit for approval.",
    ],
  },
  {
    id: "blog-6",
    title:
      "How Kenyan SMEs Use Microtask Contributors to Digitize Paper Records",
    excerpt:
      "A closer look at where WingPoll tasks come from—from retail receipts and logistics waybills to county business directories.",
    category: "Platform Updates",
    author: "Editorial Desk",
    date: "10 Oct 2026",
    readTime: "5 min read",
    content: [
      "Across Kenya, thousands of businesses still rely on printed delivery notes, physical receipts, and paper directories.",
      "By splitting digitizing projects into bite-sized microtasks on WingPoll, companies get fast, human-verified digital spreadsheets while thousands of contributors earn rewards from home.",
    ],
  },
];

const CATEGORIES = [
  "All",
  "Task Tips",
  "Document Formatting",
  "Earnings & Payouts",
  "Productivity",
  "Platform Updates",
];

export default function BlogsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [activePost, setActivePost] = useState<BlogPost | null>(null);

  const filteredPosts = BLOG_POSTS.filter((post) => {
    const matchesCat =
      selectedCategory === "All" || post.category === selectedCategory;
    const matchesSearch =
      !searchQuery.trim() ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <Navbar />

      <main className="flex-1">
        {/* Header */}
        <section className="bg-white border-b border-slate-200 py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#F0FDF4] border border-emerald-200 text-xs font-semibold text-[#14532D]">
              <BookOpen className="w-3.5 h-3.5 text-[#16A34A]" />
              WingPoll Earner Blog & Guides
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">
              Tips, Guides & Platform Insights
            </h1>
            <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto">
              Learn how to complete digital assignments faster, improve your
              submission approval accuracy, and maximize your M-Pesa earnings.
            </p>
          </div>
        </section>

        {/* Filter & Search Bar */}
        <section className="py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="bg-white border border-slate-200 rounded-lg p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
              <div className="flex items-center gap-1.5 flex-wrap">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                      selectedCategory === cat
                        ? "bg-[#16A34A] text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="relative w-full md:w-72">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search articles..."
                  className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:bg-white focus:border-[#16A34A]"
                />
              </div>
            </div>

            {/* Blog Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map((post) => (
                <article
                  key={post.id}
                  className="bg-white border border-slate-200 rounded-lg p-5 flex flex-col justify-between hover:border-emerald-300 transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.03)]"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="px-2.5 py-0.5 rounded bg-[#F0FDF4] text-[#14532D] border border-emerald-200 font-semibold">
                        {post.category}
                      </span>
                      <span className="inline-flex items-center gap-1 text-slate-400">
                        <Clock className="w-3.5 h-3.5" />
                        {post.readTime}
                      </span>
                    </div>

                    <h2 className="text-base font-bold text-slate-900 leading-snug">
                      {post.title}
                    </h2>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {post.excerpt}
                    </p>
                  </div>

                  <div className="pt-4 mt-5 border-t border-slate-100 flex items-center justify-between text-xs">
                    <div className="text-slate-500">
                      <span className="font-medium text-slate-700 block">
                        {post.author}
                      </span>
                      <span className="text-[11px]">{post.date}</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => setActivePost(post)}
                      className="inline-flex items-center gap-1 font-semibold text-[#16A34A] hover:text-[#14532D] cursor-pointer"
                    >
                      <span>Read Article</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Article Reader Modal */}
      {activePost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-[1px] p-4">
          <div className="bg-white border border-slate-200 rounded-lg shadow-lg max-w-2xl w-full overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded bg-[#F0FDF4] text-[#14532D] border border-emerald-200 text-xs font-semibold">
                {activePost.category}
              </span>
              <button
                type="button"
                onClick={() => setActivePost(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-md cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <h2 className="text-xl font-bold text-slate-900">
                {activePost.title}
              </h2>

              <div className="flex items-center gap-4 text-xs text-slate-500 pb-3 border-b border-slate-100">
                <span className="inline-flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-[#16A34A]" />
                  {activePost.author}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-[#16A34A]" />
                  {activePost.date}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#16A34A]" />
                  {activePost.readTime}
                </span>
              </div>

              <div className="space-y-3 text-sm text-slate-700 leading-relaxed">
                {activePost.content.map((para, idx) => (
                  <p key={idx}>{para}</p>
                ))}
              </div>
            </div>

            <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <Link
                href="/register"
                className="text-xs font-semibold text-[#16A34A] hover:underline"
              >
                Start Earning on WingPoll →
              </Link>
              <button
                type="button"
                onClick={() => setActivePost(null)}
                className="px-4 py-1.5 text-xs font-semibold bg-slate-900 text-white rounded-md cursor-pointer"
              >
                Close Article
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

