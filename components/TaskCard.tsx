"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Clock, Layers, Users } from "lucide-react";
import { Task } from "@/lib/types";
import { StatusBadge } from "./StatusBadge";
import { useApp } from "@/context/AppContext";

interface TaskCardProps {
  task: Task;
}

export function TaskCard({ task }: TaskCardProps) {
  const { user, submissions } = useApp();
  const userSubmission = submissions.find(
    (s) => s.taskId === task.id && s.userId === user.id
  );
  const isDone = Boolean(userSubmission);

  const slotPercent = Math.min(
    100,
    Math.round((task.availableSlots / Math.max(1, task.totalSlots)) * 100)
  );

  return (
    <div
      className={`bg-white border rounded-lg p-5 flex flex-col justify-between transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.03)] ${
        isDone
          ? "border-emerald-300 bg-emerald-50/15"
          : "border-slate-200 hover:border-emerald-300"
      }`}
    >
      <div>
        {/* Top Row: Category, Done Badge & Reward */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700">
              <Layers className="w-3.5 h-3.5 text-[#16A34A]" />
              {task.category}
            </span>
            {isDone && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-bold bg-[#16A34A] text-white">
                <CheckCircle2 className="w-3 h-3" />
                Done
              </span>
            )}
          </div>
          <div className="px-2.5 py-1 rounded-md bg-[#F0FDF4] border border-emerald-200 text-[#14532D] font-bold text-sm">
            KSh {task.reward}
          </div>
        </div>

        {/* Title & Description */}
        <h3 className="text-base font-semibold text-slate-900 mb-1.5 line-clamp-1">
          {task.title}
        </h3>
        <p className="text-xs text-slate-600 leading-relaxed mb-3 line-clamp-2">
          {task.shortDescription}
        </p>

        {userSubmission && (
          <div className="mb-3 px-2.5 py-1.5 rounded-md bg-[#F0FDF4] border border-emerald-200 flex items-center justify-between gap-2 text-[11px]">
            <span className="font-semibold text-[#14532D]">
              Submitted • Marked as Done
            </span>
            <StatusBadge status={userSubmission.status} />
          </div>
        )}
      </div>

      <div className="space-y-3 pt-3 border-t border-slate-100">
        {/* Meta Row */}
        <div className="flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{task.estimatedTime}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-slate-400" />
            <span>
              <strong className="text-slate-700">{task.availableSlots}</strong>{" "}
              / {task.totalSlots} slots left
            </span>
          </div>
          <StatusBadge status={task.difficulty} />
        </div>

        {/* Slot Bar */}
        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#16A34A] rounded-full"
            style={{ width: `${slotPercent}%` }}
          />
        </div>

        {/* View Task Button */}
        <Link
          href={`/dashboard/tasks/${task.id}`}
          className={`w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-md transition-colors ${
            isDone
              ? "text-[#14532D] bg-[#F0FDF4] border border-emerald-300 hover:bg-emerald-100"
              : "text-white bg-[#16A34A] hover:bg-[#15803d]"
          }`}
        >
          {isDone ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-[#16A34A]" />
              <span>
                {userSubmission?.status === "Approved"
                  ? "Done — Reward Approved"
                  : "Done — View / Edit or Cancel"}
              </span>
            </>
          ) : (
            <>
              <span>View Task</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </>
          )}
        </Link>
      </div>
    </div>
  );
}

