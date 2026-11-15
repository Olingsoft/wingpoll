"use client";

import React, { useState } from "react";
import { Check, Copy, Gift, Share2 } from "lucide-react";
import { useApp } from "@/context/AppContext";

export function ReferralCard() {
  const { user } = useApp();
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [sharedNotice, setSharedNotice] = useState(false);

  const activeReferralLink =
    typeof window !== "undefined"
      ? `${window.location.origin}/register?ref=${user.referralCode}`
      : user.referralLink;

  const handleCopyCode = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(user.referralCode);
    }
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyLink = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(activeReferralLink);
    }
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleShare = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(
        `Join me on Wingpoll and earn KSh completing simple digital tasks! Register here: ${activeReferralLink}`
      );
    }
    setSharedNotice(true);
    setTimeout(() => setSharedNotice(false), 2500);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#16A34A] bg-[#F0FDF4] border border-emerald-200 px-2.5 py-0.5 rounded mb-2">
            <Gift className="w-3.5 h-3.5" />
            Earn KSh 50 Per Active Friend
          </span>
          <h3 className="text-base font-semibold text-slate-900">
            Invite Friends & Earn Commissions
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Share your unique referral link. You earn KSh 50 once your referred
            friend completes their first 3 approved tasks.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Referral Code Box */}
        <div className="bg-slate-50 border border-slate-200 rounded-md p-3 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block">
              Referral Code
            </span>
            <span className="text-sm font-mono font-bold text-slate-900">
              {user.referralCode}
            </span>
          </div>
          <button
            type="button"
            onClick={handleCopyCode}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium bg-white border border-slate-200 rounded hover:border-[#16A34A] text-slate-700 cursor-pointer"
          >
            {copiedCode ? (
              <>
                <Check className="w-3.5 h-3.5 text-[#16A34A]" />
                <span className="text-[#16A34A]">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>

        {/* Referral Link Box */}
        <div className="md:col-span-2 bg-slate-50 border border-slate-200 rounded-md p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="min-w-0">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 block">
              Personal Referral Link
            </span>
            <span className="text-xs font-mono text-slate-700 truncate block">
              {activeReferralLink}
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-[#16A34A] hover:bg-[#15803d] rounded-md transition-colors cursor-pointer"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Link Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Link</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#14532D] bg-[#F0FDF4] hover:bg-emerald-100 border border-emerald-200 rounded-md transition-colors cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{sharedNotice ? "Invite Copied!" : "Share"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

