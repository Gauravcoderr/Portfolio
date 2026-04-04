"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Github, Globe, ArrowRight } from "lucide-react";
import Link from "next/link";
import type { Project } from "@/types";
import SectionWrapper from "./SectionWrapper";
import { screenshotUrl } from "@/lib/iconMap";

interface ProjectsProps {
  items: Project[];
}

type FilterTab = "all" | "professional" | "personal";

const tabs: { label: string; value: FilterTab }[] = [
  { label: "All", value: "all" },
  { label: "Professional", value: "professional" },
  { label: "Personal", value: "personal" },
];

// Sites that block iframes — go straight to screenshot
const IFRAME_BLOCKED_DOMAINS = ["embtalent.ai", "starquik.com"];
function isIframeBlocked(url: string): boolean {
  return IFRAME_BLOCKED_DOMAINS.some((d) => url.includes(d));
}

function BrowserChrome({ domain }: { domain: string }) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-[#191919] border-b border-[#222] shrink-0">
      <div className="flex gap-1.5 shrink-0">
        <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
        <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
        <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
      </div>
      <div className="flex-1 bg-[#242424] rounded flex items-center gap-1.5 px-2.5 py-1 overflow-hidden">
        <Globe size={9} className="text-[#444] shrink-0" />
        <span className="text-[10px] text-[#555] truncate">{domain}</span>
      </div>
    </div>
  );
}

function Shimmer() {
  return (
    <div className="absolute inset-0 z-10 flex flex-col gap-2 p-3 bg-[#0d0d0d]">
      {[0.66, 1, 0.8, 0.5].map((w, i) => (
        <div key={i} className="h-3 rounded-sm animate-pulse" style={{ background: "#1a1a2a", width: `${w * 100}%` }} />
      ))}
      <div className="flex gap-2 mt-2">
        {[1, 1, 0.7].map((w, i) => (
          <div key={i} className="h-10 rounded-sm animate-pulse" style={{ background: "#1a1a2a", flex: w }} />
        ))}
      </div>
    </div>
  );
}

// Screenshot via microlink.io with scroll-on-hover animation
function ScreenshotPreview({ url, title, isHovered }: { url: string; title: string; isHovered: boolean }) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const src = screenshotUrl(url);

  return (
    <div className="overflow-hidden relative" style={{ height: "180px" }}>
      {!loaded && !failed && <Shimmer />}
      {!failed ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={title}
          className="w-full"
          style={{
            display: "block",
            height: "auto",
            opacity: loaded ? 1 : 0,
            transform: isHovered ? "translateY(-20%)" : "translateY(0)",
            transition: isHovered
              ? "transform 4s ease-in-out, opacity 0.3s ease"
              : "transform 1s ease, opacity 0.3s ease",
          }}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-[#0d0d0d]">
          <Globe size={20} className="text-[#333]" />
        </div>
      )}
    </div>
  );
}

// Iframe preview with screenshot fallback on timeout / block
// iframe is 1280×2000 scaled to 0.3 → 384×600px visual, container clips to 180px
// On hover: translateY(-1400px) shifts content up 1400×0.3=420px visually
function IframePreview({ url, title, isHovered }: { url: string; title: string; isHovered: boolean }) {
  const [status, setStatus] = useState<"loading" | "loaded" | "screenshot">(
    isIframeBlocked(url) ? "screenshot" : "loading"
  );
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (status !== "loading") return;
    timerRef.current = setTimeout(() => {
      setStatus((s) => (s === "loading" ? "screenshot" : s));
    }, 7000);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [status]);

  if (status === "screenshot") {
    return <ScreenshotPreview url={url} title={title} isHovered={isHovered} />;
  }

  return (
    <div className="overflow-hidden relative" style={{ height: "180px" }}>
      {status === "loading" && <Shimmer />}
      <iframe
        src={url}
        title={title}
        scrolling="no"
        className="absolute top-0 left-0 border-0"
        style={{
          width: "1280px",
          height: "2000px",
          transform: `scale(0.3) translateY(${isHovered ? -1400 : 0}px)`,
          transformOrigin: "top left",
          pointerEvents: "none",
          opacity: status === "loaded" ? 1 : 0,
          transition: isHovered
            ? "transform 4s ease-in-out, opacity 0.35s ease"
            : "transform 1s ease, opacity 0.35s ease",
        }}
        loading="lazy"
        onLoad={() => {
          if (timerRef.current) clearTimeout(timerRef.current);
          setStatus("loaded");
        }}
        onError={() => {
          if (timerRef.current) clearTimeout(timerRef.current);
          setStatus("screenshot");
        }}
      />
    </div>
  );
}

