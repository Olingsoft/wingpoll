import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Task Workspace",
  description: "Complete and submit your WingPoll microtask.",
  path: "/dashboard/tasks",
  noIndex: true,
});

export default function TaskDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

