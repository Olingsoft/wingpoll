"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertTriangle,
  CheckCircle2,
  Phone,
  ShieldCheck,
  Wallet,
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import { ConfirmationModal } from "./ConfirmationModal";

const kenyanPhoneRegex = /^(?:254|\+254|0)(7\d{8}|1\d{8})$/;

export function WithdrawalForm() {
  const { user, requestWithdrawal } = useApp();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingValues, setPendingValues] = useState<{
    amount: number;
    mpesaNumber: string;
  } | null>(null);
  const [successReceipt, setSuccessReceipt] = useState<{
    reference: string;
    amount: number;
    mpesaNumber: string;
  } | null>(null);

  const isBalanceBelowMinimum = user.availableBalance < 300;

  const withdrawalSchema = z.object({
    amount: z
      .number({ message: "Please enter a valid KSh amount." })
      .min(300, "Minimum withdrawal amount is KSh 300.")
      .max(
        Math.max(300, user.availableBalance),
        `Amount cannot exceed your available balance of KSh ${user.availableBalance.toLocaleString()}.`
      ),
    mpesaNumber: z
      .string()
      .min(10, "Enter a valid Kenyan M-Pesa phone number.")
      .regex(
        kenyanPhoneRegex,
        "Enter a valid Safaricom M-Pesa number (e.g. 0712345678 or 0112345678)."
      ),
  });

  type WithdrawalFormValues = z.infer<typeof withdrawalSchema>;

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<WithdrawalFormValues>({
    resolver: zodResolver(withdrawalSchema),
    defaultValues: {
      amount: user.availableBalance >= 300 ? 300 : undefined,
      mpesaNumber: user.mpesaNumber || "0712345678",
    },
  });

  const onSubmit = (data: WithdrawalFormValues) => {
    if (data.amount > user.availableBalance) {
      return;
    }
    setPendingValues(data);
    setConfirmOpen(true);
  };

  const handleConfirmWithdrawal = () => {
    if (!pendingValues) return;
    const record = requestWithdrawal(
      pendingValues.amount,
      pendingValues.mpesaNumber
    );
    setConfirmOpen(false);
    setSuccessReceipt({
      reference: record.reference,
      amount: record.amount,
      mpesaNumber: record.mpesaNumber,
    });
    reset({
      amount: undefined,
      mpesaNumber: pendingValues.mpesaNumber,
    });
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-5 sm:p-6 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
      <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-100">
        <div>
          <h3 className="text-base font-semibold text-slate-900">
            Request M-Pesa Withdrawal
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Submit a withdrawal request for admin review and M-Pesa disbursement
          </p>
        </div>
        <span className="px-2.5 py-1 text-xs font-bold rounded bg-[#F0FDF4] text-[#16A34A] border border-emerald-200">
          M-PESA
        </span>
      </div>

      {/* Insufficient Balance Notice */}
      {isBalanceBelowMinimum && (
        <div className="mb-5 p-4 rounded-md bg-amber-50 border border-amber-200 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-900 space-y-1">
            <p className="font-semibold">
              Insufficient Balance for Withdrawal (Minimum KSh 300)
            </p>
            <p className="text-amber-800">
              Your current available balance is{" "}
              <strong>KSh {user.availableBalance.toLocaleString()}</strong>. You
              need at least{" "}
              <strong>
                KSh {Math.max(0, 300 - user.availableBalance).toLocaleString()}
              </strong>{" "}
              more in approved task earnings to request an M-Pesa payout.
            </p>
          </div>
        </div>
      )}

      {/* Success Banner */}
      {successReceipt && (
        <div className="mb-5 p-4 rounded-md bg-[#F0FDF4] border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-[#16A34A] shrink-0 mt-0.5" />
            <div className="text-xs text-[#14532D] space-y-1">
              <p className="font-semibold">
                Withdrawal Request Sent for Admin Approval (
                {successReceipt.reference})
              </p>
              <p>
                Your request for{" "}
                <strong>KSh {successReceipt.amount.toLocaleString()}</strong> to
                M-Pesa number <strong>{successReceipt.mpesaNumber}</strong> is
                now <strong>Pending Admin Approval (Processing)</strong>.
              </p>
            </div>
          </div>
          <Link
            href="/admin"
            className="px-3 py-1.5 text-xs font-semibold bg-[#16A34A] text-white rounded-md hover:bg-[#15803d] shrink-0 text-center"
          >
            Approve in Admin →
          </Link>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Amount Input */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold text-slate-700">
              Withdrawal Amount (KSh)
            </label>
            <button
              type="button"
              disabled={isBalanceBelowMinimum}
              onClick={() =>
                setValue("amount", user.availableBalance, {
                  shouldValidate: true,
                })
              }
              className="text-xs font-semibold text-[#16A34A] hover:text-[#14532D] disabled:opacity-40 cursor-pointer"
            >
              Withdraw Max (KSh {user.availableBalance.toLocaleString()})
            </button>
          </div>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
              KSh
            </span>
            <input
              type="number"
              step="1"
              disabled={isBalanceBelowMinimum}
              placeholder="e.g. 450"
              {...register("amount", { valueAsNumber: true })}
              className="w-full pl-11 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:bg-white focus:border-[#16A34A] disabled:opacity-60"
            />
          </div>
          {errors.amount && (
            <p className="text-xs text-red-600 mt-1">{errors.amount.message}</p>
          )}
          <p className="text-[11px] text-slate-400 mt-1">
            Minimum withdrawal: KSh 300 • Available: KSh{" "}
            {user.availableBalance.toLocaleString()}
          </p>
        </div>

        {/* M-Pesa Phone Number */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            M-Pesa Phone Number
          </label>
          <div className="relative">
            <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              disabled={isBalanceBelowMinimum}
              placeholder="0712345678"
              {...register("mpesaNumber")}
              className="w-full pl-9 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:bg-white focus:border-[#16A34A] disabled:opacity-60"
            />
          </div>
          {errors.mpesaNumber && (
            <p className="text-xs text-red-600 mt-1">
              {errors.mpesaNumber.message}
            </p>
          )}
          <p className="text-[11px] text-slate-400 mt-1">
            Accepted formats: 07XXXXXXXX, 01XXXXXXXX, or +2547XXXXXXXX
          </p>
        </div>

        {/* Security Note */}
        <div className="p-3 rounded-md bg-slate-50 border border-slate-200 flex items-center gap-2.5 text-xs text-slate-600">
          <ShieldCheck className="w-4 h-4 text-[#16A34A] shrink-0" />
          <span>
            Your withdrawal request will be reviewed and approved by an
            administrator before M-Pesa disbursement.
          </span>
        </div>

        <button
          type="submit"
          disabled={isBalanceBelowMinimum}
          className="w-full py-2.5 px-4 rounded-md bg-[#16A34A] hover:bg-[#15803d] disabled:bg-slate-300 text-white text-sm font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
        >
          <Wallet className="w-4 h-4" />
          <span>Request Withdrawal</span>
        </button>
      </form>

      <ConfirmationModal
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirmWithdrawal}
        title="Submit M-Pesa Withdrawal Request"
        description="Your withdrawal request will be sent to the administrator for verification and M-Pesa disbursement. Please confirm your details below."
        confirmLabel="Submit Withdrawal Request"
        summaryItems={
          pendingValues
            ? [
                {
                  label: "Requested Amount",
                  value: `KSh ${pendingValues.amount.toLocaleString()}`,
                },
                {
                  label: "M-Pesa Recipient",
                  value: pendingValues.mpesaNumber,
                },
                {
                  label: "Review Status",
                  value: "Pending Admin Approval",
                },
                {
                  label: "Remaining Balance",
                  value: `KSh ${(
                    user.availableBalance - pendingValues.amount
                  ).toLocaleString()}`,
                },
              ]
            : []
        }
      />
    </div>
  );
}
