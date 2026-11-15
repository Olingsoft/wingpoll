"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  LogOut,
  MailCheck,
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
    verifyEmailWithCode,
    refreshUserProfile,
    logoutUser,
  } = useApp();

  const [checkingStatus, setCheckingStatus] = useState(false);
  const [resending, setResending] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: "success" | "warning" | "error";
    text: string;
  } | null>(null);

  const targetEmail = firebaseUser?.email || user.email;

  // Redirect to /dashboard as soon as email is verified
  useEffect(() => {
    if (!firebaseUser || !emailVerified) return;
    if (user.role === "admin") {
      router.replace("/admin");
    } else {
      router.replace("/dashboard");
    }
  }, [firebaseUser, emailVerified, user.role, router]);

  // Process ?oobCode=... if the user clicked a direct verification link
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const oobCode = params.get("oobCode");

    if (oobCode) {
      setCheckingStatus(true);
      verifyEmailWithCode(oobCode)
        .then(async () => {
          await refreshUserProfile();
          router.replace("/dashboard");
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
    }
  }, [verifyEmailWithCode, refreshUserProfile, router]);

  // Silently check Firebase Auth in the background so the Continue button enables once verified
  useEffect(() => {
    if (!firebaseUser || emailVerified) return;

    const checkVerification = async () => {
      try {
        const verified = await refreshEmailVerification();
        if (verified) {
          await refreshUserProfile();
        }
      } catch {
        // Ignore background check errors
      }
    };

    const interval = setInterval(checkVerification, 3000);
    window.addEventListener("focus", checkVerification);
    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", checkVerification);
    };
  }, [firebaseUser, emailVerified, refreshEmailVerification, refreshUserProfile]);

  const handleContinue = async () => {
    setStatusMessage(null);
    setCheckingStatus(true);
    try {
      const isNowVerified = await refreshEmailVerification();
      if (isNowVerified) {
        const updatedProfile = await refreshUserProfile();
        if (updatedProfile?.role === "admin") {
          router.push("/admin");
        } else {
          router.push("/dashboard");
        }
      } else {
        setStatusMessage({
          type: "warning",
          text: "Please click the verification link sent to your email first.",
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
        <div className="max-w-md w-full bg-white border border-slate-200 rounded-lg p-6 sm:p-8 shadow-xs space-y-5">
          <div className="text-center">
            <div className="w-14 h-14 rounded-full bg-[#F0FDF4] border border-emerald-200 flex items-center justify-center mx-auto mb-3 text-[#16A34A]">
              <MailCheck className="w-7 h-7" />
            </div>
            <h1 className="text-xl font-bold text-slate-900">
              Verify Your Email Address
            </h1>
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
              We sent a verification link to{" "}
              <strong className="text-slate-800">{targetEmail}</strong>{" "}
              Please verify your email first — once verified, your account will
              proceed to Admin activation.
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

          <div className="space-y-3">
            <button
              type="button"
              onClick={handleContinue}
              disabled={!emailVerified || checkingStatus || resending}
              className="w-full py-2.5 px-4 bg-[#16A34A] hover:bg-[#15803d] text-white text-sm font-semibold rounded-md transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {checkingStatus ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Continuing...</span>
                </>
              ) : (
                <span>Continue</span>
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
