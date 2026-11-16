"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  Edit3,
  Eye,
  FileSpreadsheet,
  FileText,
  Film,
  Gift,
  Image as ImageIcon,
  Layers,
  Loader2,
  Maximize2,
  Minimize2,
  MousePointerClick,
  Plus,
  RotateCcw,
  Send,
  Sparkles,
  Trash2,
  Upload,
  Users,
  XCircle,
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import { SubmissionFormat } from "@/lib/types";
import { formatFileSize, uploadToCloudinary } from "@/lib/cloudinary";
import { StatusBadge } from "@/components/StatusBadge";
import { ConfirmationModal } from "@/components/ConfirmationModal";
import { AdvertisementBanner } from "@/components/AdvertisementBanner";
import { NativeAdBanner } from "@/components/NativeAdBanner";
import { IframeBannerAd } from "@/components/IframeBannerAd";

const FORMAT_LABELS: { id: SubmissionFormat; label: string }[] = [
  { id: "text_input", label: "Single Text Input" },
  { id: "multiline_text", label: "Multiline Text Area" },
  { id: "structured_table", label: "Structured Table" },
  { id: "multiple_fields", label: "Multiple Input Fields" },
  { id: "file_upload", label: "File Upload" },
  { id: "pdf_upload", label: "PDF Upload" },
];

