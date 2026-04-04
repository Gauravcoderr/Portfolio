import type { Metadata } from "next";
import { Syne, Onest } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/components/layout/QueryProvider";
import { ThemeProvider } from "@/context/ThemeContext";

const syne = Syne({ subsets: ["latin"], variable: "--font-syne", weight: ["400","500","600","700","800"] });
const onest = Onest({ subsets: ["latin"], variable: "--font-onest", weight: ["300","400","500","600","700"] });

export const metadata: Metadata = {
  title: "Gaurav Rauthan | Frontend Developer",
  description:
    "Frontend Developer with 3+ years of experience building high-performance web applications with React.js, Next.js, TypeScript, and GenAI.",
  icons: { icon: "/favicon.svg" },
  openGraph: {
    title: "Gaurav Rauthan | Frontend Developer",
    description:
      "Frontend Developer with 3+ years of experience building high-performance web applications with React.js, Next.js, TypeScript, and GenAI.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${syne.variable} ${onest.variable}`}>
      <body className="font-body antialiased">
        <QueryProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
