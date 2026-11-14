"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  Award,
  Briefcase,
  Clock,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import { StatsCard } from "@/components/StatsCard";
import { EarningsChart } from "@/components/EarningsChart";
import { TransactionTable } from "@/components/TransactionTable";

export default function EarningsPage() {
  const { user, transactions } = useApp();

  const rewardTransactions = transactions.filter(
    (t) =>
      (!t.userId || t.userId === user.id) &&
      (t.type === "Task Reward" || t.type === "Referral Reward")
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-slate-900">
            Earnings & Rewards Breakdown
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Monitor your task rewards, referral commissions, and available
            M-Pesa balance.
          </p>
        </div>
        <Link
          href="/dashboard/withdrawals"
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#16A34A] hover:bg-[#15803d] rounded-md self-start sm:self-auto"
        >
          <Wallet className="w-4 h-4" />
          <span>Withdraw via M-Pesa</span>
        </Link>
      </div>

      {/* 5 Required Earnings Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatsCard
          title="Available Balance"
          value={`KSh ${user.availableBalance.toLocaleString()}`}
          subtitle="Ready for M-Pesa"
          icon={<Wallet className="w-5 h-5" />}
          highlighted
        />
        <StatsCard
          title="Total Earnings"
          value={`KSh ${user.totalEarnings.toLocaleString()}`}
          subtitle="Lifetime earned"
          icon={<TrendingUp className="w-5 h-5" />}
        />
        <StatsCard
          title="Task Earnings"
          value={`KSh ${user.taskEarnings.toLocaleString()}`}
          subtitle={`${user.completedTasks} tasks approved`}
          icon={<Briefcase className="w-5 h-5" />}
        />
        <StatsCard
          title="Referral Earnings"
          value={`KSh ${user.referralEarnings.toLocaleString()}`}
          subtitle={`${user.totalReferrals} referred friends`}
          icon={<Users className="w-5 h-5" />}
        />
        <StatsCard
          title="Pending Rewards"
          value={`KSh ${user.pendingEarnings.toLocaleString()}`}
          subtitle="Awaiting review"
          icon={<Clock className="w-5 h-5" />}
        />
      </div>

      {/* Chart + Breakdown Summary Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <EarningsChart />
        </div>

        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-lg p-5 flex flex-col justify-between shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-md bg-[#F0FDF4] text-[#16A34A] flex items-center justify-center">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-900">
                  Income Source Split
                </h3>
                <p className="text-xs text-slate-500">
                  Proportion of total KSh {user.totalEarnings.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium text-slate-700">
                    Microtask Completions (80%)
                  </span>
                  <span className="font-bold text-slate-900">
                    KSh {user.taskEarnings.toLocaleString()}
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#16A34A] rounded-full"
                    style={{ width: "80%" }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium text-slate-700">
                    Referral Commissions (20%)
                  </span>
                  <span className="font-bold text-slate-900">
                    KSh {user.referralEarnings.toLocaleString()}
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#14532D] rounded-full"
                    style={{ width: "20%" }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium text-slate-700">
                    Pending Moderation Queue
                  </span>
                  <span className="font-bold text-amber-700">
                    KSh {user.pendingEarnings.toLocaleString()}
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-500 rounded-full"
                    style={{ width: "25%" }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-100">
            <Link
              href="/dashboard/tasks"
              className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold text-[#14532D] bg-[#F0FDF4] hover:bg-emerald-100 border border-emerald-200 rounded-md"
            >
              <span>Complete More Tasks</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Reward Credits Breakdown Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-semibold text-slate-900">
            Recent Reward Credits
          </h2>
          <Link
            href="/dashboard/transactions"
            className="text-xs font-semibold text-[#16A34A] hover:underline"
          >
            All Transactions →
          </Link>
        </div>
        <TransactionTable transactions={rewardTransactions} />
      </div>
    </div>
  );
}

