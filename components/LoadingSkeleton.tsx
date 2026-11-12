import React from "react";

interface LoadingSkeletonProps {
  rows?: number;
  variant?: "card" | "table";
}

export function LoadingSkeleton({
  rows = 3,
  variant = "card",
}: LoadingSkeletonProps) {
  if (variant === "table") {
    return (
      <div className="bg-white border border-slate-200 rounded-lg p-4 space-y-3 animate-pulse">
        <div className="h-8 bg-slate-100 rounded-md w-full" />
        {Array.from({ length: rows }).map((_, idx) => (
          <div key={idx} className="h-12 bg-slate-50 rounded-md w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-pulse">
      {Array.from({ length: rows }).map((_, idx) => (
        <div
          key={idx}
          className="bg-white border border-slate-200 rounded-lg p-5 space-y-3"
        >
          <div className="h-4 bg-slate-100 rounded w-1/3" />
          <div className="h-6 bg-slate-200 rounded w-2/3" />
          <div className="h-16 bg-slate-50 rounded w-full" />
          <div className="h-9 bg-slate-100 rounded w-full" />
        </div>
      ))}
    </div>
  );
}

