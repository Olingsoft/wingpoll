"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  ExternalLink,
  Gift,
  Lock,
  Pause,
  Play,
  Sparkles,
  Video,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import { IframeBannerAd } from "@/components/IframeBannerAd";
import { NativeAdBanner } from "@/components/NativeAdBanner";

interface DailyVideoAdItem {
  id: string;
  title: string;
  sponsor: string;
  description: string;
  durationSeconds: number;
  reward: number;
  ctaText: string;
  ctaUrl: string;
}

const DEFAULT_DAILY_VIDEO_ADS: DailyVideoAdItem[] = [
  {
    id: "daily-video-1",
    title: "Digital Skills & Mobile Productivity Spotlight",
    sponsor: "WingPoll Partner Network",
    description:
      "Watch this short sponsored showcase to completion to unlock your daily video reward.",
    durationSeconds: 15,
    reward: 10,
    ctaText: "Explore Partner Offer",
    ctaUrl: "https://www.wingpoll.co.ke/en-ke/blogs",
  },
  {
    id: "daily-video-2",
    title: "Smart M-Pesa Budgeting & Micro-Savings Guide",
    sponsor: "Kenya FinTech Digest",
    description:
      "Complete the full 20-second video briefing without leaving the tab to claim your reward.",
    durationSeconds: 20,
    reward: 12,
    ctaText: "Learn More",
    ctaUrl: "https://www.wingpoll.co.ke/en-ke/faq",
  },
  {
    id: "daily-video-3",
    title: "High-Accuracy Transcription & Remote Work Tips",
    sponsor: "WingPoll Career Hub",
    description:
      "Watch all 25 seconds of this sponsored feature to earn your daily bonus directly to your balance.",
    durationSeconds: 25,
    reward: 15,
    ctaText: "View Task Guidelines",
    ctaUrl: "https://www.wingpoll.co.ke/en-ke/task-guidelines",
  },
];

function parseDurationToSeconds(duration?: string): number {
  if (!duration) return 20;
  const match = duration.match(/(\d+)/);
  if (!match) return 20;
  const val = parseInt(match[1], 10);
  return Math.min(60, Math.max(10, val));
}

