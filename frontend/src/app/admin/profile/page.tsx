"use client";

import { useState, useEffect, useRef, FormEvent } from "react";
import { fetchPortfolioClient, updateProfile, uploadResume } from "@/lib/api";
import { Profile } from "@/types";

export default function AdminProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [bio, setBio] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [github, setGithub] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [twitter, setTwitter] = useState("");
  const [resumeUrl, setResumeUrl] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await fetchPortfolioClient();
        const p: Profile = data.profile;
        setName(p.name || "");
        setTitle(p.title || "");
        setBio(p.bio || "");
        setEmail(p.email || "");
        setPhone(p.phone || "");
        setLocation(p.location || "");
        setGithub(p.social_links?.github || "");
        setLinkedin(p.social_links?.linkedin || "");
        setTwitter(p.social_links?.twitter || "");
        setResumeUrl(p.resume_url || "");
      } catch {
        setError("Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);

    try {
      await updateProfile({
        name,
        title,
        bio,
        email,
        phone,
        location,
        resume_url: resumeUrl,
        social_links: {
          github,
          linkedin,
          twitter,
          email,
        },
      });
      setSuccess("Profile updated successfully");
      setTimeout(() => setSuccess(""), 3000);
    } catch {
      setError("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-[var(--text-secondary)]">Loading profile...</p>
      </div>
    );
  }

  const inputClass =
    "w-full bg-[var(--bg-card)] border border-[var(--border)] rounded-lg px-4 py-3 text-white focus:border-[var(--accent)] outline-none transition-colors";

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-8">
        Edit Profile
      </h1>

      {success && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg px-4 py-3 text-emerald-400 text-sm mb-6">
          {success}
        </div>
      )}

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 text-red-400 text-sm mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Info */}
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-6 space-y-5">
          <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
            Basic Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={inputClass}
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={inputClass}
                placeholder="Full Stack Developer"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
              Bio
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={4}
              className={inputClass + " resize-none"}
              placeholder="A short bio about yourself..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                Phone
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={inputClass}
                placeholder="+1 234 567 890"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className={inputClass}
                placeholder="New York, NY"
              />
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-6 space-y-5">
          <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
            Social Links
          </h2>

          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
              GitHub URL
            </label>
            <input
              type="url"
              value={github}
              onChange={(e) => setGithub(e.target.value)}
              className={inputClass}
              placeholder="https://github.com/username"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
              LinkedIn URL
            </label>
            <input
              type="url"
              value={linkedin}
              onChange={(e) => setLinkedin(e.target.value)}
              className={inputClass}
              placeholder="https://linkedin.com/in/username"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
              Twitter URL
            </label>
            <input
              type="url"
              value={twitter}
              onChange={(e) => setTwitter(e.target.value)}
              className={inputClass}
              placeholder="https://twitter.com/username"
            />
          </div>
        </div>

        {/* Resume */}
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-6 space-y-5">
          <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
            Resume
          </h2>

          {/* File upload */}
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-3">
              Upload PDF
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,application/pdf"
              className="hidden"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                setUploading(true);
                setError("");
                try {
                  const url = await uploadResume(file);
                  setResumeUrl(url);
                  setSuccess("Resume uploaded — click Save Changes to apply.");
                  setTimeout(() => setSuccess(""), 4000);
                } catch (err) {
                  setError(err instanceof Error ? err.message : "Upload failed");
                } finally {
                  setUploading(false);
                  if (fileInputRef.current) fileInputRef.current.value = "";
                }
              }}
            />
            <div className="flex items-center gap-3">
              <button
                type="button"
                disabled={uploading}
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-[var(--border)] bg-[#0d0d0d] text-sm font-medium text-[var(--text-secondary)] hover:text-white hover:border-[var(--accent)] transition-colors disabled:opacity-50"
              >
                {uploading ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Uploading…
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Choose PDF
                  </>
                )}
              </button>
              {resumeUrl && (
                <a
                  href={resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[var(--accent)] hover:underline truncate max-w-xs"
                >
                  View current resume ↗
                </a>
              )}
            </div>
          </div>

          {/* Manual URL fallback */}
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
              Or paste a URL
            </label>
            <input
              type="url"
              value={resumeUrl}
              onChange={(e) => setResumeUrl(e.target.value)}
              className={inputClass}
              placeholder="https://drive.google.com/file/..."
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="bg-[var(--accent)] hover:opacity-90 text-white rounded-lg px-6 py-2.5 font-medium transition-opacity disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
