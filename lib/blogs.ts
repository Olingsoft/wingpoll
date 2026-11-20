import type { BlogPost } from "./types";

export const BLOG_CATEGORIES = [
  "All",
  "Task Tips",
  "Document Formatting",
  "Earnings & Payouts",
  "Productivity",
  "Platform Updates",
] as const;

export function slugifyBlogTitle(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export const INITIAL_BLOG_POSTS: BlogPost[] = [
  {
    id: "blog-1",
    slug: "achieve-98-approval-rate-image-transcription-email-extraction",
    title:
      "How to Achieve a 98% Approval Rate on Image Transcription & Email Extraction Tasks",
    seoTitle:
      "How to Get a 98% Approval Rate on Image Transcription & Email Extraction",
    metaDescription:
      "Learn practical verification habits top WingPoll earners use to pass image transcription and email extraction quality reviews on the first try.",
    excerpt:
      "Learn the simple verification habits top WingPoll contributors use to make sure every submission passes quality review on the first try.",
    featuredImage: "/heroimg.jpg",
    featuredImageAlt:
      "WingPoll contributor reviewing scanned documents for image transcription and email extraction",
    category: "Task Tips",
    tags: [
      "image transcription",
      "email extraction",
      "microtask quality",
      "wingpoll tips",
    ],
    author: "WingPoll Quality Team",
    date: "10 Nov 2026",
    publishedAt: "2026-11-10T08:00:00+03:00",
    updatedAt: "2026-11-12T10:00:00+03:00",
    readTime: "4 min read",
    published: true,
    content: [
      "Image transcription and email extraction are among the most popular tasks on WingPoll because they can be completed quickly from either a laptop or a smartphone.",
      "1. Always Download and Zoom In: Before typing your entries, inspect the full-resolution attachment so you don't misread similar characters like 'rn' vs 'm' or '0' vs 'O' in email domains.",
      "2. Follow Line-by-Line Order: Enter extracted records from top to bottom as they appear on the scanned page. This helps moderators verify your submission much faster.",
      "3. Double-Check Domain Extensions: Many Kenyan directory scans include '.co.ke', '.or.ke', and '.ac.ke' addresses. Take 30 seconds before hitting Submit to review your list.",
    ],
  },
  {
    id: "blog-2",
    slug: "step-by-step-guide-formatting-meeting-notes-into-pdf",
    title:
      "Step-by-Step Guide: Formatting Raw Meeting Notes into Clean PDF Documents",
    seoTitle:
      "Step-by-Step Guide to Formatting Raw Meeting Notes into Clean PDFs",
    metaDescription:
      "Document formatting and PDF creation tasks pay KSh 120 to KSh 150 on WingPoll. Learn how to structure headings, bullets, and A4 PDF exports.",
    excerpt:
      "Document formatting and PDF creation tasks pay some of the highest rewards on the platform (up to KSh 120–150). Here is how to structure them cleanly.",
    featuredImage: "/hero-bg.jpg",
    featuredImageAlt:
      "Laptop workspace showing formatted PDF document creation for WingPoll microtasks",
    category: "Document Formatting",
    tags: [
      "pdf formatting",
      "document processing",
      "high paying microtasks",
      "wingpoll",
    ],
    author: "Grace Wanjiku",
    date: "06 Nov 2026",
    publishedAt: "2026-11-06T09:00:00+03:00",
    updatedAt: "2026-11-08T11:30:00+03:00",
    readTime: "5 min read",
    published: true,
    content: [
      "PDF Creation and Document Formatting tasks offer higher KSh rewards because they turn messy raw notes into polished documents ready for business use.",
      "1. Use Consistent Headings: Start with a clear Document Title, Date, and Attendance list at the top of the page.",
      "2. Convert Long Paragraphs into Bullet Points: When formatting product catalogs or committee notes, use clean bulleted lists for specifications and action items.",
      "3. Export Directly to A4 PDF: Whether you use Microsoft Word, Google Docs, or WPS Office on your phone, use the 'Export as PDF' option so fonts and spacing remain intact.",
    ],
  },
  {
    id: "blog-3",
    slug: "wingpoll-mpesa-withdrawals-and-referral-commissions-guide",
    title:
      "Understanding WingPoll M-Pesa Withdrawals and Referral Commissions",
    seoTitle:
      "WingPoll M-Pesa Withdrawals & KSh 25 Referral Commissions Explained",
    metaDescription:
      "Everything you need to know about WingPoll pending vs. available balance, the KSh 300 M-Pesa withdrawal minimum, and KSh 25 referral bonuses.",
    excerpt:
      "Everything you need to know about pending vs. available balances, the KSh 300 withdrawal threshold, and earning KSh 25 per referred friend.",
    featuredImage: "/heroimg.jpg",
    featuredImageAlt:
      "Kenyan microtask earner checking M-Pesa withdrawal balance and referral rewards on WingPoll",
    category: "Earnings & Payouts",
    tags: [
      "mpesa withdrawal",
      "referral commission",
      "earn ksh online",
      "wingpoll payouts",
    ],
    author: "WingPoll Support",
    date: "01 Nov 2026",
    publishedAt: "2026-11-01T08:30:00+03:00",
    updatedAt: "2026-11-05T14:00:00+03:00",
    readTime: "3 min read",
    published: true,
    content: [
      "When you submit a task on WingPoll, its reward is immediately reflected in your Pending Earnings while our moderators verify your work.",
      "Once approved, the reward moves directly into your Available Balance. As soon as your Available Balance reaches KSh 300 or more, you can head to the Withdrawals tab and request an M-Pesa transfer.",
      "Want to boost your balance faster? Share your unique referral link from the Referrals page. Every time a friend registers with your code and completes their first 3 approved tasks, KSh 25 is credited to your account.",
    ],
  },
  {
    id: "blog-4",
    slug: "smartphone-skills-complete-structured-table-entry-faster",
    title:
      "5 Everyday Smartphone Skills That Help You Complete Structured Table Entry Faster",
    seoTitle:
      "5 Smartphone Skills to Complete Structured Table Entry Tasks Faster",
    metaDescription:
      "Complete supermarket receipt and SME directory table entry tasks faster on mobile or desktop with these five practical accuracy habits.",
    excerpt:
      "Completing supermarket receipt and SME directory categorization tasks accurately using your mobile browser or desktop.",
    featuredImage: "/hero-bg.jpg",
    featuredImageAlt:
      "Mobile and desktop workflow for structured table data entry on WingPoll",
    category: "Productivity",
    tags: [
      "data entry",
      "smartphone earning",
      "table entry",
      "productivity kenya",
    ],
    author: "David Kiptoo",
    date: "25 Oct 2026",
    publishedAt: "2026-10-25T10:00:00+03:00",
    updatedAt: "2026-10-28T09:15:00+03:00",
    readTime: "4 min read",
    published: true,
    content: [
      "Structured table tasks ask you to read rows from a receipt or CSV batch and enter each column (such as Item Description, Quantity, and Unit Price in KSh).",
      "1. Verify Totals Row by Row: Check that Quantity multiplied by Unit Price matches the Total column before adding the next row.",
      "2. Keep Capitalization Uniform: If the instructions ask for Title Case or UPPERCASE item names, apply the same style across every row.",
      "3. Use the Reviewer Notes Field: If a receipt scan has a faded digit, mention it briefly in the optional notes box so the moderator knows you inspected it carefully.",
    ],
  },
  {
    id: "blog-5",
    slug: "avoid-revision-required-on-microtask-submissions",
    title:
      "Avoiding Common Reasons for 'Revision Required' on Microtask Submissions",
    seoTitle:
      "How to Avoid 'Revision Required' on WingPoll Microtask Submissions",
    metaDescription:
      "Understand why moderators request corrections on microtask submissions and how to quickly revise your entry to get your KSh reward approved.",
    excerpt:
      "What happens when a moderator requests a correction on your submission, and how to quickly revise and get your reward approved.",
    featuredImage: "/heroimg.jpg",
    featuredImageAlt:
      "Earner reviewing moderator feedback and updating a microtask submission",
    category: "Task Tips",
    tags: [
      "revision required",
      "task approval",
      "submission guide",
      "wingpoll review",
    ],
    author: "WingPoll Quality Team",
    date: "18 Oct 2026",
    publishedAt: "2026-10-18T11:00:00+03:00",
    updatedAt: "2026-10-20T16:00:00+03:00",
    readTime: "3 min read",
    published: true,
    content: [
      "Occasionally, you may see a 'Revision Required' status on your submission in the My Submissions tab. Don't worry—this means your work is close to approval and just needs a small fix.",
      "Click 'View Details' on the submission row to read the moderator's exact feedback (for example, a missing bullet point on item 9 or a typo in a waybill number).",
      "Then click the 'Revise' button to open the task, update your entry, and resubmit for approval.",
    ],
  },
  {
    id: "blog-6",
    slug: "how-kenyan-smes-use-microtasks-digitize-paper-records",
    title:
      "How Kenyan SMEs Use Microtask Contributors to Digitize Paper Records",
    seoTitle:
      "How Kenyan SMEs Digitize Paper Records with WingPoll Microtasks",
    metaDescription:
      "Discover how Kenyan businesses turn printed receipts, waybills, and directories into structured spreadsheets through WingPoll microtask earners.",
    excerpt:
      "A closer look at where WingPoll tasks come from—from retail receipts and logistics waybills to county business directories.",
    featuredImage: "/hero-bg.jpg",
    featuredImageAlt:
      "Kenyan business digitization workflow powered by WingPoll microtask contributors",
    category: "Platform Updates",
    tags: [
      "kenyan smes",
      "data digitization",
      "microtasks kenya",
      "wingpoll platform",
    ],
    author: "Editorial Desk",
    date: "10 Oct 2026",
    publishedAt: "2026-10-10T09:00:00+03:00",
    updatedAt: "2026-10-14T12:00:00+03:00",
    readTime: "5 min read",
    published: true,
    content: [
      "Across Kenya, thousands of businesses still rely on printed delivery notes, physical receipts, and paper directories.",
      "By splitting digitizing projects into bite-sized microtasks on WingPoll, companies get fast, human-verified digital spreadsheets while thousands of contributors earn rewards from home.",
    ],
  },
];

function decodeFirestoreValue(val: Record<string, unknown> | undefined): unknown {
  if (!val) return undefined;
  if ("stringValue" in val) return String(val.stringValue);
  if ("booleanValue" in val) return Boolean(val.booleanValue);
  if ("integerValue" in val) return Number(val.integerValue);
  if ("doubleValue" in val) return Number(val.doubleValue);
  if ("timestampValue" in val) return String(val.timestampValue);
  if ("arrayValue" in val) {
    const arr = (val.arrayValue as { values?: Record<string, unknown>[] })?.values;
    return Array.isArray(arr) ? arr.map((item) => decodeFirestoreValue(item)) : [];
  }
  return undefined;
}

async function fetchBlogsFromFirestoreRest(): Promise<BlogPost[]> {
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  if (!projectId) return [];

  try {
    const res = await fetch(
      `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/blogs`,
      { next: { revalidate: 300 } }
    );
    if (!res.ok) return [];
    const data = (await res.json()) as {
      documents?: { name: string; fields?: Record<string, Record<string, unknown>> }[];
    };
    if (!Array.isArray(data.documents)) return [];

    return data.documents
      .map((docItem): BlogPost | null => {
        const f = docItem.fields || {};
        const docId = docItem.name.split("/").pop() || "";
        const title = String(decodeFirestoreValue(f.title) || "").trim();
        if (!title) return null;

        const slug =
          String(decodeFirestoreValue(f.slug) || "").trim() ||
          slugifyBlogTitle(title);
        const excerpt = String(decodeFirestoreValue(f.excerpt) || "").trim();
        const publishedRaw = decodeFirestoreValue(f.published);
        const published =
          typeof publishedRaw === "boolean" ? publishedRaw : true;
        const publishedAt =
          String(decodeFirestoreValue(f.publishedAt) || "") ||
          new Date().toISOString();
        const updatedAt =
          String(decodeFirestoreValue(f.updatedAt) || "") || publishedAt;
        const contentRaw = decodeFirestoreValue(f.content);
        const content = Array.isArray(contentRaw)
          ? contentRaw.map(String)
          : excerpt
          ? [excerpt]
          : [];
        const tagsRaw = decodeFirestoreValue(f.tags);
        const tags = Array.isArray(tagsRaw) ? tagsRaw.map(String) : [];

        return {
          id: docId || slug,
          slug,
          title,
          seoTitle:
            String(decodeFirestoreValue(f.seoTitle) || "").trim() || title,
          metaDescription:
            String(decodeFirestoreValue(f.metaDescription) || "").trim() ||
            excerpt.slice(0, 160),
          excerpt,
          featuredImage:
            String(decodeFirestoreValue(f.featuredImage) || "").trim() ||
            "/heroimg.jpg",
          featuredImageAlt:
            String(decodeFirestoreValue(f.featuredImageAlt) || "").trim() ||
            title,
          category:
            String(decodeFirestoreValue(f.category) || "").trim() ||
            "Platform Updates",
          tags,
          author:
            String(decodeFirestoreValue(f.author) || "").trim() ||
            "WingPoll Editorial Team",
          date:
            String(decodeFirestoreValue(f.date) || "").trim() ||
            publishedAt.slice(0, 10),
          publishedAt,
          updatedAt,
          readTime:
            String(decodeFirestoreValue(f.readTime) || "").trim() ||
            "4 min read",
          published,
          content,
        };
      })
      .filter((p): p is BlogPost => Boolean(p && p.published));
  } catch {
    return [];
  }
}

export async function getPublishedBlogs(): Promise<BlogPost[]> {
  const firestorePosts = await fetchBlogsFromFirestoreRest();
  if (firestorePosts.length === 0) {
    return INITIAL_BLOG_POSTS;
  }

  const bySlug = new Map<string, BlogPost>();
  for (const post of INITIAL_BLOG_POSTS) {
    bySlug.set(post.slug, post);
  }
  for (const post of firestorePosts) {
    bySlug.set(post.slug, post);
  }

  return Array.from(bySlug.values()).sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

export async function getBlogBySlug(slug: string): Promise<BlogPost | null> {
  const posts = await getPublishedBlogs();
  return posts.find((p) => p.slug === slug) || null;
}

