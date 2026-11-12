import React from "react";
import { LoadingSkeleton } from "@/components/LoadingSkeleton";

export default function DashboardLoading() {
  return (
    <div className="space-y-6">
      <LoadingSkeleton rows={3} variant="card" />
      <LoadingSkeleton rows={5} variant="table" />
    </div>
  );
}

