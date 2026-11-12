"use client";

import React, { useState } from "react";
import { ExternalLink, Megaphone } from "lucide-react";
import { AdPosition, Advertisement } from "@/lib/types";
import { useApp } from "@/context/AppContext";

interface AdvertisementBannerProps {
  position: AdPosition;
  customAd?: Advertisement;
  compact?: boolean;
}

export function AdvertisementBanner({
  position,
  customAd,
  compact = false,
}: AdvertisementBannerProps) {
  const { ads, recordAdClick } = useApp();
  const [clickedNotice, setClickedNotice] = useState(false);

  const ad =
    customAd || ads.find((item) => item.position === position && item.active);

  if (!ad) return null;

  const handleCtaClick = () => {
    recordAdClick(ad.id);
    setClickedNotice(true);
    setTimeout(() => setClickedNotice(false), 2500);
  };

  if (compact || position === "task_details_sidebar") {
    return (
      <div className="bg-slate-50/90 border border-dashed border-slate-300 rounded-lg p-4 relative">
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-slate-200/80 text-slate-600 rounded">
            <Megaphone className="w-3 h-3" />
            {ad.badgeText || "Sponsored Ad"}
          </span>
          <span className="text-[11px] text-slate-400 font-medium">
            {ad.sponsor}
          </span>
        </div>
        <h4 className="text-xs font-semibold text-slate-800 mb-1">
          {ad.title}
        </h4>
        <p className="text-xs text-slate-600 leading-relaxed mb-3">
          {ad.description}
        </p>
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={handleCtaClick}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#16A34A] hover:text-[#14532D] transition-colors cursor-pointer"
          >
            {ad.ctaText}
            <ExternalLink className="w-3 h-3" />
          </button>
          {clickedNotice && (
            <span className="text-[11px] text-emerald-700 font-medium">
              Partner link recorded
            </span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-4 sm:p-5 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-200 rounded">
              <Megaphone className="w-3 h-3 text-slate-500" />
              {ad.badgeText || "Sponsored"}
            </span>
            <span className="text-xs text-slate-500 font-medium">
              by {ad.sponsor}
            </span>
          </div>
          <h4 className="text-sm font-semibold text-slate-900">{ad.title}</h4>
          <p className="text-xs text-slate-600 max-w-2xl leading-relaxed">
            {ad.description}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {clickedNotice && (
            <span className="text-xs text-[#16A34A] font-medium">
              Visited partner offer
            </span>
          )}
          <button
            type="button"
            onClick={handleCtaClick}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#14532D] bg-[#F0FDF4] hover:bg-emerald-100 border border-emerald-200 rounded-md transition-colors cursor-pointer"
          >
            {ad.ctaText}
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

