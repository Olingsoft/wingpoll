import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  ChevronRight,
  Clock,
  Tag,
  User,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import { getBlogBySlug, getPublishedBlogs } from "@/lib/blogs";
import {
  buildBlogPostingSchema,
  buildBreadcrumbSchema,
  buildPageMetadata,
} from "@/lib/seo";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = await getPublishedBlogs();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogBySlug(slug);

  if (!post) {
    return buildPageMetadata({
      title: "Article Not Found",
      description: "The requested WingPoll blog article could not be found.",
      path: `/blogs/${slug}`,
      noIndex: true,
    });
  }

  return buildPageMetadata({
    title: post.seoTitle || post.title,
    description: post.metaDescription || post.excerpt,
    path: `/blogs/${post.slug}`,
    keywords: [...post.tags, post.category, "WingPoll", "microtasks Kenya"],
    image: post.featuredImage,
    imageAlt: post.featuredImageAlt || post.title,
    type: "article",
    publishedTime: post.publishedAt,
    modifiedTime: post.updatedAt || post.publishedAt,
    authors: [post.author],
    section: post.category,
    tags: post.tags,
  });
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getBlogBySlug(slug);

  if (!post) {
    notFound();
  }

  const allPosts = await getPublishedBlogs();
  const relatedPosts = allPosts
    .filter((p) => p.slug !== post.slug)
    .sort((a, b) => {
      const aMatch = a.category === post.category ? 1 : 0;
      const bMatch = b.category === post.category ? 1 : 0;
      return bMatch - aMatch;
    })
    .slice(0, 3);

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Blogs & Guides", path: "/blogs" },
    { name: post.title, path: `/blogs/${post.slug}` },
  ]);

  const blogPostingSchema = buildBlogPostingSchema(post);

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <JsonLd data={[breadcrumbSchema, blogPostingSchema]} />
      <Navbar />

      <main className="flex-1 py-8 sm:py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb Navigation */}
          <nav
            aria-label="Breadcrumb"
            className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500 mb-6"
          >
            <Link href="/" className="hover:text-[#16A34A] transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <Link
              href="/blogs"
              className="hover:text-[#16A34A] transition-colors"
            >
              Blogs & Guides
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-800 font-medium truncate max-w-xs sm:max-w-md">
              {post.title}
            </span>
          </nav>

          <article className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-xs">
            {/* Featured Image */}
            <div className="relative w-full h-56 sm:h-80 bg-slate-100">
              <Image
                src={post.featuredImage}
                alt={post.featuredImageAlt || post.title}
                fill
                priority
                sizes="(max-width: 896px) 100vw, 896px"
                className="object-cover"
              />
            </div>

            <div className="p-6 sm:p-10 space-y-6">
              <header className="space-y-4">
                <div className="flex flex-wrap items-center gap-2.5 text-xs">
                  <span className="px-2.5 py-1 rounded bg-[#F0FDF4] border border-emerald-200 font-semibold text-[#14532D]">
                    {post.category}
                  </span>
                  <span className="inline-flex items-center gap-1 text-slate-500">
                    <Clock className="w-3.5 h-3.5" />
                    {post.readTime}
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-tight">
                  {post.title}
                </h1>

                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-slate-500 pt-2 border-t border-slate-100">
                  <span className="inline-flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>By {post.author}</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <time dateTime={post.publishedAt}>
                      Published: {post.date}
                    </time>
                  </span>
                  {post.updatedAt && post.updatedAt !== post.publishedAt && (
                    <span className="text-slate-400">
                      Updated:{" "}
                      <time dateTime={post.updatedAt}>
                        {post.updatedAt.slice(0, 10)}
                      </time>
                    </span>
                  )}
                </div>
              </header>

              {/* Article Body */}
              <div className="space-y-4 text-sm sm:text-base text-slate-700 leading-relaxed">
                {post.content.map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>

              {/* Tags */}
              {post.tags.length > 0 && (
                <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center gap-2">
                  <Tag className="w-3.5 h-3.5 text-slate-400" />
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 text-xs font-medium"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              {/* CTA Box */}
              <div className="mt-6 bg-[#F0FDF4] border border-emerald-200 rounded-lg p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-sm font-bold text-[#14532D]">
                    Ready to Start Completing Microtasks on WingPoll?
                  </h2>
                  <p className="text-xs text-slate-600 mt-1">
                    Create your earner account and withdraw KSh earnings via
                    M-Pesa once you reach KSh 300.
                  </p>
                </div>
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-white bg-[#16A34A] hover:bg-[#15803d] rounded-md shrink-0 transition-colors"
                >
                  <span>Create Earner Account</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="pt-2">
                <Link
                  href="/blogs"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#16A34A] hover:underline"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to All WingPoll Guides</span>
                </Link>
              </div>
            </div>
          </article>

          {/* Related Articles (Internal Linking) */}
          {relatedPosts.length > 0 && (
            <section
              aria-labelledby="related-articles-heading"
              className="mt-10 space-y-4"
            >
              <h2
                id="related-articles-heading"
                className="text-lg font-bold text-slate-900"
              >
                Related Guides & Articles
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {relatedPosts.map((related) => (
                  <article
                    key={related.slug}
                    className="bg-white border border-slate-200 rounded-lg p-4 flex flex-col justify-between hover:border-[#16A34A]/60 transition-colors"
                  >
                    <div className="space-y-2">
                      <span className="inline-block px-2 py-0.5 rounded bg-[#F0FDF4] border border-emerald-200 text-[11px] font-semibold text-[#14532D]">
                        {related.category}
                      </span>
                      <h3 className="text-sm font-semibold text-slate-900 leading-snug">
                        <Link
                          href={`/blogs/${related.slug}`}
                          className="hover:text-[#16A34A] transition-colors"
                        >
                          {related.title}
                        </Link>
                      </h3>
                      <p className="text-xs text-slate-500 line-clamp-2">
                        {related.excerpt}
                      </p>
                    </div>
                    <Link
                      href={`/blogs/${related.slug}`}
                      className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-[#16A34A] hover:underline"
                    >
                      <span>Read {related.category} Guide</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </article>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

