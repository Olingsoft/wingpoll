"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CheckCircle2,
  Clock,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Send,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

const contactSchema = z.object({
  fullName: z.string().min(3, "Please enter your full name."),
  email: z.string().email("Please enter a valid email address."),
  phone: z.string().optional(),
  subject: z.string().min(4, "Please enter a subject."),
  message: z
    .string()
    .min(10, "Please provide a message of at least 10 characters."),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = () => {
    setSubmitted(true);
    reset();
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <Navbar />

      <main className="flex-1">
        {/* Header */}
        <section className="bg-white border-b border-slate-200 py-12 sm:py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
            <span className="inline-block px-3 py-1 rounded-md bg-[#F0FDF4] border border-emerald-200 text-xs font-semibold text-[#14532D]">
              Get in Touch
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">
              Contact WingPoll Support
            </h1>
            <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto">
              Have a question about digital tasks, account verification, M-Pesa
              withdrawals, or business partnerships? Our team is ready to help.
            </p>
          </div>
        </section>

        {/* Contact Info + Form */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Left Contact Cards */}
              <div className="lg:col-span-5 space-y-4">
                <div className="bg-white border border-slate-200 rounded-lg p-5 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-md bg-[#F0FDF4] border border-emerald-200 text-[#16A34A] flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      Email Support
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      For account inquiries, task moderation, and payouts:
                    </p>
                    <p className="text-xs font-semibold text-[#16A34A] mt-1">
                      support@wingpoll.co.ke
                    </p>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-lg p-5 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-md bg-[#F0FDF4] border border-emerald-200 text-[#16A34A] flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      Phone & WhatsApp Desk
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Available during standard East Africa Time business hours:
                    </p>
                    <p className="text-xs font-semibold text-slate-800 mt-1">
                      +254 700 123 456
                    </p>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-lg p-5 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-md bg-[#F0FDF4] border border-emerald-200 text-[#16A34A] flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      Support Operating Hours
                    </h3>
                    <p className="text-xs text-slate-600 mt-1">
                      Monday – Saturday: 8:00 AM – 6:00 PM (EAT)
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Average response time: Under 3 hours
                    </p>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 rounded-lg p-5 flex items-start gap-4">
                  <div className="w-10 h-10 rounded-md bg-[#F0FDF4] border border-emerald-200 text-[#16A34A] flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      Office Location
                    </h3>
                    <p className="text-xs text-slate-600 mt-1">
                      Westlands Commercial Centre, Nairobi, Kenya
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Contact Form */}
              <div className="lg:col-span-7 bg-white border border-slate-200 rounded-lg p-6 sm:p-8 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
                <div className="flex items-center gap-2 pb-4 mb-5 border-b border-slate-100">
                  <MessageSquare className="w-4 h-4 text-[#16A34A]" />
                  <h2 className="text-base font-bold text-slate-900">
                    Send Us a Message
                  </h2>
                </div>

                {submitted && (
                  <div className="mb-5 p-4 rounded-md bg-[#F0FDF4] border border-emerald-200 flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-[#16A34A] shrink-0 mt-0.5" />
                    <div className="text-xs text-[#14532D] space-y-1">
                      <p className="font-semibold">
                        Message Received Successfully!
                      </p>
                      <p>
                        Thank you for contacting WingPoll. Our support team will
                        reply to your email shortly.
                      </p>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. John Kamau"
                        {...register("fullName")}
                        className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:bg-white focus:border-[#16A34A]"
                      />
                      {errors.fullName && (
                        <p className="text-xs text-red-600 mt-1">
                          {errors.fullName.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        placeholder="john@example.com"
                        {...register("email")}
                        className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:bg-white focus:border-[#16A34A]"
                      />
                      {errors.email && (
                        <p className="text-xs text-red-600 mt-1">
                          {errors.email.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Phone Number{" "}
                        <span className="font-normal text-slate-400">
                          (Optional)
                        </span>
                      </label>
                      <input
                        type="text"
                        placeholder="0712345678"
                        {...register("phone")}
                        className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:bg-white focus:border-[#16A34A]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Subject *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Task Review / M-Pesa Withdrawal"
                        {...register("subject")}
                        className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:bg-white focus:border-[#16A34A]"
                      />
                      {errors.subject && (
                        <p className="text-xs text-red-600 mt-1">
                          {errors.subject.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Message *
                    </label>
                    <textarea
                      rows={5}
                      placeholder="How can we help you today?"
                      {...register("message")}
                      className="w-full px-3.5 py-2 text-sm bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:bg-white focus:border-[#16A34A]"
                    />
                    {errors.message && (
                      <p className="text-xs text-red-600 mt-1">
                        {errors.message.message}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-[#16A34A] hover:bg-[#15803d] rounded-md transition-colors cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>Send Message</span>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

