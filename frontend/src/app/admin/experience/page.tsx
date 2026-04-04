"use client";

import { useState, useEffect, FormEvent } from "react";
import {
  getAdminExperience,
  createExperience,
  updateExperience,
  deleteExperience,
} from "@/lib/api";
import { Experience } from "@/types";
import { Plus, Pencil, Trash2, X } from "lucide-react";

interface ExperienceForm {
  company: string;
  role: string;
  location: string;
  start_date: string;
  end_date: string;
  is_current: boolean;
  description: string[];
  tech_stack: string;
  company_url: string;
  order: number;
}

const emptyForm: ExperienceForm = {
  company: "",
  role: "",
  location: "",
  start_date: "",
  end_date: "",
  is_current: false,
  description: [""],
  tech_stack: "",
  company_url: "",
  order: 0,
};

export default function AdminExperiencePage() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ExperienceForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const data = await getAdminExperience();
      setExperiences(data);
    } catch {
      setError("Failed to load experience data");
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

  const openEditForm = (exp: Experience) => {
    setForm({
      company: exp.company,
      role: exp.role,
      location: exp.location,
      start_date: exp.start_date,
      end_date: exp.end_date || "",
      is_current: exp.is_current,
      description: exp.description.length > 0 ? exp.description : [""],
      tech_stack: exp.tech_stack.join(", "),
      company_url: exp.company_url,
      order: exp.order,
    });
    setEditingId(exp.id);
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
      company: form.company,
      role: form.role,
      location: form.location,
      start_date: form.start_date,
      end_date: form.is_current ? null : form.end_date,
      is_current: form.is_current,
      description: form.description.filter((d) => d.trim() !== ""),
      tech_stack: form.tech_stack
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      company_url: form.company_url,
      order: form.order,
    };

    try {
      if (editingId) {
        await updateExperience(editingId, payload);
      } else {
        await createExperience(payload);
      }
      await fetchData();
      closeForm();
    } catch {
      setError(editingId ? "Failed to update experience" : "Failed to create experience");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteExperience(id);
      setConfirmDeleteId(null);
      await fetchData();
    } catch {
      setError("Failed to delete experience");
    }
  };

  const addDescriptionField = () => {
    setForm((prev) => ({ ...prev, description: [...prev.description, ""] }));
  };

  const removeDescriptionField = (index: number) => {
    setForm((prev) => ({
      ...prev,
      description: prev.description.filter((_, i) => i !== index),
    }));
  };

  const updateDescription = (index: number, value: string) => {
    setForm((prev) => ({
      ...prev,
      description: prev.description.map((d, i) => (i === index ? value : d)),
    }));
  };

  const inputClass =
    "w-full bg-[var(--bg-card)] border border-[var(--border)] rounded-lg px-4 py-3 text-white focus:border-[var(--accent)] outline-none transition-colors";

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-[var(--text-secondary)]">Loading experience...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">
          Experience
        </h1>
        <button
          onClick={openAddForm}
          className="flex items-center gap-2 bg-[var(--accent)] hover:opacity-90 text-white rounded-lg px-4 py-2 font-medium transition-opacity"
        >
          <Plus size={18} />
          Add Experience
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
                {editingId ? "Edit Experience" : "Add Experience"}
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
                    Company
                  </label>
                  <input
                    type="text"
                    value={form.company}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, company: e.target.value }))
                    }
                    className={inputClass}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                    Role
                  </label>
                  <input
                    type="text"
                    value={form.role}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, role: e.target.value }))
                    }
                    className={inputClass}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    value={form.location}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, location: e.target.value }))
                    }
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                    Company URL
                  </label>
                  <input
                    type="url"
                    value={form.company_url}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        company_url: e.target.value,
                      }))
                    }
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={form.start_date}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        start_date: e.target.value,
                      }))
                    }
                    className={inputClass}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={form.end_date}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        end_date: e.target.value,
                      }))
                    }
                    className={inputClass}
                    disabled={form.is_current}
                  />
                </div>
              </div>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.is_current}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      is_current: e.target.checked,
                      end_date: e.target.checked ? "" : prev.end_date,
                    }))
                  }
                  className="w-4 h-4 rounded border-[var(--border)] accent-[var(--accent)]"
                />
                <span className="text-sm text-[var(--text-secondary)]">
                  Currently working here
                </span>
              </label>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-[var(--text-secondary)]">
                    Description
                  </label>
                  <button
                    type="button"
                    onClick={addDescriptionField}
                    className="text-xs text-[var(--accent)] hover:underline"
                  >
                    + Add bullet point
                  </button>
                </div>
                <div className="space-y-3">
                  {form.description.map((desc, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={desc}
                        onChange={(e) =>
                          updateDescription(index, e.target.value)
                        }
                        className={inputClass}
                        placeholder={`Description point ${index + 1}`}
                      />
                      {form.description.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeDescriptionField(index)}
                          className="text-red-400 hover:text-red-300 shrink-0"
                        >
                          <X size={18} />
                        </button>
                      )}
                    </div>
                  ))}
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
                  placeholder="React, Node.js, TypeScript"
                />
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

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-[var(--accent)] hover:opacity-90 text-white rounded-lg px-6 py-2.5 font-medium transition-opacity disabled:opacity-50"
                >
                  {saving
                    ? "Saving..."
                    : editingId
                    ? "Update Experience"
                    : "Create Experience"}
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

      {/* Experience List */}
      {experiences.length === 0 ? (
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-12 text-center">
          <p className="text-[var(--text-secondary)]">
            No experience entries yet. Add your first one!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {experiences.map((exp) => (
            <div
              key={exp.id}
              className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-6"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                    {exp.role}
                  </h3>
                  <p className="text-[var(--accent)] font-medium mt-0.5">
                    {exp.company}
                  </p>
                  <p className="text-sm text-[var(--text-secondary)] mt-1">
                    {exp.location} &middot; {exp.start_date} &ndash;{" "}
                    {exp.is_current ? "Present" : exp.end_date}
                  </p>
                  {exp.tech_stack.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {exp.tech_stack.map((tech, i) => (
                        <span
                          key={i}
                          className="text-xs bg-[var(--accent)]/10 text-[var(--accent)] px-2.5 py-1 rounded-full"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={() => openEditForm(exp)}
                    className="p-2 text-[var(--text-secondary)] hover:text-[var(--accent)] hover:bg-[var(--accent)]/10 rounded-lg transition-colors"
                  >
                    <Pencil size={16} />
                  </button>
                  {confirmDeleteId === exp.id ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleDelete(exp.id)}
                        className="text-xs bg-red-500 text-white px-3 py-1.5 rounded-lg hover:bg-red-600 transition-colors"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() => setConfirmDeleteId(null)}
                        className="text-xs text-[var(--text-secondary)] px-3 py-1.5 hover:text-[var(--text-primary)] transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmDeleteId(exp.id)}
                      className="p-2 text-[var(--text-secondary)] hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
