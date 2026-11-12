"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Briefcase,
  ClipboardCheck,
  CreditCard,
  HelpCircle,
  History,
  LayoutDashboard,
  LogOut,
  ShieldCheck,
  TrendingUp,
  User,
  Users,
  X,
} from "lucide-react";

interface SidebarProps {
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

const NAV_ITEMS = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Available Tasks", href: "/dashboard/tasks", icon: Briefcase },
  {
    label: "My Submissions",
    href: "/dashboard/submissions",
    icon: ClipboardCheck,
  },
  { label: "Earnings", href: "/dashboard/earnings", icon: TrendingUp },
  { label: "Referrals", href: "/dashboard/referrals", icon: Users },
  { label: "Withdrawals", href: "/dashboard/withdrawals", icon: CreditCard },
  {
    label: "Transaction History",
    href: "/dashboard/transactions",
    icon: History,
  },
  { label: "Profile", href: "/dashboard/profile", icon: User },
  { label: "Help & Support", href: "/dashboard/help", icon: HelpCircle },
];

export function Sidebar({ mobileOpen, onCloseMobile }: SidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-50 h-screen w-64 bg-white border-r border-slate-200 flex flex-col transition-transform duration-200 lg:sticky lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo bar */}
        <div className="h-16 px-5 border-b border-slate-200 flex items-center justify-between shrink-0">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-md bg-[#16A34A] flex items-center justify-center text-white font-bold text-base">
              W
            </div>
            <div>
              <span className="text-base font-bold tracking-tight text-slate-900 leading-none block">
                wing<span className="text-[#16A34A]">poll</span>
              </span>
              <span className="text-[10px] font-medium text-slate-400">
                EARNER PORTAL
              </span>
            </div>
          </Link>
          <button
            type="button"
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 text-slate-400 hover:text-slate-600 rounded-md"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <div className="px-2.5 pb-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Workspace
          </div>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onCloseMobile}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-xs font-medium transition-colors ${
                  active
                    ? "bg-[#F0FDF4] text-[#14532D] font-semibold border border-emerald-200/70"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 ${
                    active ? "text-[#16A34A]" : "text-slate-400"
                  }`}
                />
                <span>{item.label}</span>
              </Link>
            );
          })}

          <div className="pt-4 mt-4 border-t border-slate-100">
            <div className="px-2.5 pb-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Platform Demo
            </div>
            <Link
              href="/admin"
              onClick={onCloseMobile}
              className="flex items-center gap-3 px-3 py-2.5 rounded-md text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            >
              <ShieldCheck className="w-4 h-4 text-[#14532D]" />
              <span>Admin Dashboard</span>
            </Link>
          </div>
        </div>

        {/* Bottom Logout */}
        <div className="p-3 border-t border-slate-200 bg-slate-50/50">
          <Link
            href="/login"
            onClick={onCloseMobile}
            className="flex items-center gap-3 px-3 py-2 rounded-md text-xs font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </Link>
        </div>
      </aside>
    </>
  );
}

