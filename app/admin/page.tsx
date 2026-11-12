"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  BarChart3,
  Briefcase,
  CheckCircle2,
  ClipboardCheck,
  CreditCard,
  Edit3,
  Eye,
  FileText,
  History,
  LayoutDashboard,
  Megaphone,
  Menu,
  PlusCircle,
  Power,
  Settings,
  ShieldCheck,
  Trash2,
  UserCheck,
  Users,
  Wallet,
  X,
} from "lucide-react";
import { useApp } from "@/context/AppContext";
import {
  AdPosition,
  Submission,
  SubmissionFormat,
  Task,
  TaskCategory,
  TaskDifficulty,
} from "@/lib/types";
import { StatsCard } from "@/components/StatsCard";
import { StatusBadge } from "@/components/StatusBadge";
import { AdvertisementBanner } from "@/components/AdvertisementBanner";
import { TransactionTable } from "@/components/TransactionTable";
import { EarningsChart } from "@/components/EarningsChart";

type AdminSection =
  | "overview"
  | "manage_tasks"
  | "create_task"
  | "submissions"
  | "users"
  | "referrals"
  | "withdrawals"
  | "transactions"
  | "advertisements"
  | "reports"
  | "settings";

const ADMIN_NAV: {
  id: AdminSection;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "manage_tasks", label: "Manage Tasks", icon: Briefcase },
  { id: "create_task", label: "Create Task", icon: PlusCircle },
  { id: "submissions", label: "Task Submissions", icon: ClipboardCheck },
  { id: "users", label: "Manage Users", icon: Users },
  { id: "referrals", label: "Referral Management", icon: UserCheck },
  { id: "withdrawals", label: "Withdrawal Requests", icon: CreditCard },
  { id: "transactions", label: "Transactions", icon: History },
  { id: "advertisements", label: "Advertisements", icon: Megaphone },
  { id: "reports", label: "Reports", icon: BarChart3 },
  { id: "settings", label: "Settings", icon: Settings },
];

