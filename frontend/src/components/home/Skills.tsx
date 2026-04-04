"use client";

import { motion } from "framer-motion";
import type { SkillCategory } from "@/types";
import { getIconUrl } from "@/lib/iconMap";
import SectionWrapper from "./SectionWrapper";

interface SkillsProps {
  categories: SkillCategory[];
}

// Category accent colors for visual variety
const CATEGORY_COLORS: Record<string, { from: string; to: string; glow: string }> = {
  Frontend: { from: "#c44eff", to: "#5b8def", glow: "rgba(196,78,255,0.2)" },
  "AI / GenAI": { from: "#5b8def", to: "#34d399", glow: "rgba(91,141,239,0.2)" },
  "Backend & DevOps": { from: "#34d399", to: "#5b8def", glow: "rgba(52,211,153,0.15)" },
  Other: { from: "#fb923c", to: "#c44eff", glow: "rgba(251,146,60,0.15)" },
};

function getCategory(cat: string) {
  return CATEGORY_COLORS[cat] || CATEGORY_COLORS.Frontend;
}

function SkillBadge({ name, catColor }: { name: string; catColor: { from: string; to: string; glow: string } }) {
  const iconUrl = getIconUrl(name);
  const displayName = name.replace(" (ES6+)", "").replace(".js", "").replace(" CSS", "").replace(" Authentication", "");

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.06 }}
      transition={{ duration: 0.18 }}
      className="group flex flex-col items-center gap-2 p-3 rounded-xl border transition-all duration-200 cursor-default"
      style={{
        borderColor: "var(--border)",
        background: "var(--bg-secondary)",
        minWidth: "64px",
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLElement;
        el.style.borderColor = catColor.from + "66";
        el.style.background = "var(--bg-card)";
        el.style.boxShadow = `0 0 16px ${catColor.glow}`;
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLElement;
        el.style.borderColor = "var(--border)";
        el.style.background = "var(--bg-secondary)";
        el.style.boxShadow = "none";
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
                parent.innerHTML = `<span style="width:32px;height:32px;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;background:linear-gradient(135deg,${catColor.from}22,${catColor.to}22);border-radius:8px;color:${catColor.from}">${name[0]}</span>`;
              }
            }}
          />
        </div>
      ) : (
        <span
          className="w-8 h-8 flex items-center justify-center text-[13px] font-bold rounded-lg font-heading"
          style={{ background: `linear-gradient(135deg, ${catColor.from}22, ${catColor.to}22)`, color: catColor.from }}
        >
          {name[0]}
        </span>
      )}
      <span
        className="text-[10px] transition-colors text-center leading-tight font-body max-w-[60px] truncate"
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
        {sorted.map((category) => {
          const catColor = getCategory(category.category);
          return (
            <motion.div
              key={category.id}
              variants={cardVariants}
              className="rounded-2xl p-6 border transition-colors"
              style={{ background: "var(--bg-card)", borderColor: "var(--border)" }}
            >
              {/* Category header with gradient underline */}
              <div className="flex items-center gap-3 mb-5">
                <div
                  className="w-1 h-5 rounded-full"
                  style={{ background: `linear-gradient(180deg, ${catColor.from}, ${catColor.to})` }}
                />
                <h3
                  className="text-xs font-semibold uppercase tracking-widest font-heading"
                  style={{
                    background: `linear-gradient(90deg, ${catColor.from}, ${catColor.to})`,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  {category.category}
                </h3>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {category.items.map((skill) => (
                  <SkillBadge key={skill.name} name={skill.name} catColor={catColor} />
                ))}
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </SectionWrapper>
  );
}
