"use client";

import React, { useMemo, useState } from "react";
import { Calendar, Search, X } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { TransactionType } from "@/lib/types";
import { TransactionTable } from "@/components/TransactionTable";

const TRANSACTION_TYPES: ("All" | TransactionType)[] = [
  "All",
  "Task Reward",
  "Referral Reward",
  "Withdrawal",
  "Withdrawal Reversal",
];

export default function TransactionsPage() {
  const { user, transactions } = useApp();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<"All" | TransactionType>(
    "All"
  );
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const filteredTransactions = useMemo(() => {
    return transactions.filter((txn) => {
      if (txn.userId && txn.userId !== user.id) return false;
      if (selectedType !== "All" && txn.type !== selectedType) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesRef = txn.reference.toLowerCase().includes(q);
        const matchesDesc = txn.description.toLowerCase().includes(q);
        if (!matchesRef && !matchesDesc) return false;
      }

      if (startDate && txn.date < startDate) return false;
      if (endDate && txn.date > endDate) return false;

      return true;
    });
  }, [transactions, selectedType, searchQuery, startDate, endDate]);

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedType("All");
    setStartDate("");
    setEndDate("");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg sm:text-xl font-bold text-slate-900">
          Transaction History
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Complete ledger of your task rewards, referral commissions, M-Pesa
          withdrawals, and reversals.
        </p>
      </div>

      {/* Filters Bar */}
      <div className="bg-white border border-slate-200 rounded-lg p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search Input */}
          <div className="md:col-span-5 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search reference code or description..."
              className="w-full pl-9 pr-8 py-2 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:bg-white focus:border-[#16A34A]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Date From */}
          <div className="md:col-span-3 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-2.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-md text-slate-700 focus:outline-none focus:border-[#16A34A]"
              aria-label="Start Date"
            />
          </div>

          {/* Date To */}
          <div className="md:col-span-3 flex items-center gap-2">
            <span className="text-xs text-slate-400">to</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-2.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-md text-slate-700 focus:outline-none focus:border-[#16A34A]"
              aria-label="End Date"
            />
          </div>

          {/* Reset button */}
          <div className="md:col-span-1 flex items-center justify-end">
            <button
              type="button"
              onClick={handleClearFilters}
              className="w-full py-2 px-2.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-md cursor-pointer"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Transaction Type Pills */}
        <div className="flex items-center justify-between gap-2 flex-wrap pt-2 border-t border-slate-100">
          <div className="flex items-center gap-1.5 flex-wrap">
            {TRANSACTION_TYPES.map((tType) => (
              <button
                key={tType}
                type="button"
                onClick={() => setSelectedType(tType)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                  selectedType === tType
                    ? "bg-[#16A34A] text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {tType}
              </button>
            ))}
          </div>
          <span className="text-xs text-slate-500">
            {filteredTransactions.length} record
            {filteredTransactions.length === 1 ? "" : "s"}
          </span>
        </div>
      </div>

      {/* Table */}
      <TransactionTable transactions={filteredTransactions} />
    </div>
  );
}

