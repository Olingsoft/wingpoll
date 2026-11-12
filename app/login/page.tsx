"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, Lock, Mail, UserCheck } from "lucide-react";
import { Navbar } from "@/components/Navbar";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "john@example.com",
      password: "password123",
    },
  });

  const onSubmit = () => {
    router.push("/dashboard");
  };

  const handleQuickDemoLogin = () => {
    setValue("email", "john@example.com");
    setValue("password", "password123");
    router.push("/dashboard");
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
              Welcome Back to Wingpoll
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Log in to browse microtasks and manage your M-Pesa earnings
            </p>
          </div>

          {/* Demo Account Quick Fill */}
          <div className="mb-5 p-3.5 rounded-md bg-[#F0FDF4] border border-emerald-200 flex items-center justify-between gap-3">
            <div className="text-xs text-[#14532D]">
              <p className="font-semibold">Demo Account: John Kamau</p>
              <p className="text-[11px] text-emerald-800">
                john@example.com • Balance: KSh 450
              </p>
            </div>
            <button
              type="button"
              onClick={handleQuickDemoLogin}
              className="px-3 py-1.5 text-xs font-semibold bg-[#16A34A] text-white rounded hover:bg-[#15803d] inline-flex items-center gap-1 shrink-0 cursor-pointer"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Instant Demo</span>
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email Address
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

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700">
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs font-medium text-[#16A34A] hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  placeholder="••••••••"
                  {...register("password")}
                  className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:bg-white focus:border-[#16A34A]"
                />
              </div>
              {errors.password && (
                <p className="text-xs text-red-600 mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-[#16A34A] hover:bg-[#15803d] text-white text-sm font-semibold rounded-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Log In to Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-600">
            <span>
              New to Wingpoll?{" "}
              <Link
                href="/register"
                className="font-semibold text-[#16A34A] hover:underline"
              >
                Create account
              </Link>
            </span>
            <Link
              href="/admin"
              className="font-medium text-slate-500 hover:text-slate-800"
            >
              Admin Portal →
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

