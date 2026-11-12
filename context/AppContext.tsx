"use client";

import React, { createContext, useContext, useState } from "react";
import {
  Advertisement,
  NotificationItem,
  ReferralRecord,
  Submission,
  SubmissionStatus,
  Task,
  Transaction,
  UserProfile,
  Withdrawal,
  WithdrawalStatus,
} from "@/lib/types";
import {
  INITIAL_ADS,
  INITIAL_NOTIFICATIONS,
  INITIAL_REFERRALS,
  INITIAL_SUBMISSIONS,
  INITIAL_TASKS,
  INITIAL_TRANSACTIONS,
  INITIAL_USER,
  INITIAL_WITHDRAWALS,
  MOCK_ALL_USERS,
} from "@/lib/mock-data";

interface AppContextType {
  user: UserProfile;
  allUsers: UserProfile[];
  tasks: Task[];
  submissions: Submission[];
  withdrawals: Withdrawal[];
  transactions: Transaction[];
  referrals: ReferralRecord[];
  ads: Advertisement[];
  notifications: NotificationItem[];
  submitTask: (
    taskId: string,
    submittedData: Submission["submittedData"]
  ) => Submission;
  requestWithdrawal: (amount: number, mpesaNumber: string) => Withdrawal;
  updateUserProfile: (updates: Partial<UserProfile>) => void;
  markAllNotificationsRead: () => void;
  markNotificationRead: (id: string) => void;
  // Admin methods
  createTask: (taskData: Omit<Task, "id" | "createdAt">) => Task;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  deleteTask: (taskId: string) => void;
  toggleTaskActive: (taskId: string) => void;
  reviewSubmission: (
    submissionId: string,
    status: SubmissionStatus,
    feedback?: string
  ) => void;
  processWithdrawal: (
    withdrawalId: string,
    status: WithdrawalStatus,
    notes?: string
  ) => void;
  createAd: (
    adData: Omit<Advertisement, "id" | "impressions" | "clicks">
  ) => void;
  toggleAdActive: (adId: string) => void;
  deleteAd: (adId: string) => void;
  recordAdClick: (adId: string) => void;
  toggleUserStatus: (userId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile>(INITIAL_USER);
  const [allUsers, setAllUsers] = useState<UserProfile[]>(MOCK_ALL_USERS);
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [submissions, setSubmissions] =
    useState<Submission[]>(INITIAL_SUBMISSIONS);
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>(
    INITIAL_WITHDRAWALS ?? []
  );
  const [transactions, setTransactions] =
    useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [referrals] = useState<ReferralRecord[]>(INITIAL_REFERRALS);
  const [ads, setAds] = useState<Advertisement[]>(INITIAL_ADS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(
    INITIAL_NOTIFICATIONS
  );

  const submitTask = (
    taskId: string,
    submittedData: Submission["submittedData"]
  ): Submission => {
    const task = tasks.find((t) => t.id === taskId);
    const reward = task ? task.reward : 50;
    const newSub: Submission = {
      id: `sub-${Date.now().toString().slice(-4)}`,
      taskId,
      taskTitle: task ? task.title : "Microtask Submission",
      category: task ? task.category : "Data Entry",
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      submittedAt: "2026-11-12 12:50 PM",
      reward,
      status: "Pending Review",
      submittedData,
    };

    setSubmissions((prev) => [newSub, ...prev]);

    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId && t.availableSlots > 0
          ? { ...t, availableSlots: t.availableSlots - 1 }
          : t
      )
    );

    setUser((prev) => ({
      ...prev,
      pendingEarnings: prev.pendingEarnings + reward,
    }));

    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: "Task Submitted for Review",
        message: `Your work for '${newSub.taskTitle}' (KSh ${reward}) is now Pending Review.`,
        time: "Just now",
        read: false,
        type: "submission",
      },
      ...prev,
    ]);

    return newSub;
  };

  const requestWithdrawal = (
    amount: number,
    mpesaNumber: string
  ): Withdrawal => {
    const refCode = `MPESA-WTH-${Math.floor(10000 + Math.random() * 90000)}`;
    const newWithdrawal: Withdrawal = {
      id: `wth-${Date.now().toString().slice(-4)}`,
      reference: refCode,
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      amount,
      mpesaNumber,
      requestedAt: "2026-11-12 12:52 PM",
      status: "Processing",
      notes: "Pending admin approval for M-Pesa payout",
    };

    setWithdrawals((prev) => [newWithdrawal, ...prev]);

    setUser((prev) => ({
      ...prev,
      availableBalance: Math.max(0, prev.availableBalance - amount),
    }));

    const newTxn: Transaction = {
      id: `txn-${Date.now().toString().slice(-4)}`,
      reference: refCode,
      date: "2026-11-12",
      description: `M-Pesa Withdrawal Request to ${mpesaNumber} (Pending Admin Approval)`,
      amount: -amount,
      type: "Withdrawal",
      status: "Processing",
    };

    setTransactions((prev) => [newTxn, ...prev]);

    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: "Withdrawal Request Sent for Admin Approval",
        message: `Your M-Pesa withdrawal request of KSh ${amount.toLocaleString()} to ${mpesaNumber} is awaiting admin approval.`,
        time: "Just now",
        read: false,
        type: "withdrawal",
      },
      ...prev,
    ]);

    return newWithdrawal;
  };

  const updateUserProfile = (updates: Partial<UserProfile>) => {
    setUser((prev) => {
      const updated = { ...prev, ...updates };
      if (updates.name) {
        const parts = updates.name.trim().split(" ");
        updated.avatarInitials = parts
          .map((p) => p[0])
          .join("")
          .toUpperCase()
          .slice(0, 2);
      }
      return updated;
    });
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const createTask = (taskData: Omit<Task, "id" | "createdAt">): Task => {
    const newTask: Task = {
      ...taskData,
      id: `tsk-${Math.floor(200 + Math.random() * 799)}`,
      createdAt: "2026-11-12",
    };
    setTasks((prev) => [newTask, ...prev]);
    return newTask;
  };

  const updateTask = (taskId: string, updates: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, ...updates } : t))
    );
  };

  const deleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  };

  const toggleTaskActive = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, active: !t.active } : t))
    );
  };

  const reviewSubmission = (
    submissionId: string,
    status: SubmissionStatus,
    feedback?: string
  ) => {
    const target = submissions.find((s) => s.id === submissionId);
    if (!target) return;

    const wasApproved = target.status === "Approved";

    setSubmissions((prev) =>
      prev.map((s) =>
        s.id === submissionId
          ? { ...s, status, feedback: feedback ?? s.feedback }
          : s
      )
    );

    if (target.userId === user.id) {
      if (status === "Approved" && !wasApproved) {
        setUser((prev) => ({
          ...prev,
          availableBalance: prev.availableBalance + target.reward,
          totalEarnings: prev.totalEarnings + target.reward,
          taskEarnings: prev.taskEarnings + target.reward,
          pendingEarnings: Math.max(0, prev.pendingEarnings - target.reward),
          completedTasks: prev.completedTasks + 1,
        }));

        setTransactions((prev) => [
          {
            id: `txn-${Date.now().toString().slice(-4)}`,
            reference: `TXN-2026-${Math.floor(10000 + Math.random() * 89999)}`,
            date: "2026-11-12",
            description: `Task Reward: ${target.taskTitle}`,
            amount: target.reward,
            type: "Task Reward",
            status: "Completed",
          },
          ...prev,
        ]);

        setNotifications((prev) => [
          {
            id: `notif-${Date.now()}`,
            title: `Task Approved (+KSh ${target.reward})`,
            message: `Your submission for '${target.taskTitle}' was approved!`,
            time: "Just now",
            read: false,
            type: "reward",
          },
          ...prev,
        ]);
      } else if (
        (status === "Rejected" || status === "Revision Required") &&
        target.status === "Pending Review"
      ) {
        setUser((prev) => ({
          ...prev,
          pendingEarnings: Math.max(0, prev.pendingEarnings - target.reward),
        }));
      }
    }
  };

  const processWithdrawal = (
    withdrawalId: string,
    status: WithdrawalStatus,
    notes?: string
  ) => {
    const target = withdrawals.find((w) => w.id === withdrawalId);
    if (!target) return;

    setWithdrawals((prev) =>
      prev.map((w) =>
        w.id === withdrawalId
          ? {
              ...w,
              status,
              processedAt: "2026-11-12 12:55 PM",
              notes: notes ?? w.notes,
            }
          : w
      )
    );

    setTransactions((prev) =>
      prev.map((t) =>
        t.reference === target.reference
          ? {
              ...t,
              status,
              description:
                status === "Completed"
                  ? `M-Pesa Withdrawal Approved & Sent to ${target.mpesaNumber}`
                  : status === "Failed"
                  ? `M-Pesa Withdrawal Rejected (${target.mpesaNumber})`
                  : t.description,
            }
          : t
      )
    );

    if (status === "Completed" && target.status !== "Completed") {
      if (target.userId === user.id) {
        setNotifications((prev) => [
          {
            id: `notif-${Date.now()}`,
            title: "Withdrawal Approved by Admin",
            message: `Admin approved your KSh ${target.amount.toLocaleString()} withdrawal to ${target.mpesaNumber} (${target.reference}).`,
            time: "Just now",
            read: false,
            type: "withdrawal",
          },
          ...prev,
        ]);
      }
    }

    if (status === "Failed" && target.status !== "Failed") {
      if (target.userId === user.id) {
        setUser((prev) => ({
          ...prev,
          availableBalance: prev.availableBalance + target.amount,
        }));
        setNotifications((prev) => [
          {
            id: `notif-${Date.now()}`,
            title: "Withdrawal Request Declined",
            message: `Your withdrawal request of KSh ${target.amount.toLocaleString()} (${target.reference}) was declined by admin and refunded to your Available Balance.`,
            time: "Just now",
            read: false,
            type: "withdrawal",
          },
          ...prev,
        ]);
      }
      setTransactions((prev) => [
        {
          id: `txn-rev-${Date.now().toString().slice(-4)}`,
          reference: `REV-${target.reference}`,
          date: "2026-11-12",
          description: `Reversal: Declined M-Pesa Withdrawal ${target.reference}`,
          amount: target.amount,
          type: "Withdrawal Reversal",
          status: "Completed",
        },
        ...prev,
      ]);
    }
  };

  const createAd = (
    adData: Omit<Advertisement, "id" | "impressions" | "clicks">
  ) => {
    const newAd: Advertisement = {
      ...adData,
      id: `ad-${Date.now().toString().slice(-4)}`,
      impressions: 120,
      clicks: 8,
    };
    setAds((prev) => [newAd, ...prev]);
  };

  const toggleAdActive = (adId: string) => {
    setAds((prev) =>
      prev.map((a) => (a.id === adId ? { ...a, active: !a.active } : a))
    );
  };

  const deleteAd = (adId: string) => {
    setAds((prev) => prev.filter((a) => a.id !== adId));
  };

  const recordAdClick = (adId: string) => {
    setAds((prev) =>
      prev.map((a) =>
        a.id === adId
          ? { ...a, clicks: a.clicks + 1, impressions: a.impressions + 1 }
          : a
      )
    );
  };

  const toggleUserStatus = (userId: string) => {
    setAllUsers((prev) =>
      prev.map((u) =>
        u.id === userId
          ? { ...u, status: u.status === "Active" ? "Suspended" : "Active" }
          : u
      )
    );
  };

  return (
    <AppContext.Provider
      value={{
        user,
        allUsers,
        tasks,
        submissions,
        withdrawals,
        transactions,
        referrals,
        ads,
        notifications,
        submitTask,
        requestWithdrawal,
        updateUserProfile,
        markAllNotificationsRead,
        markNotificationRead,
        createTask,
        updateTask,
        deleteTask,
        toggleTaskActive,
        reviewSubmission,
        processWithdrawal,
        createAd,
        toggleAdActive,
        deleteAd,
        recordAdClick,
        toggleUserStatus,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return ctx;
}
