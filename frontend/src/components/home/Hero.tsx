"use client";

import { motion } from "framer-motion";
import { Github, Linkedin, Mail, ArrowDown, Download, MapPin } from "lucide-react";
import type { Profile } from "@/types";

interface HeroProps {
  profile: Profile;
}

const HERO_VIDEO = "/hero-bg.mp4";

// Holographic spectrum for each letter of "Gaurav Rauthan"
// Flows: fuchsia → purple → violet → indigo → blue → sky → cyan → sky → blue → indigo → violet → purple → fuchsia
const LETTER_COLORS: Record<number, string> = {
  0:  "#e879f9", // G — fuchsia
  1:  "#c44eff", // a — purple
  2:  "#a78bfa", // u — violet
  3:  "#818cf8", // r — indigo
  4:  "#5b8def", // a — blue
  5:  "#38bdf8", // v — sky
  // space at 6
  7:  "#22d3ee", // R — cyan
  8:  "#38bdf8", // a — sky
  9:  "#5b8def", // u — blue
  10: "#818cf8", // t — indigo
  11: "#a78bfa", // h — violet
  12: "#c44eff", // a — purple
  13: "#e879f9", // n — fuchsia
};

// Aurora orb config
const ORBS = [
  { color: "rgba(196,78,255,0.22)",   size: "700px", top: "5%",   left: "15%",  anim: "aurora-1 22s ease-in-out infinite" },
  { color: "rgba(91,141,239,0.18)",   size: "600px", top: "50%",  left: "60%",  anim: "aurora-2 28s ease-in-out infinite" },
  { color: "rgba(34,211,238,0.14)",   size: "500px", top: "65%",  left: "20%",  anim: "aurora-3 35s ease-in-out infinite" },
  { color: "rgba(232,121,249,0.12)",  size: "450px", top: "20%",  left: "75%",  anim: "aurora-4 20s ease-in-out infinite" },
];

// Floating sparkle particles
const PARTICLES = [
  { size: 3, left: "12%",  delay: "0s",    dur: "4.5s",  drift: "12px"  },
  { size: 2, left: "28%",  delay: "1.2s",  dur: "5.5s",  drift: "-8px"  },
  { size: 4, left: "44%",  delay: "0.6s",  dur: "6s",    drift: "15px"  },
  { size: 2, left: "58%",  delay: "2s",    dur: "4s",    drift: "-10px" },
  { size: 3, left: "70%",  delay: "0.3s",  dur: "5s",    drift: "8px"   },
  { size: 2, left: "82%",  delay: "1.8s",  dur: "6.5s",  drift: "-12px" },
  { size: 3, left: "92%",  delay: "0.9s",  dur: "4.8s",  drift: "10px"  },
  { size: 2, left: "6%",   delay: "2.5s",  dur: "5.2s",  drift: "-6px"  },
];

const TAG_COLORS = [
  { border: "rgba(196,78,255,0.45)", bg: "rgba(196,78,255,0.1)",  color: "#df8aff" },
  { border: "rgba(91,141,239,0.45)", bg: "rgba(91,141,239,0.1)",  color: "#8ab8ff" },
  { border: "rgba(34,211,238,0.4)",  bg: "rgba(34,211,238,0.08)", color: "#67e8f9" },
  { border: "rgba(52,211,153,0.4)",  bg: "rgba(52,211,153,0.08)", color: "#6ee7b7" },
];