export default function DailyEasyEarningPage() {
  const { user, ads, claimDailyVideoAdReward, recordAdClick } = useApp();

  const today = new Date().toISOString().slice(0, 10);
  const watchedTodayIds = useMemo(
    () => new Set(user.dailyAdHistory?.[today] || []),
    [user.dailyAdHistory, today]
  );

  const videoAds: DailyVideoAdItem[] = useMemo(() => {
    const customVideoAds = ads
      .filter((a) => a.active && a.format === "video")
      .map((a) => ({
        id: a.id,
        title: a.videoHeadline || a.title,
        sponsor: a.sponsor,
        description: a.description,
        durationSeconds: parseDurationToSeconds(a.videoDuration),
        reward: 12,
        ctaText: a.ctaText || "Learn More",
        ctaUrl: a.ctaUrl || "/dashboard/tasks",
      }));

    if (customVideoAds.length > 0) {
      return [...customVideoAds, ...DEFAULT_DAILY_VIDEO_ADS];
    }
    return DEFAULT_DAILY_VIDEO_ADS;
  }, [ads]);

  const [activeAdId, setActiveAdId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [watchedSeconds, setWatchedSeconds] = useState(0);
  const [tabPausedNotice, setTabPausedNotice] = useState(false);
  const [claiming, setClaiming] = useState(false);
  const [rewardBanner, setRewardBanner] = useState<string | null>(null);

  const activeAd = videoAds.find((a) => a.id === activeAdId) || null;
  const isCompleted = activeAd
    ? watchedSeconds >= activeAd.durationSeconds
    : false;
  const progressPercent = activeAd
    ? Math.min(
        100,
        Math.round((watchedSeconds / activeAd.durationSeconds) * 100)
      )
    : 0;

  // Pause automatically if user switches away from the active tab
  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState !== "visible" && isPlaying) {
        setIsPlaying(false);
        setTabPausedNotice(true);
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibility);
  }, [isPlaying]);

  // Advance watch timer 1 second at a time only while playing & visible
  useEffect(() => {
    if (!activeAd || !isPlaying) return;
    if (watchedSeconds >= activeAd.durationSeconds) {
      setIsPlaying(false);
      return;
    }

    const timer = window.setInterval(() => {
      if (document.visibilityState !== "visible") return;
      setWatchedSeconds((prev) => {
        const next = prev + 1;
        if (next >= activeAd.durationSeconds) {
          setIsPlaying(false);
          return activeAd.durationSeconds;
        }
        return next;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [activeAd, isPlaying, watchedSeconds]);

  const handleStartWatching = (ad: DailyVideoAdItem) => {
    setRewardBanner(null);
    setTabPausedNotice(false);
    setActiveAdId(ad.id);
    setWatchedSeconds(0);
    setIsPlaying(true);
  };

  const handleClaimReward = async () => {
    if (!activeAd || !isCompleted || claiming) return;
    setClaiming(true);
    try {
      const success = await claimDailyVideoAdReward(
        activeAd.id,
        activeAd.title,
        activeAd.reward
      );
      if (success) {
        if (ads.some((a) => a.id === activeAd.id)) {
          recordAdClick(activeAd.id);
        }
        setRewardBanner(
          `Reward credited! KSh ${activeAd.reward} has been added to your Available Balance for watching "${activeAd.title}".`
        );
        setActiveAdId(null);
        setWatchedSeconds(0);
        setIsPlaying(false);
      }
    } finally {
      setClaiming(false);
    }
  };

  const earnedToday = videoAds
    .filter((a) => watchedTodayIds.has(a.id))
    .reduce((sum, a) => sum + a.reward, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 sm:p-6 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#F0FDF4] border border-emerald-200 text-[11px] font-semibold text-[#14532D]">
                <Sparkles className="w-3 h-3 text-[#16A34A]" />
                Daily Easy Earning
              </span>
              <span className="text-xs text-slate-400">{today}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
              Watch Daily Video Ads &amp; Earn KSh
            </h1>
            <p className="text-xs sm:text-sm text-slate-600">
              Watch each sponsored video ad completely to 100% without switching
              tabs to unlock and claim your instant KSh reward.
            </p>
          </div>

          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md self-start sm:self-center shrink-0"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Dashboard</span>
          </Link>
        </div>

        {/* Daily Progress Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5 pt-5 border-t border-slate-100">
          <div className="bg-[#F8FAFC] border border-slate-200 rounded-md p-3.5">
            <span className="text-[11px] text-slate-500 block">
              Ads Watched Today
            </span>
            <span className="text-lg font-bold text-slate-900">
              {videoAds.filter((a) => watchedTodayIds.has(a.id)).length} /{" "}
              {videoAds.length}
            </span>
          </div>
          <div className="bg-[#F0FDF4] border border-emerald-200 rounded-md p-3.5">
            <span className="text-[11px] text-[#14532D] block">
              Earned Today from Ads
            </span>
            <span className="text-lg font-bold text-[#14532D]">
              KSh {earnedToday}
            </span>
          </div>
          <div className="bg-[#F8FAFC] border border-slate-200 rounded-md p-3.5">
            <span className="text-[11px] text-slate-500 block">
              Available Balance
            </span>
            <span className="text-lg font-bold text-[#16A34A]">
              KSh {user.availableBalance.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Success Banner */}
      {rewardBanner && (
        <div className="bg-[#F0FDF4] border border-emerald-200 rounded-lg p-4 flex items-center gap-3 text-xs sm:text-sm text-[#14532D] font-medium">
          <CheckCircle2 className="w-5 h-5 text-[#16A34A] shrink-0" />
          <span>{rewardBanner}</span>
        </div>
      )}

      {/* Active Video Ad Player */}
      {activeAd && (
        <div className="bg-white border-2 border-[#16A34A]/40 rounded-lg overflow-hidden shadow-sm">
          <div className="px-4 sm:px-6 py-3 bg-slate-900 text-white flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Video className="w-4 h-4 text-[#4ade80]" />
              <span className="text-xs font-semibold">
                Sponsored Video Ad — {activeAd.sponsor}
              </span>
            </div>
            <span className="px-2.5 py-0.5 rounded bg-[#16A34A] text-white text-[11px] font-bold">
              Reward: KSh {activeAd.reward}
            </span>
          </div>

          {/* Simulated / Sponsored Video Stage */}
          <div className="relative bg-slate-950 text-white p-6 sm:p-10 min-h-[240px] flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
              {isCompleted ? (
                <CheckCircle2 className="w-7 h-7 text-[#4ade80]" />
              ) : isPlaying ? (
                <Pause className="w-6 h-6 text-[#4ade80]" />
              ) : (
                <Play className="w-6 h-6 text-[#4ade80] ml-0.5" />
              )}
            </div>

            <div className="max-w-lg space-y-1.5">
              <h2 className="text-base sm:text-lg font-bold text-white">
                {activeAd.title}
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                {activeAd.description}
              </p>
            </div>

            {tabPausedNotice && !isCompleted && (
              <p className="text-[11px] px-3 py-1 rounded bg-amber-500/20 border border-amber-400/40 text-amber-200">
                Video paused because you left this tab. Press Play to continue
                watching.
              </p>
            )}

            <div className="flex items-center gap-3 pt-1">
              {!isCompleted && (
                <button
                  type="button"
                  onClick={() => {
                    setTabPausedNotice(false);
                    setIsPlaying((prev) => !prev);
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-[#16A34A] hover:bg-[#15803d] text-white rounded-md cursor-pointer"
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-3.5 h-3.5" />
                      <span>Pause</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5" />
                      <span>{watchedSeconds > 0 ? "Resume" : "Play"}</span>
                    </>
                  )}
                </button>
              )}

              <button
                type="button"
                onClick={() => setIsMuted((prev) => !prev)}
                aria-label={isMuted ? "Unmute video" : "Mute video"}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-white/10 hover:bg-white/20 text-white rounded-md cursor-pointer"
              >
                {isMuted ? (
                  <VolumeX className="w-3.5 h-3.5" />
                ) : (
                  <Volume2 className="w-3.5 h-3.5" />
                )}
                <span>{isMuted ? "Muted" : "Sound On"}</span>
              </button>

              {activeAd.ctaUrl && (
                <a
                  href={activeAd.ctaUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-3 py-2 text-xs font-semibold bg-white/10 hover:bg-white/20 text-slate-200 rounded-md"
                >
                  <span>{activeAd.ctaText}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>

          {/* Progress Bar & Claim Footer */}
          <div className="p-4 sm:p-5 bg-white border-t border-slate-200 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700">
                {isCompleted
                  ? "Video completed! Your reward is unlocked."
                  : `Keep watching to unlock reward (${
                      activeAd.durationSeconds - watchedSeconds
                    }s remaining)`}
              </span>
              <span className="font-mono font-bold text-[#16A34A]">
                {progressPercent}%
              </span>
            </div>

            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#16A34A] transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <button
                type="button"
                onClick={() => {
                  setIsPlaying(false);
                  setActiveAdId(null);
                  setWatchedSeconds(0);
                }}
                className="text-xs font-medium text-slate-500 hover:text-slate-700 cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={!isCompleted || claiming}
                onClick={handleClaimReward}
                className={`inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold rounded-md transition-colors ${
                  isCompleted
                    ? "bg-[#16A34A] hover:bg-[#15803d] text-white cursor-pointer"
                    : "bg-slate-200 text-slate-500 cursor-not-allowed"
                }`}
              >
                {isCompleted ? (
                  <>
                    <Gift className="w-4 h-4" />
                    <span>
                      {claiming
                        ? "Crediting..."
                        : `Claim KSh ${activeAd.reward} Reward`}
                    </span>
                  </>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5" />
                    <span>Finish Watching to Claim KSh {activeAd.reward}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Video Ads List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {videoAds.map((ad) => {
          const alreadyWatched = watchedTodayIds.has(ad.id);
          const isCurrent = activeAdId === ad.id;

          return (
            <div
              key={ad.id}
              className={`bg-white border rounded-lg p-5 flex flex-col justify-between space-y-4 shadow-[0_1px_2px_rgba(0,0,0,0.03)] ${
                alreadyWatched
                  ? "border-emerald-200 bg-[#F0FDF4]/30"
                  : isCurrent
                  ? "border-[#16A34A]"
                  : "border-slate-200"
              }`}
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px] font-medium">
                    <Clock className="w-3 h-3 text-[#16A34A]" />
                    {ad.durationSeconds}s Video
                  </span>
                  <span className="text-xs font-bold text-[#16A34A] bg-[#F0FDF4] border border-emerald-200 px-2.5 py-0.5 rounded">
                    +KSh {ad.reward}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 leading-snug">
                  {ad.title}
                </h3>
                <p className="text-[11px] font-medium text-slate-400">
                  Sponsor: {ad.sponsor}
                </p>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {ad.description}
                </p>
              </div>

              {alreadyWatched ? (
                <div className="pt-3 border-t border-emerald-200/70 flex items-center justify-center gap-1.5 text-xs font-semibold text-[#14532D]">
                  <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
                  <span>Completed &amp; Rewarded Today</span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => handleStartWatching(ad)}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-[#16A34A] hover:bg-[#15803d] rounded-md transition-colors cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>
                    {isCurrent ? "Watching Now..." : "Watch Video Ad"}
                  </span>
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Sponsored Display & Native Ads */}
      <IframeBannerAd />
      <NativeAdBanner />
    </div>
  );
}