function ProjectPreview({ project, idx, isHovered }: { project: Project; idx: number; isHovered: boolean }) {
  const domain = project.live_url
    ? project.live_url.replace(/^https?:\/\//, "").replace(/\/$/, "")
    : "";

  if (!project.live_url) {
    return (
      <div>
        <div className="flex items-center gap-2 px-3 py-2 bg-[#191919] border-b border-[#222]">
          <div className="flex gap-1.5">
            {[0, 1, 2].map((i) => <div key={i} className="w-2.5 h-2.5 rounded-full bg-[#333]" />)}
          </div>
          <div className="flex-1 bg-[#242424] rounded px-2.5 py-1">
            <span className="text-[10px] text-[#444]">Private / Internal</span>
          </div>
        </div>
        <div className="w-full h-[180px] flex items-center justify-center bg-[#0d0d0d]">
          <Globe size={20} className="text-[#333]" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0d0d0d]">
      <BrowserChrome domain={domain} />
      <IframePreview url={project.live_url} title={project.title} isHovered={isHovered} />
    </div>
  );
}

export default function Projects({ items }: ProjectsProps) {
  const [activeFilter, setActiveFilter] = useState<FilterTab>("all");

  const sorted = [...items].sort((a, b) => a.order - b.order);
  const filtered =
    activeFilter === "all" ? sorted : sorted.filter((p) => p.category === activeFilter);

  return (
    <SectionWrapper
      id="projects"
      title="Projects"
      subtitle="A selection of things I've built and shipped."
    >
      {/* Filter tabs */}
      <div className="flex items-center gap-2 mb-10">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveFilter(tab.value)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              activeFilter === tab.value
                ? "bg-[var(--accent)] text-white shadow-lg shadow-[var(--accent)]/20"
                : "bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[#2e2e2e]"
            }`}
          >
            {tab.label}
          </button>
        ))}
        <span className="ml-auto text-xs text-[var(--text-muted)]">
          {filtered.length} project{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeFilter}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5"
        >
          {filtered.map((project, i) => (
            <ProjectCard key={project.id} project={project} i={i} />
          ))}
        </motion.div>
      </AnimatePresence>
    </SectionWrapper>
  );
}

function ProjectCard({ project, i }: { project: Project; i: number }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: i * 0.06 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`group relative flex flex-col rounded-2xl overflow-hidden border transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl ${
        project.is_featured
          ? "hover:shadow-[var(--accent)]/20 border-[var(--accent)]/25 bg-[var(--bg-card)] hover:border-[var(--accent)]/50"
          : "hover:shadow-black/50 border-[var(--border)] bg-[var(--bg-card)] hover:border-[var(--accent)]/30"
      }`}
    >
      <ProjectPreview project={project} idx={i} isHovered={isHovered} />

      {/* Info */}
      <div className="flex flex-col flex-1 p-5">
        <div className="flex items-start justify-between gap-2 mb-2">
          <Link
            href={`/projects/${project.slug}`}
            onClick={(e) => e.stopPropagation()}
            className="text-base font-semibold leading-tight hover:text-[var(--accent)] transition-colors"
            style={{ color: "var(--text-primary)" }}
          >
            {project.title}
          </Link>
          {project.is_featured && (
            <span className="shrink-0 text-[10px] font-medium text-[var(--accent)] bg-[var(--accent)]/10 border border-[var(--accent)]/20 rounded-full px-2 py-0.5">
              Featured
            </span>
          )}
        </div>

        <p className="text-xs text-[var(--text-secondary)] line-clamp-2 mb-3 leading-relaxed">
          {project.description}
        </p>

        {project.bullets.length > 0 && (
          <ul className="space-y-1 mb-3">
            {project.bullets.slice(0, 2).map((bullet, bIdx) => (
              <li
                key={bIdx}
                className="text-[11px] text-[var(--text-muted)] pl-3 relative leading-relaxed
                  before:content-[''] before:absolute before:left-0 before:top-[7px]
                  before:w-1 before:h-1 before:rounded-full before:bg-[var(--accent)]/40"
              >
                {bullet}
              </li>
            ))}
          </ul>
        )}

        {project.tech_stack.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-auto pt-3">
            {project.tech_stack.slice(0, 5).map((tech) => (
              <span
                key={tech}
                className="bg-[#0d0d0d] border border-[var(--border)] rounded px-2 py-0.5 text-[10px] text-[var(--text-muted)]"
              >
                {tech}
              </span>
            ))}
            {project.tech_stack.length > 5 && (
              <span className="text-[10px] text-[var(--text-muted)] self-center">
                +{project.tech_stack.length - 5}
              </span>
            )}
          </div>
        )}

        <div className="flex items-center gap-3 pt-3 mt-3 border-t border-[var(--border)]">
          {project.live_url && (
            <a
              href={project.live_url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1.5 text-xs font-medium text-[var(--accent)] hover:text-[var(--accent-light)] transition-colors"
            >
              <ExternalLink size={12} />
              Live
            </a>
          )}
          {project.github_url && (
            <a
              href={project.github_url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-1.5 text-xs font-medium text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
            >
              <Github size={12} />
              GitHub
            </a>
          )}
          <Link
            href={`/projects/${project.slug}`}
            className="ml-auto flex items-center gap-1 text-xs font-medium transition-colors hover:text-[var(--accent-light)]"
            style={{ color: "var(--accent)" }}
            onClick={(e) => e.stopPropagation()}
          >
            Details <ArrowRight size={11} />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
