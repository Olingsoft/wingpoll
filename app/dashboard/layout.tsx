import React, { Suspense } from "react";
import type { Metadata } from "next";
import { connection } from "next/server";
import DashboardLayoutClient from "@/components/DashboardLayoutClient";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Earner Dashboard",
  description: "Manage your WingPoll microtasks, submissions, and M-Pesa withdrawals.",
  path: "/dashboard",
  noIndex: true,
});

async function DynamicDashboardMarker() {
  await connection();
  return null;
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Suspense fallback={null}>
        <DynamicDashboardMarker />
      </Suspense>
      <DashboardLayoutClient>{children}</DashboardLayoutClient>
    </>
  );
}

