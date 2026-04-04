import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { QueryProvider } from "@/components/layout/QueryProvider";
import { ThemeProvider } from "@/context/ThemeContext";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Gaurav Rauthan | Frontend Developer",
  description:
    "Frontend Developer with 3+ years of experience building high-performance web applications with React.js, Next.js, TypeScript, and GenAI.",
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
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased">
        <QueryProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
