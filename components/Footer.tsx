import React from "react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pb-10 border-b border-slate-100">
          <div className="lg:col-span-4 space-y-3">
            <div className="flex items-center">
              <img
                src="/en-ke/logo.png"
                alt="WingPoll — Digital Microtask Platform"
                width={118}
                height={32}
                className="h-8 w-auto object-contain"
              />
            </div>
            <p className="text-xs text-slate-500 leading-relaxed max-w-xs">
              Clean, reliable digital microtask platform empowering earners in
              Kenya to complete simple online tasks and withdraw rewards via
              M-Pesa.
            </p>
            <p className="text-xs text-slate-400">Nairobi, Kenya</p>
          </div>

          <div className="lg:col-span-8 grid grid-cols-2 gap-x-8 gap-y-10">
            {/* Platform */}
            <div>
              <h4 className="text-sm font-bold text-slate-900 mb-3.5">
                Platform
              </h4>
              <ul className="space-y-2.5 text-xs sm:text-sm text-slate-600">
                <li>
                  <Link href="/about" className="hover:text-[#16A34A]">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/#how-it-works"
                    className="hover:text-[#16A34A]"
                  >
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link
                    href="/dashboard/tasks"
                    className="hover:text-[#16A34A]"
                  >
                    Explore Tasks
                  </Link>
                </li>
                <li>
                  <Link
                    href="/task-guidelines"
                    className="hover:text-[#16A34A]"
                  >
                    Task Guidelines
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="hover:text-[#16A34A]">
                    Careers
                  </Link>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="text-sm font-bold text-slate-900 mb-3.5">
                Resources
              </h4>
              <ul className="space-y-2.5 text-xs sm:text-sm text-slate-600">
                <li>
                  <Link href="/blogs" className="hover:text-[#16A34A]">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/help-center" className="hover:text-[#16A34A]">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="hover:text-[#16A34A]">
                    FAQs
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-[#16A34A]">
                    Contact Us
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-sm font-bold text-slate-900 mb-3.5">
                Legal
              </h4>
              <ul className="space-y-2.5 text-xs sm:text-sm text-slate-600">
                <li>
                  <Link
                    href="/privacy-policy"
                    className="hover:text-[#16A34A]"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms-and-conditions"
                    className="hover:text-[#16A34A]"
                  >
                    Terms and Conditions
                  </Link>
                </li>
                <li>
                  <Link
                    href="/cookie-policy"
                    className="hover:text-[#16A34A]"
                  >
                    Cookie Policy
                  </Link>
                </li>
                <li>
                  <Link href="/disclaimer" className="hover:text-[#16A34A]">
                    Disclaimer
                  </Link>
                </li>
              </ul>
            </div>

            {/* Community */}
            <div>
              <h4 className="text-sm font-bold text-slate-900 mb-3.5">
                Community
              </h4>
              <ul className="space-y-2.5 text-xs sm:text-sm text-slate-600">
                <li>
                  <Link
                    href="/community-guidelines"
                    className="hover:text-[#16A34A]"
                  >
                    Community Guidelines
                  </Link>
                </li>
                <li>
                  <Link href="/feedback" className="hover:text-[#16A34A]">
                    Feedback
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="hover:text-[#16A34A]">
                    Support
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="pt-6 text-center text-xs text-slate-500">
          <p>© 2026 WingPoll. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
