"use client";

import React, { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { TaskCategory } from "@/lib/types";
import { TaskCard } from "@/components/TaskCard";
import { TaskFilters } from "@/components/TaskFilters";
import { AdvertisementBanner } from "@/components/AdvertisementBanner";
import { EmptyState } from "@/components/EmptyState";

const ITEMS_PER_PAGE = 6;

export default function AvailableTasksPage() {
  const { tasks, submissions, user } = useApp();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<
    "All" | TaskCategory
  >("All");
  const [sortBy, setSortBy] = useState<"newest" | "reward_high" | "reward_low">(
    "newest"
  );
  const [currentPage, setCurrentPage] = useState(1);

  const submittedTaskIds = useMemo(
    () =>
      new Set(
        submissions.filter((s) => s.userId === user.id).map((s) => s.taskId)
      ),
    [submissions, user.id]
  );

  const filteredTasks = useMemo(() => {
    const activeTasks = tasks.filter(
      (t) => t.active && !submittedTaskIds.has(t.id)
    );

    const byCat =
      selectedCategory === "All"
        ? activeTasks
        : activeTasks.filter((t) => t.category === selectedCategory);

    const bySearch = searchQuery.trim()
      ? byCat.filter(
          (t) =>
            t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.shortDescription
              .toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            t.category.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : byCat;

    return [...bySearch].sort((a, b) => {
      if (sortBy === "reward_high") return b.reward - a.reward;
      if (sortBy === "reward_low") return a.reward - b.reward;
      return b.createdAt.localeCompare(a.createdAt);
    });
  }, [tasks, submittedTaskIds, selectedCategory, searchQuery, sortBy]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredTasks.length / ITEMS_PER_PAGE)
  );
  const safePage = Math.min(currentPage, totalPages);
  const paginatedTasks = filteredTasks.slice(
    (safePage - 1) * ITEMS_PER_PAGE,
    safePage * ITEMS_PER_PAGE
  );

  const firstBatch = paginatedTasks.slice(0, 3);
  const secondBatch = paginatedTasks.slice(3);

  const handleCategoryChange = (cat: "All" | TaskCategory) => {
    setSelectedCategory(cat);
    setCurrentPage(1);
  };

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg sm:text-xl font-bold text-slate-900">
          Available Microtasks Marketplace
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Choose a task that matches your skills, download the attachment, and
          submit accurate results for KSh rewards.
        </p>
      </div>

      {/* Top Marketplace Banner Ad */}
      <AdvertisementBanner position="task_list_banner" />

      {/* Filters & Search */}
      <TaskFilters
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
        sortBy={sortBy}
        onSortChange={setSortBy}
        totalResults={filteredTasks.length}
      />

      {paginatedTasks.length === 0 ? (
        <EmptyState
          title="No matching tasks found"
          description="Try clearing your search keyword or switching to 'All' categories to view more microtasks."
          actionLabel="Reset Filters"
          onAction={() => {
            setSearchQuery("");
            setSelectedCategory("All");
            setSortBy("newest");
            setCurrentPage(1);
          }}
        />
      ) : (
        <div className="space-y-6">
          {/* First row of tasks */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {firstBatch.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>

          {/* Inline Sponsored Banner Ad Between Task Listings */}
          <AdvertisementBanner position="task_list_inline" />

          {/* Second row of tasks */}
          {secondBatch.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {secondBatch.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          )}

          {/* Sponsored Video Ad in Task Marketplace */}
          <AdvertisementBanner position="task_list_video" />

          {/* Pagination */}
          <div className="bg-white border border-slate-200 rounded-lg px-4 py-3 flex items-center justify-between">
            <span className="text-xs text-slate-500">
              Page <strong>{safePage}</strong> of <strong>{totalPages}</strong>{" "}
              ({filteredTasks.length} total tasks)
            </span>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                disabled={safePage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-white border border-slate-200 rounded-md text-slate-700 hover:bg-slate-50 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Previous</span>
              </button>

              {Array.from({ length: totalPages }).map((_, idx) => {
                const pageNum = idx + 1;
                return (
                  <button
                    key={pageNum}
                    type="button"
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-8 h-8 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                      safePage === pageNum
                        ? "bg-[#16A34A] text-white"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                type="button"
                disabled={safePage >= totalPages}
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-white border border-slate-200 rounded-md text-slate-700 hover:bg-slate-50 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
              >
                <span>Next</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

