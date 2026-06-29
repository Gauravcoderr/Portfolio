import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/components/layout/QueryProvider";
import { ThemeProvider } from "@/context/ThemeContext";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", weight: ["300","400","500","600","700","800"], display: "swap" });

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://gaurav-rauthan.vercel.app";

const DESCRIPTION =
  "Software Developer 2 with 3.5+ years of experience building high-performance web applications with React.js, Next.js, TypeScript, and GenAI.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Gaurav Rauthan | Frontend Developer",
    template: "%s | Gaurav Rauthan",
  },
  description: DESCRIPTION,
  keywords: [
    "Gaurav Rauthan",
    "Frontend Developer",
    "React Developer",
    "Next.js Developer",
    "TypeScript Developer",
    "Web Developer",
    "Full Stack Developer",
    "GenAI Developer",
    "Software Engineer India",
  ],
  authors: [{ name: "Gaurav Rauthan", url: SITE_URL }],
  creator: "Gaurav Rauthan",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: { icon: "/favicon.svg" },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "Gaurav Rauthan",
    title: "Gaurav Rauthan | Frontend Developer",
    description: DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: "Gaurav Rauthan | Frontend Developer",
    description: DESCRIPTION,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased">
        <QueryProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
