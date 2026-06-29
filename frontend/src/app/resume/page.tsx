import { fetchPortfolio } from "@/lib/api";
import { ArrowLeft, Download } from "lucide-react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Resume",
  description:
    "Resume of Gaurav Rauthan — Frontend Developer specialising in React.js, Next.js, and TypeScript.",
  alternates: { canonical: "/resume" },
  openGraph: {
    title: "Resume | Gaurav Rauthan",
    description:
      "Resume of Gaurav Rauthan — Frontend Developer specialising in React.js, Next.js, and TypeScript.",
    url: "/resume",
    type: "profile",
  },
  twitter: {
    card: "summary_large_image",
    title: "Resume | Gaurav Rauthan",
    description:
      "Resume of Gaurav Rauthan — Frontend Developer specialising in React.js, Next.js, and TypeScript.",
  },
};

export default async function ResumePage() {
  const data = await fetchPortfolio();
  const resumeUrl = data.profile.resume_url;

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: "var(--bg-primary)", color: "var(--text-primary)" }}
    >
      {/* Top bar */}
      <div
        className="sticky top-0 z-10 flex items-center justify-between px-6 h-14 border-b backdrop-blur-xl"
        style={{
          background: "var(--bg-primary)/80",
          borderColor: "var(--border)",
        }}
      >
        <Link
          href="/"
          className="flex items-center gap-2 text-sm font-medium transition-colors hover:text-[var(--text-primary)]"
          style={{ color: "var(--text-secondary)" }}
        >
          <ArrowLeft size={15} />
          Back
        </Link>

        <span
          className="text-sm font-semibold tracking-tight"
          style={{ letterSpacing: "-0.02em" }}
        >
          Gaurav Rauthan — Resume
        </span>

        {resumeUrl && (
          <a
            href={resumeUrl}
            download
            className="flex items-center gap-1.5 text-sm font-medium rounded-lg px-4 py-1.5 transition-opacity hover:opacity-80 text-white"
            style={{ background: "var(--accent)" }}
          >
            <Download size={13} />
            Download
          </a>
        )}
      </div>

      {/* PDF viewer */}
      <div className="flex-1 flex flex-col">
        {resumeUrl ? (
          <iframe
            src={`${resumeUrl}#toolbar=0&navpanes=0&scrollbar=1`}
            className="flex-1 w-full"
            style={{ minHeight: "calc(100vh - 3.5rem)", border: "none" }}
            title="Gaurav Rauthan Resume"
          />
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p style={{ color: "var(--text-muted)" }}>No resume uploaded yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
