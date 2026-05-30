"use client";

import { motion } from "framer-motion";
import { Github, Linkedin, Mail, ArrowDown, Download, MapPin } from "lucide-react";
import Link from "next/link";
import type { Profile } from "@/types";

interface HeroProps {
  profile: Profile;
}

export default function Hero({ profile }: HeroProps) {
  const handleScroll = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  const tags = profile.title.split("|").slice(1);

  return (
    <section
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        background: "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(94,106,210,0.12) 0%, transparent 60%)",
      }}
    >
      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-5xl w-full">

        {/* Location badge */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="inline-flex items-center gap-1.5 text-xs rounded-full px-4 py-2 mb-10 border"
          style={{
            background: "var(--bg-card)",
            borderColor: "var(--border)",
            color: "var(--text-muted)",
          }}
        >
          <MapPin size={11} style={{ color: "var(--accent)" }} />
          <span>{profile.location || "Available for opportunities"}</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse ml-1" />
        </motion.div>

        {/* Name */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="font-bold mb-5 tracking-tight"
          style={{
            fontSize: "clamp(3rem, 10vw, 7rem)",
            letterSpacing: "-0.03em",
            lineHeight: 1.05,
            color: "var(--text-primary)",
          }}
        >
          {profile.name}
        </motion.h1>

        {/* Title */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.2 }}
          className="text-lg md:text-xl mb-6 font-light"
          style={{ color: "var(--text-secondary)", letterSpacing: "-0.01em" }}
        >
          {profile.title.split("|")[0].trim()}
        </motion.p>

        {/* Tags */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="flex flex-wrap items-center justify-center gap-2 mb-10"
        >
          {tags.map((tag, i) => (
            <motion.span
              key={tag}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4 + i * 0.05 }}
              className="text-xs px-3 py-1.5 rounded-full border font-medium"
              style={{
                borderColor: "var(--border-hover)",
                background: "var(--bg-secondary)",
                color: "var(--text-muted)",
              }}
            >
              {tag.trim()}
            </motion.span>
          ))}
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.55 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-12"
        >
          <button
            onClick={() => handleScroll("#projects")}
            className="flex items-center gap-2 text-white font-semibold rounded-lg px-7 py-3 transition-opacity duration-150 hover:opacity-80 text-sm"
            style={{ background: "var(--accent)" }}
          >
            <ArrowDown size={15} />
            View My Work
          </button>

          {profile.resume_url ? (
            <Link
              href="/resume"
              className="flex items-center gap-2 font-medium rounded-lg px-7 py-3 border transition-colors duration-150 text-sm hover:border-[var(--border-hover)] hover:text-[var(--text-primary)]"
              style={{
                borderColor: "var(--border)",
                background: "transparent",
                color: "var(--text-secondary)",
              }}
            >
              <Download size={15} />
              View Resume
            </Link>
          ) : (
            <button
              onClick={() => handleScroll("#contact")}
              className="flex items-center gap-2 font-medium rounded-lg px-7 py-3 border transition-colors duration-150 text-sm hover:border-[var(--border-hover)] hover:text-[var(--text-primary)]"
              style={{
                borderColor: "var(--border)",
                background: "transparent",
                color: "var(--text-secondary)",
              }}
            >
              <Mail size={15} />
              Get In Touch
            </button>
          )}
        </motion.div>

        {/* Social icons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="flex items-center justify-center gap-3"
        >
          {[
            { show: profile.social_links?.github,   href: profile.social_links?.github,   icon: <Github size={17} />   },
            { show: profile.social_links?.linkedin, href: profile.social_links?.linkedin, icon: <Linkedin size={17} /> },
            { show: profile.email,                  href: `mailto:${profile.email}`,       icon: <Mail size={17} />     },
          ].map(({ show, href, icon }, idx) =>
            show && href ? (
              <a
                key={idx}
                href={href}
                target={href.startsWith("mailto") ? undefined : "_blank"}
                rel="noopener noreferrer"
                className="p-3 rounded-lg border transition-colors duration-150 hover:border-[var(--border-hover)] hover:text-[var(--text-primary)]"
                style={{
                  borderColor: "var(--border)",
                  color: "var(--text-muted)",
                  background: "transparent",
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
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.0 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
        style={{ color: "var(--text-muted)" }}
      >
        <ArrowDown size={16} />
      </motion.div>
    </section>
  );
}
