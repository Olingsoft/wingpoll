import React, { Suspense } from "react";
import type { Metadata } from "next";
import { connection } from "next/server";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Task Workspace",
  description: "Complete and submit your WingPoll microtask.",
  path: "/dashboard/tasks",
  noIndex: true,
});

async function DynamicRouteMarker() {
  await connection();
  return null;
}

export default function TaskDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Suspense fallback={null}>
        <DynamicRouteMarker />
      </Suspense>
      {children}
    </>
  );
}
