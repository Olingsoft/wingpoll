"use client";

import React, { Suspense, useEffect, useState } from "react";
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

  const isPrivilegedRole =
    user.role === "admin" || user.role === "agent-admin";

  // Redirect unauthenticated users to /login, and unverified non-admin users strictly to /verify-email
  useEffect(() => {
    if (authLoading) return;
    if (!firebaseUser) {
      router.replace("/login");
      return;
    }
    if (!isPrivilegedRole && !emailVerified) {
      router.replace("/verify-email");
    }
  }, [authLoading, firebaseUser, isPrivilegedRole, emailVerified, router]);

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

  if (authLoading || !firebaseUser) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
        <div className="bg-white border border-slate-200 rounded-lg p-8 max-w-sm w-full text-center space-y-3 shadow-xs">
          <Loader2 className="w-7 h-7 text-[#16A34A] animate-spin mx-auto" />
          <p className="text-sm font-semibold text-slate-800">
            {authLoading ? "Loading Your Account..." : "Redirecting to Login..."}
          </p>
        </div>
      </div>
    );
  }

  // Step 1 Gate: Non-admin users MUST verify their email address on /verify-email first (never stay on /dashboard)
  if (!isPrivilegedRole && !emailVerified) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
        <div className="bg-white border border-slate-200 rounded-lg p-8 max-w-sm w-full text-center space-y-3 shadow-xs">
          <Loader2 className="w-7 h-7 text-[#16A34A] animate-spin mx-auto" />
          <p className="text-sm font-semibold text-slate-800">
            Redirecting to Email Verification...
          </p>
        </div>
      </div>
    );
  }

  const isPendingApproval =
    firebaseUser && !isPrivilegedRole && user.status !== "Active";
  const isPending = user.status === "Pending Approval";

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

        {/* Top Approval Banner when email is verified but account is still waiting for Admin approval */}
        {isPendingApproval && (
          <div className="bg-amber-50 border-b border-amber-200 px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3 text-xs text-amber-900">
            <div className="flex items-center gap-2.5">
              {isPending ? (
                <Clock className="w-4 h-4 text-amber-600 shrink-0" />
              ) : (
                <ShieldAlert className="w-4 h-4 text-red-600 shrink-0" />
              )}
              <span>
                {isPending ? (
                  <>
                    <strong>Account Waiting for Admin Approval:</strong> Your
                    email is verified, and an administrator will activate your
                    account shortly.
                  </>
                ) : (
                  <>
                    <strong>Account {user.status}:</strong> Please contact
                    WingPoll support for assistance.
                  </>
                )}
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
                onClick={handleCheckApprovalStatus}
                disabled={isCheckingApproval}
                className="px-3 py-1.5 rounded bg-[#16A34A] hover:bg-[#15803d] text-white font-semibold inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
              >
                <RefreshCw
                  className={`w-3.5 h-3.5 ${
                    isCheckingApproval ? "animate-spin" : ""
                  }`}
                />
                <span>
                  {isCheckingApproval ? "Checking..." : "Check Approval Status"}
                </span>
              </button>
            </div>
          </div>
        )}

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
          {isPendingApproval ? (
            <div className="max-w-xl mx-auto mt-6 bg-white border border-slate-200 rounded-lg p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-slate-900">
                      {isPending
                        ? "Awaiting Admin Approval"
                        : `Account ${user.status}`}
                    </h2>
                    <p className="text-xs text-slate-500">{user.email}</p>
                  </div>
                </div>
                <StatusBadge status={user.status} />
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                {isPending
                  ? "Your email address is verified. Tasks, submissions, and withdrawal features will appear here automatically once an administrator approves your account."
                  : `Your account is currently ${user.status}. Please contact WingPoll support for assistance.`}
              </p>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                <span className="inline-flex items-center gap-1 text-[#16A34A] font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Email Verified
                </span>
                <button
                  type="button"
                  onClick={async () => {
                    await logoutUser();
                    router.push("/login");
                  }}
                  className="inline-flex items-center gap-1.5 text-slate-600 hover:text-red-600 font-semibold cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          ) : (
            <Suspense fallback={<LoadingSkeleton rows={3} variant="card" />}>
              {children}
            </Suspense>
          )}
        </main>
      </div>
    </div>
  );
}
