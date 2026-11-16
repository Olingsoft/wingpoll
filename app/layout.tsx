import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppProvider } from "@/context/AppContext";
import { JsonLd } from "@/components/JsonLd";
import {
  SITE_CONFIG,
  SITE_URL,
  buildOrganizationSchema,
  buildWebSiteSchema,
} from "@/lib/seo";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#16A34A",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_CONFIG.defaultTitle,
    template: "%s | WingPoll",
  },
  description: SITE_CONFIG.description,
  keywords: [
    "WingPoll",
    "microtasks Kenya",
    "online tasks Kenya",
    "earn money online Kenya",
    "M-Pesa microtasks",
    "data entry tasks",
    "image transcription",
    "document formatting",
    "video extraction tasks",
  ],
  authors: [{ name: SITE_CONFIG.name, url: SITE_URL }],
  creator: SITE_CONFIG.name,
  publisher: SITE_CONFIG.name,
  alternates: {
    canonical: SITE_URL,
    languages: {
      "en-KE": SITE_URL,
      "x-default": SITE_URL,
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: SITE_CONFIG.locale,
    url: SITE_URL,
    siteName: SITE_CONFIG.name,
    title: SITE_CONFIG.defaultTitle,
    description: SITE_CONFIG.description,
    images: [
      {
        url: SITE_CONFIG.ogImage,
        width: 1200,
        height: 630,
        alt: "WingPoll — Microtask Earning Platform in Kenya",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_CONFIG.defaultTitle,
    description: SITE_CONFIG.description,
    images: [SITE_CONFIG.ogImage],
  },
  icons: {
    icon: "/en-ke/icon.png",
    shortcut: "/en-ke/icon.png",
    apple: "/en-ke/apple-icon.png",
  },
  ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? {
        verification: {
          google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
        },
      }
    : {}),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en-KE"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#F8FAFC] text-slate-900">
        <JsonLd data={[buildOrganizationSchema(), buildWebSiteSchema()]} />
        <AppProvider>{children}</AppProvider>
        <Script
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3984271218322436"
          strategy="lazyOnload"
          crossOrigin="anonymous"
        />
        <Script
          src="https://abscloud.org/1/7adfc76466f73edaa573b97b204a9561"
          strategy="lazyOnload"
          data-cfasync="false"
        />
        <Script
          src="https://bauval.org/14/08e451d279eff3066ce389c4216337f3"
          strategy="lazyOnload"
          data-cfasync="false"
        />
      </body>
    </html>
  );
}
