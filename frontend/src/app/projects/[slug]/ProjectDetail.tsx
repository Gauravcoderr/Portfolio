"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft, ExternalLink, Github, Globe, CheckCircle2,
  Code2, Briefcase, Star, ChevronRight,
} from "lucide-react";
import type { Project } from "@/types";
import { getIconUrl, screenshotUrl } from "@/lib/iconMap";

function TechBadge({ name }: { name: string }) {
  const iconUrl = getIconUrl(name);
  const [imgFailed, setImgFailed] = useState(false);
  return (
    <div
      className="flex items-center gap-2 px-3 py-2 rounded-xl border transition-all duration-200 hover:scale-105"
      style={{ borderColor: "var(--border)", background: "var(--bg-secondary)" }}
    >
      {iconUrl && !imgFailed ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={iconUrl} alt={name} width={18} height={18} className="w-[18px] h-[18px] object-contain"
          onError={() => setImgFailed(true)} loading="lazy" />
      ) : (
        <span className="w-[18px] h-[18px] flex items-center justify-center text-[10px] font-bold rounded"
          style={{ background: "rgba(196,78,255,0.15)", color: "var(--accent)" }}>
          {name[0]}
        </span>
      )}
      <span className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>{name}</span>
    </div>
  );
}

function ProjectScreenshot({ url, title }: { url: string; title: string }) {
  const [status, setStatus] = useState<"loading" | "loaded" | "error">("loading");
  const src = screenshotUrl(url);
  const domain = url.replace(/^https?:\/\//, "").replace(/\/$/, "");

  return (
    <div className="rounded-2xl overflow-hidden border shadow-2xl shadow-black/60"
      style={{ borderColor: "var(--border)" }}>
      {/* Browser chrome */}
      <div className="flex items-center gap-2 px-4 py-3 border-b" style={{ background: "#141428", borderColor: "#222" }}>
        <div className="flex gap-1.5 shrink-0">
          <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
          <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
          <div className="w-3 h-3 rounded-full bg-[#28c840]" />
        </div>
        <div className="flex-1 rounded-md flex items-center gap-2 px-3 py-1.5" style={{ background: "#0e0e24" }}>
          <Globe size={11} className="shrink-0" style={{ color: "#555" }} />
          <span className="text-xs truncate" style={{ color: "#666" }}>{domain}</span>
        </div>
        {url && (
          <a href={url} target="_blank" rel="noopener noreferrer"
            className="shrink-0 p-1.5 rounded-lg transition-colors hover:bg-white/5"
            style={{ color: "#555" }}>
            <ExternalLink size={12} />
          </a>
        )}
      </div>
      {/* Screenshot */}
      <div className="relative bg-[#0d0d0d]" style={{ minHeight: "320px" }}>
        {status === "loading" && (
          <div className="absolute inset-0 flex flex-col gap-3 p-6">
            {[0.7, 1, 0.85, 0.6, 0.9, 0.75].map((w, i) => (
              <div key={i} className="h-4 rounded animate-pulse" style={{ background: "#1a1a2a", width: `${w * 100}%` }} />
            ))}
          </div>
        )}
        {status !== "error" ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt={title}
            className="w-full"
            style={{ display: "block", opacity: status === "loaded" ? 1 : 0, transition: "opacity 0.4s ease" }}
            loading="lazy"
            onLoad={() => setStatus("loaded")}
            onError={() => setStatus("error")}
          />
        ) : (
          <div className="flex flex-col items-center justify-center gap-3 py-16">
            <Globe size={28} style={{ color: "#333" }} />
            <span className="text-sm" style={{ color: "var(--text-muted)" }}>Preview unavailable</span>
          </div>
        )}
      </div>
    </div>
  );
}

interface Props {
  project: Project;
  otherProjects: Project[];
}

