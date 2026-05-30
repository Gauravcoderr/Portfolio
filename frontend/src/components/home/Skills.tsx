"use client";

import { motion } from "framer-motion";
import type { SkillCategory } from "@/types";
import { getIconUrl } from "@/lib/iconMap";
import SectionWrapper from "./SectionWrapper";

interface SkillsProps {
  categories: SkillCategory[];
}

function SkillBadge({ name }: { name: string }) {
  const iconUrl = getIconUrl(name);
  const displayName = name.replace(" (ES6+)", "").replace(".js", "").replace(" CSS", "").replace(" Authentication", "");

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.18 }}
      className="group flex flex-col items-center gap-2 p-3 rounded-xl border transition-colors duration-150 cursor-default hover:border-[var(--border-hover)]"
      style={{
        borderColor: "var(--border)",
        background: "var(--bg-primary)",
        minWidth: "64px",
      }}
    >
      {iconUrl ? (
        <div className="relative w-8 h-8 flex items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={iconUrl}
            alt={name}
            width={32}
            height={32}
            className="w-8 h-8 object-contain"
            loading="lazy"
            onError={(e) => {
              const img = e.target as HTMLImageElement;
              img.style.display = "none";
              const parent = img.parentElement;
              if (parent) {
                parent.innerHTML = `<span style="width:32px;height:32px;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;background:var(--bg-card);border-radius:8px;color:var(--text-muted)">${name[0]}</span>`;
              }
            }}
          />
        </div>
      ) : (
        <span
          className="w-8 h-8 flex items-center justify-center text-[13px] font-bold rounded-lg"
          style={{ background: "var(--bg-card)", color: "var(--text-muted)" }}
        >
          {name[0]}
        </span>
      )}
      <span
        className="text-[10px] text-center leading-tight max-w-[60px] truncate"
        style={{ color: "var(--text-muted)" }}
      >
        {displayName}
      </span>
    </motion.div>
  );
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
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
        className="space-y-5"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
      >
        {sorted.map((category) => (
          <motion.div
            key={category.id}
            variants={cardVariants}
            className="rounded-2xl p-6 border transition-colors"
            style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}
          >
            <div className="flex items-center gap-3 mb-5">
              <div
                className="w-1 h-5 rounded-full"
                style={{ background: "var(--accent)" }}
              />
              <h3
                className="text-xs font-semibold uppercase tracking-widest"
                style={{ color: "var(--text-primary)", letterSpacing: "0.06em" }}
              >
                {category.category}
              </h3>
            </div>
            <div className="flex flex-wrap gap-2.5">
              {category.items.map((skill) => (
                <SkillBadge key={skill.name} name={skill.name} />
              ))}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </SectionWrapper>
  );
}