export default function TaskDetailsPage() {
  const params = useParams<{ id: string }>();
  const {
    tasks,
    submissions,
    user,
    submitTask,
    updateSubmission,
    cancelSubmission,
  } = useApp();

  const task = tasks.find((t) => t.id === params.id) || tasks[0];

  const existingSubmission = submissions.find(
    (s) => task && s.taskId === task.id && s.userId === user.id
  );

  const [activeFormat, setActiveFormat] = useState<SubmissionFormat>(
    task?.submissionFormat || "multiline_text"
  );
  const [imageZoomed, setImageZoomed] = useState(false);
  const [isEditingSubmission, setIsEditingSubmission] = useState(false);
  const [abortConfirmOpen, setAbortConfirmOpen] = useState(false);
  const [actionBannerMessage, setActionBannerMessage] = useState<{
    type: "success" | "aborted";
    title: string;
    message: string;
  } | null>(null);

  // Form states for the 6 formats
  const [singleText, setSingleText] = useState("");
  const [multilineText, setMultilineText] = useState("");
  const defaultColumns = task?.tableColumns || [
    "Item / Record",
    "Extracted Value",
    "Category / Unit",
    "Amount / Notes",
  ];
  const [tableRows, setTableRows] = useState<Record<string, string>[]>([
    Object.fromEntries(defaultColumns.map((col) => [col, ""])),
    Object.fromEntries(defaultColumns.map((col) => [col, ""])),
  ]);
  const defaultFields = task?.fields || [
    {
      id: "referenceNo",
      label: "Document Reference / ID",
      placeholder: "e.g. REF-2026-104",
      required: true,
    },
    {
      id: "organizationName",
      label: "Company / Entity Name",
      placeholder: "e.g. Savanna Logistics Ltd",
      required: true,
    },
    {
      id: "contactDetails",
      label: "Extracted Contact / Email",
      placeholder: "e.g. info@savannalogistics.co.ke",
      required: true,
    },
    {
      id: "summaryRemarks",
      label: "Verification Summary",
      placeholder: "Enter extracted notes...",
      required: true,
    },
  ];
  const [fieldValues, setFieldValues] = useState<Record<string, string>>(
    Object.fromEntries(defaultFields.map((f) => [f.id, ""]))
  );
  const [selectedFile, setSelectedFile] = useState<{
    name: string;
    size: string;
    url?: string;
  } | null>(null);
  const [isUploadingToCloudinary, setIsUploadingToCloudinary] = useState(false);
  const [optionalNotes, setOptionalNotes] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [justSubmittedStatus, setJustSubmittedStatus] = useState<string | null>(
    null
  );

  const handleAddTableRow = () => {
    setTableRows((prev) => [
      ...prev,
      Object.fromEntries(defaultColumns.map((c) => [c, ""])),
    ]);
  };

  const handleRemoveTableRow = (index: number) => {
    if (tableRows.length <= 1) return;
    setTableRows((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleTableCellChange = (
    rowIndex: number,
    column: string,
    value: string
  ) => {
    setTableRows((prev) =>
      prev.map((row, idx) =>
        idx === rowIndex ? { ...row, [column]: value } : row
      )
    );
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValidationError(null);
      setIsUploadingToCloudinary(true);
      try {
        const uploaded = await uploadToCloudinary(file, "wingpoll_submissions");
        setSelectedFile({
          name: file.name,
          size: formatFileSize(uploaded.bytes || file.size),
          url: uploaded.secureUrl,
        });
      } catch (err) {
        // Fallback to local file metadata if offline
        setSelectedFile({
          name: file.name,
          size: formatFileSize(file.size),
        });
        console.warn("Cloudinary submission upload warning:", err);
      } finally {
        setIsUploadingToCloudinary(false);
      }
    }
  };

  const handlePreSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (activeFormat === "text_input" && singleText.trim().length < 3) {
      setValidationError(
        "Please enter your extracted answer in the text field before submitting."
      );
      return;
    }
    if (activeFormat === "multiline_text" && multilineText.trim().length < 5) {
      setValidationError(
        "Please enter the extracted items or transcription into the text area."
      );
      return;
    }
    if (activeFormat === "structured_table") {
      const hasFilledRow = tableRows.some((row) =>
        Object.values(row).some((val) => val.trim().length > 0)
      );
      if (!hasFilledRow) {
        setValidationError(
          "Please fill in at least one row in the structured data table."
        );
        return;
      }
    }
    if (activeFormat === "multiple_fields") {
      const missing = defaultFields.some(
        (f) => f.required && !fieldValues[f.id]?.trim()
      );
      if (missing) {
        setValidationError("Please complete all required extraction fields.");
        return;
      }
    }
    if (
      (activeFormat === "file_upload" || activeFormat === "pdf_upload") &&
      !selectedFile
    ) {
      setValidationError(
        activeFormat === "pdf_upload"
          ? "Please select or simulate a PDF file to upload."
          : "Please select or simulate a document file to upload."
      );
      return;
    }

    setConfirmModalOpen(true);
  };

  const handleStartEditSubmission = () => {
    if (!existingSubmission) return;
    const data = existingSubmission.submittedData;
    setActiveFormat(data.format || task?.submissionFormat || "multiline_text");
    if (data.format === "text_input") {
      setSingleText(data.textAnswer || "");
    } else if (data.format === "multiline_text") {
      setMultilineText(data.textAnswer || "");
    }
    if (data.tableRows && data.tableRows.length > 0) {
      setTableRows(data.tableRows);
    }
    if (data.fieldValues) {
      setFieldValues(data.fieldValues);
    }
    if (data.fileName) {
      setSelectedFile({
        name: data.fileName,
        size: data.fileSize || "",
        url: data.fileUrl,
      });
    }
    setOptionalNotes(data.notes || "");
    setValidationError(null);
    setIsEditingSubmission(true);
  };

  const handleAbortSubmission = () => {
    if (!existingSubmission) return;
    cancelSubmission(existingSubmission.id);
    setIsEditingSubmission(false);
    setAbortConfirmOpen(false);
    setJustSubmittedStatus(null);
    setActionBannerMessage({
      type: "aborted",
      title: "Submission Aborted / Cancelled",
      message: `Your submission for "${task.title}" has been cancelled and the task is no longer marked as Done. You can start fresh or return to Available Tasks.`,
    });
  };

  const handleConfirmSubmission = () => {
    const payload = {
      format: activeFormat,
      textAnswer:
        activeFormat === "text_input"
          ? singleText
          : activeFormat === "multiline_text"
          ? multilineText
          : undefined,
      tableRows: activeFormat === "structured_table" ? tableRows : undefined,
      fieldValues: activeFormat === "multiple_fields" ? fieldValues : undefined,
      fileName: selectedFile?.name,
      fileSize: selectedFile?.size,
      fileUrl: selectedFile?.url,
      notes: optionalNotes,
    };

    if (existingSubmission) {
      updateSubmission(existingSubmission.id, payload);
      setIsEditingSubmission(false);
      setConfirmModalOpen(false);
      setJustSubmittedStatus("Pending Review");
      setActionBannerMessage({
        type: "success",
        title: "Submission Updated — Task Marked as Done!",
        message: `Your updated work for "${task.title}" has been saved and is Pending Review.`,
      });
    } else {
      const created = submitTask(task.id, payload);
      setConfirmModalOpen(false);
      setJustSubmittedStatus(created.status);
      setActionBannerMessage({
        type: "success",
        title: "Task Submitted Successfully — Marked as Done!",
        message: `Your submission for "${task.title}" has been queued for admin review. KSh ${task.reward} has been added to your Pending Earnings.`,
      });
    }
  };

  const currentTaskStatus = existingSubmission?.status || justSubmittedStatus;
  const isTaskDone = Boolean(existingSubmission);

  if (!task) {
    return (
      <div className="bg-white border border-slate-200 rounded-lg p-8 text-center space-y-3">
        <p className="text-sm font-semibold text-slate-800">
          Task not found or no tasks published yet.
        </p>
        <Link
          href="/dashboard/tasks"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#16A34A] hover:underline"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Available Tasks</span>
        </Link>
      </div>
    );
  }

  if (
    existingSubmission &&
    existingSubmission.status !== "Revision Required" &&
    !isEditingSubmission
  ) {
    return (
      <div className="bg-white border border-slate-200 rounded-lg p-8 max-w-xl mx-auto text-center space-y-4 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
        <div className="w-12 h-12 rounded-full bg-[#F0FDF4] border border-emerald-200 text-[#16A34A] flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <div className="space-y-1.5">
          <h1 className="text-lg font-bold text-slate-900">
            Task Already Completed
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            You have already submitted this task ({existingSubmission.status}).
            Completed tasks are hidden from your available tasks list.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href="/dashboard/tasks"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-[#16A34A] hover:bg-[#15803d] text-white rounded-md transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Browse Available Tasks</span>
          </Link>
          <Link
            href="/dashboard/submissions"
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold border border-slate-200 text-slate-700 hover:border-[#16A34A] rounded-md transition-colors"
          >
            <span>View My Submissions</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <Link
          href="/dashboard/tasks"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-[#16A34A]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Available Tasks</span>
        </Link>

        {isTaskDone && existingSubmission && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-[#16A34A] text-white">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Task Marked as Done
            </span>
            <StatusBadge status={existingSubmission.status} size="md" />
          </div>
        )}
      </div>

      {/* Top Bonus Earnings & Sponsored Partner Offers Section */}
      <div className="bg-white border border-emerald-200 rounded-lg overflow-hidden shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
        <div className="bg-[#F0FDF4] border-b border-emerald-200 px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-md bg-[#16A34A] text-white flex items-center justify-center shrink-0 mt-0.5">
              <Gift className="w-4 h-4" />
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-sm font-bold text-[#14532D]">
                  Bonus Earnings — Sponsored Partner Offers
                </h2>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-white text-[#16A34A] border border-emerald-200">
                  <Sparkles className="w-3 h-3" />
                  Earn Extra
                </span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                <strong>Instructions:</strong> Before completing your task, click
                and explore the sponsored partner offers below to check out
                featured services and qualify for bonus earnings on your WingPoll
                account.
              </p>
            </div>
          </div>

          <div className="bg-white border border-emerald-200 rounded-md px-3.5 py-2 shrink-0 text-left sm:text-right">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
              Your Bonus &amp; Balance
            </p>
            <p className="text-sm font-bold text-[#14532D]">
              KSh {user.availableBalance.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="p-4 sm:p-5 bg-[#F8FAFC] space-y-4">
          <div className="flex items-center justify-between text-[11px] text-slate-500">
            <span className="inline-flex items-center gap-1.5 font-semibold uppercase tracking-wider text-slate-500">
              <MousePointerClick className="w-3.5 h-3.5 text-[#16A34A]" />
              <span>Sponsored Partner Offers (Click to Explore)</span>
            </span>
            <Link
              href="/dashboard/earnings"
              className="font-semibold text-[#16A34A] hover:underline"
            >
              View Earnings →
            </Link>
          </div>

          <NativeAdBanner />
          <IframeBannerAd />
          <AdvertisementBanner position="task_list_inline" />
        </div>
      </div>

      {/* Aborted / Cancelled Notification Banner */}
      {actionBannerMessage?.type === "aborted" && !existingSubmission && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <RotateCcw className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-amber-900">
                {actionBannerMessage.title}
              </h3>
              <p className="text-xs text-amber-800">
                {actionBannerMessage.message}
              </p>
            </div>
          </div>
          <Link
            href="/dashboard/tasks"
            className="px-3.5 py-2 text-xs font-semibold bg-white border border-amber-300 text-amber-900 rounded-md hover:bg-amber-100 shrink-0 text-center"
          >
            Browse Other Tasks →
          </Link>
        </div>
      )}

      {/* Submission Success & Task Marked as Done Banner */}
      {existingSubmission && (
        <div className="bg-[#F0FDF4] border border-emerald-300 rounded-lg p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-xs">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-full bg-[#16A34A] text-white flex items-center justify-center shrink-0 mt-0.5">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-sm font-bold text-[#14532D]">
                  {actionBannerMessage?.type === "success"
                    ? actionBannerMessage.title
                    : "Task Marked as Done!"}
                </h3>
                <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-[#16A34A] text-white">
                  DONE ✓
                </span>
                <StatusBadge status={existingSubmission.status} />
              </div>
              <p className="text-xs text-emerald-900 leading-relaxed">
                {existingSubmission.status === "Approved" ? (
                  <>
                    Your submission for <strong>{task.title}</strong> was
                    approved by the admin and{" "}
                    <strong>KSh {task.reward}</strong> has been credited to your
                    Available Balance!
                  </>
                ) : actionBannerMessage?.type === "success" ? (
                  actionBannerMessage.message
                ) : (
                  <>
                    You have submitted <strong>{task.title}</strong> (submitted
                    on {existingSubmission.submittedAt}). Reward:{" "}
                    <strong>KSh {task.reward}</strong>. You can edit your
                    submission or abort/cancel it anytime before admin approval.
                  </>
                )}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {existingSubmission.status !== "Approved" && (
              <>
                <button
                  type="button"
                  onClick={handleStartEditSubmission}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-white border border-emerald-300 text-[#14532D] hover:bg-emerald-100 rounded-md cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5 text-[#16A34A]" />
                  <span>Edit Submission</span>
                </button>
                <button
                  type="button"
                  onClick={() => setAbortConfirmOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-red-50 border border-red-200 text-red-700 hover:bg-red-100 rounded-md cursor-pointer"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Abort / Cancel</span>
                </button>
              </>
            )}
            <Link
              href="/dashboard/submissions"
              className="px-3.5 py-2 text-xs font-semibold bg-[#16A34A] text-white rounded-md hover:bg-[#15803d] text-center"
            >
              My Submissions →
            </Link>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Left Column: Instructions, Attachment Preview & Submission Form */}
        <div className="lg:col-span-8 space-y-6">
          {/* Task Header Card */}
          <div className="bg-white border border-slate-200 rounded-lg p-5 sm:p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700">
                  <Layers className="w-3.5 h-3.5 text-[#16A34A]" />
                  {task.category}
                </span>
                <StatusBadge status={task.difficulty} />
              </div>
              <div className="px-3 py-1.5 rounded-md bg-[#F0FDF4] border border-emerald-200 text-[#14532D] font-bold text-base">
                Reward: KSh {task.reward}
              </div>
            </div>

            <div>
              <h1 className="text-lg sm:text-xl font-bold text-slate-900">
                {task.title}
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                {task.shortDescription}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="flex items-center gap-2 text-slate-600">
                <Clock className="w-4 h-4 text-[#16A34A]" />
                <span>Est. Time: {task.estimatedTime}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <Users className="w-4 h-4 text-[#16A34A]" />
                <span>
                  Slots: {task.availableSlots}/{task.totalSlots}
                </span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <Calendar className="w-4 h-4 text-[#16A34A]" />
                <span>Due: {task.deadline}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <FileText className="w-4 h-4 text-[#16A34A]" />
                <span>ID: #{task.id.toUpperCase()}</span>
              </div>
            </div>
          </div>

          {/* Step-by-Step Instructions & Attachment */}
          <div className="bg-white border border-slate-200 rounded-lg p-5 sm:p-6 space-y-5">
            <div>
              <h2 className="text-sm font-semibold text-slate-900 mb-3">
                Task Instructions
              </h2>
              <ol className="space-y-2.5">
                {task.instructions.map((inst, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-3 text-xs sm:text-sm text-slate-700"
                  >
                    <span className="w-5 h-5 rounded-full bg-[#F0FDF4] border border-emerald-200 text-[#14532D] text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {index + 1}
                    </span>
                    <span className="leading-relaxed">{inst}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Inline Task Source File Preview (PDF, Image, Video, or Document) */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-50 border border-slate-200 rounded-lg px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-md bg-white border border-slate-200 flex items-center justify-center text-[#16A34A] shrink-0">
                    {task.attachment.type === "video" ? (
                      <Film className="w-4 h-4" />
                    ) : task.attachment.type === "image" ? (
                      <ImageIcon className="w-4 h-4" />
                    ) : task.attachment.type === "spreadsheet" ? (
                      <FileSpreadsheet className="w-4 h-4" />
                    ) : (
                      <FileText className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-900">
                        <Eye className="w-3.5 h-3.5 text-[#16A34A]" />
                        Task Source Material: {task.attachment.name}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-[#F0FDF4] border border-emerald-200 text-[10px] font-bold uppercase text-[#14532D]">
                        {task.attachment.type}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Work directly from the live preview below ({task.attachment.size})
                    </p>
                  </div>
                </div>

                {task.attachment.type === "image" &&
                  task.attachment.previewUrl && (
                    <button
                      type="button"
                      onClick={() => setImageZoomed((prev) => !prev)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-white border border-slate-300 rounded-md text-slate-700 hover:bg-slate-100 cursor-pointer"
                    >
                      {imageZoomed ? (
                        <>
                          <Minimize2 className="w-3.5 h-3.5 text-[#16A34A]" />
                          <span>Fit to Screen</span>
                        </>
                      ) : (
                        <>
                          <Maximize2 className="w-3.5 h-3.5 text-[#16A34A]" />
                          <span>Zoom Image</span>
                        </>
                      )}
                    </button>
                  )}
              </div>

              {/* 1. VIDEO PREVIEW */}
              {(task.attachment.type === "video" ||
                task.attachment.previewUrl?.match(/\.(mp4|webm|mov|ogg)(\?|$)/i)) &&
                task.attachment.previewUrl && (
                  <div className="rounded-lg overflow-hidden border border-slate-800 bg-black shadow-xs">
                    <video
                      src={task.attachment.previewUrl}
                      controls
                      preload="metadata"
                      className="w-full max-h-[480px] object-contain bg-black"
                    >
                      Your browser does not support HTML5 video playback.
                    </video>
                  </div>
                )}

              {/* 2. IMAGE PREVIEW */}
              {(task.attachment.type === "image" ||
                task.attachment.previewUrl?.match(
                  /\.(png|jpe?g|webp|gif|svg)(\?|$)/i
                )) &&
                task.attachment.type !== "pdf" &&
                !task.attachment.previewUrl?.match(/\.pdf(\?|$)/i) &&
                task.attachment.previewUrl && (
                  <div className="rounded-lg overflow-auto border border-slate-200 bg-slate-100 p-3 max-h-[600px]">
                    <img
                      src={task.attachment.previewUrl}
                      alt={task.attachment.name}
                      className={`rounded mx-auto transition-all ${
                        imageZoomed
                          ? "w-[140%] max-w-none"
                          : "w-full max-h-[520px] object-contain"
                      }`}
                    />
                  </div>
                )}

              {/* 3. PDF PREVIEW */}
              {(task.attachment.type === "pdf" ||
                task.attachment.previewUrl?.match(/\.pdf(\?|$)/i)) &&
                task.attachment.previewUrl && (
                  <div className="rounded-lg overflow-hidden border border-slate-200 bg-slate-100">
                    <iframe
                      src={`${task.attachment.previewUrl}#toolbar=1&navpanes=0`}
                      title={task.attachment.name}
                      className="w-full h-[580px] bg-white"
                    />
                  </div>
                )}

              {/* 4. DOCUMENT / SPREADSHEET PREVIEW */}
              {(task.attachment.type === "document" ||
                task.attachment.type === "spreadsheet") &&
                task.attachment.previewUrl && (
                  <div className="rounded-lg overflow-hidden border border-slate-200 bg-slate-100">
                    <iframe
                      src={`https://docs.google.com/gview?url=${encodeURIComponent(
                        task.attachment.previewUrl
                      )}&embedded=true`}
                      title={task.attachment.name}
                      className="w-full h-[540px] bg-white"
                    />
                  </div>
                )}

              {/* Text / Keyframe Reference Content (shown if provided or if no media URL) */}
              {task.attachment.sampleContent &&
                task.attachment.sampleContent.length > 0 && (
                  <div className="bg-slate-900 text-slate-100 rounded-lg p-4 sm:p-5 border border-slate-800 font-mono text-xs space-y-2 overflow-x-auto">
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-700 text-[11px] text-slate-400">
                      <span>
                        {task.attachment.type === "video"
                          ? `VIDEO NOTES / KEYFRAMES: ${task.attachment.name}`
                          : `SOURCE CONTENT: ${task.attachment.name}`}
                      </span>
                      <span className="text-emerald-400">
                        LIVE WORKSPACE PREVIEW
                      </span>
                    </div>
                    {task.attachment.sampleContent.map((line, i) => (
                      <p key={i} className="leading-relaxed text-slate-200">
                        {line}
                      </p>
                    ))}
                  </div>
                )}
            </div>
          </div>

          {/* Sponsored Ad Below Task Instructions (Clearly Distinguished) */}
          <AdvertisementBanner position="task_instructions_below" />

          {/* Task Submission Form OR Submitted Work Summary */}
          {existingSubmission && !isEditingSubmission ? (
            <div className="bg-white border border-emerald-300 rounded-lg p-5 sm:p-6 space-y-5 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-bold bg-[#16A34A] text-white">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Task Marked as Done
                    </span>
                    <StatusBadge status={existingSubmission.status} />
                  </div>
                  <h2 className="text-base font-bold text-slate-900 mt-2">
                    Your Submitted Work
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Submitted on {existingSubmission.submittedAt} • Format:{" "}
                    {existingSubmission.submittedData.format.replace(/_/g, " ")}
                  </p>
                </div>

                {existingSubmission.status !== "Approved" && (
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={handleStartEditSubmission}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-[#F0FDF4] border border-emerald-300 text-[#14532D] hover:bg-emerald-100 rounded-md cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-[#16A34A]" />
                      <span>Edit Submission</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setAbortConfirmOpen(true)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-red-50 border border-red-200 text-red-700 hover:bg-red-100 rounded-md cursor-pointer"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Abort / Cancel Submission</span>
                    </button>
                  </div>
                )}
              </div>

              {existingSubmission.feedback && (
                <div className="p-3.5 rounded-md bg-amber-50 border border-amber-200 text-xs text-amber-900">
                  <span className="font-bold block mb-1">
                    Admin Reviewer Feedback:
                  </span>
                  {existingSubmission.feedback}
                </div>
              )}

              {existingSubmission.submittedData.textAnswer && (
                <div>
                  <span className="text-xs font-semibold text-slate-700 block mb-1.5">
                    Submitted Text Answer:
                  </span>
                  <pre className="p-3.5 bg-slate-900 text-slate-100 rounded-md text-xs font-mono whitespace-pre-wrap">
                    {existingSubmission.submittedData.textAnswer}
                  </pre>
                </div>
              )}

              {existingSubmission.submittedData.tableRows &&
                existingSubmission.submittedData.tableRows.length > 0 && (
                  <div>
                    <span className="text-xs font-semibold text-slate-700 block mb-1.5">
                      Submitted Structured Table Rows:
                    </span>
                    <div className="border border-slate-200 rounded-md overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold text-slate-600">
                            {Object.keys(
                              existingSubmission.submittedData.tableRows[0]
                            ).map((col) => (
                              <th key={col} className="py-2 px-3">
                                {col}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {existingSubmission.submittedData.tableRows.map(
                            (row, idx) => (
                              <tr key={idx}>
                                {Object.values(row).map((val, cIdx) => (
                                  <td
                                    key={cIdx}
                                    className="py-2 px-3 text-slate-700"
                                  >
                                    {val || "—"}
                                  </td>
                                ))}
                              </tr>
                            )
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

              {existingSubmission.submittedData.fieldValues && (
                <div>
                  <span className="text-xs font-semibold text-slate-700 block mb-1.5">
                    Submitted Extracted Fields:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 bg-slate-50 p-3.5 rounded-md border border-slate-200 text-xs">
                    {Object.entries(
                      existingSubmission.submittedData.fieldValues
                    ).map(([key, value]) => (
                      <div key={key}>
                        <span className="text-[11px] text-slate-400 uppercase font-semibold block">
                          {key}
                        </span>
                        <span className="font-medium text-slate-900">
                          {value || "—"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {existingSubmission.submittedData.fileName && (
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-md flex items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2 font-semibold text-slate-800">
                    <FileText className="w-4 h-4 text-[#16A34A]" />
                    <span>{existingSubmission.submittedData.fileName}</span>
                    {existingSubmission.submittedData.fileSize && (
                      <span className="text-slate-400 font-normal">
                        ({existingSubmission.submittedData.fileSize})
                      </span>
                    )}
                  </div>
                  {existingSubmission.submittedData.fileUrl && (
                    <a
                      href={existingSubmission.submittedData.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1 text-xs font-semibold bg-[#16A34A] text-white rounded hover:bg-[#15803d]"
                    >
                      View Uploaded File
                    </a>
                  )}
                </div>
              )}

              {existingSubmission.submittedData.notes && (
                <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-md border border-slate-200">
                  <span className="font-semibold text-slate-800">Notes: </span>
                  {existingSubmission.submittedData.notes}
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-lg p-5 sm:p-6 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-base font-semibold text-slate-900">
                    {isEditingSubmission
                      ? "Edit Your Submitted Work"
                      : "Submit Your Completed Work"}
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {isEditingSubmission
                      ? "Update your answers or file below and save your changes."
                      : "Complete the required submission format below and submit for verification."}
                  </p>
                </div>

                {isEditingSubmission && (
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsEditingSubmission(false)}
                      className="px-3 py-1.5 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-md cursor-pointer"
                    >
                      Cancel Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => setAbortConfirmOpen(true)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-red-700 bg-red-50 border border-red-200 hover:bg-red-100 rounded-md cursor-pointer"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Abort / Cancel Submission</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Format Switcher Tabs (Supports all 6 required formats) */}
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Submission Format Mode
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {FORMAT_LABELS.map((fmt) => (
                    <button
                      key={fmt.id}
                      type="button"
                      onClick={() => {
                        setActiveFormat(fmt.id);
                        setValidationError(null);
                      }}
                      className={`px-2.5 py-1.5 rounded text-xs font-medium transition-colors cursor-pointer ${
                        activeFormat === fmt.id
                          ? "bg-[#14532D] text-white"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {fmt.label}
                    </button>
                  ))}
                </div>
              </div>

              {validationError && (
                <div className="p-3 rounded-md bg-red-50 border border-red-200 text-xs text-red-700 font-medium">
                  {validationError}
                </div>
              )}

              <form onSubmit={handlePreSubmit} className="space-y-4">
                {/* 1. Single Text Input */}
                {activeFormat === "text_input" && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Extracted Text Answer *
                    </label>
                    <input
                      type="text"
                      value={singleText}
                      onChange={(e) => setSingleText(e.target.value)}
                      placeholder="Enter the extracted information here..."
                      className="w-full px-3.5 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:bg-white focus:border-[#16A34A]"
                    />
                  </div>
                )}

                {/* 2. Multiline Text Area */}
                {activeFormat === "multiline_text" && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Extracted Items / Full Transcription (One per line) *
                    </label>
                    <textarea
                      rows={6}
                      value={multilineText}
                      onChange={(e) => setMultilineText(e.target.value)}
                      placeholder={
                        task.category === "Email Extraction"
                          ? "info@savannalogistics.co.ke\norders@kilimanifresh.co.ke\n..."
                          : "Type the transcribed text or extracted lines here..."
                      }
                      className="w-full px-3.5 py-2.5 text-sm font-mono bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:bg-white focus:border-[#16A34A]"
                    />
                  </div>
                )}

                {/* 3. Structured Table Entry */}
                {activeFormat === "structured_table" && (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-semibold text-slate-700">
                        Structured Table Data Entry *
                      </label>
                      <button
                        type="button"
                        onClick={handleAddTableRow}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-[#16A34A] hover:text-[#14532D] cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Row</span>
                      </button>
                    </div>

                    <div className="border border-slate-200 rounded-md overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold text-slate-600">
                            <th className="py-2.5 px-3 w-10">#</th>
                            {defaultColumns.map((col) => (
                              <th key={col} className="py-2.5 px-3">
                                {col}
                              </th>
                            ))}
                            <th className="py-2.5 px-3 w-10"></th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-xs">
                          {tableRows.map((row, rIdx) => (
                            <tr key={rIdx}>
                              <td className="py-2 px-3 text-slate-400 font-mono">
                                {rIdx + 1}
                              </td>
                              {defaultColumns.map((col) => (
                                <td key={col} className="p-1.5">
                                  <input
                                    type="text"
                                    value={row[col] || ""}
                                    onChange={(e) =>
                                      handleTableCellChange(
                                        rIdx,
                                        col,
                                        e.target.value
                                      )
                                    }
                                    placeholder={`Enter ${col}`}
                                    className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded focus:outline-none focus:bg-white focus:border-[#16A34A]"
                                  />
                                </td>
                              ))}
                              <td className="p-1.5 text-center">
                                <button
                                  type="button"
                                  onClick={() => handleRemoveTableRow(rIdx)}
                                  className="text-slate-400 hover:text-red-600 p-1 cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* 4. Multiple Input Fields */}
                {activeFormat === "multiple_fields" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {defaultFields.map((field) => (
                      <div
                        key={field.id}
                        className={
                          field.id === "dispatchRemarks" ||
                          field.id === "summaryRemarks"
                            ? "sm:col-span-2"
                            : ""
                        }
                      >
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          {field.label} {field.required && "*"}
                        </label>
                        <input
                          type="text"
                          value={fieldValues[field.id] || ""}
                          onChange={(e) =>
                            setFieldValues((prev) => ({
                              ...prev,
                              [field.id]: e.target.value,
                            }))
                          }
                          placeholder={field.placeholder}
                          className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:bg-white focus:border-[#16A34A]"
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* 5 & 6. File Upload / PDF Upload */}
                {(activeFormat === "file_upload" ||
                  activeFormat === "pdf_upload") && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      {activeFormat === "pdf_upload"
                        ? "Upload Formatted PDF Document (.pdf) *"
                        : "Upload Completed Task File (.docx, .xlsx, .csv) *"}
                    </label>
                    <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center bg-slate-50/60 hover:border-[#16A34A] transition-colors">
                      <Upload className="w-7 h-7 text-[#16A34A] mx-auto mb-2" />
                      <p className="text-xs font-semibold text-slate-800">
                        {isUploadingToCloudinary
                          ? "Uploading file to Cloudinary..."
                          : selectedFile
                          ? `Uploaded: ${selectedFile.name} (${selectedFile.size})`
                          : "Select a file from your device to upload to Cloudinary"}
                      </p>
                      {selectedFile?.url && (
                        <p className="text-[11px] text-[#16A34A] font-medium mt-1">
                          ✓ Saved on Cloudinary CDN
                        </p>
                      )}
                      <p className="text-[11px] text-slate-500 mt-1 mb-3">
                        {activeFormat === "pdf_upload"
                          ? "Accepted format: PDF up to 10 MB"
                          : "Accepted formats: DOCX, XLSX, CSV, TXT, PDF up to 10 MB"}
                      </p>
                      <div className="flex items-center justify-center gap-2">
                        <label className="px-3.5 py-1.5 text-xs font-semibold bg-white border border-slate-300 rounded-md text-slate-700 hover:bg-slate-50 cursor-pointer inline-flex items-center gap-1.5">
                          {isUploadingToCloudinary && (
                            <Loader2 className="w-3.5 h-3.5 animate-spin text-[#16A34A]" />
                          )}
                          <span>
                            {isUploadingToCloudinary
                              ? "Uploading..."
                              : "Choose & Upload File"}
                          </span>
                          <input
                            type="file"
                            disabled={isUploadingToCloudinary}
                            accept={
                              activeFormat === "pdf_upload"
                                ? ".pdf"
                                : ".doc,.docx,.xls,.xlsx,.csv,.txt,.pdf"
                            }
                            onChange={handleFileChange}
                            className="hidden"
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {/* Optional Earner Notes */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Additional Reviewer Notes{" "}
                    <span className="font-normal text-slate-400">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={optionalNotes}
                    onChange={(e) => setOptionalNotes(e.target.value)}
                    placeholder="Any comments for the quality reviewer..."
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:bg-white focus:border-[#16A34A]"
                  />
                </div>

                <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
                  {isEditingSubmission ? (
                    <button
                      type="button"
                      onClick={() => setIsEditingSubmission(false)}
                      className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-md cursor-pointer"
                    >
                      Cancel Edit
                    </button>
                  ) : (
                    <Link
                      href="/dashboard/tasks"
                      className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-md"
                    >
                      <XCircle className="w-3.5 h-3.5 text-slate-500" />
                      <span>Abort / Cancel Task</span>
                    </Link>
                  )}

                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-[#16A34A] hover:bg-[#15803d] rounded-md transition-colors cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>
                      {isEditingSubmission
                        ? "Save Updated Submission"
                        : "Submit Task for Review"}
                    </span>
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Right Column: Quality Checklist + Sidebar Sponsored Ad */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-4">
            <h3 className="text-sm font-semibold text-slate-900">
              Quality Approval Checklist
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-600">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0 mt-0.5" />
                <span>
                  Verify that all extracted names, numbers, and email addresses
                  match the source scan without typos.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0 mt-0.5" />
                <span>
                  Do not submit partial work—complete all visible entries shown
                  in the attachment.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0 mt-0.5" />
                <span>
                  Once approved,{" "}
                  <strong className="text-slate-900">KSh {task.reward}</strong>{" "}
                  will be credited directly to your Available Balance.
                </span>
              </li>
            </ul>
          </div>

          {/* Sidebar Sponsored Video Ad */}
          <AdvertisementBanner position="task_details_video" compact />

          {/* Sidebar Sponsored Banner Ad */}
          <AdvertisementBanner position="task_details_sidebar" compact />
        </div>
      </div>

      {/* Submit / Update Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        onConfirm={handleConfirmSubmission}
        title={
          isEditingSubmission
            ? "Confirm Updated Submission"
            : "Confirm Task Submission"
        }
        description={
          isEditingSubmission
            ? "Save your updated submission changes and send for quality review?"
            : "Are you sure you are ready to submit your completed work for quality review? Make sure all extracted entries are accurate."
        }
        confirmLabel={
          isEditingSubmission
            ? "Save Updated Submission"
            : "Confirm & Submit Work"
        }
        summaryItems={[
          { label: "Task Title", value: task.title },
          { label: "Category", value: task.category },
          { label: "Reward Amount", value: `KSh ${task.reward}` },
          {
            label: "Status After Submit",
            value: "Done • Pending Review",
          },
        ]}
      />

      {/* Abort / Cancel Submission Confirmation Modal */}
      <ConfirmationModal
        isOpen={abortConfirmOpen}
        onClose={() => setAbortConfirmOpen(false)}
        onConfirm={handleAbortSubmission}
        title="Abort / Cancel Submission"
        description="Are you sure you want to abort and cancel this submission? The task will be unmarked as Done and removed from the review queue."
        confirmLabel="Yes, Abort & Cancel Submission"
        summaryItems={[
          { label: "Task Title", value: task.title },
          { label: "Reward", value: `KSh ${task.reward}` },
          {
            label: "Action",
            value: "Cancel submission & unmark task as Done",
          },
        ]}
      />
    </div>
  );
}

