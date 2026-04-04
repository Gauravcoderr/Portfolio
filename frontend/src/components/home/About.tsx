"use client";

import { motion } from "framer-motion";
import type { Profile } from "@/types";
import SectionWrapper from "./SectionWrapper";

interface AboutProps {
  profile: Profile;
}

const stats = [
  { value: "3+", label: "Years Experience" },
  { value: "10+", label: "Projects Built" },
  { value: "20+", label: "Tech Skills" },
];

export default function About({ profile }: AboutProps) {
  return (
    <SectionWrapper
      id="about"
      title="About Me"
      subtitle="A snapshot of who I am and what I bring to the table."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
        {/* Left: Bio */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <p className="text-lg text-[var(--text-secondary)] leading-relaxed whitespace-pre-line">
            {profile.bio}
          </p>
        </motion.div>

        {/* Right: Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-1 lg:grid-cols-3 gap-4">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
              className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-6 text-center hover:border-[var(--accent)]/50 transition-colors"
            >
              <p className="text-3xl font-bold text-gradient mb-1">
                {stat.value}
              </p>
              <p className="text-sm text-[var(--text-secondary)]">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}
