"use client";

import React from "react";
import Link from "next/link";
import { Calendar, Menu, Wallet } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { NotificationDropdown } from "./NotificationDropdown";

interface DashboardHeaderProps {
  onOpenMobileSidebar: () => void;
}

export function DashboardHeader({ onOpenMobileSidebar }: DashboardHeaderProps) {
  const { user } = useApp();

  const formattedDate = new Date().toLocaleDateString("en-KE", {
    weekday: "long",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <header className="sticky top-0 z-30 h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenMobileSidebar}
          className="lg:hidden p-2 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          aria-label="Open Navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-sm sm:text-base font-semibold text-slate-900">
            Welcome back, {user.name.split(" ")[0]}
          </h1>
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>{formattedDate}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Quick Wallet Pill */}
        <Link
          href="/dashboard/withdrawals"
          className="hidden sm:inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#F0FDF4] border border-emerald-200 text-xs font-semibold text-[#14532D] hover:bg-emerald-100 transition-colors"
        >
          <Wallet className="w-3.5 h-3.5 text-[#16A34A]" />
          <span>Balance: KSh {user.availableBalance.toLocaleString()}</span>
        </Link>

        {/* Notifications */}
        <NotificationDropdown />

        {/* User Profile Pill */}
        <Link
          href="/dashboard/profile"
          className="flex items-center gap-2.5 pl-2 pr-2.5 py-1 rounded-md hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-colors"
        >
          {user.photoURL ? (
            <img
              src={user.photoURL}
              alt={user.name}
              referrerPolicy="no-referrer"
              className="w-8 h-8 rounded-full object-cover border border-emerald-200"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-[#14532D] text-white text-xs font-bold flex items-center justify-center">
              {user.avatarInitials}
            </div>
          )}
          <div className="hidden md:block text-left">
            <p className="text-xs font-semibold text-slate-900 leading-none">
              {user.name}
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {user.email || user.phone}
            </p>
          </div>
        </Link>
      </div>
    </header>
  );
}

