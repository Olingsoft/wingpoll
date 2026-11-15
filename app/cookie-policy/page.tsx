import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { PublicInfoPage } from "@/components/PublicInfoPage";
import { buildBreadcrumbSchema, buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  title: "Cookie Policy — WingPoll",
  description:
    "Learn how WingPoll uses essential cookies and local storage to maintain your login session, security preferences, and platform performance.",
  path: "/cookie-policy",
  keywords: [
    "WingPoll cookie policy",
    "WingPoll cookies",
    "browser storage policy",
  ],
});

export default function CookiePolicyPage() {
  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Cookie Policy", path: "/cookie-policy" },
  ]);

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <PublicInfoPage
        badge="Legal"
        title="Cookie Policy"
        subtitle="This Cookie Policy explains how WingPoll uses cookies and similar browser storage technologies when you visit wingpoll.co.ke."
        lastUpdated="November 15, 2026"
        breadcrumbLabel="Cookie Policy"
        sections={[
          {
            heading: "1. What Are Cookies?",
            paragraphs: [
              "Cookies are small text files stored on your browser or device when you visit a website. They help websites remember your sign-in session, keep your account secure, and deliver a smooth user experience.",
            ],
          },
          {
            heading: "2. Types of Cookies We Use",
            bullets: [
              "Essential Authentication Cookies: Required for Firebase Authentication to keep you signed in securely as you navigate between dashboard pages.",
              "Security & Anti-Abuse Storage: Helps protect login, registration, and verification flows against automated spam or unauthorized access.",
              "Preference & Session Storage: Remembers UI preferences and referral attribution codes during registration.",
            ],
          },
          {
            heading: "3. Managing Your Cookie Settings",
            paragraphs: [
              "You can clear or block cookies through your browser settings at any time. Please note that disabling essential authentication cookies will prevent you from staying signed in or completing tasks on WingPoll.",
            ],
          },
        ]}
      />
    </>
  );
}

