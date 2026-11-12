"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, CheckCircle2, Mail } from "lucide-react";
import { Navbar } from "@/components/Navbar";

const forgotSchema = z.object({
  email: z.string().email("Please enter the email address linked to your account."),
});

type ForgotFormValues = z.infer<typeof forgotSchema>;

export default function ForgotPasswordPage() {
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotFormValues>({
    resolver: zodResolver(forgotSchema),
    defaultValues: {
      email: "john@example.com",
    },
  });

  const onSubmit = (data: ForgotFormValues) => {
    setSubmittedEmail(data.email);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <Navbar />

      <main className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6">
        <div className="max-w-md w-full bg-white border border-slate-200 rounded-lg p-6 sm:p-8 shadow-xs">
          <div className="text-center mb-6">
            <div className="w-10 h-10 rounded-md bg-[#F0FDF4] border border-emerald-200 text-[#16A34A] font-bold flex items-center justify-center mx-auto mb-3">
              W
            </div>
            <h1 className="text-xl font-bold text-slate-900">
              Reset Your Password
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Enter your registered email address and we will send password
              recovery instructions.
            </p>
          </div>

          {submittedEmail ? (
            <div className="space-y-4">
              <div className="p-4 rounded-md bg-[#F0FDF4] border border-emerald-200 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#16A34A] shrink-0 mt-0.5" />
                <div className="text-xs text-[#14532D] space-y-1">
                  <p className="font-semibold">Recovery Link Sent!</p>
                  <p>
                    We have sent password reset instructions to{" "}
                    <strong>{submittedEmail}</strong>. Please check your inbox
                    or spam folder.
                  </p>
                </div>
              </div>
              <Link
                href="/login"
                className="w-full py-2.5 px-4 bg-[#16A34A] hover:bg-[#15803d] text-white text-xs font-semibold rounded-md transition-colors flex items-center justify-center gap-2"
              >
                <span>Return to Login</span>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Registered Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    placeholder="john@example.com"
                    {...register("email")}
                    className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:bg-white focus:border-[#16A34A]"
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-red-600 mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-[#16A34A] hover:bg-[#15803d] text-white text-sm font-semibold rounded-md transition-colors cursor-pointer"
              >
                Send Reset Instructions
              </button>
            </form>
          )}

          <div className="mt-6 pt-5 border-t border-slate-100 text-center">
            <Link
              href="/login"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-[#16A34A]"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Login</span>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