export default function AdminDashboardPage() {
  const {
    allUsers,
    tasks,
    submissions,
    withdrawals,
    transactions,
    referrals,
    ads,
    createTask,
    updateTask,
    deleteTask,
    toggleTaskActive,
    reviewSubmission,
    processWithdrawal,
    createAd,
    toggleAdActive,
    deleteAd,
    toggleUserStatus,
  } = useApp();

  const [activeTab, setActiveTab] = useState<AdminSection>("overview");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Create / Edit Task State
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDesc, setTaskDesc] = useState("");
  const [taskCategory, setTaskCategory] =
    useState<TaskCategory>("Email Extraction");
  const [taskReward, setTaskReward] = useState(75);
  const [taskTime, setTaskTime] = useState("15 mins");
  const [taskDifficulty, setTaskDifficulty] =
    useState<TaskDifficulty>("Easy");
  const [taskSlots, setTaskSlots] = useState(30);
  const [taskDeadline, setTaskDeadline] = useState("2026-11-25");
  const [taskFormat, setTaskFormat] =
    useState<SubmissionFormat>("multiline_text");
  const [taskAttachmentName, setTaskAttachmentName] = useState(
    "Scanned_Batch_Document.png"
  );
  const [taskInstructionsText, setTaskInstructionsText] = useState(
    "Download the attached file.\nExtract all required records accurately.\nSubmit your structured answer for review."
  );
  const [taskToast, setTaskToast] = useState<string | null>(null);

  // Submission Review Modal State
  const [reviewingSub, setReviewingSub] = useState<Submission | null>(null);
  const [reviewFeedback, setReviewFeedback] = useState("");

  // Advertisement Creation State
  const [adTitle, setAdTitle] = useState("");
  const [adSponsor, setAdSponsor] = useState("");
  const [adDesc, setAdDesc] = useState("");
  const [adCta, setAdCta] = useState("Learn More");
  const [adPosition, setAdPosition] =
    useState<AdPosition>("dashboard_banner");
  const [previewAdId, setPreviewAdId] = useState<string | null>(null);

  // Platform Settings State
  const [minWithdrawalSetting, setMinWithdrawalSetting] = useState(300);
  const [referralBonusSetting, setReferralBonusSetting] = useState(50);
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Overview Computed Metrics
  const totalRegisteredUsers = allUsers.length;
  const activeUsersCount = allUsers.filter((u) => u.status === "Active").length;
  const totalTasksCount = tasks.length;
  const pendingSubmissionsCount = submissions.filter(
    (s) => s.status === "Pending Review"
  ).length;
  const approvedSubmissionsCount = submissions.filter(
    (s) => s.status === "Approved"
  ).length;
  const pendingWithdrawalsCount = withdrawals.filter(
    (w) => w.status === "Processing"
  ).length;
  const totalRewardsIssued = allUsers.reduce(
    (sum, u) => sum + u.totalEarnings,
    0
  );

  const startEditTask = (task: Task) => {
    setEditingTaskId(task.id);
    setTaskTitle(task.title);
    setTaskDesc(task.shortDescription);
    setTaskCategory(task.category);
    setTaskReward(task.reward);
    setTaskTime(task.estimatedTime);
    setTaskDifficulty(task.difficulty);
    setTaskSlots(task.availableSlots);
    setTaskDeadline(task.deadline);
    setTaskFormat(task.submissionFormat);
    setTaskAttachmentName(task.attachment.name);
    setTaskInstructionsText(task.instructions.join("\n"));
    setActiveTab("create_task");
  };

  const handleSaveTask = (e: React.FormEvent) => {
    e.preventDefault();
    const instructionsList = taskInstructionsText
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);

    if (editingTaskId) {
      updateTask(editingTaskId, {
        title: taskTitle,
        shortDescription: taskDesc,
        category: taskCategory,
        reward: Number(taskReward),
        estimatedTime: taskTime,
        difficulty: taskDifficulty,
        availableSlots: Number(taskSlots),
        deadline: taskDeadline,
        submissionFormat: taskFormat,
        instructions:
          instructionsList.length > 0
            ? instructionsList
            : ["Follow task instructions carefully."],
        attachment: {
          name: taskAttachmentName || "Task_Attachment.png",
          size: "950 KB",
          type: "image",
          sampleContent: [
            `Attachment Preview for ${taskTitle}`,
            "Sample line 1: Verified record entry",
          ],
        },
      });
      setTaskToast("Task updated successfully!");
      setEditingTaskId(null);
    } else {
      createTask({
        title: taskTitle || "New Digital Microtask",
        shortDescription:
          taskDesc ||
          "Complete the extraction instructions and submit for verification.",
        category: taskCategory,
        reward: Number(taskReward) || 60,
        estimatedTime: taskTime || "15 mins",
        difficulty: taskDifficulty,
        availableSlots: Number(taskSlots) || 25,
        totalSlots: Number(taskSlots) || 25,
        deadline: taskDeadline || "2026-11-30",
        active: true,
        submissionFormat: taskFormat,
        instructions:
          instructionsList.length > 0
            ? instructionsList
            : ["Complete the task and submit for review."],
        attachment: {
          name: taskAttachmentName || "Task_Source_File.png",
          size: "1.1 MB",
          type: "image",
          sampleContent: [
            `SAMPLE CONTENT FOR: ${taskTitle || "New Task"}`,
            "1. Contact: info@kenyabusiness.co.ke | Tel: 0722 000 111",
          ],
        },
      });
      setTaskToast("New task created and published to marketplace!");
    }

    setTaskTitle("");
    setTaskDesc("");
    setTimeout(() => {
      setTaskToast(null);
      setActiveTab("manage_tasks");
    }, 1200);
  };

  const handleAddAd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adTitle.trim() || !adSponsor.trim()) return;
    createAd({
      title: adTitle,
      sponsor: adSponsor,
      description:
        adDesc ||
        "Exclusive partner offer for registered Wingpoll microtask earners.",
      ctaText: adCta || "Learn More",
      ctaUrl: "#partner",
      position: adPosition,
      active: true,
      badgeText: "Sponsored Partner",
    });
    setAdTitle("");
    setAdSponsor("");
    setAdDesc("");
  };

  return (
    <div className="min-h-screen flex bg-[#F8FAFC]">
      {/* Mobile Sidebar Backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Admin Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-screen w-64 bg-white border-r border-slate-200 flex flex-col transition-transform duration-200 lg:sticky lg:translate-x-0 ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-16 px-5 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-md bg-[#14532D] flex items-center justify-center text-white font-bold text-base">
              W
            </div>
            <div>
              <span className="text-base font-bold tracking-tight text-slate-900 leading-none block">
                wing<span className="text-[#16A34A]">poll</span>
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#16A34A]">
                ADMIN CONSOLE
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(false)}
            className="lg:hidden p-1 text-slate-400 hover:text-slate-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {ADMIN_NAV.map((item) => {
            const Icon = item.icon;
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                  active
                    ? "bg-[#F0FDF4] text-[#14532D] font-semibold border border-emerald-200"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 ${
                      active ? "text-[#16A34A]" : "text-slate-400"
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.id === "submissions" && pendingSubmissionsCount > 0 && (
                  <span className="px-1.5 py-0.5 text-[10px] font-bold bg-amber-100 text-amber-800 rounded">
                    {pendingSubmissionsCount}
                  </span>
                )}
                {item.id === "withdrawals" && pendingWithdrawalsCount > 0 && (
                  <span className="px-1.5 py-0.5 text-[10px] font-bold bg-emerald-100 text-[#14532D] rounded">
                    {pendingWithdrawalsCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="p-3 border-t border-slate-200 bg-slate-50/50 space-y-1.5">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-3 py-2 rounded-md text-xs font-semibold text-[#14532D] bg-[#F0FDF4] border border-emerald-200 hover:bg-emerald-100"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#16A34A]" />
            <span>Switch to Earner Dashboard</span>
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Admin Header */}
        <header className="sticky top-0 z-30 h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-md text-slate-600 hover:bg-slate-100"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#16A34A]" />
              <h1 className="text-sm sm:text-base font-bold text-slate-900">
                Wingpoll Administration —{" "}
                <span className="text-[#16A34A]">
                  {ADMIN_NAV.find((n) => n.id === activeTab)?.label}
                </span>
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                setEditingTaskId(null);
                setActiveTab("create_task");
              }}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-[#16A34A] text-white rounded-md hover:bg-[#15803d] cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Create Task</span>
            </button>
            <Link
              href="/"
              className="text-xs font-medium text-slate-600 hover:text-[#16A34A]"
            >
              Public Site →
            </Link>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {/* 1. ADMIN OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Platform Operations Overview
                </h2>
                <p className="text-xs text-slate-500">
                  Real-time summary of registered earners, tasks, submissions,
                  and M-Pesa payouts.
                </p>
              </div>

              {/* 7 Required Admin Overview Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatsCard
                  title="Total Registered Users"
                  value={`${totalRegisteredUsers}`}
                  subtitle="Verified phone accounts"
                  icon={<Users className="w-5 h-5" />}
                />
                <StatsCard
                  title="Active Users"
                  value={`${activeUsersCount}`}
                  subtitle="Completing tasks this week"
                  icon={<UserCheck className="w-5 h-5" />}
                />
                <StatsCard
                  title="Total Tasks"
                  value={`${totalTasksCount}`}
                  subtitle={`${tasks.filter((t) => t.active).length} active in marketplace`}
                  icon={<Briefcase className="w-5 h-5" />}
                />
                <StatsCard
                  title="Total Rewards Issued"
                  value={`KSh ${totalRewardsIssued.toLocaleString()}`}
                  subtitle="Approved tasks + referrals"
                  icon={<Wallet className="w-5 h-5" />}
                  highlighted
                />
                <StatsCard
                  title="Pending Submissions"
                  value={`${pendingSubmissionsCount}`}
                  subtitle="Awaiting moderator review"
                  icon={<ClipboardCheck className="w-5 h-5" />}
                />
                <StatsCard
                  title="Approved Submissions"
                  value={`${approvedSubmissionsCount}`}
                  subtitle="Quality verified"
                  icon={<CheckCircle2 className="w-5 h-5" />}
                />
                <StatsCard
                  title="Pending Withdrawals"
                  value={`${pendingWithdrawalsCount}`}
                  subtitle="M-Pesa disbursement queue"
                  icon={<CreditCard className="w-5 h-5" />}
                />
              </div>

              {/* Quick Action Queues */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Pending Submissions Queue */}
                <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-slate-900">
                      Recent Task Submissions Queue
                    </h3>
                    <button
                      type="button"
                      onClick={() => setActiveTab("submissions")}
                      className="text-xs font-semibold text-[#16A34A] hover:underline cursor-pointer"
                    >
                      Review All ({submissions.length}) →
                    </button>
                  </div>
                  <div className="divide-y divide-slate-100 text-xs">
                    {submissions.slice(0, 4).map((sub) => (
                      <div
                        key={sub.id}
                        className="py-3 flex items-center justify-between gap-2"
                      >
                        <div>
                          <p className="font-semibold text-slate-900">
                            {sub.taskTitle}
                          </p>
                          <p className="text-[11px] text-slate-500">
                            by {sub.userName} • KSh {sub.reward}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <StatusBadge status={sub.status} />
                          <button
                            type="button"
                            onClick={() => {
                              setReviewingSub(sub);
                              setReviewFeedback(sub.feedback || "");
                            }}
                            className="px-2.5 py-1 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded cursor-pointer"
                          >
                            Inspect
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pending M-Pesa Withdrawals Queue */}
                <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-slate-900">
                      M-Pesa Withdrawal Requests
                    </h3>
                    <button
                      type="button"
                      onClick={() => setActiveTab("withdrawals")}
                      className="text-xs font-semibold text-[#16A34A] hover:underline cursor-pointer"
                    >
                      Manage All ({withdrawals.length}) →
                    </button>
                  </div>
                  <div className="divide-y divide-slate-100 text-xs">
                    {withdrawals.slice(0, 4).map((wth) => (
                      <div
                        key={wth.id}
                        className="py-3 flex items-center justify-between gap-2"
                      >
                        <div>
                          <p className="font-semibold text-slate-900">
                            {wth.userName} — KSh {wth.amount.toLocaleString()}
                          </p>
                          <p className="text-[11px] text-slate-500 font-mono">
                            M-Pesa: {wth.mpesaNumber} • {wth.reference}
                          </p>
                        </div>
                        <StatusBadge status={wth.status} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 2. MANAGE TASKS */}
          {activeTab === "manage_tasks" && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Manage Marketplace Tasks
                  </h2>
                  <p className="text-xs text-slate-500">
                    Edit rewards, available slots, deadlines, or activate and
                    deactivate tasks.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setEditingTaskId(null);
                    setActiveTab("create_task");
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-[#16A34A] text-white rounded-md hover:bg-[#15803d] cursor-pointer self-start"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Create New Task</span>
                </button>
              </div>

              <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                        <th className="py-3.5 px-4">Task Title</th>
                        <th className="py-3.5 px-4">Category</th>
                        <th className="py-3.5 px-4">Reward</th>
                        <th className="py-3.5 px-4">Slots</th>
                        <th className="py-3.5 px-4">Deadline</th>
                        <th className="py-3.5 px-4">Status</th>
                        <th className="py-3.5 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs">
                      {tasks.map((task) => (
                        <tr key={task.id} className="hover:bg-slate-50/80">
                          <td className="py-3.5 px-4">
                            <p className="font-semibold text-slate-900">
                              {task.title}
                            </p>
                            <span className="text-[11px] text-slate-400">
                              Format: {task.submissionFormat} •{" "}
                              {task.attachment.name}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                            {task.category}
                          </td>
                          <td className="py-3.5 px-4 font-bold text-[#14532D] whitespace-nowrap">
                            KSh {task.reward}
                          </td>
                          <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                            {task.availableSlots} / {task.totalSlots}
                          </td>
                          <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                            {task.deadline}
                          </td>
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <StatusBadge
                              status={task.active ? "Active" : "Inactive"}
                            />
                          </td>
                          <td className="py-3.5 px-4 text-right whitespace-nowrap">
                            <div className="inline-flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => startEditTask(task)}
                                className="p-1.5 text-slate-600 hover:text-[#16A34A] bg-slate-100 rounded cursor-pointer"
                                title="Edit Task"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => toggleTaskActive(task.id)}
                                className="p-1.5 text-slate-600 hover:text-amber-600 bg-slate-100 rounded cursor-pointer"
                                title={
                                  task.active
                                    ? "Deactivate Task"
                                    : "Activate Task"
                                }
                              >
                                <Power className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => deleteTask(task.id)}
                                className="p-1.5 text-slate-600 hover:text-red-600 bg-slate-100 rounded cursor-pointer"
                                title="Delete Task"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 3. CREATE / EDIT TASK */}
          {activeTab === "create_task" && (
            <div className="bg-white border border-slate-200 rounded-lg p-6 max-w-3xl space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    {editingTaskId
                      ? `Edit Task (${editingTaskId})`
                      : "Create New Microtask"}
                  </h2>
                  <p className="text-xs text-slate-500">
                    Configure task instructions, reward in KSh, attachment file,
                    and submission format.
                  </p>
                </div>
                {editingTaskId && (
                  <button
                    type="button"
                    onClick={() => setEditingTaskId(null)}
                    className="text-xs text-slate-500 hover:text-slate-800 cursor-pointer"
                  >
                    Switch to New Task
                  </button>
                )}
              </div>

              {taskToast && (
                <div className="p-3 rounded-md bg-[#F0FDF4] border border-emerald-200 text-xs font-semibold text-[#14532D]">
                  {taskToast}
                </div>
              )}

              <form onSubmit={handleSaveTask} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Task Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={taskTitle}
                      onChange={(e) => setTaskTitle(e.target.value)}
                      placeholder="e.g. Extract Email Addresses From Scanned Business Directory"
                      className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:bg-white focus:border-[#16A34A]"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Short Summary Description *
                    </label>
                    <input
                      type="text"
                      required
                      value={taskDesc}
                      onChange={(e) => setTaskDesc(e.target.value)}
                      placeholder="Brief explanation shown on marketplace task card..."
                      className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:bg-white focus:border-[#16A34A]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Task Category
                    </label>
                    <select
                      value={taskCategory}
                      onChange={(e) =>
                        setTaskCategory(e.target.value as TaskCategory)
                      }
                      className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-md"
                    >
                      <option value="Email Extraction">Email Extraction</option>
                      <option value="Image to Text">Image to Text</option>
                      <option value="Data Entry">Data Entry</option>
                      <option value="Document Formatting">
                        Document Formatting
                      </option>
                      <option value="PDF Creation">PDF Creation</option>
                      <option value="Text Transcription">
                        Text Transcription
                      </option>
                      <option value="Information Sorting">
                        Information Sorting
                      </option>
                      <option value="Simple Research">Simple Research</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Submission Format
                    </label>
                    <select
                      value={taskFormat}
                      onChange={(e) =>
                        setTaskFormat(e.target.value as SubmissionFormat)
                      }
                      className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-md"
                    >
                      <option value="multiline_text">
                        Multiline Text Area
                      </option>
                      <option value="text_input">Single Text Input</option>
                      <option value="structured_table">
                        Structured Table Entry
                      </option>
                      <option value="multiple_fields">
                        Multiple Input Fields
                      </option>
                      <option value="file_upload">File Upload</option>
                      <option value="pdf_upload">PDF Upload</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Task Reward (KSh)
                    </label>
                    <input
                      type="number"
                      min={10}
                      value={taskReward}
                      onChange={(e) => setTaskReward(Number(e.target.value))}
                      className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-md"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Available Slots
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={taskSlots}
                      onChange={(e) => setTaskSlots(Number(e.target.value))}
                      className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-md"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Estimated Completion Time
                    </label>
                    <input
                      type="text"
                      value={taskTime}
                      onChange={(e) => setTaskTime(e.target.value)}
                      placeholder="e.g. 15 mins"
                      className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-md"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Task Deadline
                    </label>
                    <input
                      type="date"
                      value={taskDeadline}
                      onChange={(e) => setTaskDeadline(e.target.value)}
                      className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-md"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Difficulty Level
                    </label>
                    <select
                      value={taskDifficulty}
                      onChange={(e) =>
                        setTaskDifficulty(e.target.value as TaskDifficulty)
                      }
                      className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-md"
                    >
                      <option value="Easy">Easy</option>
                      <option value="Medium">Medium</option>
                      <option value="Hard">Hard</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Task Attachment File Name
                    </label>
                    <input
                      type="text"
                      value={taskAttachmentName}
                      onChange={(e) => setTaskAttachmentName(e.target.value)}
                      placeholder="e.g. Directory_Scan_Batch2.png"
                      className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-md"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Step-by-Step Instructions (One instruction per line)
                    </label>
                    <textarea
                      rows={4}
                      value={taskInstructionsText}
                      onChange={(e) => setTaskInstructionsText(e.target.value)}
                      className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-md"
                    />
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveTab("manage_tasks")}
                    className="px-4 py-2 text-xs font-medium text-slate-600 bg-slate-100 rounded-md cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-semibold text-white bg-[#16A34A] hover:bg-[#15803d] rounded-md cursor-pointer"
                  >
                    {editingTaskId ? "Save Task Updates" : "Publish Task"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* 4. SUBMISSION MANAGEMENT */}
          {activeTab === "submissions" && (
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Task Submissions Moderation
                </h2>
                <p className="text-xs text-slate-500">
                  Review submitted answers, open uploaded files, provide
                  feedback, and approve or reject work.
                </p>
              </div>

              <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                        <th className="py-3.5 px-4">Submission / Task</th>
                        <th className="py-3.5 px-4">Earner</th>
                        <th className="py-3.5 px-4">Submitted Date</th>
                        <th className="py-3.5 px-4">Reward</th>
                        <th className="py-3.5 px-4">Status</th>
                        <th className="py-3.5 px-4 text-right">
                          Review Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs">
                      {submissions.map((sub) => (
                        <tr key={sub.id} className="hover:bg-slate-50/80">
                          <td className="py-3.5 px-4">
                            <p className="font-semibold text-slate-900">
                              {sub.taskTitle}
                            </p>
                            <span className="text-[11px] text-slate-400">
                              #{sub.id} • {sub.category}
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            <p className="font-medium text-slate-800">
                              {sub.userName}
                            </p>
                            <span className="text-[11px] text-slate-400">
                              {sub.userEmail}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                            {sub.submittedAt}
                          </td>
                          <td className="py-3.5 px-4 font-bold text-[#14532D] whitespace-nowrap">
                            KSh {sub.reward}
                          </td>
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <StatusBadge status={sub.status} />
                          </td>
                          <td className="py-3.5 px-4 text-right whitespace-nowrap">
                            <div className="inline-flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => {
                                  setReviewingSub(sub);
                                  setReviewFeedback(sub.feedback || "");
                                }}
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 rounded cursor-pointer"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>Review</span>
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  reviewSubmission(
                                    sub.id,
                                    "Approved",
                                    "Approved by moderator. Accurate submission!"
                                  )
                                }
                                className="px-2.5 py-1.5 text-xs font-semibold bg-[#16A34A] hover:bg-[#15803d] text-white rounded cursor-pointer"
                              >
                                Approve
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  reviewSubmission(
                                    sub.id,
                                    "Revision Required",
                                    "Please double-check missing rows and resubmit."
                                  )
                                }
                                className="px-2.5 py-1.5 text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 rounded cursor-pointer"
                              >
                                Request Correction
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  reviewSubmission(
                                    sub.id,
                                    "Rejected",
                                    "Submission did not match the source attachment."
                                  )
                                }
                                className="px-2.5 py-1.5 text-xs font-semibold bg-red-50 text-red-700 border border-red-200 rounded cursor-pointer"
                              >
                                Reject
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 5. MANAGE USERS */}
          {activeTab === "users" && (
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Manage Registered Earners
                </h2>
                <p className="text-xs text-slate-500">
                  View earner balances, completed task counts, M-Pesa phone
                  numbers, and account status.
                </p>
              </div>

              <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                        <th className="py-3.5 px-4">User</th>
                        <th className="py-3.5 px-4">M-Pesa Phone</th>
                        <th className="py-3.5 px-4">Available Balance</th>
                        <th className="py-3.5 px-4">Total Earned</th>
                        <th className="py-3.5 px-4">Tasks Done</th>
                        <th className="py-3.5 px-4">Status</th>
                        <th className="py-3.5 px-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs">
                      {allUsers.map((u) => (
                        <tr key={u.id} className="hover:bg-slate-50/80">
                          <td className="py-3.5 px-4">
                            <p className="font-semibold text-slate-900">
                              {u.name}
                            </p>
                            <span className="text-[11px] text-slate-400">
                              {u.email}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 font-mono text-slate-700">
                            {u.mpesaNumber}
                          </td>
                          <td className="py-3.5 px-4 font-bold text-[#16A34A]">
                            KSh {u.availableBalance.toLocaleString()}
                          </td>
                          <td className="py-3.5 px-4 font-semibold text-slate-800">
                            KSh {u.totalEarnings.toLocaleString()}
                          </td>
                          <td className="py-3.5 px-4 text-slate-600">
                            {u.completedTasks}
                          </td>
                          <td className="py-3.5 px-4">
                            <StatusBadge status={u.status} />
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <button
                              type="button"
                              onClick={() => toggleUserStatus(u.id)}
                              className="px-2.5 py-1 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded cursor-pointer"
                            >
                              {u.status === "Active" ? "Suspend" : "Activate"}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 6. REFERRAL MANAGEMENT */}
          {activeTab === "referrals" && (
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Referral Program Management
                </h2>
                <p className="text-xs text-slate-500">
                  Monitor referral invitations, qualifying task progress, and
                  KSh 50 commission payouts.
                </p>
              </div>

              <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                        <th className="py-3.5 px-4">Referred User</th>
                        <th className="py-3.5 px-4">Referred By</th>
                        <th className="py-3.5 px-4">Registration Date</th>
                        <th className="py-3.5 px-4">Tasks Completed</th>
                        <th className="py-3.5 px-4">Status</th>
                        <th className="py-3.5 px-4 text-right">
                          Commission Issued
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs">
                      {referrals.map((ref) => (
                        <tr key={ref.id} className="hover:bg-slate-50/80">
                          <td className="py-3.5 px-4 font-semibold text-slate-900">
                            {ref.referredName} ({ref.referredPhone})
                          </td>
                          <td className="py-3.5 px-4 text-slate-600">
                            John Kamau (KAMAU254)
                          </td>
                          <td className="py-3.5 px-4 text-slate-500">
                            {ref.registrationDate}
                          </td>
                          <td className="py-3.5 px-4 text-slate-700">
                            {ref.tasksCompleted} tasks
                          </td>
                          <td className="py-3.5 px-4">
                            <StatusBadge status={ref.status} />
                          </td>
                          <td className="py-3.5 px-4 text-right font-bold text-[#14532D]">
                            KSh {ref.rewardEarned}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 7. WITHDRAWAL MANAGEMENT */}
          {activeTab === "withdrawals" && (
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  M-Pesa Withdrawal Requests
                </h2>
                <p className="text-xs text-slate-500">
                  Verify earner balances and M-Pesa phone numbers, then approve
                  or reject payout requests.
                </p>
              </div>

              <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                        <th className="py-3.5 px-4">Reference</th>
                        <th className="py-3.5 px-4">User Details</th>
                        <th className="py-3.5 px-4">M-Pesa Number</th>
                        <th className="py-3.5 px-4">Requested Amount</th>
                        <th className="py-3.5 px-4">Status</th>
                        <th className="py-3.5 px-4 text-right">
                          Admin Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs">
                      {withdrawals.map((wth) => (
                        <tr key={wth.id} className="hover:bg-slate-50/80">
                          <td className="py-3.5 px-4 font-mono font-semibold text-slate-800 whitespace-nowrap">
                            {wth.reference}
                            <span className="block text-[10px] font-sans text-slate-400">
                              {wth.requestedAt}
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            <p className="font-semibold text-slate-900">
                              {wth.userName}
                            </p>
                            <span className="text-[11px] text-slate-400">
                              {wth.userEmail}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 font-mono font-semibold text-[#14532D]">
                            {wth.mpesaNumber}
                          </td>
                          <td className="py-3.5 px-4 font-bold text-slate-900">
                            KSh {wth.amount.toLocaleString()}
                          </td>
                          <td className="py-3.5 px-4">
                            <StatusBadge status={wth.status} />
                          </td>
                          <td className="py-3.5 px-4 text-right whitespace-nowrap">
                            <div className="inline-flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() =>
                                  processWithdrawal(
                                    wth.id,
                                    "Completed",
                                    "M-Pesa Receipt: SL99P40K2M (Approved)"
                                  )
                                }
                                className="px-2.5 py-1.5 text-xs font-semibold bg-[#16A34A] hover:bg-[#15803d] text-white rounded cursor-pointer"
                              >
                                Approve (Complete)
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  processWithdrawal(
                                    wth.id,
                                    "Failed",
                                    "Rejected / Reversed to user balance"
                                  )
                                }
                                className="px-2.5 py-1.5 text-xs font-semibold bg-red-50 text-red-700 border border-red-200 rounded cursor-pointer"
                              >
                                Reject
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 8. TRANSACTIONS */}
          {activeTab === "transactions" && (
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Platform Transaction Ledger
                </h2>
                <p className="text-xs text-slate-500">
                  All task rewards, referral commissions, M-Pesa payouts, and
                  reversal entries.
                </p>
              </div>
              <TransactionTable transactions={transactions} />
            </div>
          )}

          {/* 9. ADVERTISEMENT MANAGEMENT */}
          {activeTab === "advertisements" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Advertisement Management
                </h2>
                <p className="text-xs text-slate-500">
                  Add sponsored placements, configure ad positions, preview
                  banners, and monitor impressions & clicks.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Create Ad Form */}
                <div className="lg:col-span-5 bg-white border border-slate-200 rounded-lg p-5 space-y-4">
                  <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-slate-100">
                    Add New Advertisement
                  </h3>
                  <form onSubmit={handleAddAd} className="space-y-3.5">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Headline / Campaign Title *
                      </label>
                      <input
                        type="text"
                        required
                        value={adTitle}
                        onChange={(e) => setAdTitle(e.target.value)}
                        placeholder="e.g. Safaricom 5G Router Promo"
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-md"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Sponsor Brand Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={adSponsor}
                        onChange={(e) => setAdSponsor(e.target.value)}
                        placeholder="e.g. Safaricom PLC"
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-md"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Placement Position
                      </label>
                      <select
                        value={adPosition}
                        onChange={(e) =>
                          setAdPosition(e.target.value as AdPosition)
                        }
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-md"
                      >
                        <option value="homepage_promo">
                          Homepage Promotional Section
                        </option>
                        <option value="dashboard_banner">
                          Dashboard Top Banner
                        </option>
                        <option value="task_list_inline">
                          Between Task Listings
                        </option>
                        <option value="task_details_sidebar">
                          Task Details Sidebar
                        </option>
                        <option value="task_instructions_below">
                          Below Task Instructions
                        </option>
                        <option value="dashboard_section">
                          Dashboard Content Section
                        </option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Ad Copy / Description
                      </label>
                      <textarea
                        rows={2}
                        value={adDesc}
                        onChange={(e) => setAdDesc(e.target.value)}
                        placeholder="Short promotional copy..."
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-md"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Button CTA Label
                      </label>
                      <input
                        type="text"
                        value={adCta}
                        onChange={(e) => setAdCta(e.target.value)}
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-md"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2 px-4 bg-[#16A34A] hover:bg-[#15803d] text-white text-xs font-semibold rounded-md cursor-pointer"
                    >
                      Add Advertisement
                    </button>
                  </form>
                </div>

                {/* Ad List & Stats */}
                <div className="lg:col-span-7 space-y-4">
                  {previewAdId && (
                    <div className="bg-slate-100 border border-slate-200 rounded-lg p-4 space-y-2">
                      <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
                        <span>Live Advertisement Preview</span>
                        <button
                          type="button"
                          onClick={() => setPreviewAdId(null)}
                          className="text-slate-500 hover:text-slate-900 cursor-pointer"
                        >
                          Close Preview
                        </button>
                      </div>
                      <AdvertisementBanner
                        position="dashboard_banner"
                        customAd={ads.find((a) => a.id === previewAdId)}
                      />
                    </div>
                  )}

                  <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                            <th className="py-3 px-4">Campaign / Sponsor</th>
                            <th className="py-3 px-4">Position</th>
                            <th className="py-3 px-4">Impressions / Clicks</th>
                            <th className="py-3 px-4">Status</th>
                            <th className="py-3 px-4 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 text-xs">
                          {ads.map((ad) => {
                            const ctr = (
                              (ad.clicks / Math.max(1, ad.impressions)) *
                              100
                            ).toFixed(1);
                            return (
                              <tr key={ad.id} className="hover:bg-slate-50/80">
                                <td className="py-3.5 px-4">
                                  <p className="font-semibold text-slate-900">
                                    {ad.title}
                                  </p>
                                  <span className="text-[11px] text-slate-400">
                                    {ad.sponsor}
                                  </span>
                                </td>
                                <td className="py-3.5 px-4 font-mono text-[11px] text-slate-600">
                                  {ad.position}
                                </td>
                                <td className="py-3.5 px-4 text-slate-700 whitespace-nowrap">
                                  <strong>
                                    {ad.impressions.toLocaleString()}
                                  </strong>{" "}
                                  views • <strong>{ad.clicks}</strong> clicks (
                                  {ctr}%)
                                </td>
                                <td className="py-3.5 px-4">
                                  <StatusBadge
                                    status={ad.active ? "Active" : "Inactive"}
                                  />
                                </td>
                                <td className="py-3.5 px-4 text-right whitespace-nowrap">
                                  <div className="inline-flex items-center gap-1.5">
                                    <button
                                      type="button"
                                      onClick={() => setPreviewAdId(ad.id)}
                                      className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded cursor-pointer"
                                      title="Preview Ad"
                                    >
                                      <Eye className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => toggleAdActive(ad.id)}
                                      className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded cursor-pointer"
                                      title="Toggle Active"
                                    >
                                      <Power className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => deleteAd(ad.id)}
                                      className="p-1.5 bg-slate-100 hover:text-red-600 text-slate-700 rounded cursor-pointer"
                                      title="Delete Ad"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 10. REPORTS */}
          {activeTab === "reports" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Platform Performance Reports
                </h2>
                <p className="text-xs text-slate-500">
                  Analytics on task completion volume, approval rates, and
                  disbursed rewards.
                </p>
              </div>
              <EarningsChart />
            </div>
          )}

          {/* 11. SETTINGS */}
          {activeTab === "settings" && (
            <div className="bg-white border border-slate-200 rounded-lg p-6 max-w-xl space-y-4">
              <h2 className="text-base font-bold text-slate-900">
                Platform Rules & Payout Configuration
              </h2>
              {settingsSaved && (
                <div className="p-3 rounded-md bg-[#F0FDF4] border border-emerald-200 text-xs font-semibold text-[#14532D]">
                  Platform settings saved!
                </div>
              )}
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Minimum M-Pesa Withdrawal Threshold (KSh)
                  </label>
                  <input
                    type="number"
                    value={minWithdrawalSetting}
                    onChange={(e) =>
                      setMinWithdrawalSetting(Number(e.target.value))
                    }
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Referral Commission Per Qualified Friend (KSh)
                  </label>
                  <input
                    type="number"
                    value={referralBonusSetting}
                    onChange={(e) =>
                      setReferralBonusSetting(Number(e.target.value))
                    }
                    className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-md"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSettingsSaved(true);
                    setTimeout(() => setSettingsSaved(false), 2500);
                  }}
                  className="px-4 py-2 text-xs font-semibold bg-[#16A34A] text-white rounded-md cursor-pointer"
                >
                  Save Configuration
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Admin Submission Inspection Modal */}
      {reviewingSub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-[1px] p-4">
          <div className="bg-white border border-slate-200 rounded-lg shadow-lg max-w-lg w-full overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-mono text-slate-400">
                  SUBMISSION #{reviewingSub.id} • {reviewingSub.userName}
                </span>
                <h3 className="text-base font-bold text-slate-900">
                  {reviewingSub.taskTitle}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setReviewingSub(null)}
                className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
              <div className="flex items-center justify-between bg-slate-50 p-3 rounded border border-slate-200">
                <span>Reward: KSh {reviewingSub.reward}</span>
                <StatusBadge status={reviewingSub.status} />
              </div>

              {reviewingSub.submittedData.textAnswer && (
                <div>
                  <span className="font-semibold text-slate-700 block mb-1">
                    Submitted Text Answer:
                  </span>
                  <pre className="p-3 bg-slate-900 text-slate-100 rounded-md font-mono whitespace-pre-wrap">
                    {reviewingSub.submittedData.textAnswer}
                  </pre>
                </div>
              )}

              {reviewingSub.submittedData.fileName && (
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-md flex items-center justify-between">
                  <div className="flex items-center gap-2 font-semibold text-slate-800">
                    <FileText className="w-4 h-4 text-[#16A34A]" />
                    <span>{reviewingSub.submittedData.fileName}</span>
                  </div>
                  <span className="text-slate-400">
                    {reviewingSub.submittedData.fileSize}
                  </span>
                </div>
              )}

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Reviewer Feedback for Earner
                </label>
                <textarea
                  rows={3}
                  value={reviewFeedback}
                  onChange={(e) => setReviewFeedback(e.target.value)}
                  placeholder="Write feedback or correction instructions..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md"
                />
              </div>
            </div>

            <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  reviewSubmission(
                    reviewingSub.id,
                    "Revision Required",
                    reviewFeedback || "Please revise and resubmit."
                  );
                  setReviewingSub(null);
                }}
                className="px-3 py-1.5 text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 rounded cursor-pointer"
              >
                Request Correction
              </button>
              <button
                type="button"
                onClick={() => {
                  reviewSubmission(
                    reviewingSub.id,
                    "Rejected",
                    reviewFeedback || "Rejected during quality check."
                  );
                  setReviewingSub(null);
                }}
                className="px-3 py-1.5 text-xs font-semibold bg-red-50 text-red-700 border border-red-200 rounded cursor-pointer"
              >
                Reject
              </button>
              <button
                type="button"
                onClick={() => {
                  reviewSubmission(
                    reviewingSub.id,
                    "Approved",
                    reviewFeedback || "Great job! Task approved."
                  );
                  setReviewingSub(null);
                }}
                className="px-3.5 py-1.5 text-xs font-semibold bg-[#16A34A] text-white rounded cursor-pointer"
              >
                Approve (+KSh {reviewingSub.reward})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

