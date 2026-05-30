"use client";

import { motion } from "framer-motion";

interface SectionWrapperProps {
  id: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export default function SectionWrapper({
  id,
  title,
  subtitle,
  children,
}: SectionWrapperProps) {
  return (
    <section id={id} className="max-w-6xl mx-auto px-6 py-20 md:py-28">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* Section heading */}
        <div className="mb-12">
          <h2
            className="text-3xl md:text-4xl font-bold mb-2"
            style={{ color: "var(--text-primary)", letterSpacing: "-0.025em" }}
          >
            {title}
          </h2>
          <div className="mt-3 h-px w-12" style={{ background: "var(--border-hover)" }} />
          {subtitle && (
            <p className="mt-4 text-lg max-w-2xl" style={{ color: "var(--text-secondary)" }}>
              {subtitle}
            </p>
          )}
        </div>

        {children}
      </motion.div>
    </section>
  );
}
