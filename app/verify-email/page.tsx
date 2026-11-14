"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Loader2,
  LogOut,
  MailCheck,
  RefreshCw,
  Send,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { useApp } from "@/context/AppContext";
import { getFirebaseAuthErrorMessage } from "@/lib/firebase";

export default function VerifyEmailPage() {
  const router = useRouter();
  const {
    user,
    firebaseUser,
    emailVerified,
    refreshEmailVerification,
    resendEmailVerification,
    logoutUser,
  } = useApp();

  const [checkingStatus, setCheckingStatus] = useState(false);
  const [resending, setResending] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "warning" | "error";
    text: string;
  } | null>(null);

  const targetEmail = firebaseUser?.email || user.email;

  const handleCheckVerified = async () => {
    setStatusMessage(null);
    setCheckingStatus(true);
    try {
      const isNowVerified = await refreshEmailVerification();
      if (isNowVerified) {
        setStatusMessage({
          type: "success",
          text: "Email verified! Redirecting to your dashboard...",
        });
        setTimeout(() => {
          router.push("/dashboard");
        }, 900);
      } else {
        setStatusMessage({
          type: "warning",
          text: "Your email is not verified yet. Please click the verification link in your inbox (or spam folder) and try again.",
        });
      }
    } catch (error) {
      setStatusMessage({
        type: "error",
        text: getFirebaseAuthErrorMessage(error),
      });
    } finally {
      setCheckingStatus(false);
    }
  };

  const handleResendEmail = async () => {
    setStatusMessage(null);
    setResending(true);
    try {
      await resendEmailVerification();
      setStatusMessage({
        type: "success",
        text: `A fresh verification link has been sent to ${targetEmail}.`,
      });
    } catch (error) {
      setStatusMessage({
        type: "error",
        text: getFirebaseAuthErrorMessage(error),
      });
    } finally {
      setResending(false);
    }
  };

  const handleSwitchAccount = async () => {
    await logoutUser();
    router.push("/login");
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <Navbar />

      <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6">
        <div className="max-w-md w-full bg-white border border-slate-200 rounded-lg p-6 sm:p-8 shadow-xs">
          <div className="text-center mb-6">
            <div className="w-14 h-14 rounded-full bg-[#F0FDF4] border border-emerald-200 flex items-center justify-center mx-auto mb-3 text-[#16A34A]">
              <MailCheck className="w-7 h-7" />
            </div>
            <h1 className="text-xl font-bold text-slate-900">
              Verify Your Email Address
            </h1>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
              We sent a verification link to{" "}
              <strong className="text-slate-800">{targetEmail}</strong>. Please
              verify your email to secure your WingPoll account and M-Pesa
              withdrawals.
            </p>
          </div>

          {emailVerified && (
            <div className="mb-5 p-4 rounded-md bg-[#F0FDF4] border border-emerald-200 flex items-center gap-3 text-xs text-[#14532D]">
              <CheckCircle2 className="w-5 h-5 text-[#16A34A] shrink-0" />
              <div>
                <p className="font-semibold">Your email is verified!</p>
                <p className="text-[11px] text-emerald-800 mt-0.5">
                  You have full access to all microtasks and M-Pesa payouts.
                </p>
              </div>
            </div>
          )}

          {statusMessage && (
            <div
              className={`mb-5 p-3.5 rounded-md border flex items-start gap-2.5 text-xs ${
                statusMessage.type === "success"
                  ? "bg-[#F0FDF4] border-emerald-200 text-[#14532D]"
                  : statusMessage.type === "warning"
                  ? "bg-amber-50 border-amber-200 text-amber-900"
                  : "bg-red-50 border-red-200 text-red-700"
              }`}
            >
              {statusMessage.type === "success" ? (
                <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              )}
              <span>{statusMessage.text}</span>
            </div>
          )}

          {/* Instructions Box */}
          <div className="mb-6 bg-slate-50 border border-slate-200 rounded-md p-4 space-y-2 text-xs text-slate-600">
            <p className="font-semibold text-slate-800">Next Steps:</p>
            <ol className="list-decimal list-inside space-y-1.5">
              <li>
                Open your email inbox for <strong>{targetEmail}</strong>.
              </li>
              <li>
                Click the verification link in the email from{" "}
                <strong>WingPoll (Firebase)</strong>.
              </li>
              <li>
                Come back here and click{" "}
                <strong>&ldquo;I&apos;ve Verified My Email&rdquo;</strong> below.
              </li>
            </ol>
          </div>

          <div className="space-y-3">
            <button
              type="button"
              onClick={handleCheckVerified}
              disabled={checkingStatus || resending}
              className="w-full py-2.5 px-4 bg-[#16A34A] hover:bg-[#15803d] text-white text-sm font-semibold rounded-md transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {checkingStatus ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Checking Verification Status...</span>
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4" />
                  <span>I&apos;ve Verified My Email — Continue</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleResendEmail}
              disabled={resending || checkingStatus}
              className="w-full py-2.5 px-4 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs font-semibold rounded-md transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              {resending ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Sending Verification Link...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5 text-[#16A34A]" />
                  <span>Resend Verification Email</span>
                </>
              )}
            </button>
          </div>

          <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1 font-semibold text-[#16A34A] hover:underline"
            >
              <span>Skip to Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <button
              type="button"
              onClick={handleSwitchAccount}
              className="inline-flex items-center gap-1.5 text-slate-500 hover:text-red-600 font-medium cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Use Different Email</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

