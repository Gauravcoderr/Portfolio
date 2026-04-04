"use client";

import { useState, FormEvent } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Send, CheckCircle, AlertCircle } from "lucide-react";
import { submitContact } from "@/lib/api";
import type { Profile } from "@/types";
import SectionWrapper from "./SectionWrapper";

interface ContactProps {
  profile: Profile;
}

export default function Contact({ profile }: ContactProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      await submitContact(formData);
      setStatus("success");
      setFormData({ name: "", email: "", message: "" });
    } catch (err) {
      setStatus("error");
      setErrorMessage(
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      );
    }
  };

  return (
    <SectionWrapper
      id="contact"
      title="Get In Touch"
      subtitle="Have a project in mind or just want to say hi? Let's connect."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Left: Contact info */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-8"
        >
          <p className="text-[var(--text-secondary)] text-lg leading-relaxed">
            I&apos;m always open to discussing new projects, creative ideas, or
            opportunities to be part of something great.
          </p>

          <div className="space-y-5">
            {profile.email && (
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[var(--accent)]/10 text-[var(--accent)]">
                  <Mail size={18} />
                </div>
                <div>
                  <p className="text-xs text-[var(--text-muted)] uppercase tracking-wide">
                    Email
                  </p>
                  <a
                    href={`mailto:${profile.email}`}
                    className="text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors"
                  >
                    {profile.email}
                  </a>
                </div>
              </div>
            )}

            {profile.phone && (
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[var(--accent)]/10 text-[var(--accent)]">
                  <Phone size={18} />
                </div>
                <div>
                  <p className="text-xs text-[var(--text-muted)] uppercase tracking-wide">
                    Phone
                  </p>
                  <a
                    href={`tel:${profile.phone}`}
                    className="text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors"
                  >
                    {profile.phone}
                  </a>
                </div>
              </div>
            )}

            {profile.location && (
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[var(--accent)]/10 text-[var(--accent)]">
                  <MapPin size={18} />
                </div>
                <div>
                  <p className="text-xs text-[var(--text-muted)] uppercase tracking-wide">
                    Location
                  </p>
                  <p className="text-[var(--text-primary)]">{profile.location}</p>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Right: Contact form */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="contact-name"
                className="block text-sm font-medium text-[var(--text-secondary)] mb-2"
              >
                Name
              </label>
              <input
                id="contact-name"
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="Your name"
                className="w-full bg-[var(--bg-card)] border border-[var(--border)] rounded-lg px-4 py-3 text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] outline-none transition-colors"
              />
            </div>

            <div>
              <label
                htmlFor="contact-email"
                className="block text-sm font-medium text-[var(--text-secondary)] mb-2"
              >
                Email
              </label>
              <input
                id="contact-email"
                type="email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, email: e.target.value }))
                }
                placeholder="you@example.com"
                className="w-full bg-[var(--bg-card)] border border-[var(--border)] rounded-lg px-4 py-3 text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] outline-none transition-colors"
              />
            </div>

            <div>
              <label
                htmlFor="contact-message"
                className="block text-sm font-medium text-[var(--text-secondary)] mb-2"
              >
                Message
              </label>
              <textarea
                id="contact-message"
                required
                rows={5}
                value={formData.message}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, message: e.target.value }))
                }
                placeholder="Tell me about your project or idea..."
                className="w-full bg-[var(--bg-card)] border border-[var(--border)] rounded-lg px-4 py-3 text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent)] outline-none transition-colors resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={status === "loading"}
              className="flex items-center justify-center gap-2 w-full bg-[var(--accent)] hover:bg-[var(--accent-dark)] disabled:opacity-60 disabled:cursor-not-allowed text-white rounded-lg px-6 py-3 font-medium transition-colors"
            >
              {status === "loading" ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send size={16} />
                  Send Message
                </>
              )}
            </button>

            {/* Status messages */}
            {status === "success" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 text-green-400 text-sm"
              >
                <CheckCircle size={16} />
                Message sent successfully! I&apos;ll get back to you soon.
              </motion.div>
            )}

            {status === "error" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 text-red-400 text-sm"
              >
                <AlertCircle size={16} />
                {errorMessage}
              </motion.div>
            )}
          </form>
        </motion.div>
      </div>
    </SectionWrapper>
  );
}
