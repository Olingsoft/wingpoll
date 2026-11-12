"use client";

import React from "react";
import { ArrowUpDown, Search, X } from "lucide-react";
import { TaskCategory } from "@/lib/types";

export const TASK_CATEGORIES: ("All" | TaskCategory)[] = [
  "All",
  "Image to Text",
  "Data Entry",
  "Email Extraction",
  "Document Formatting",
  "PDF Creation",
  "Text Transcription",
  "Information Sorting",
  "Simple Research",
];

interface TaskFiltersProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  selectedCategory: "All" | TaskCategory;
  onCategoryChange: (cat: "All" | TaskCategory) => void;
  sortBy: "newest" | "reward_high" | "reward_low";
  onSortChange: (sort: "newest" | "reward_high" | "reward_low") => void;
  totalResults: number;
}

export function TaskFilters({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  sortBy,
  onSortChange,
  totalResults,
}: TaskFiltersProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-lg p-4 space-y-4">
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search tasks by title, keyword, or category..."
            className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:bg-white focus:border-[#16A34A]"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <ArrowUpDown className="w-3.5 h-3.5" />
            <span>Sort by:</span>
          </div>
          <select
            value={sortBy}
            onChange={(e) =>
              onSortChange(
                e.target.value as "newest" | "reward_high" | "reward_low"
              )
            }
            className="px-3 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-md text-slate-700 focus:outline-none focus:border-[#16A34A] cursor-pointer"
          >
            <option value="newest">Newest First</option>
            <option value="reward_high">Highest Reward (KSh)</option>
            <option value="reward_low">Lowest Reward (KSh)</option>
          </select>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center justify-between gap-2 flex-wrap pt-2 border-t border-slate-100">
        <div className="flex items-center gap-1.5 flex-wrap">
          {TASK_CATEGORIES.map((category) => {
            const active = selectedCategory === category;
            return (
              <button
                key={category}
                type="button"
                onClick={() => onCategoryChange(category)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                  active
                    ? "bg-[#16A34A] text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>
        <span className="text-xs text-slate-500 font-medium">
          Showing {totalResults} task{totalResults === 1 ? "" : "s"}
        </span>
      </div>
    </div>
  );
}

