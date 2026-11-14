"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  Eye,
  FileSpreadsheet,
  FileText,
  Image as ImageIcon,
  Layers,
  Plus,
  Send,
  Trash2,
  Upload,
  Users,
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import { SubmissionFormat } from "@/lib/types";
import { StatusBadge } from "@/components/StatusBadge";
import { ConfirmationModal } from "@/components/ConfirmationModal";
import { AdvertisementBanner } from "@/components/AdvertisementBanner";

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
  const { tasks, submissions, user, submitTask } = useApp();

  const task = tasks.find((t) => t.id === params.id) || tasks[0];

  const existingSubmission = submissions.find(
    (s) => s.taskId === task.id && s.userId === user.id
  );

  const [activeFormat, setActiveFormat] = useState<SubmissionFormat>(
    task.submissionFormat
  );
  const [downloadedNotice, setDownloadedNotice] = useState(false);

  // Form states for the 6 formats
  const [singleText, setSingleText] = useState("");
  const [multilineText, setMultilineText] = useState("");
  const defaultColumns = task.tableColumns || [
    "Item / Record",
    "Extracted Value",
    "Category / Unit",
    "Amount / Notes",
  ];
  const [tableRows, setTableRows] = useState<Record<string, string>[]>([
    Object.fromEntries(defaultColumns.map((col) => [col, ""])),
    Object.fromEntries(defaultColumns.map((col) => [col, ""])),
  ]);
  const defaultFields = task.fields || [
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
  } | null>(null);
  const [optionalNotes, setOptionalNotes] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [justSubmittedStatus, setJustSubmittedStatus] = useState<string | null>(
    null
  );

  const handleDownloadAttachment = () => {
    setDownloadedNotice(true);
    const content = [
      `WINGPOLL TASK ATTACHMENT: ${task.attachment.name}`,
      `Task: ${task.title} (Reward: KSh ${task.reward})`,
      "--------------------------------------------------",
      ...(task.attachment.sampleContent || []),
    ].join("\n");

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = task.attachment.name.replace(/\.(png|jpg|docx|csv)$/i, ".txt");
    a.click();
    URL.revokeObjectURL(url);
  };

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const kb = Math.max(12, Math.round(file.size / 1024));
      setSelectedFile({
        name: file.name,
        size: `${kb} KB`,
      });
      setValidationError(null);
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

  const handleConfirmSubmission = () => {
    const created = submitTask(task.id, {
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
      notes: optionalNotes,
    });

    setConfirmModalOpen(false);
    setJustSubmittedStatus(created.status);
  };

  const currentTaskStatus = justSubmittedStatus || existingSubmission?.status;

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

        {currentTaskStatus && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">Your Task Status:</span>
            <StatusBadge status={currentTaskStatus} size="md" />
          </div>
        )}
      </div>

      {/* Submission Success Alert */}
      {justSubmittedStatus && (
        <div className="bg-[#F0FDF4] border border-emerald-200 rounded-lg p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-[#16A34A] shrink-0 mt-0.5" />
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-[#14532D]">
                  Task Submitted Successfully!
                </h3>
                <StatusBadge status={justSubmittedStatus} />
              </div>
              <p className="text-xs text-emerald-900">
                Your submission for <strong>{task.title}</strong> has been
                queued for quality review.{" "}
                <strong>KSh {task.reward}</strong> has been added to your
                Pending Earnings.
              </p>
            </div>
          </div>
          <Link
            href="/dashboard/submissions"
            className="px-3.5 py-2 text-xs font-semibold bg-[#16A34A] text-white rounded-md hover:bg-[#15803d] shrink-0 text-center"
          >
            View in My Submissions →
          </Link>
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

            {/* Download Attachment Bar */}
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-md bg-white border border-slate-200 flex items-center justify-center text-[#16A34A]">
                  {task.attachment.type === "image" ? (
                    <ImageIcon className="w-5 h-5" />
                  ) : task.attachment.type === "spreadsheet" ? (
                    <FileSpreadsheet className="w-5 h-5" />
                  ) : (
                    <FileText className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-900">
                    {task.attachment.name}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    File size: {task.attachment.size} • Source Attachment
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleDownloadAttachment}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#16A34A] hover:bg-[#15803d] rounded-md transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>
                  {downloadedNotice
                    ? "Attachment Downloaded ✓"
                    : "Download Attachment"}
                </span>
              </button>
            </div>

            {/* Reference Image / Document Live Preview */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                  <Eye className="w-3.5 h-3.5 text-[#16A34A]" />
                  Reference Attachment Preview
                </span>
                <span className="text-[11px] text-slate-400">
                  Inspect content below to complete your task
                </span>
              </div>

              <div className="bg-slate-900 text-slate-100 rounded-lg p-4 sm:p-5 border border-slate-800 font-mono text-xs space-y-2 overflow-x-auto">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-700 text-[11px] text-slate-400">
                  <span>PREVIEW: {task.attachment.name}</span>
                  <span className="text-emerald-400">SCAN QUALITY: HIGH</span>
                </div>
                {(task.attachment.sampleContent || []).map((line, i) => (
                  <p key={i} className="leading-relaxed text-slate-200">
                    {line}
                  </p>
                ))}
              </div>
            </div>
          </div>

          {/* Sponsored Ad Below Task Instructions (Clearly Distinguished) */}
          <AdvertisementBanner position="task_instructions_below" />

          {/* Task Submission Form */}
          <div className="bg-white border border-slate-200 rounded-lg p-5 sm:p-6 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-base font-semibold text-slate-900">
                  Submit Your Completed Work
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Complete the required submission format below and submit for
                  verification.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  if (activeFormat === "multiline_text") {
                    setMultilineText(
                      "info@savannalogistics.co.ke\norders@kilimanifresh.co.ke\nhelp@kilimanifresh.co.ke\nsales@rvagrovet.com\nhello@amanitech.io\ntalent@amanitech.io\nops@mombasacargo.co.ke"
                    );
                  } else if (activeFormat === "text_input") {
                    setSingleText(
                      "Thika - 01000, Eldoret - 30100, Kisumu - 40100, Nyeri - 10100, Machakos - 90100"
                    );
                  } else if (activeFormat === "structured_table") {
                    setTableRows([
                      {
                        [defaultColumns[0]]: "FRESH FRI COOKING OIL 2L",
                        [defaultColumns[1]]: "1",
                        [defaultColumns[2]]: "645.00",
                        [defaultColumns[3]]: "645.00",
                      },
                      {
                        [defaultColumns[0]]: "EXE ALL PURPOSE FLOUR 2KG",
                        [defaultColumns[1]]: "2",
                        [defaultColumns[2]]: "195.00",
                        [defaultColumns[3]]: "390.00",
                      },
                    ]);
                  } else if (activeFormat === "multiple_fields") {
                    const demoObj: Record<string, string> = {};
                    defaultFields.forEach((f, idx) => {
                      demoObj[f.id] =
                        idx === 0
                          ? "WB-2026-8841"
                          : idx === 1
                          ? "Peter Njuguna"
                          : idx === 2
                          ? "Nakuru, Kenyatta Avenue"
                          : "Received 14 cartons in good condition.";
                    });
                    setFieldValues(demoObj);
                  } else {
                    setSelectedFile({
                      name:
                        activeFormat === "pdf_upload"
                          ? "Formatted_Task_Output_JK.pdf"
                          : "Completed_Data_Sheet_JK.xlsx",
                      size: "284 KB",
                    });
                  }
                  setValidationError(null);
                }}
                className="text-xs font-semibold text-[#16A34A] bg-[#F0FDF4] hover:bg-emerald-100 border border-emerald-200 px-3 py-1.5 rounded-md cursor-pointer self-start sm:self-auto"
              >
                Auto-Fill Sample Answer
              </button>
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
                      {selectedFile
                        ? `Selected: ${selectedFile.name} (${selectedFile.size})`
                        : "Select a file from your device to attach"}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-1 mb-3">
                      {activeFormat === "pdf_upload"
                        ? "Accepted format: PDF up to 10 MB"
                        : "Accepted formats: DOCX, XLSX, CSV, TXT up to 10 MB"}
                    </p>
                    <div className="flex items-center justify-center gap-2">
                      <label className="px-3.5 py-1.5 text-xs font-semibold bg-white border border-slate-300 rounded-md text-slate-700 hover:bg-slate-50 cursor-pointer">
                        Choose File
                        <input
                          type="file"
                          accept={
                            activeFormat === "pdf_upload"
                              ? ".pdf"
                              : ".doc,.docx,.xls,.xlsx,.csv,.txt,.pdf"
                          }
                          onChange={handleFileChange}
                          className="hidden"
                        />
                      </label>
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedFile({
                            name:
                              activeFormat === "pdf_upload"
                                ? `${task.id}_Formatted_Submission.pdf`
                                : `${task.id}_Completed_Entry.docx`,
                            size: "320 KB",
                          })
                        }
                        className="px-3.5 py-1.5 text-xs font-semibold bg-[#F0FDF4] text-[#14532D] border border-emerald-200 rounded-md hover:bg-emerald-100 cursor-pointer"
                      >
                        Attach Demo File
                      </button>
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

              <div className="pt-2 flex items-center justify-end">
                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-[#16A34A] hover:bg-[#15803d] rounded-md transition-colors cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Task for Review</span>
                </button>
              </div>
            </form>
          </div>
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

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        onConfirm={handleConfirmSubmission}
        title="Confirm Task Submission"
        description="Are you sure you are ready to submit your completed work for quality review? Make sure all extracted entries are accurate."
        confirmLabel="Confirm & Submit Work"
        summaryItems={[
          { label: "Task Title", value: task.title },
          { label: "Category", value: task.category },
          { label: "Reward Amount", value: `KSh ${task.reward}` },
          {
            label: "Status After Submit",
            value: "Pending Review",
          },
        ]}
      />
    </div>
  );
}

