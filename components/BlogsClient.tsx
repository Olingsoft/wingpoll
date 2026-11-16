"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  BookOpen,
  Calendar,
  ChevronRight,
  Clock,
  Search,
  User,
} from "lucide-react";
import { BLOG_CATEGORIES } from "@/lib/blogs";
import type { BlogPost } from "@/lib/types";

const POSTS_PER_PAGE = 6;

export function BlogsClient({ posts }: { posts: BlogPost[] }) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesCat =
        selectedCategory === "All" || post.category === selectedCategory;
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        post.title.toLowerCase().includes(q) ||
        post.excerpt.toLowerCase().includes(q) ||
        post.tags.some((t) => t.toLowerCase().includes(q));
      return matchesCat && matchesSearch;
    });
  }, [posts, selectedCategory, searchQuery]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredPosts.length / POSTS_PER_PAGE)
  );
  const safePage = Math.min(currentPage, totalPages);
  const paginatedPosts = filteredPosts.slice(
    (safePage - 1) * POSTS_PER_PAGE,
    safePage * POSTS_PER_PAGE
  );

  return (
    <>
      {/* Header */}
      <section className="bg-white border-b border-slate-200 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center justify-center gap-1.5 text-xs text-slate-500 mb-2"
          >
            <Link href="/" className="hover:text-[#16A34A] transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-800 font-medium">Blogs & Guides</span>
          </nav>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#F0FDF4] border border-emerald-200 text-xs font-semibold text-[#14532D]">
            <BookOpen className="w-3.5 h-3.5 text-[#16A34A]" />
            WingPoll Blog & Earner Guides
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">
            Tips, Guides & Platform Updates
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto">
            Practical guides to help you complete microtasks accurately,
            maintain high approval rates, and maximize your M-Pesa payouts.
          </p>
        </div>
      </section>

      {/* Search & Categories */}
      <section className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            {BLOG_CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  setSelectedCategory(cat);
                  setCurrentPage(1);
                }}
                className={`px-3.5 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-[#16A34A] text-white"
                    : "bg-white border border-slate-200 text-slate-600 hover:border-[#16A34A]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search articles..."
              aria-label="Search blog articles"
              className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-200 rounded-md focus:outline-none focus:border-[#16A34A]"
            />
          </div>
        </div>

        {/* Articles Grid */}
        {paginatedPosts.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-lg p-10 text-center text-sm text-slate-500">
            No blog articles matched your search. Try another keyword or
            category.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedPosts.map((post) => (
              <article
                key={post.slug}
                className="bg-white border border-slate-200 rounded-lg overflow-hidden flex flex-col justify-between hover:border-[#16A34A]/60 transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.03)]"
              >
                <div>
                  <Link
                    href={`/blogs/${post.slug}`}
                    className="block relative h-44 w-full bg-slate-100 overflow-hidden"
                  >
                    <Image
                      src={post.featuredImage}
                      alt={post.featuredImageAlt || post.title}
                      fill
                      loading="lazy"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </Link>

                  <div className="p-6 space-y-3">
                    <div className="flex items-center justify-between gap-2 text-xs">
                      <span className="px-2.5 py-0.5 rounded bg-[#F0FDF4] border border-emerald-200 font-semibold text-[#14532D]">
                        {post.category}
                      </span>
                      <span className="text-slate-400 inline-flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {post.readTime}
                      </span>
                    </div>

                    <h2 className="text-base font-semibold text-slate-900 leading-snug">
                      <Link
                        href={`/blogs/${post.slug}`}
                        className="hover:text-[#16A34A] transition-colors"
                      >
                        {post.title}
                      </Link>
                    </h2>

                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                      {post.excerpt}
                    </p>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {post.author}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <time dateTime={post.publishedAt}>{post.date}</time>
                    </span>
                  </div>
                  <Link
                    href={`/blogs/${post.slug}`}
                    aria-label={`Read article: ${post.title}`}
                    className="inline-flex items-center gap-1 font-semibold text-[#16A34A] hover:underline shrink-0"
                  >
                    <span>Read Guide</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <nav
            aria-label="Blog pagination"
            className="flex items-center justify-center gap-2 pt-4"
          >
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Link
                key={page}
                href={page === 1 ? "/blogs" : `/blogs?page=${page}`}
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentPage(page);
                }}
                aria-current={safePage === page ? "page" : undefined}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold ${
                  safePage === page
                    ? "bg-[#16A34A] text-white"
                    : "bg-white border border-slate-200 text-slate-700 hover:border-[#16A34A]"
                }`}
              >
                {page}
              </Link>
            ))}
          </nav>
        )}
      </section>
    </>
  );
}

