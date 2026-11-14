"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Edit3,
  Eye,
  FileText,
  MessageSquare,
  X,
  XCircle,
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import { Submission, SubmissionStatus } from "@/lib/types";
import { StatusBadge } from "@/components/StatusBadge";
import { EmptyState } from "@/components/EmptyState";

const STATUS_FILTERS: ("All" | SubmissionStatus)[] = [
  "All",
  "Pending Review",
  "Approved",
  "Revision Required",
  "Rejected",
];

export default function MySubmissionsPage() {
  const { submissions, user, cancelSubmission } = useApp();
  const [selectedStatus, setSelectedStatus] = useState<
    "All" | SubmissionStatus
  >("All");
  const [activeSubmission, setActiveSubmission] = useState<Submission | null>(
    null
  );
  const [cancelledBanner, setCancelledBanner] = useState<string | null>(null);

  const userSubmissions = submissions.filter((s) => s.userId === user.id);

  const filteredSubmissions =
    selectedStatus === "All"
      ? userSubmissions
      : userSubmissions.filter((s) => s.status === selectedStatus);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-slate-900">
            My Task Submissions
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Track the review status of your submitted microtasks and read
            moderator feedback.
          </p>
        </div>

        {/* Status Filter Pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {STATUS_FILTERS.map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setSelectedStatus(status)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                selectedStatus === status
                  ? "bg-[#16A34A] text-white"
                  : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {cancelledBanner && (
        <div className="p-3.5 rounded-lg bg-amber-50 border border-amber-200 text-xs font-semibold text-amber-900 flex items-center justify-between gap-2">
          <span>{cancelledBanner}</span>
          <button
            type="button"
            onClick={() => setCancelledBanner(null)}
            className="text-amber-700 hover:text-amber-950 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {filteredSubmissions.length === 0 ? (
        <EmptyState
          title="No submissions in this category"
          description="Browse available tasks in the marketplace to complete work and earn rewards."
        />
      ) : (
        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  <th className="py-3.5 px-4">Task Name</th>
                  <th className="py-3.5 px-4">Submission Date</th>
                  <th className="py-3.5 px-4">Reward</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredSubmissions.map((sub) => (
                  <tr
                    key={sub.id}
                    className="hover:bg-slate-50/80 transition-colors"
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-slate-900">
                          {sub.taskTitle}
                        </p>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-[#16A34A] text-white">
                          <CheckCircle2 className="w-2.5 h-2.5" />
                          Done
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-500">
                        {sub.category} • Ref #{sub.id}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-slate-600 whitespace-nowrap">
                      {sub.submittedAt}
                    </td>
                    <td className="py-4 px-4 font-bold text-[#14532D] whitespace-nowrap">
                      KSh {sub.reward}
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap">
                      <StatusBadge status={sub.status} />
                    </td>
                    <td className="py-4 px-4 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setActiveSubmission(sub)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:border-[#16A34A] hover:text-[#16A34A] rounded-md transition-colors cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Details</span>
                        </button>
                        {sub.status !== "Approved" && (
                          <>
                            <Link
                              href={`/dashboard/tasks/${sub.taskId}`}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-[#14532D] bg-[#F0FDF4] border border-emerald-200 hover:bg-emerald-100 rounded-md"
                            >
                              <Edit3 className="w-3 h-3 text-[#16A34A]" />
                              <span>Edit</span>
                            </Link>
                            <button
                              type="button"
                              onClick={() => {
                                cancelSubmission(sub.id);
                                setCancelledBanner(
                                  `Aborted & cancelled submission for "${sub.taskTitle}". Task is unmarked as Done.`
                                );
                              }}
                              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-red-700 bg-red-50 border border-red-200 hover:bg-red-100 rounded-md cursor-pointer"
                            >
                              <XCircle className="w-3 h-3" />
                              <span>Abort / Cancel</span>
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Submission Details Modal */}
      {activeSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-[1px] p-4">
          <div className="bg-white border border-slate-200 rounded-lg shadow-lg max-w-lg w-full overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-mono text-slate-400 uppercase">
                  Submission #{activeSubmission.id}
                </span>
                <h3 className="text-base font-bold text-slate-900">
                  {activeSubmission.taskTitle}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveSubmission(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-md cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-3 gap-3 bg-slate-50 border border-slate-200 rounded-md p-3 text-xs">
                <div>
                  <span className="text-slate-400 block">Status</span>
                  <div className="mt-1">
                    <StatusBadge status={activeSubmission.status} />
                  </div>
                </div>
                <div>
                  <span className="text-slate-400 block">Reward</span>
                  <span className="font-bold text-slate-900 mt-1 block">
                    KSh {activeSubmission.reward}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block">Submitted</span>
                  <span className="font-medium text-slate-700 mt-1 block">
                    {activeSubmission.submittedAt}
                  </span>
                </div>
              </div>

              {/* Reviewer Feedback */}
              <div className="p-3.5 rounded-md bg-[#F0FDF4] border border-emerald-200 space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#14532D]">
                  <MessageSquare className="w-3.5 h-3.5 text-[#16A34A]" />
                  <span>Moderator Review Feedback</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {activeSubmission.feedback ||
                    "Your submission is currently in the moderation queue. Quality verification takes 2 to 12 hours."}
                </p>
              </div>

              {/* Submitted Payload Preview */}
              <div className="space-y-2">
                <h4 className="text-xs font-semibold text-slate-700">
                  Your Submitted Work
                </h4>

                {activeSubmission.submittedData.textAnswer && (
                  <pre className="p-3 bg-slate-900 text-slate-100 rounded-md text-xs font-mono whitespace-pre-wrap">
                    {activeSubmission.submittedData.textAnswer}
                  </pre>
                )}

                {activeSubmission.submittedData.fileName && (
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-md flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 font-medium text-slate-800">
                      <FileText className="w-4 h-4 text-[#16A34A]" />
                      <span>{activeSubmission.submittedData.fileName}</span>
                    </div>
                    <span className="text-slate-400">
                      {activeSubmission.submittedData.fileSize}
                    </span>
                  </div>
                )}

                {activeSubmission.submittedData.fieldValues && (
                  <div className="bg-slate-50 border border-slate-200 rounded-md p-3 space-y-2 text-xs">
                    {Object.entries(
                      activeSubmission.submittedData.fieldValues
                    ).map(([k, v]) => (
                      <div key={k} className="flex justify-between gap-4">
                        <span className="text-slate-500 font-medium">{k}:</span>
                        <span className="text-slate-900 font-semibold text-right">
                          {v}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {activeSubmission.submittedData.tableRows && (
                  <div className="border border-slate-200 rounded-md overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                          {Object.keys(
                            activeSubmission.submittedData.tableRows[0] || {}
                          ).map((col) => (
                            <th key={col} className="py-2 px-3 font-semibold">
                              {col}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {activeSubmission.submittedData.tableRows.map(
                          (r, i) => (
                            <tr key={i}>
                              {Object.values(r).map((val, j) => (
                                <td key={j} className="py-2 px-3 text-slate-700">
                                  {val}
                                </td>
                              ))}
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                )}

                {activeSubmission.submittedData.notes && (
                  <p className="text-xs text-slate-500 italic">
                    Notes: &ldquo;{activeSubmission.submittedData.notes}&rdquo;
                  </p>
                )}
              </div>
            </div>

            <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Link
                  href={`/dashboard/tasks/${activeSubmission.taskId}`}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-[#14532D] bg-[#F0FDF4] border border-emerald-200 hover:bg-emerald-100 rounded-md"
                >
                  <Edit3 className="w-3.5 h-3.5 text-[#16A34A]" />
                  <span>
                    {activeSubmission.status === "Approved"
                      ? "Open Task Page"
                      : "Edit Submission"}
                  </span>
                </Link>
                {activeSubmission.status !== "Approved" && (
                  <button
                    type="button"
                    onClick={() => {
                      const title = activeSubmission.taskTitle;
                      cancelSubmission(activeSubmission.id);
                      setActiveSubmission(null);
                      setCancelledBanner(
                        `Aborted & cancelled submission for "${title}". Task is unmarked as Done.`
                      );
                    }}
                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-red-700 bg-red-50 border border-red-200 hover:bg-red-100 rounded-md cursor-pointer"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Abort / Cancel</span>
                  </button>
                )}
              </div>
              <button
                type="button"
                onClick={() => setActiveSubmission(null)}
                className="px-4 py-1.5 text-xs font-semibold bg-slate-900 text-white rounded-md cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

