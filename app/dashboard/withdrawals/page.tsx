"use client";

import React from "react";
import { CheckCircle2, ShieldCheck, Smartphone, Wallet } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { StatsCard } from "@/components/StatsCard";
import { WithdrawalForm } from "@/components/WithdrawalForm";
import { StatusBadge } from "@/components/StatusBadge";

export default function WithdrawalsPage() {
  const { user, withdrawals } = useApp();

  const userWithdrawals = withdrawals.filter((w) => w.userId === user.id);
  const completedTotal = userWithdrawals
    .filter((w) => w.status === "Completed")
    .reduce((acc, w) => acc + w.amount, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg sm:text-xl font-bold text-slate-900">
          M-Pesa Withdrawals
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Withdraw your available balance directly to your Safaricom M-Pesa
          account once your balance reaches KSh 300.
        </p>
      </div>

      {/* Top Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatsCard
          title="Available Balance"
          value={`KSh ${user.availableBalance.toLocaleString()}`}
          subtitle={
            user.availableBalance >= 300
              ? "Ready for M-Pesa withdrawal"
              : "Minimum KSh 300 required"
          }
          icon={<Wallet className="w-5 h-5" />}
          highlighted
        />
        <StatsCard
          title="Minimum Withdrawal"
          value="KSh 300"
          subtitle="Payment Method: Safaricom M-Pesa"
          icon={<Smartphone className="w-5 h-5" />}
        />
        <StatsCard
          title="Total Withdrawn"
          value={`KSh ${completedTotal.toLocaleString()}`}
          subtitle="Completed M-Pesa payouts"
          icon={<CheckCircle2 className="w-5 h-5" />}
        />
      </div>

      {/* Withdrawal Form + Payout Guidelines */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <WithdrawalForm />
        </div>

        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-3 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
            <div className="flex items-center gap-2 text-[#14532D] font-semibold text-sm">
              <ShieldCheck className="w-4 h-4 text-[#16A34A]" />
              <span>M-Pesa Withdrawal Guidelines</span>
            </div>
            <ul className="space-y-2.5 text-xs text-slate-600 leading-relaxed">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] mt-1.5 shrink-0" />
                <span>
                  <strong>Minimum Threshold:</strong> You can request a payout
                  anytime your Available Balance is{" "}
                  <strong>KSh 300 or higher</strong>.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] mt-1.5 shrink-0" />
                <span>
                  <strong>Phone Number Format:</strong> Ensure your Safaricom
                  M-Pesa phone number is active and registered in your name
                  (e.g., <code className="font-mono">0712345678</code>).
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] mt-1.5 shrink-0" />
                <span>
                  <strong>Failed Payouts:</strong> If an M-Pesa transfer fails
                  due to network timeout, the full amount is automatically
                  reversed to your Available Balance.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Withdrawal History Table */}
      <div className="space-y-3">
        <div>
          <h2 className="text-base font-semibold text-slate-900">
            Withdrawal History
          </h2>
          <p className="text-xs text-slate-500">
            All M-Pesa payout requests and their disbursement statuses
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  <th className="py-3.5 px-4">Reference</th>
                  <th className="py-3.5 px-4">Requested Date</th>
                  <th className="py-3.5 px-4">M-Pesa Number</th>
                  <th className="py-3.5 px-4">Amount</th>
                  <th className="py-3.5 px-4">Receipt / Notes</th>
                  <th className="py-3.5 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {userWithdrawals.map((wth) => (
                  <tr
                    key={wth.id}
                    className="hover:bg-slate-50/80 transition-colors"
                  >
                    <td className="py-3.5 px-4 font-mono font-semibold text-slate-800 whitespace-nowrap">
                      {wth.reference}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                      {wth.requestedAt}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-700 whitespace-nowrap">
                      {wth.mpesaNumber}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900 whitespace-nowrap">
                      KSh {wth.amount.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">
                      {wth.notes || "—"}
                    </td>
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <StatusBadge status={wth.status} />
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

