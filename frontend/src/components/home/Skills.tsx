"use client";

import { motion } from "framer-motion";
import type { SkillCategory } from "@/types";
import SectionWrapper from "./SectionWrapper";

interface SkillsProps {
  categories: SkillCategory[];
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

const badgeContainerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.04,
    },
  },
};

const badgeVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.25 },
  },
};

export default function Skills({ categories }: SkillsProps) {
  const sorted = [...categories].sort((a, b) => a.order - b.order);

  return (
    <SectionWrapper
      id="skills"
      title="Skills"
      subtitle="Technologies and tools I work with every day."
    >
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
      >
        {sorted.map((category) => (
          <motion.div
            key={category._id}
            variants={cardVariants}
            className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-6 hover:border-[var(--accent)]/30 transition-colors"
          >
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
              {category.category}
            </h3>

            <motion.div
              className="flex flex-wrap gap-2"
              variants={badgeContainerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {category.items.map((skill) => (
                <motion.span
                  key={skill.name}
                  variants={badgeVariants}
                  className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-full px-4 py-2 text-sm text-[var(--text-secondary)] hover:border-[var(--accent)] hover:text-[var(--text-primary)] transition-colors cursor-default"
                >
                  {skill.name}
                </motion.span>
              ))}
            </motion.div>
          </motion.div>
        ))}
      </motion.div>
    </SectionWrapper>
  );
}
