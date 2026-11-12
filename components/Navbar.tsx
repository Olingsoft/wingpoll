"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo & Brand */}
        <Link href="/" className="flex items-center gap-2.5">
          <img
            src="/logo.png"
            alt="WingPoll"
            className="h-9 w-auto object-contain"
          />
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
          <Link href="/" className="hover:text-[#16A34A] transition-colors">
            Home
          </Link>
          <Link
            href="/#how-it-works"
            className="hover:text-[#16A34A] transition-colors"
          >
            How it works
          </Link>
          <Link
            href="/#available-tasks"
            className="hover:text-[#16A34A] transition-colors"
          >
            Available tasks
          </Link>
          <Link
            href="/about"
            className="hover:text-[#16A34A] transition-colors"
          >
            About us
          </Link>
          <Link
            href="/blogs"
            className="hover:text-[#16A34A] transition-colors"
          >
            Blogs
          </Link>
          <Link
            href="/contact"
            className="hover:text-[#16A34A] transition-colors"
          >
            Contact us
          </Link>
        </nav>

        {/* Auth Actions */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/login"
            className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-[#16A34A] transition-colors"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="px-4 py-2 text-sm font-semibold text-white bg-[#16A34A] hover:bg-[#15803d] rounded-md shadow-xs transition-colors"
          >
            Create Account
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100"
          aria-label="Toggle Menu"
        >
          {mobileMenuOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-5 space-y-3">
          <div className="flex flex-col space-y-2 text-sm font-medium text-slate-700">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 hover:text-[#16A34A]"
            >
              Home
            </Link>
            <Link
              href="/#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 hover:text-[#16A34A]"
            >
              How it works
            </Link>
            <Link
              href="/#available-tasks"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 hover:text-[#16A34A]"
            >
              Available tasks
            </Link>
            <Link
              href="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 hover:text-[#16A34A]"
            >
              About us
            </Link>
            <Link
              href="/blogs"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 hover:text-[#16A34A]"
            >
              Blogs
            </Link>
            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 hover:text-[#16A34A]"
            >
              Contact us
            </Link>
          </div>
          <div className="pt-3 border-t border-slate-100 flex items-center gap-3">
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="flex-1 text-center py-2 text-sm font-medium text-slate-700 border border-slate-300 rounded-md"
            >
              Login
            </Link>
            <Link
              href="/register"
              onClick={() => setMobileMenuOpen(false)}
              className="flex-1 text-center py-2 text-sm font-semibold text-white bg-[#16A34A] rounded-md"
            >
              Create Account
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
