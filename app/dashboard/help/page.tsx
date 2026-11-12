"use client";

import React, { useState } from "react";
import {
  CheckCircle2,
  HelpCircle,
  Mail,
  MessageSquare,
  Phone,
  Shield,
} from "lucide-react";

export default function HelpSupportPage() {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [ticketSent, setTicketSent] = useState(false);

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) return;
    setTicketSent(true);
    setSubject("");
    setMessage("");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg sm:text-xl font-bold text-slate-900">
          Help Center & Support
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Platform rules, terms of use, privacy guidelines, and earner support
          desk.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Support Ticket Form */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-lg p-5 sm:p-6 space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <MessageSquare className="w-4 h-4 text-[#16A34A]" />
            <h2 className="text-base font-semibold text-slate-900">
              Submit a Support Inquiry
            </h2>
          </div>

          {ticketSent && (
            <div className="p-3.5 rounded-md bg-[#F0FDF4] border border-emerald-200 flex items-center gap-2 text-xs text-[#14532D] font-medium">
              <CheckCircle2 className="w-4 h-4 text-[#16A34A]" />
              <span>
                Support ticket #WGP-4920 created! Our team will respond within
                4 hours.
              </span>
            </div>
          )}

          <form onSubmit={handleSubmitTicket} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Inquiry Category / Subject
              </label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Question about task #TSK-105 review or M-Pesa payout"
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:bg-white focus:border-[#16A34A]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Message Details
              </label>
              <textarea
                rows={4}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe your question, task ID, or transaction reference..."
                className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:bg-white focus:border-[#16A34A]"
              />
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 text-xs font-semibold text-white bg-[#16A34A] hover:bg-[#15803d] rounded-md cursor-pointer"
            >
              Send Support Message
            </button>
          </form>
        </div>

        {/* Policies & Contact Info */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white border border-slate-200 rounded-lg p-5 space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
              <Shield className="w-4 h-4 text-[#16A34A]" />
              <span>Terms & Privacy Summary</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Wingpoll requires all task submissions to be completed accurately
              by the registered account holder. Automated bots or duplicate
              accounts are strictly prohibited.
            </p>
            <p className="text-xs text-slate-600 leading-relaxed">
              Your Kenyan phone number and email address are used solely for
              account verification and M-Pesa reward disbursements.
            </p>
          </div>

          <div className="bg-[#F0FDF4] border border-emerald-200 rounded-lg p-5 space-y-3 text-xs text-[#14532D]">
            <div className="flex items-center gap-2 font-bold text-sm">
              <HelpCircle className="w-4 h-4 text-[#16A34A]" />
              <span>Direct Contact Channels</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-[#16A34A]" />
              <span>support@wingpoll.co.ke</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-[#16A34A]" />
              <span>+254 700 123 456 (Mon–Sat, 8am–6pm EAT)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

