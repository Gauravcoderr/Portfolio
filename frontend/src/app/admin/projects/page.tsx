"use client";

import { useState, useEffect, FormEvent } from "react";
import {
  getAdminProjects,
  createProject,
  updateProject,
  deleteProject,
} from "@/lib/api";
import { Project } from "@/types";
import { Plus, Pencil, Trash2, X, Star } from "lucide-react";

interface ProjectForm {
  title: string;
  slug: string;
  description: string;
  bullets: string[];
  live_url: string;
  github_url: string;
  tech_stack: string;
  category: "professional" | "personal";
  is_featured: boolean;
  order: number;
}

const emptyForm: ProjectForm = {
  title: "",
  slug: "",
  description: "",
  bullets: [""],
  live_url: "",
  github_url: "",
  tech_stack: "",
  category: "personal",
  is_featured: false,
  order: 0,
};

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ProjectForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const data = await getAdminProjects();
      setProjects(data);
    } catch {
      setError("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openAddForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
  };

  const openEditForm = (project: Project) => {
    setForm({
      title: project.title,
      slug: project.slug,
      description: project.description,
      bullets: project.bullets.length > 0 ? project.bullets : [""],
      live_url: project.live_url,
      github_url: project.github_url,
      tech_stack: project.tech_stack.join(", "),
      category: project.category,
      is_featured: project.is_featured,
      order: project.order,
    });
    setEditingId(project.id);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      title: form.title,
      slug: form.slug,
      description: form.description,
      bullets: form.bullets.filter((b) => b.trim() !== ""),
      live_url: form.live_url,
      github_url: form.github_url,
      tech_stack: form.tech_stack
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      category: form.category,
      is_featured: form.is_featured,
      order: form.order,
    };

    try {
      if (editingId) {
        await updateProject(editingId, payload);
      } else {
        await createProject(payload);
      }
      await fetchData();
      closeForm();
    } catch {
      setError(editingId ? "Failed to update project" : "Failed to create project");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteProject(id);
      setConfirmDeleteId(null);
      await fetchData();
    } catch {
      setError("Failed to delete project");
    }
  };

  const addBulletField = () => {
    setForm((prev) => ({ ...prev, bullets: [...prev.bullets, ""] }));
  };

  const removeBulletField = (index: number) => {
    setForm((prev) => ({
      ...prev,
      bullets: prev.bullets.filter((_, i) => i !== index),
    }));
  };

  const updateBullet = (index: number, value: string) => {
    setForm((prev) => ({
      ...prev,
      bullets: prev.bullets.map((b, i) => (i === index ? value : b)),
    }));
  };

  const inputClass =
    "w-full bg-[var(--bg-card)] border border-[var(--border)] rounded-lg px-4 py-3 text-white focus:border-[var(--accent)] outline-none transition-colors";

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-[var(--text-secondary)]">Loading projects...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">
          Projects
        </h1>
        <button
          onClick={openAddForm}
          className="flex items-center gap-2 bg-[var(--accent)] hover:opacity-90 text-white rounded-lg px-4 py-2 font-medium transition-opacity"
        >
          <Plus size={18} />
          Add Project
        </button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3 text-red-400 text-sm mb-6">
          {error}
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-[var(--bg-secondary)] border border-[var(--border)] rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-[var(--text-primary)]">
                {editingId ? "Edit Project" : "Add Project"}
              </h2>
              <button
                onClick={closeForm}
                className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                    Title
                  </label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, title: e.target.value }))
                    }
                    className={inputClass}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                    Slug
                  </label>
                  <input
                    type="text"
                    value={form.slug}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, slug: e.target.value }))
                    }
                    className={inputClass}
                    placeholder="my-project"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                  Description
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  rows={3}
                  className={inputClass + " resize-none"}
                  required
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-[var(--text-secondary)]">
                    Bullet Points
                  </label>
                  <button
                    type="button"
                    onClick={addBulletField}
                    className="text-xs text-[var(--accent)] hover:underline"
                  >
                    + Add bullet
                  </button>
                </div>
                <div className="space-y-3">
                  {form.bullets.map((bullet, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={bullet}
                        onChange={(e) => updateBullet(index, e.target.value)}
                        className={inputClass}
                        placeholder={`Bullet point ${index + 1}`}
                      />
                      {form.bullets.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeBulletField(index)}
                          className="text-red-400 hover:text-red-300 shrink-0"
                        >
                          <X size={18} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                    Live URL
                  </label>
                  <input
                    type="url"
                    value={form.live_url}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        live_url: e.target.value,
                      }))
                    }
                    className={inputClass}
                    placeholder="https://myproject.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                    GitHub URL
                  </label>
                  <input
                    type="url"
                    value={form.github_url}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        github_url: e.target.value,
                      }))
                    }
                    className={inputClass}
                    placeholder="https://github.com/user/repo"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                  Tech Stack (comma-separated)
                </label>
                <input
                  type="text"
                  value={form.tech_stack}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      tech_stack: e.target.value,
                    }))
                  }
                  className={inputClass}
                  placeholder="React, Next.js, TypeScript"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                    Category
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        category: e.target.value as "professional" | "personal",
                      }))
                    }
                    className={inputClass}
                  >
                    <option value="personal">Personal</option>
                    <option value="professional">Professional</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={form.order}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        order: parseInt(e.target.value) || 0,
                      }))
                    }
                    className={inputClass}
                  />
                </div>
              </div>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.is_featured}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      is_featured: e.target.checked,
                    }))
                  }
                  className="w-4 h-4 rounded border-[var(--border)] accent-[var(--accent)]"
                />
                <span className="text-sm text-[var(--text-secondary)]">
                  Featured project
                </span>
              </label>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-[var(--accent)] hover:opacity-90 text-white rounded-lg px-6 py-2.5 font-medium transition-opacity disabled:opacity-50"
                >
                  {saving
                    ? "Saving..."
                    : editingId
                    ? "Update Project"
                    : "Create Project"}
                </button>
                <button
                  type="button"
                  onClick={closeForm}
                  className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] px-4 py-2.5 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Projects List */}
      {projects.length === 0 ? (
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-12 text-center">
          <p className="text-[var(--text-secondary)]">
            No projects yet. Add your first one!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-6"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                      {project.title}
                    </h3>
                    {project.is_featured && (
                      <Star
                        size={14}
                        className="text-[var(--accent)] fill-[var(--accent)]"
                      />
                    )}
                  </div>
                  <span
                    className={`inline-block text-xs px-2.5 py-1 rounded-full font-medium ${
                      project.category === "professional"
                        ? "bg-blue-500/10 text-blue-400"
                        : "bg-emerald-500/10 text-emerald-400"
                    }`}
                  >
                    {project.category}
                  </span>
                </div>
                <div className="flex items-center gap-1 ml-4">
                  <button
                    onClick={() => openEditForm(project)}
                    className="p-2 text-[var(--text-secondary)] hover:text-[var(--accent)] hover:bg-[var(--accent)]/10 rounded-lg transition-colors"
                  >
                    <Pencil size={16} />
                  </button>
                  {confirmDeleteId === project.id ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleDelete(project.id)}
                        className="text-xs bg-red-500 text-white px-3 py-1.5 rounded-lg hover:bg-red-600 transition-colors"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => setConfirmDeleteId(null)}
                        className="text-xs text-[var(--text-secondary)] px-2 py-1.5 hover:text-[var(--text-primary)] transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmDeleteId(project.id)}
                      className="p-2 text-[var(--text-secondary)] hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>

              <p className="text-sm text-[var(--text-secondary)] line-clamp-2 mb-3">
                {project.description}
              </p>

              {project.tech_stack.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {project.tech_stack.slice(0, 4).map((tech, i) => (
                    <span
                      key={i}
                      className="text-xs bg-[var(--bg-secondary)] text-[var(--text-secondary)] px-2 py-0.5 rounded"
                    >
                      {tech}
                    </span>
                  ))}
                  {project.tech_stack.length > 4 && (
                    <span className="text-xs text-[var(--text-secondary)]">
                      +{project.tech_stack.length - 4}
                    </span>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
