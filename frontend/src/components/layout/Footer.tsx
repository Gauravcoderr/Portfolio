import { Github, Linkedin, Mail } from "lucide-react";

interface FooterProps {
  socialLinks?: {
    github: string;
    linkedin: string;
    email: string;
  };
}

export default function Footer({ socialLinks }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-[var(--border)] bg-[var(--bg-primary)]">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Left */}
          <div className="flex flex-col items-center md:items-start gap-1">
            <p className="text-sm text-[var(--text-primary)] font-medium">
              Gaurav Rauthan
            </p>
            <p className="text-xs text-[var(--text-muted)]">
              &copy; {currentYear} All rights reserved.
            </p>
          </div>

          {/* Center */}
          <p className="text-xs text-[var(--text-muted)]">
            Built with Next.js &amp; FastAPI
          </p>

          {/* Right: social icons */}
          <div className="flex items-center gap-4">
            {socialLinks?.github && (
              <a
                href={socialLinks.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                aria-label="GitHub"
              >
                <Github size={18} />
              </a>
            )}
            {socialLinks?.linkedin && (
              <a
                href={socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin size={18} />
              </a>
            )}
            {socialLinks?.email && (
              <a
                href={`mailto:${socialLinks.email}`}
                className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                aria-label="Email"
              >
                <Mail size={18} />
              </a>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
