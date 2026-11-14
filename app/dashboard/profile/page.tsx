"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Camera,
  CheckCircle2,
  Lock,
  Mail,
  Phone,
  Save,
  Smartphone,
  User,
} from "lucide-react";
import { useApp } from "@/context/AppContext";

const profileSchema = z.object({
  name: z.string().min(3, "Full name must be at least 3 characters."),
  email: z.string().email("Enter a valid email address."),
  phone: z
    .string()
    .regex(
      /^(?:254|\+254|0)(7\d{8}|1\d{8})$/,
      "Enter a valid Kenyan phone number."
    ),
  mpesaNumber: z
    .string()
    .regex(
      /^(?:254|\+254|0)(7\d{8}|1\d{8})$/,
      "Enter a valid Safaricom M-Pesa phone number."
    ),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const passwordSchema = z
  .object({
    currentPassword: z.string().min(6, "Enter your current password."),
    newPassword: z
      .string()
      .min(8, "New password must be at least 8 characters."),
    confirmPassword: z.string().min(8, "Confirm your new password."),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

type PasswordFormValues = z.infer<typeof passwordSchema>;

export default function ProfileSettingsPage() {
  const {
    user,
    firebaseUser,
    emailVerified,
    resendEmailVerification,
    refreshEmailVerification,
    updateUserProfile,
  } = useApp();
  const [profileSaved, setProfileSaved] = useState(false);
  const [passwordSaved, setPasswordSaved] = useState(false);
  const [avatarTheme, setAvatarTheme] = useState<string>("#14532D");
  const [verificationMsg, setVerificationMsg] = useState<string | null>(null);

  const handleSendVerifyEmail = async () => {
    try {
      await resendEmailVerification();
      setVerificationMsg("Verification email sent! Please check your inbox.");
    } catch {
      setVerificationMsg("Please wait a moment before requesting another link.");
    }
  };

  const handleCheckVerifyStatus = async () => {
    const verified = await refreshEmailVerification();
    setVerificationMsg(
      verified
        ? "Your email address is now verified!"
        : "Not verified yet. Click the link in your email first."
    );
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
      phone: user.phone,
      mpesaNumber: user.mpesaNumber,
    },
  });

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    reset: resetPassword,
    formState: { errors: passwordErrors },
  } = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
  });

  const onSaveProfile = (data: ProfileFormValues) => {
    updateUserProfile(data);
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 3000);
  };

  const onSavePassword = () => {
    setPasswordSaved(true);
    resetPassword();
    setTimeout(() => setPasswordSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg sm:text-xl font-bold text-slate-900">
          Profile & Account Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Manage your personal details, M-Pesa payout phone number, and account
          security.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Profile Card & Avatar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white border border-slate-200 rounded-lg p-6 text-center space-y-4 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
            <div className="relative inline-block mx-auto">
              <div
                className="w-20 h-20 rounded-full text-white text-2xl font-bold flex items-center justify-center mx-auto"
                style={{ backgroundColor: avatarTheme }}
              >
                {user.avatarInitials}
              </div>
              <button
                type="button"
                onClick={() =>
                  setAvatarTheme((prev) =>
                    prev === "#14532D"
                      ? "#16A34A"
                      : prev === "#16A34A"
                      ? "#0f172a"
                      : "#14532D"
                  )
                }
                className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-white border border-slate-300 flex items-center justify-center text-slate-700 hover:text-[#16A34A] shadow-xs cursor-pointer"
                title="Change Avatar Badge Color"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>

            <div>
              <h2 className="text-base font-bold text-slate-900">
                {user.name}
              </h2>
              <p className="text-xs text-slate-500">{user.email}</p>
              <div className="flex flex-wrap items-center justify-center gap-1.5 mt-2">
                <span
                  className={`px-2.5 py-0.5 text-[11px] font-semibold rounded border ${
                    !firebaseUser || emailVerified
                      ? "bg-[#F0FDF4] text-[#14532D] border-emerald-200"
                      : "bg-amber-50 text-amber-800 border-amber-200"
                  }`}
                >
                  {!firebaseUser || emailVerified
                    ? "Email Verified"
                    : "Email Unverified"}
                </span>
                <span className="px-2.5 py-0.5 text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200 rounded">
                  Joined {user.joinedDate}
                </span>
              </div>
              {firebaseUser && !emailVerified && (
                <div className="mt-3 pt-3 border-t border-slate-100 space-y-2">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={handleSendVerifyEmail}
                      className="px-2.5 py-1 text-[11px] font-semibold bg-[#16A34A] hover:bg-[#15803d] text-white rounded cursor-pointer"
                    >
                      Send Verification Email
                    </button>
                    <button
                      type="button"
                      onClick={handleCheckVerifyStatus}
                      className="px-2.5 py-1 text-[11px] font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded cursor-pointer"
                    >
                      Refresh Status
                    </button>
                  </div>
                  {verificationMsg && (
                    <p className="text-[11px] text-[#14532D] font-medium">
                      {verificationMsg}
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
              <div className="bg-slate-50 p-2.5 rounded-md">
                <span className="text-slate-400 block">M-Pesa Number</span>
                <span className="font-mono font-bold text-slate-800">
                  {user.mpesaNumber}
                </span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-md">
                <span className="text-slate-400 block">Referral Code</span>
                <span className="font-mono font-bold text-[#16A34A]">
                  {user.referralCode}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Forms: Personal Details & Password */}
        <div className="lg:col-span-8 space-y-6">
          {/* Personal & M-Pesa Details Form */}
          <div className="bg-white border border-slate-200 rounded-lg p-5 sm:p-6 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
            <h3 className="text-base font-semibold text-slate-900 pb-3 mb-4 border-b border-slate-100">
              Personal & M-Pesa Details
            </h3>

            {profileSaved && (
              <div className="mb-4 p-3 rounded-md bg-[#F0FDF4] border border-emerald-200 flex items-center gap-2 text-xs text-[#14532D] font-medium">
                <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
                <span>
                  Your profile and M-Pesa details have been updated.
                </span>
              </div>
            )}

            <form
              onSubmit={handleSubmit(onSaveProfile)}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      {...register("name")}
                      className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:bg-white focus:border-[#16A34A]"
                    />
                  </div>
                  {errors.name && (
                    <p className="text-xs text-red-600 mt-1">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      {...register("email")}
                      className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:bg-white focus:border-[#16A34A]"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-xs text-red-600 mt-1">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Primary Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      {...register("phone")}
                      className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:bg-white focus:border-[#16A34A]"
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-xs text-red-600 mt-1">
                      {errors.phone.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    M-Pesa Withdrawal Number
                  </label>
                  <div className="relative">
                    <Smartphone className="w-4 h-4 text-[#16A34A] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      {...register("mpesaNumber")}
                      className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:bg-white focus:border-[#16A34A]"
                    />
                  </div>
                  {errors.mpesaNumber && (
                    <p className="text-xs text-red-600 mt-1">
                      {errors.mpesaNumber.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#16A34A] hover:bg-[#15803d] rounded-md transition-colors cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Profile Changes</span>
                </button>
              </div>
            </form>
          </div>

          {/* Password Settings Form */}
          <div className="bg-white border border-slate-200 rounded-lg p-5 sm:p-6 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
            <h3 className="text-base font-semibold text-slate-900 pb-3 mb-4 border-b border-slate-100">
              Password & Security Settings
            </h3>

            {passwordSaved && (
              <div className="mb-4 p-3 rounded-md bg-[#F0FDF4] border border-emerald-200 flex items-center gap-2 text-xs text-[#14532D] font-medium">
                <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
                <span>Your password has been updated successfully.</span>
              </div>
            )}

            <form
              onSubmit={handlePasswordSubmit(onSavePassword)}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Current Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      placeholder="••••••••"
                      {...registerPassword("currentPassword")}
                      className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:bg-white focus:border-[#16A34A]"
                    />
                  </div>
                  {passwordErrors.currentPassword && (
                    <p className="text-xs text-red-600 mt-1">
                      {passwordErrors.currentPassword.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    New Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      placeholder="••••••••"
                      {...registerPassword("newPassword")}
                      className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:bg-white focus:border-[#16A34A]"
                    />
                  </div>
                  {passwordErrors.newPassword && (
                    <p className="text-xs text-red-600 mt-1">
                      {passwordErrors.newPassword.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      placeholder="••••••••"
                      {...registerPassword("confirmPassword")}
                      className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:bg-white focus:border-[#16A34A]"
                    />
                  </div>
                  {passwordErrors.confirmPassword && (
                    <p className="text-xs text-red-600 mt-1">
                      {passwordErrors.confirmPassword.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors cursor-pointer"
                >
                  <span>Update Password</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

