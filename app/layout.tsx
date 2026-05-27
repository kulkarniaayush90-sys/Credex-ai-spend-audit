import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { env } from "@/lib/env";

const heading = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-heading"
});

const body = Inter({
  subsets: ["latin"],
  variable: "--font-body"
});

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
  title: {
    default: "Credex AI Spend Audit",
    template: "%s | Credex AI Spend Audit"
  },
  description: "Audit AI SaaS spend, identify waste, and produce shareable savings reports for startup teams.",
  openGraph: {
    title: "Credex AI Spend Audit",
    description: "Free audit for AI SaaS spend with deterministic recommendations and shareable reports.",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Credex AI Spend Audit",
    description: "Find wasted AI spend with a premium shareable audit report."
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${heading.variable} ${body.variable}`}>
      <body>
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
