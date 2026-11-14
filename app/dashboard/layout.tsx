"use client";

import React, { Suspense, useState } from "react";
import Link from "next/link";
import { AlertCircle, CheckCircle2, MailCheck, RefreshCw } from "lucide-react";
import { Sidebar } from "@/components/Sidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import { useApp } from "@/context/AppContext";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const {
    firebaseUser,
    emailVerified,
    resendEmailVerification,
    refreshEmailVerification,
  } = useApp();
  const [bannerNotice, setBannerNotice] = useState<string | null>(null);

  const handleQuickResend = async () => {
    try {
      await resendEmailVerification();
      setBannerNotice("Verification link sent! Check your email inbox.");
    } catch {
      setBannerNotice("Please wait a moment before requesting another link.");
    }
  };

  const handleQuickRefresh = async () => {
    const verified = await refreshEmailVerification();
    if (verified) {
      setBannerNotice("Email verified!");
    } else {
      setBannerNotice("Not verified yet. Click the link in your email first.");
    }
  };

  return (
    <div className="min-h-screen flex bg-[#F8FAFC]">
      <Suspense
        fallback={
          <aside className="hidden lg:block w-64 bg-white border-r border-slate-200 h-screen shrink-0" />
        }
      >
        <Sidebar
          mobileOpen={mobileSidebarOpen}
          onCloseMobile={() => setMobileSidebarOpen(false)}
        />
      </Suspense>

      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader
          onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
        />

        {/* Email Verification Reminder Banner for Unverified Firebase Users */}
        {firebaseUser && !emailVerified && (
          <div className="bg-amber-50 border-b border-amber-200 px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs text-amber-900">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                Please verify your email address (
                <strong>{firebaseUser.email}</strong>) to unlock full M-Pesa
                withdrawal privileges.
              </span>
              {bannerNotice && (
                <span className="font-semibold text-[#14532D] bg-[#F0FDF4] border border-emerald-200 px-2 py-0.5 rounded">
                  {bannerNotice}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleQuickResend}
                className="px-2.5 py-1 rounded bg-white border border-amber-300 hover:bg-amber-100 text-amber-900 font-semibold cursor-pointer"
              >
                Resend Email
              </button>
              <button
                type="button"
                onClick={handleQuickRefresh}
                className="px-2.5 py-1 rounded bg-[#16A34A] hover:bg-[#15803d] text-white font-semibold inline-flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                <span>I&apos;ve Verified</span>
              </button>
              <Link
                href="/verify-email"
                className="inline-flex items-center gap-1 font-semibold text-amber-900 underline hover:text-amber-700 ml-1"
              >
                <MailCheck className="w-3.5 h-3.5" />
                <span>Details</span>
              </Link>
            </div>
          </div>
        )}

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Suspense fallback={<LoadingSkeleton rows={3} variant="card" />}>
            {children}
          </Suspense>
        </main>
      </div>
    </div>
  );
}
