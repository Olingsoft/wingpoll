"use client";

import React from "react";
import { Award, Clock, UserCheck, Users } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { StatsCard } from "@/components/StatsCard";
import { ReferralCard } from "@/components/ReferralCard";
import { StatusBadge } from "@/components/StatusBadge";

export default function ReferralsPage() {
  const { user, referrals } = useApp();

  const userReferrals = referrals.filter(
    (r) => !r.referrerId || r.referrerId === user.id
  );
  const successfulCount = userReferrals.filter(
    (r) => r.status === "Active"
  ).length;
  const pendingCount = userReferrals.filter(
    (r) => r.status === "Pending First Task"
  ).length;
  const pendingRewardAmount = pendingCount * 50;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg sm:text-xl font-bold text-slate-900">
          Referrals & Commission Program
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Invite friends to Wingpoll and earn KSh 50 for every friend who
          completes their first 3 tasks.
        </p>
      </div>

      {/* Referral Link & Share Card */}
      <ReferralCard />

      {/* 4 Referral Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Referrals"
          value={`${user.totalReferrals}`}
          subtitle="Registered with your code"
          icon={<Users className="w-5 h-5" />}
        />
        <StatsCard
          title="Successful Referrals"
          value={`${successfulCount}`}
          subtitle="Completed qualifying tasks"
          icon={<UserCheck className="w-5 h-5" />}
        />
        <StatsCard
          title="Pending Referral Rewards"
          value={`KSh ${pendingRewardAmount}`}
          subtitle={`${pendingCount} friend awaiting task completion`}
          icon={<Clock className="w-5 h-5" />}
        />
        <StatsCard
          title="Referral Earnings"
          value={`KSh ${user.referralEarnings.toLocaleString()}`}
          subtitle="Credited to Available Balance"
          icon={<Award className="w-5 h-5" />}
          highlighted
        />
      </div>

      {/* Referred Friends Table */}
      <div className="space-y-3">
        <div>
          <h2 className="text-base font-semibold text-slate-900">
            Referred Users History
          </h2>
          <p className="text-xs text-slate-500">
            Track your invited friends and their task qualification progress
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  <th className="py-3.5 px-4">Referred User</th>
                  <th className="py-3.5 px-4">Registration Date</th>
                  <th className="py-3.5 px-4">Tasks Completed</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Reward Earned</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {userReferrals.map((ref) => (
                  <tr
                    key={ref.id}
                    className="hover:bg-slate-50/80 transition-colors"
                  >
                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-slate-900">
                        {ref.referredName}
                      </p>
                      <span className="text-[11px] text-slate-400">
                        {ref.referredPhone}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                      {ref.registrationDate}
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 font-medium whitespace-nowrap">
                      {ref.tasksCompleted} tasks
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <StatusBadge status={ref.status} />
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-[#14532D] whitespace-nowrap">
                      {ref.rewardEarned > 0
                        ? `KSh ${ref.rewardEarned}`
                        : "KSh 0 (Pending)"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