export default function Hero({ profile }: HeroProps) {
  const handleScroll = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  const nameChars = profile.name.split("");
  const tags = profile.title.split("|").slice(1);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">

      {/* ── Video background ── */}
      <video
        className="absolute inset-0 w-full h-full object-cover opacity-10"
        src={HERO_VIDEO} autoPlay muted loop playsInline
        onError={(e) => { (e.target as HTMLVideoElement).style.display = "none"; }}
      />

      {/* ── Aurora blobs ── */}
      {ORBS.map((orb, i) => (
        <div
          key={i}
          className="absolute rounded-full pointer-events-none"
          style={{
            width: orb.size, height: orb.size,
            top: orb.top, left: orb.left,
            transform: "translate(-50%,-50%)",
            background: `radial-gradient(circle, ${orb.color} 0%, transparent 70%)`,
            filter: "blur(60px)",
            animation: orb.anim,
          }}
        />
      ))}

      {/* ── Dot grid ── */}
      <div className="absolute inset-0 dot-grid opacity-30" />

      {/* ── Radial vignette ── */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_75%_75%_at_50%_50%,transparent_25%,var(--bg-primary)_90%)]" />

      {/* ── Floating sparkle particles ── */}
      {PARTICLES.map((p, i) => (
        <div
          key={i}
          className="absolute bottom-1/4 rounded-full pointer-events-none"
          style={{
            width: p.size, height: p.size,
            left: p.left,
            background: i % 2 === 0 ? "rgba(196,78,255,0.7)" : "rgba(91,141,239,0.7)",
            boxShadow: `0 0 ${p.size * 3}px ${i % 2 === 0 ? "rgba(196,78,255,0.6)" : "rgba(91,141,239,0.6)"}`,
            animationName: "particle-rise",
            animationDuration: p.dur,
            animationDelay: p.delay,
            animationIterationCount: "infinite",
            animationTimingFunction: "ease-out",
            ["--drift" as string]: p.drift,
          }}
        />
      ))}

      {/* ── Bottom fade ── */}
      <div className="absolute bottom-0 left-0 right-0 h-56 bg-gradient-to-t from-[var(--bg-primary)] to-transparent" />

      {/* ── Content ── */}
      <div className="relative z-10 text-center px-6 max-w-5xl w-full">

        {/* Location badge */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="inline-flex items-center gap-1.5 text-xs rounded-full px-4 py-2 mb-10 backdrop-blur-md"
          style={{
            background: "linear-gradient(135deg,rgba(196,78,255,0.12),rgba(91,141,239,0.08))",
            border: "1px solid rgba(196,78,255,0.25)",
            color: "var(--text-secondary)",
          }}
        >
          <MapPin size={11} style={{ color: "var(--accent)" }} />
          <span>{profile.location || "Available for opportunities"}</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse ml-1" />
        </motion.div>

        {/* ── ANIMATED NAME ── */}
        <div className="mb-6 flex flex-wrap justify-center leading-none"
          style={{ gap: "0.05em" }}>
          {nameChars.map((char, i) => {
            if (char === " ") {
              return <span key={i} style={{ display: "inline-block", width: "0.35em" }} />;
            }
            const color = LETTER_COLORS[i] ?? "#c44eff";
            return (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 60, filter: "blur(14px)", scale: 0.8 }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)", scale: 1 }}
                transition={{
                  duration: 0.65,
                  delay: 0.08 + i * 0.045,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="inline-block font-bold font-heading select-none"
                style={{
                  fontSize: "clamp(3rem, 10vw, 7rem)",
                  letterSpacing: "-0.03em",
                  color,
                  textShadow: `0 0 40px ${color}55, 0 0 80px ${color}25`,
                  lineHeight: 1,
                }}
              >
                {char}
              </motion.span>
            );
          })}
        </div>

        {/* Title */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.75 }}
          className="text-lg md:text-2xl mb-5 font-light tracking-wide"
          style={{ color: "var(--text-secondary)" }}
        >
          {profile.title.split("|")[0].trim()}
        </motion.p>

        {/* Accent tags */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.85 }}
          className="flex flex-wrap items-center justify-center gap-2 mb-11"
        >
          {tags.map((tag, i) => {
            const c = TAG_COLORS[i % TAG_COLORS.length];
            return (
              <motion.span
                key={tag}
                initial={{ opacity: 0, scale: 0.8, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.9 + i * 0.06 }}
                className="text-xs px-3 py-1.5 rounded-full border font-medium backdrop-blur-sm"
                style={{ borderColor: c.border, background: c.bg, color: c.color }}
              >
                {tag.trim()}
              </motion.span>
            );
          })}
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.05 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-12"
        >
          <button
            onClick={() => handleScroll("#projects")}
            className="flex items-center gap-2 text-white font-semibold rounded-xl px-8 py-3.5 transition-all duration-200 text-sm hover:scale-105 active:scale-95"
            style={{
              background: "linear-gradient(135deg, #c44eff 0%, #5b8def 100%)",
              boxShadow: "0 0 40px rgba(196,78,255,0.45), 0 4px 24px rgba(0,0,0,0.4)",
            }}
          >
            <ArrowDown size={16} />
            View My Work
          </button>

          {profile.resume_url ? (
            <a
              href={profile.resume_url} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 font-medium rounded-xl px-8 py-3.5 transition-all duration-200 text-sm backdrop-blur-md hover:scale-105"
              style={{ border: "1px solid rgba(196,78,255,0.35)", background: "rgba(196,78,255,0.08)", color: "var(--text-secondary)" }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "rgba(196,78,255,0.65)"; el.style.color = "var(--text-primary)"; }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "rgba(196,78,255,0.35)"; el.style.color = "var(--text-secondary)"; }}
            >
              <Download size={16} />
              Download Resume
            </a>
          ) : (
            <button
              onClick={() => handleScroll("#contact")}
              className="flex items-center gap-2 font-medium rounded-xl px-8 py-3.5 transition-all duration-200 text-sm backdrop-blur-md hover:scale-105"
              style={{ border: "1px solid rgba(196,78,255,0.35)", background: "rgba(196,78,255,0.08)", color: "var(--text-secondary)" }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "rgba(196,78,255,0.65)"; el.style.color = "var(--text-primary)"; }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "rgba(196,78,255,0.35)"; el.style.color = "var(--text-secondary)"; }}
            >
              <Mail size={16} />
              Get In Touch
            </button>
          )}
        </motion.div>

        {/* Social icons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.2 }}
          className="flex items-center justify-center gap-3"
        >
          {[
            { show: profile.social_links?.github,   href: profile.social_links?.github,       icon: <Github size={18} />,   hoverColor: "rgba(196,78,255,0.5)",  glow: "rgba(196,78,255,0.2)"  },
            { show: profile.social_links?.linkedin, href: profile.social_links?.linkedin,     icon: <Linkedin size={18} />, hoverColor: "rgba(91,141,239,0.5)",  glow: "rgba(91,141,239,0.2)"  },
            { show: profile.email,                  href: `mailto:${profile.email}`,          icon: <Mail size={18} />,     hoverColor: "rgba(34,211,238,0.5)",  glow: "rgba(34,211,238,0.2)"  },
          ].map(({ show, href, icon, hoverColor, glow }, idx) =>
            show && href ? (
              <a key={idx} href={href} target={href.startsWith("mailto") ? undefined : "_blank"} rel="noopener noreferrer"
                className="p-3 rounded-xl border transition-all duration-200 hover:scale-110"
                style={{ borderColor: "var(--border)", color: "var(--text-muted)", background: "rgba(255,255,255,0.03)" }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = hoverColor;
                  el.style.color = "var(--text-primary)";
                  el.style.boxShadow = `0 0 24px ${glow}`;
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.borderColor = "var(--border)";
                  el.style.color = "var(--text-muted)";
                  el.style.boxShadow = "none";
                }}
              >
                {icon}
              </a>
            ) : null
          )}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 1.6 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-px h-14 mx-auto"
          style={{ background: "linear-gradient(to bottom, transparent, #c44eff 40%, #22d3ee 80%, transparent)" }}
        />
      </motion.div>
    </section>
  );
}
