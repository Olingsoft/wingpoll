"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  KeyRound,
  Loader2,
  LogOut,
  MailCheck,
  RefreshCw,
  Send,
  ShieldCheck,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { StatusBadge } from "@/components/StatusBadge";
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
    verifyEmailWithCode,
    refreshUserProfile,
    logoutUser,
  } = useApp();

  const [checkingStatus, setCheckingStatus] = useState(false);
  const [resending, setResending] = useState(false);
  const [manualCodeOrLink, setManualCodeOrLink] = useState("");
  const [verifyingCode, setVerifyingCode] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "warning" | "error";
    text: string;
  } | null>(null);

  const targetEmail = firebaseUser?.email || user.email;

  // Automatically process ?oobCode=... or ?verified=true when user returns from email link on wingpoll.co.ke
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const oobCode = params.get("oobCode");
    const verifiedFlag = params.get("verified");

    if (oobCode) {
      setCheckingStatus(true);
      verifyEmailWithCode(oobCode)
        .then(async () => {
          await refreshUserProfile();
          setStatusMessage({
            type: "success",
            text: "Step 1 Complete: Email verified! Now waiting for Admin to activate your account.",
          });
        })
        .catch((err) => {
          setStatusMessage({
            type: "error",
            text: getFirebaseAuthErrorMessage(err),
          });
        })
        .finally(() => {
          setCheckingStatus(false);
        });
    } else if (verifiedFlag === "true") {
      refreshEmailVerification().then((verified) => {
        if (verified) {
          refreshUserProfile();
          setStatusMessage({
            type: "success",
            text: "Step 1 Complete: Email verified! Now waiting for Admin to activate your account.",
          });
        }
      });
    }
  }, [verifyEmailWithCode, refreshEmailVerification, refreshUserProfile]);

  // Auto-poll verification status every 5s and on window focus while unverified
  useEffect(() => {
    if (!firebaseUser || emailVerified) return;

    const checkSilently = async () => {
      try {
        const isNowVerified = await refreshEmailVerification();
        if (isNowVerified) {
          await refreshUserProfile();
          setStatusMessage({
            type: "success",
            text: "Step 1 Complete: Email verified! Now waiting for Admin to activate your account.",
          });
        }
      } catch {
        // Ignore background poll errors
      }
    };

    const interval = setInterval(checkSilently, 5000);
    window.addEventListener("focus", checkSilently);
    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", checkSilently);
    };
  }, [firebaseUser, emailVerified, refreshEmailVerification, refreshUserProfile]);

  const handleVerifyCodeOrLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualCodeOrLink.trim()) return;
    setStatusMessage(null);
    setVerifyingCode(true);
    try {
      await verifyEmailWithCode(manualCodeOrLink);
      await refreshUserProfile();
      setManualCodeOrLink("");
      setStatusMessage({
        type: "success",
        text: "Step 1 Complete: Email verified via code/link! Now waiting for Admin to activate your account.",
      });
    } catch (error) {
      setStatusMessage({
        type: "error",
        text: getFirebaseAuthErrorMessage(error),
      });
    } finally {
      setVerifyingCode(false);
    }
  };

  const handleCheckVerified = async () => {
    setStatusMessage(null);
    setCheckingStatus(true);
    try {
      const isNowVerified = await refreshEmailVerification();
      if (isNowVerified) {
        const updatedProfile = await refreshUserProfile();
        if (updatedProfile?.role === "admin") {
          router.push("/admin");
          return;
        }
        if (updatedProfile?.status === "Active") {
          setStatusMessage({
            type: "success",
            text: "Email verified and account is active! Redirecting to dashboard...",
          });
          setTimeout(() => {
            router.push("/dashboard");
          }, 800);
        } else {
          setStatusMessage({
            type: "success",
            text: "Step 1 Complete: Email verified! Now waiting for Admin to activate your account.",
          });
          setTimeout(() => {
            router.push("/dashboard");
          }, 1200);
        }
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

  const handleCheckAdminActivation = async () => {
    setStatusMessage(null);
    setCheckingStatus(true);
    try {
      const updated = await refreshUserProfile();
      if (updated?.status === "Active") {
        setStatusMessage({
          type: "success",
          text: "Your account has been activated by Admin! Redirecting to dashboard...",
        });
        setTimeout(() => {
          router.push("/dashboard");
        }, 700);
      } else {
        setStatusMessage({
          type: "warning",
          text: "Your email is verified, and your account is currently awaiting Admin activation. Please check back shortly.",
        });
      }
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
        <div className="max-w-md w-full bg-white border border-slate-200 rounded-lg p-6 sm:p-8 shadow-xs space-y-5">
          {/* 2-Step Onboarding Progress Indicator */}
          <div className="grid grid-cols-2 gap-2 p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs">
            <div
              className={`flex items-center gap-2 px-3 py-2 rounded-md font-semibold ${
                emailVerified
                  ? "bg-[#F0FDF4] text-[#14532D] border border-emerald-200"
                  : "bg-[#16A34A] text-white"
              }`}
            >
              {emailVerified ? (
                <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0" />
              ) : (
                <span className="w-4 h-4 rounded-full bg-white text-[#14532D] text-[10px] font-bold flex items-center justify-center shrink-0">
                  1
                </span>
              )}
              <span>1. Verify Email</span>
            </div>

            <div
              className={`flex items-center gap-2 px-3 py-2 rounded-md font-semibold ${
                emailVerified && user.status === "Active"
                  ? "bg-[#F0FDF4] text-[#14532D] border border-emerald-200"
                  : emailVerified
                  ? "bg-amber-50 text-amber-900 border border-amber-200"
                  : "text-slate-400"
              }`}
            >
              <span className="w-4 h-4 rounded-full bg-slate-200 text-slate-700 text-[10px] font-bold flex items-center justify-center shrink-0">
                2
              </span>
              <span>2. Admin Activation</span>
            </div>
          </div>

          {!emailVerified ? (
            <>
              <div className="text-center">
                <div className="w-14 h-14 rounded-full bg-[#F0FDF4] border border-emerald-200 flex items-center justify-center mx-auto mb-3 text-[#16A34A]">
                  <MailCheck className="w-7 h-7" />
                </div>
                <span className="inline-block px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-200 mb-2">
                  Step 1 of 2 • Email Verification Required
                </span>
                <h1 className="text-xl font-bold text-slate-900">
                  Verify Your Email Address
                </h1>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                  We sent a verification link to{" "}
                  <strong className="text-slate-800">{targetEmail}</strong>.
                  Please verify your email first — once verified, your account
                  will proceed to Admin activation.
                </p>
              </div>

              {statusMessage && (
                <div
                  className={`p-3.5 rounded-md border flex items-start gap-2.5 text-xs ${
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
              <div className="bg-slate-50 border border-slate-200 rounded-md p-4 space-y-2 text-xs text-slate-600">
                <p className="font-semibold text-slate-800">
                  How to complete Step 1 on wingpoll.co.ke:
                </p>
                <ol className="list-decimal list-inside space-y-1.5">
                  <li>
                    Open your email inbox (and check <strong>Spam / Junk</strong>) for{" "}
                    <strong>{targetEmail}</strong>.
                  </li>
                  <li>
                    Click the verification link in the email, <strong>OR</strong> copy
                    and paste the verification link / code (`oobCode`) below.
                  </li>
                  <li>
                    Once verified, your page will automatically advance to{" "}
                    <strong>Step 2: Admin Account Activation</strong>.
                  </li>
                </ol>
              </div>

              {/* Paste Verification Code or Link Form */}
              <form
                onSubmit={handleVerifyCodeOrLink}
                className="bg-slate-50 border border-slate-200 rounded-md p-3.5 space-y-2"
              >
                <label className="block text-xs font-semibold text-slate-700">
                  Paste Verification Code or Link from Email (Optional)
                </label>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <KeyRound className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={manualCodeOrLink}
                      onChange={(e) => setManualCodeOrLink(e.target.value)}
                      placeholder="Paste verification code or link..."
                      className="w-full pl-8 pr-3 py-2 text-xs bg-white border border-slate-300 rounded-md focus:outline-none focus:border-[#16A34A]"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={verifyingCode || !manualCodeOrLink.trim()}
                    className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-md cursor-pointer disabled:opacity-50 shrink-0"
                  >
                    {verifyingCode ? "Verifying..." : "Verify Code"}
                  </button>
                </div>
              </form>

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
                      <span>Checking Email Verification...</span>
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
            </>
          ) : (
            /* Step 2: Email is Verified -> Now wait for Admin Account Activation */
            <>
              <div className="text-center">
                <div className="w-14 h-14 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto mb-3 text-amber-600">
                  {user.status === "Active" ? (
                    <ShieldCheck className="w-7 h-7 text-[#16A34A]" />
                  ) : (
                    <Clock className="w-7 h-7" />
                  )}
                </div>
                <div className="flex justify-center gap-2 mb-2">
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-bold bg-[#F0FDF4] text-[#14532D] border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3 text-[#16A34A]" />
                    Email Verified
                  </span>
                  <StatusBadge status={user.status} />
                </div>
                <h1 className="text-xl font-bold text-slate-900">
                  {user.status === "Active"
                    ? "Account Activated!"
                    : "Waiting for Admin Account Activation"}
                </h1>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                  {user.status === "Active" ? (
                    "Your email is verified and your account has been activated by Admin."
                  ) : (
                    <>
                      Great job verifying{" "}
                      <strong className="text-slate-800">{targetEmail}</strong>!
                      Your account is now in the queue waiting for an
                      administrator to activate it.
                    </>
                  )}
                </p>
              </div>

              {statusMessage && (
                <div
                  className={`p-3.5 rounded-md border flex items-start gap-2.5 text-xs ${
                    statusMessage.type === "success"
                      ? "bg-[#F0FDF4] border-emerald-200 text-[#14532D]"
                      : "bg-amber-50 border-amber-200 text-amber-900"
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{statusMessage.text}</span>
                </div>
              )}

              <button
                type="button"
                onClick={handleCheckAdminActivation}
                disabled={checkingStatus}
                className="w-full py-2.5 px-4 bg-[#16A34A] hover:bg-[#15803d] text-white text-sm font-semibold rounded-md transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                {checkingStatus ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Checking Activation Status...</span>
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4" />
                    <span>Check Admin Activation Status</span>
                  </>
                )}
              </button>
            </>
          )}

          <div className="pt-4 border-t border-slate-100 flex items-center justify-center text-xs">
            <button
              type="button"
              onClick={handleSwitchAccount}
              className="inline-flex items-center gap-1.5 text-slate-500 hover:text-red-600 font-medium cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out / Use Different Email</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

