import React from "react";
import Link from "next/link";
import { ArrowRight, Clock, Layers, Users } from "lucide-react";
import { Task } from "@/lib/types";
import { StatusBadge } from "./StatusBadge";

interface TaskCardProps {
  task: Task;
}

export function TaskCard({ task }: TaskCardProps) {
  const slotPercent = Math.min(
    100,
    Math.round((task.availableSlots / Math.max(1, task.totalSlots)) * 100)
  );

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-5 flex flex-col justify-between hover:border-emerald-300 transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
      <div>
        {/* Top Row: Category & Reward */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700">
            <Layers className="w-3.5 h-3.5 text-[#16A34A]" />
            {task.category}
          </span>
          <div className="px-2.5 py-1 rounded-md bg-[#F0FDF4] border border-emerald-200 text-[#14532D] font-bold text-sm">
            KSh {task.reward}
          </div>
        </div>

        {/* Title & Description */}
        <h3 className="text-base font-semibold text-slate-900 mb-1.5 line-clamp-1">
          {task.title}
        </h3>
        <p className="text-xs text-slate-600 leading-relaxed mb-4 line-clamp-2">
          {task.shortDescription}
        </p>
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
          className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#16A34A] hover:bg-[#15803d] rounded-md transition-colors"
        >
          <span>View Task</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}