export default function ProjectDetail({ project, otherProjects }: Props) {
  const categoryLabel = project.category === "professional" ? "Professional" : "Personal";

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-primary)", color: "var(--text-primary)" }}>
      {/* Top nav */}
      <nav className="sticky top-0 z-50 border-b backdrop-blur-xl"
        style={{ background: "rgba(7,5,26,0.85)", borderColor: "var(--border)" }}>
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center gap-4">
          <Link href="/" className="flex items-center gap-1.5 text-sm transition-colors hover:text-[var(--accent)]"
            style={{ color: "var(--text-muted)" }}>
            <ArrowLeft size={14} />
            <span>Home</span>
          </Link>
          <ChevronRight size={12} style={{ color: "var(--border)" }} />
          <Link href="/#projects" className="text-sm transition-colors hover:text-[var(--accent)]"
            style={{ color: "var(--text-muted)" }}>
            Projects
          </Link>
          <ChevronRight size={12} style={{ color: "var(--border)" }} />
          <span className="text-sm truncate" style={{ color: "var(--text-secondary)" }}>{project.title}</span>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-14 md:py-20">

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          {/* Badges row */}
          <div className="flex flex-wrap items-center gap-2 mb-5">
            <span className="flex items-center gap-1.5 text-xs px-3 py-1 rounded-full border"
              style={{
                borderColor: project.category === "professional" ? "rgba(91,141,239,0.4)" : "rgba(196,78,255,0.4)",
                background: project.category === "professional" ? "rgba(91,141,239,0.08)" : "rgba(196,78,255,0.08)",
                color: project.category === "professional" ? "#8ab8ff" : "var(--accent-light)",
              }}>
              {project.category === "professional" ? <Briefcase size={10} /> : <Code2 size={10} />}
              {categoryLabel}
            </span>
            {project.is_featured && (
              <span className="flex items-center gap-1.5 text-xs px-3 py-1 rounded-full border"
                style={{ borderColor: "rgba(251,191,36,0.4)", background: "rgba(251,191,36,0.08)", color: "#fcd34d" }}>
                <Star size={10} />
                Featured
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-5 font-heading text-gradient-purple"
            style={{ letterSpacing: "-0.02em" }}>
            {project.title}
          </h1>

          {/* Description */}
          <div className="max-w-3xl mb-8">
            <p className="text-base md:text-lg leading-[1.85] whitespace-pre-line" style={{ color: "var(--text-secondary)" }}>
              {project.description}
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-3">
            {project.live_url && (
              <a href={project.live_url} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-white transition-all duration-200 hover:scale-105 active:scale-95"
                style={{
                  background: "linear-gradient(135deg, var(--accent) 0%, var(--accent-blue) 100%)",
                  boxShadow: "0 0 30px rgba(196,78,255,0.35)",
                }}>
                <ExternalLink size={15} />
                View Live Site
              </a>
            )}
            {project.github_url && (
              <a href={project.github_url} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-sm transition-all duration-200 hover:scale-105 backdrop-blur-sm"
                style={{
                  border: "1px solid rgba(196,78,255,0.3)",
                  background: "rgba(196,78,255,0.06)",
                  color: "var(--text-secondary)",
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = "rgba(196,78,255,0.6)";
                  el.style.color = "var(--text-primary)";
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = "rgba(196,78,255,0.3)";
                  el.style.color = "var(--text-secondary)";
                }}>
                <Github size={15} />
                View on GitHub
              </a>
            )}
          </div>
        </motion.div>

        {/* Screenshot */}
        {project.live_url && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="mb-16"
          >
            <ProjectScreenshot url={project.live_url} title={project.title} />
          </motion.div>
        )}

        {/* Two-column layout: highlights + tech stack */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">

          {/* Key Highlights */}
          {project.bullets.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h2 className="text-xl font-bold mb-5 font-heading" style={{ color: "var(--text-primary)" }}>
                Key Highlights
                <span className="block mt-2 h-[3px] w-10 rounded-full"
                  style={{ background: "linear-gradient(90deg, var(--accent), var(--accent-blue))" }} />
              </h2>
              <ul className="space-y-3">
                {project.bullets.map((bullet, i) => (
                  <motion.li
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.35, delay: 0.35 + i * 0.05 }}
                    className="flex items-start gap-3 p-4 rounded-xl border"
                    style={{ borderColor: "var(--border)", background: "var(--bg-card)" }}
                  >
                    <CheckCircle2 size={15} className="shrink-0 mt-0.5" style={{ color: "var(--accent)" }} />
                    <span className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                      {bullet}
                    </span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          )}

          {/* Tech Stack */}
          {project.tech_stack.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <h2 className="text-xl font-bold mb-5 font-heading" style={{ color: "var(--text-primary)" }}>
                Tech Stack
                <span className="block mt-2 h-[3px] w-10 rounded-full"
                  style={{ background: "linear-gradient(90deg, var(--accent-blue), var(--accent))" }} />
              </h2>
              <div className="flex flex-wrap gap-2.5">
                {project.tech_stack.map((tech) => (
                  <TechBadge key={tech} name={tech} />
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* Other Projects */}
        {otherProjects.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <h2 className="text-xl font-bold mb-6 font-heading" style={{ color: "var(--text-primary)" }}>
              Other Projects
              <span className="block mt-2 h-[3px] w-10 rounded-full"
                style={{ background: "linear-gradient(90deg, var(--accent), var(--accent-blue))" }} />
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {otherProjects.map((p) => (
                <Link key={p.id} href={`/projects/${p.slug}`}
                  className="group flex flex-col p-4 rounded-xl border transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
                  style={{ borderColor: "var(--border)", background: "var(--bg-card)" }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(196,78,255,0.4)";
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLElement).style.borderColor = "var(--border)";
                  }}
                >
                  <h3 className="text-sm font-semibold mb-1.5 group-hover:text-[var(--accent)] transition-colors"
                    style={{ color: "var(--text-primary)" }}>
                    {p.title}
                  </h3>
                  <p className="text-xs leading-relaxed line-clamp-2 mb-3" style={{ color: "var(--text-muted)" }}>
                    {p.description}
                  </p>
                  <div className="flex items-center gap-1.5 mt-auto text-xs font-medium"
                    style={{ color: "var(--accent)" }}>
                    View project <ChevronRight size={12} />
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}

        {/* Back link */}
        <div className="mt-16 pt-8 border-t" style={{ borderColor: "var(--border)" }}>
          <Link href="/#projects"
            className="inline-flex items-center gap-2 text-sm font-medium transition-colors hover:text-[var(--accent)]"
            style={{ color: "var(--text-muted)" }}>
            <ArrowLeft size={15} />
            Back to all projects
          </Link>
        </div>
      </div>
    </div>
  );
}
