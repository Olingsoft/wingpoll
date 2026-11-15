import React from "react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-slate-100">
          <div className="space-y-3">
            <div className="flex items-center">
              <img
                src="/logo.png"
                alt="WingPoll — Digital Microtask Platform"
                width={118}
                height={32}
                className="h-8 w-auto object-contain"
              />
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Clean, reliable digital microtask platform empowering earners to
              complete simple online tasks and withdraw rewards via M-Pesa.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 mb-3">
              Platform
            </h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li>
                <Link href="/about" className="hover:text-[#16A34A]">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/#how-it-works" className="hover:text-[#16A34A]">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/dashboard/tasks" className="hover:text-[#16A34A]">
                  Available Tasks
                </Link>
              </li>
              <li>
                <Link href="/blogs" className="hover:text-[#16A34A]">
                  Blogs & Guides
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 mb-3">
              Legal & Policies
            </h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li>
                <Link href="/dashboard/help" className="hover:text-[#16A34A]">
                  Terms and Conditions
                </Link>
              </li>
              <li>
                <Link href="/dashboard/help" className="hover:text-[#16A34A]">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-[#16A34A]">
                  Earner Login
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 mb-3">
              Support
            </h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li>
                <Link href="/contact" className="hover:text-[#16A34A]">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/dashboard/help" className="hover:text-[#16A34A]">
                  Help Center
                </Link>
              </li>
              <li className="text-slate-400">Nairobi, Kenya</li>
            </ul>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© 2026 WingPoll Microtask Platform. All rights reserved.</p>
          <p className="text-slate-400">
            All balances and M-Pesa transactions shown are simulated demo data.
          </p>
        </div>
      </div>
    </footer>
  );
}

