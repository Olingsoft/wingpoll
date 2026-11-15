import React, { Suspense } from "react";
import type { Metadata } from "next";
import { connection } from "next/server";
import TaskDetailsClient from "@/components/TaskDetailsClient";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Task Workspace",
  description: "Complete and submit your WingPoll microtask.",
  path: "/dashboard/tasks",
  noIndex: true,
});

export function generateStaticParams() {
  return [{ id: "preview" }];
}

async function DynamicPageMarker() {
  await connection();
  return null;
}

export default function TaskDetailsPage() {
  return (
    <Suspense
      fallback={
        <div className="py-12 text-center text-xs text-slate-500">
          Loading task workspace...
        </div>
      }
    >
      <DynamicPageMarker />
      <TaskDetailsClient />
    </Suspense>
  );
}
