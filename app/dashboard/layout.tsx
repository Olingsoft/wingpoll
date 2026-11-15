"use client";

import React, { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Loader2,
  LogOut,
  MailCheck,
  RefreshCw,
  Send,
  ShieldAlert,
} from "lucide-react";
import { Sidebar } from "@/components/Sidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";
import { StatusBadge } from "@/components/StatusBadge";
import { useApp } from "@/context/AppContext";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const {
    user,
    firebaseUser,
    emailVerified,
    authLoading,
    logoutUser,
    resendEmailVerification,
    refreshEmailVerification,
    refreshUserProfile,
  } = useApp();
  const [bannerNotice, setBannerNotice] = useState<string | null>(null);
  const [isCheckingApproval, setIsCheckingApproval] = useState(false);

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

  const handleCheckApprovalStatus = async () => {
    setIsCheckingApproval(true);
    setBannerNotice(null);
    try {
      const updated = await refreshUserProfile();
      if (updated?.status === "Active") {
        setBannerNotice("Your account has been approved! Loading dashboard...");
      } else {
        setBannerNotice(
          "Your account is still awaiting admin approval. Please check back shortly."
        );
      }
    } finally {
      setIsCheckingApproval(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
        <div className="bg-white border border-slate-200 rounded-lg p-8 max-w-sm w-full text-center space-y-3 shadow-xs">
          <Loader2 className="w-7 h-7 text-[#16A34A] animate-spin mx-auto" />
          <p className="text-sm font-semibold text-slate-800">
            Loading Your Account...
          </p>
        </div>
      </div>
    );
  }

  // Step 1 Gate: Non-admin users MUST verify their email address first
  if (firebaseUser && user.role !== "admin" && !emailVerified) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
        <div className="bg-white border border-slate-200 rounded-lg p-6 sm:p-8 max-w-lg w-full space-y-5 shadow-xs">
          {/* 2-Step Onboarding Progress Indicator */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-2 px-3 py-2 rounded-md border font-semibold bg-amber-50 border-amber-300 text-amber-900">
              <span className="w-5 h-5 rounded-full bg-amber-500 text-white text-[11px] font-bold flex items-center justify-center shrink-0">
                1
              </span>
              <span>1. Verify Email</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-2 rounded-md border font-semibold bg-slate-50 border-slate-200 text-slate-400">
              <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-600 text-[11px] font-bold flex items-center justify-center shrink-0">
                2
              </span>
              <span>2. Admin Activation</span>
            </div>
          </div>

          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-full bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto">
              <MailCheck className="w-7 h-7" />
            </div>
            <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
              Step 1 of 2: Email Verification Required
            </span>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900">
              Verify Your Email Address
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              We sent a verification link to{" "}
              <strong className="text-slate-900">
                {firebaseUser.email || user.email}
              </strong>
              . Please click the link in your inbox (or spam folder) to verify
              your email before proceeding to admin account activation.
            </p>
          </div>

          {bannerNotice && (
            <div className="p-3 rounded-md bg-[#F0FDF4] border border-emerald-200 text-xs font-semibold text-[#14532D] text-center">
              {bannerNotice}
            </div>
          )}

          <div className="space-y-2.5 pt-1">
            <button
              type="button"
              onClick={handleQuickRefresh}
              className="w-full py-2.5 px-4 bg-[#16A34A] hover:bg-[#15803d] text-white text-xs font-semibold rounded-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>I&apos;ve Verified My Email — Continue</span>
            </button>

            <div className="flex flex-col sm:flex-row items-center gap-2.5">
              <button
                type="button"
                onClick={handleQuickResend}
                className="w-full sm:flex-1 py-2.5 px-4 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-md flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Resend Verification Email</span>
              </button>
              <button
                type="button"
                onClick={async () => {
                  await logoutUser();
                  router.push("/login");
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Step 2 Gate: After email is verified, gate non-admin users whose account is Pending Approval, Suspended, or Rejected
  if (
    firebaseUser &&
    user.role !== "admin" &&
    user.status !== "Active"
  ) {
    const isPending = user.status === "Pending Approval";
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
        <div className="bg-white border border-slate-200 rounded-lg p-6 sm:p-8 max-w-lg w-full space-y-5 shadow-xs">
          {/* 2-Step Onboarding Progress Indicator */}
          {isPending && (
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-2 px-3 py-2 rounded-md border font-semibold bg-[#F0FDF4] border-emerald-300 text-[#14532D]">
                <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0" />
                <span>1. Email Verified ✓</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 rounded-md border font-semibold bg-amber-50 border-amber-300 text-amber-900">
                <span className="w-5 h-5 rounded-full bg-amber-500 text-white text-[11px] font-bold flex items-center justify-center shrink-0">
                  2
                </span>
                <span>2. Admin Activation</span>
              </div>
            </div>
          )}

          <div className="text-center space-y-2">
            <div
              className={`w-14 h-14 rounded-full flex items-center justify-center mx-auto border ${
                isPending
                  ? "bg-amber-50 border-amber-200 text-amber-600"
                  : "bg-red-50 border-red-200 text-red-600"
              }`}
            >
              {isPending ? (
                <Clock className="w-7 h-7" />
              ) : (
                <ShieldAlert className="w-7 h-7" />
              )}
            </div>
            <div className="flex justify-center pt-1">
              <StatusBadge status={user.status} size="md" />
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900">
              {isPending
                ? "Step 2 of 2: Waiting for Admin Account Activation"
                : `Account ${user.status}`}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {isPending ? (
                <>
                  Hello <strong>{user.name}</strong>! Your email is verified.
                  Your WingPoll earner account is now waiting for an
                  administrator to activate your account before you can access
                  the dashboard and start earning.
                </>
              ) : (
                <>
                  Your account (<strong>{user.email}</strong>) is currently{" "}
                  <strong>{user.status}</strong>. Please contact WingPoll
                  support for assistance.
                </>
              )}
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-slate-500">Full Name:</span>
              <span className="font-semibold text-slate-900">{user.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Email Address:</span>
              <span className="font-semibold text-slate-900">{user.email}</span>
            </div>
            {user.phone && (
              <div className="flex justify-between">
                <span className="text-slate-500">M-Pesa Phone:</span>
                <span className="font-mono font-semibold text-slate-900">
                  {user.phone}
                </span>
              </div>
            )}
            {user.referredByCode && (
              <div className="flex justify-between">
                <span className="text-slate-500">Referred By Code:</span>
                <span className="font-mono font-bold text-[#14532D]">
                  {user.referredByCode}
                </span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-slate-500">Step 1 (Email Verification):</span>
              <span className="font-semibold text-[#16A34A]">
                Verified ✓
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Step 2 (Admin Activation):</span>
              <span className="font-semibold text-amber-700">
                {user.status}
              </span>
            </div>
          </div>

          {bannerNotice && (
            <div className="p-3 rounded-md bg-[#F0FDF4] border border-emerald-200 text-xs font-semibold text-[#14532D] text-center">
              {bannerNotice}
            </div>
          )}

          <div className="flex flex-col sm:flex-row items-center gap-2.5 pt-1">
            <button
              type="button"
              onClick={handleCheckApprovalStatus}
              disabled={isCheckingApproval}
              className="w-full sm:flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-[#16A34A] hover:bg-[#15803d] rounded-md cursor-pointer disabled:opacity-60"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${
                  isCheckingApproval ? "animate-spin" : ""
                }`}
              />
              <span>
                {isCheckingApproval
                  ? "Checking Activation Status..."
                  : "Check Admin Activation Status"}
              </span>
            </button>
            <button
              type="button"
              onClick={async () => {
                await logoutUser();
                router.push("/login");
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

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
