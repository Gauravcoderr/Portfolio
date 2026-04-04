"use client";

import { motion } from "framer-motion";
import type { Experience as ExperienceType } from "@/types";
import SectionWrapper from "./SectionWrapper";

interface ExperienceProps {
  items: ExperienceType[];
}

function formatDateRange(start: string, end: string | null): string {
  const startDate = new Date(start);
  const startStr = startDate.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });

  if (!end) return `${startStr} - Present`;

  const endDate = new Date(end);
  const endStr = endDate.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });

  return `${startStr} - ${endStr}`;
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export default function Experience({ items }: ExperienceProps) {
  const sorted = [...items].sort((a, b) => a.order - b.order);

  return (
    <SectionWrapper
      id="experience"
      title="Experience"
      subtitle="My professional journey and the impact I've made."
    >
      <motion.div
        className="relative"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        {/* Timeline line */}
        <div className="absolute left-4 md:left-6 top-0 bottom-0 w-0.5 bg-[var(--border)]" />

        <div className="space-y-10">
          {sorted.map((exp) => (
            <motion.div
              key={exp.id}
              variants={itemVariants}
              className="relative pl-12 md:pl-16"
            >
              {/* Timeline dot */}
              <div className="absolute left-4 md:left-6 top-7 -translate-x-1/2">
                {exp.is_current ? (
                  <span className="relative flex h-3.5 w-3.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-green-500" />
                  </span>
                ) : (
                  <span className="block h-3 w-3 rounded-full bg-[var(--accent)] border-2 border-[var(--bg-primary)]" />
                )}
              </div>

              {/* Card */}
              <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-6 hover:border-[var(--accent)]/30 transition-colors">
                {/* Header */}
                <div className="mb-4">
                  <h3 className="text-lg font-bold text-[var(--text-primary)]">
                    {exp.role}
                  </h3>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
                    {exp.company_url ? (
                      <a
                        href={exp.company_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[var(--accent)] hover:underline font-medium"
                      >
                        {exp.company}
                      </a>
                    ) : (
                      <span className="text-[var(--accent)] font-medium">
                        {exp.company}
                      </span>
                    )}
                    <span className="text-[var(--text-muted)] text-sm">
                      {exp.location}
                    </span>
                  </div>
                  <p className="text-sm text-[var(--text-muted)] mt-1">
                    {formatDateRange(exp.start_date, exp.end_date)}
                  </p>
                </div>

                {/* Description bullets */}
                {exp.description.length > 0 && (
                  <ul className="space-y-2 mb-4">
                    {exp.description.map((bullet, idx) => (
                      <li
                        key={idx}
                        className="text-sm text-[var(--text-secondary)] leading-relaxed pl-4 relative before:content-[''] before:absolute before:left-0 before:top-2 before:w-1.5 before:h-1.5 before:rounded-full before:bg-[var(--accent)]/50"
                      >
                        {bullet}
                      </li>
                    ))}
                  </ul>
                )}

                {/* Tech stack badges */}
                {exp.tech_stack.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {exp.tech_stack.map((tech) => (
                      <span
                        key={tech}
                        className="bg-[var(--accent)]/10 text-[var(--accent)] rounded-full px-3 py-1 text-xs font-medium"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </SectionWrapper>
  );
}
