"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Github } from "lucide-react";
import type { Project } from "@/types";
import SectionWrapper from "./SectionWrapper";

interface ProjectsProps {
  items: Project[];
}

type FilterTab = "all" | "professional" | "personal";

const tabs: { label: string; value: FilterTab }[] = [
  { label: "All", value: "all" },
  { label: "Professional", value: "professional" },
  { label: "Personal", value: "personal" },
];

export default function Projects({ items }: ProjectsProps) {
  const [activeFilter, setActiveFilter] = useState<FilterTab>("all");

  const sorted = [...items].sort((a, b) => a.order - b.order);

  const filtered =
    activeFilter === "all"
      ? sorted
      : sorted.filter((p) => p.category === activeFilter);

  return (
    <SectionWrapper
      id="projects"
      title="Projects"
      subtitle="A selection of things I've built and shipped."
    >
      {/* Filter tabs */}
      <div className="flex items-center gap-2 mb-8">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveFilter(tab.value)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
              activeFilter === tab.value
                ? "bg-[var(--accent)] text-white"
                : "bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--accent)]/50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Projects grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeFilter}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {filtered.map((project, i) => (
            <motion.div
              key={project._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className={`group bg-[var(--bg-card)] border rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-black/20 ${
                project.is_featured
                  ? "border-[var(--accent)]/40 glow"
                  : "border-[var(--border)]"
              }`}
            >
              <div className="p-6">
                {/* Featured badge */}
                {project.is_featured && (
                  <span className="inline-block text-xs font-medium text-[var(--accent)] bg-[var(--accent)]/10 rounded-full px-3 py-1 mb-3">
                    Featured
                  </span>
                )}

                {/* Title */}
                <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
                  {project.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-[var(--text-secondary)] line-clamp-3 mb-4">
                  {project.description}
                </p>

                {/* Bullet points */}
                {project.bullets.length > 0 && (
                  <ul className="space-y-1.5 mb-4">
                    {project.bullets.slice(0, 3).map((bullet, idx) => (
                      <li
                        key={idx}
                        className="text-sm text-[var(--text-secondary)] pl-4 relative before:content-[''] before:absolute before:left-0 before:top-2 before:w-1.5 before:h-1.5 before:rounded-full before:bg-[var(--accent)]/50"
                      >
                        {bullet}
                      </li>
                    ))}
                  </ul>
                )}

                {/* Tech stack */}
                {project.tech_stack.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-5">
                    {project.tech_stack.map((tech) => (
                      <span
                        key={tech}
                        className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-full px-3 py-1 text-xs text-[var(--text-secondary)]"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}

                {/* Action buttons */}
                <div className="flex items-center gap-3 pt-2 border-t border-[var(--border)]">
                  {project.live_url && (
                    <a
                      href={project.live_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-sm font-medium text-[var(--accent)] hover:text-[var(--accent-light)] transition-colors"
                    >
                      <ExternalLink size={14} />
                      Live Site
                    </a>
                  )}
                  {project.github_url && (
                    <a
                      href={project.github_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                    >
                      <Github size={14} />
                      GitHub
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </SectionWrapper>
  );
}
