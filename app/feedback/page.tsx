"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CheckCircle2, ChevronRight, MessageSquarePlus } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function FeedbackPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState("Feature Suggestion");
  const [rating, setRating] = useState("5 - Excellent");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <Navbar />

      <main className="flex-1">
        <section className="bg-white border-b border-slate-200 py-12 sm:py-16">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
            <nav
              aria-label="Breadcrumb"
              className="flex items-center gap-1.5 text-xs text-slate-500"
            >
              <Link href="/" className="hover:text-[#16A34A]">
                Home
              </Link>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-medium text-slate-700">Feedback</span>
            </nav>

            <span className="inline-block px-3 py-1 rounded-md bg-[#F0FDF4] border border-emerald-200 text-xs font-semibold text-[#14532D]">
              Community
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
              Share Your Feedback
            </h1>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Help us make WingPoll better. Tell us what works well, what feels
              confusing, or what new task categories and features you would love
              to see next.
            </p>
          </div>
        </section>

        <section className="py-12">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white border border-slate-200 rounded-lg p-6 sm:p-8 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
              {submitted ? (
                <div className="text-center py-8 space-y-4">
                  <div className="w-12 h-12 rounded-full bg-[#F0FDF4] border border-emerald-200 text-[#16A34A] flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Thank You for Your Feedback!
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
                    Your input helps our team improve WingPoll for every earner
                    and reviewer across Kenya.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false);
                      setMessage("");
                    }}
                    className="px-4 py-2 text-xs font-semibold bg-[#16A34A] hover:bg-[#15803d] text-white rounded-md cursor-pointer"
                  >
                    Send Another Note
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                    <MessageSquarePlus className="w-5 h-5 text-[#16A34A]" />
                    <h2 className="text-base font-bold text-slate-900">
                      Feedback Form
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Your Name (Optional)
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Faith Wanjiku"
                        className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:bg-white focus:border-[#16A34A]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Email Address (Optional)
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:bg-white focus:border-[#16A34A]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Feedback Topic
                      </label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-md"
                      >
                        <option>Feature Suggestion</option>
                        <option>Task Experience</option>
                        <option>Withdrawal &amp; Payouts</option>
                        <option>Bug Report</option>
                        <option>General Praise</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Overall Experience
                      </label>
                      <select
                        value={rating}
                        onChange={(e) => setRating(e.target.value)}
                        className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-md"
                      >
                        <option>5 - Excellent</option>
                        <option>4 - Good</option>
                        <option>3 - Fair</option>
                        <option>2 - Needs Improvement</option>
                        <option>1 - Poor</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Your Feedback *
                    </label>
                    <textarea
                      rows={5}
                      required
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Share your thoughts, ideas, or suggestions..."
                      className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:bg-white focus:border-[#16A34A]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-5 py-2.5 text-xs font-semibold bg-[#16A34A] hover:bg-[#15803d] text-white rounded-md cursor-pointer"
                  >
                    Submit Feedback
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

