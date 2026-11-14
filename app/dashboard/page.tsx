"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import { StatsCard } from "@/components/StatsCard";
import { EarningsChart } from "@/components/EarningsChart";
import { TransactionTable } from "@/components/TransactionTable";
import { TaskCard } from "@/components/TaskCard";
import { AdvertisementBanner } from "@/components/AdvertisementBanner";
import { StatusBadge } from "@/components/StatusBadge";

export default function DashboardOverviewPage() {
  const { user, tasks, transactions, submissions, referrals } = useApp();

  const previewTasks = tasks.filter((t) => t.active).slice(0, 3);
  const userSubmissions = submissions
    .filter((s) => s.userId === user.id)
    .slice(0, 4);
  const userTransactions = transactions.filter(
    (t) => !t.userId || t.userId === user.id
  );
  const userReferrals = referrals.filter(
    (r) => !r.referrerId || r.referrerId === user.id
  );

  return (
    <div className="space-y-6">
      {/* Top Sponsored Dashboard Banner */}
      <AdvertisementBanner position="dashboard_banner" />

      {/* 4 Overview Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Available Balance"
          value={`KSh ${user.availableBalance.toLocaleString()}`}
          subtitle="Min. withdrawal: KSh 300"
          trend={
            user.availableBalance >= 300
              ? "Eligible for M-Pesa"
              : "Below threshold"
          }
          icon={<Wallet className="w-5 h-5" />}
          highlighted
        />
        <StatsCard
          title="Total Earnings"
          value={`KSh ${user.totalEarnings.toLocaleString()}`}
          subtitle={`Tasks: KSh ${user.taskEarnings.toLocaleString()} • Referrals: KSh ${user.referralEarnings}`}
          icon={<TrendingUp className="w-5 h-5" />}
        />
        <StatsCard
          title="Pending Earnings"
          value={`KSh ${user.pendingEarnings.toLocaleString()}`}
          subtitle="Tasks under quality review"
          icon={<Clock className="w-5 h-5" />}
        />
        <StatsCard
          title="Completed Tasks"
          value={`${user.completedTasks}`}
          subtitle="94% approval accuracy"
          trend="+3 this week"
          icon={<CheckCircle2 className="w-5 h-5" />}
        />
      </div>

      {/* Chart + Recent Activity & Referral Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <EarningsChart />
        </div>

        {/* Right Column: Referral Performance Summary + Recent Activity */}
        <div className="lg:col-span-4 space-y-6">
          {/* Referral Performance Summary Card */}
          <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-md bg-[#F0FDF4] text-[#16A34A] flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">
                    Referral Performance
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Code: <strong className="font-mono">{user.referralCode}</strong>
                  </p>
                </div>
              </div>
              <Link
                href="/dashboard/referrals"
                className="text-xs font-semibold text-[#16A34A] hover:underline"
              >
                Manage →
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-3 my-3">
              <div className="bg-slate-50 border border-slate-200 rounded-md p-3">
                <span className="text-[11px] text-slate-500 block">
                  Total Referrals
                </span>
                <span className="text-lg font-bold text-slate-900">
                  {user.totalReferrals}
                </span>
              </div>
              <div className="bg-[#F0FDF4] border border-emerald-200 rounded-md p-3">
                <span className="text-[11px] text-[#14532D] block">
                  Referral Earnings
                </span>
                <span className="text-lg font-bold text-[#14532D]">
                  KSh {user.referralEarnings}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-500">
              {userReferrals.filter((r) => r.status === "Active").length} active
              referrals •{" "}
              {
                userReferrals.filter((r) => r.status === "Pending First Task")
                  .length
              }{" "}
              pending first tasks
            </p>
          </div>

          {/* Recent Activity Feed */}
          <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-slate-900">
                Recent Submissions Activity
              </h3>
              <Link
                href="/dashboard/submissions"
                className="text-xs font-semibold text-[#16A34A] hover:underline"
              >
                View all
              </Link>
            </div>

            <div className="space-y-3">
              {userSubmissions.map((sub) => (
                <div
                  key={sub.id}
                  className="flex items-center justify-between gap-2 pb-2.5 border-b border-slate-100 last:border-0 last:pb-0"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-800 truncate">
                      {sub.taskTitle}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      {sub.submittedAt} • KSh {sub.reward}
                    </p>
                  </div>
                  <StatusBadge status={sub.status} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Available Tasks Preview */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-slate-900">
              Available Tasks For You
            </h2>
            <p className="text-xs text-slate-500">
              Pick a digital microtask, follow the instructions, and earn KSh
              rewards
            </p>
          </div>
          <Link
            href="/dashboard/tasks"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#16A34A] hover:text-[#14532D]"
          >
            <span>Browse All Tasks</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {previewTasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      </div>

      {/* Dashboard Content Sponsored Section (Banner + Video Ad) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
        <AdvertisementBanner position="dashboard_section" />
        <AdvertisementBanner position="task_list_video" />
      </div>

      {/* Recent Transactions Preview */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-slate-900">
              Recent Transactions
            </h2>
            <p className="text-xs text-slate-500">
              Latest task rewards, referral bonuses, and M-Pesa payouts
            </p>
          </div>
          <Link
            href="/dashboard/transactions"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#16A34A] hover:text-[#14532D]"
          >
            <span>Full History</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <TransactionTable transactions={userTransactions} limit={5} />
      </div>
    </div>
  );
}

