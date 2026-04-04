"use client";

import { useState, useEffect, FormEvent } from "react";
import {
  getAdminSkills,
  createSkillCategory,
  updateSkillCategory,
  deleteSkillCategory,
} from "@/lib/api";
import { SkillCategory, SkillItem } from "@/types";
import { Plus, Pencil, Trash2, X } from "lucide-react";

interface SkillCategoryForm {
  category: string;
  items: SkillItem[];
  order: number;
}

const emptyForm: SkillCategoryForm = {
  category: "",
  items: [{ name: "", proficiency: 80 }],
  order: 0,
};

export default function AdminSkillsPage() {
  const [skills, setSkills] = useState<SkillCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<SkillCategoryForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const data = await getAdminSkills();
      setSkills(data);
    } catch {
      setError("Failed to load skills");
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

  const openEditForm = (cat: SkillCategory) => {
    setForm({
      category: cat.category,
      items: cat.items.length > 0 ? [...cat.items] : [{ name: "", proficiency: 80 }],
      order: cat.order,
    });
    setEditingId(cat.id);
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
      category: form.category,
      items: form.items.filter((item) => item.name.trim() !== ""),
      order: form.order,
    };

    try {
      if (editingId) {
        await updateSkillCategory(editingId, payload);
      } else {
        await createSkillCategory(payload);
      }
      await fetchData();
      closeForm();
    } catch {
      setError(editingId ? "Failed to update skill category" : "Failed to create skill category");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteSkillCategory(id);
      setConfirmDeleteId(null);
      await fetchData();
    } catch {
      setError("Failed to delete skill category");
    }
  };

  const addSkillItem = () => {
    setForm((prev) => ({
      ...prev,
      items: [...prev.items, { name: "", proficiency: 80 }],
    }));
  };

  const removeSkillItem = (index: number) => {
    setForm((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const updateSkillItem = (
    index: number,
    field: keyof SkillItem,
    value: string | number
  ) => {
    setForm((prev) => ({
      ...prev,
      items: prev.items.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }));
  };

  const inputClass =
    "w-full bg-[var(--bg-card)] border border-[var(--border)] rounded-lg px-4 py-3 text-white focus:border-[var(--accent)] outline-none transition-colors";

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-[var(--text-secondary)]">Loading skills...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">
          Skills
        </h1>
        <button
          onClick={openAddForm}
          className="flex items-center gap-2 bg-[var(--accent)] hover:opacity-90 text-white rounded-lg px-4 py-2 font-medium transition-opacity"
        >
          <Plus size={18} />
          Add Category
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
                {editingId ? "Edit Skill Category" : "Add Skill Category"}
              </h2>
              <button
                onClick={closeForm}
                className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                  Category Name
                </label>
                <input
                  type="text"
                  value={form.category}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, category: e.target.value }))
                  }
                  className={inputClass}
                  placeholder="e.g., Frontend, Backend, DevOps"
                  required
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

              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-medium text-[var(--text-secondary)]">
                    Skills
                  </label>
                  <button
                    type="button"
                    onClick={addSkillItem}
                    className="text-xs text-[var(--accent)] hover:underline"
                  >
                    + Add skill
                  </button>
                </div>
                <div className="space-y-3">
                  {form.items.map((item, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) =>
                          updateSkillItem(index, "name", e.target.value)
                        }
                        className={inputClass}
                        placeholder="Skill name"
                      />
                      <div className="flex items-center gap-2 shrink-0">
                        <input
                          type="range"
                          min={0}
                          max={100}
                          value={item.proficiency}
                          onChange={(e) =>
                            updateSkillItem(
                              index,
                              "proficiency",
                              parseInt(e.target.value)
                            )
                          }
                          className="w-24 accent-[var(--accent)]"
                        />
                        <span className="text-sm text-[var(--text-secondary)] w-10 text-right">
                          {item.proficiency}%
                        </span>
                      </div>
                      {form.items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeSkillItem(index)}
                          className="text-red-400 hover:text-red-300 shrink-0"
                        >
                          <X size={18} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
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
                    ? "Update Category"
                    : "Create Category"}
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

      {/* Skills List */}
      {skills.length === 0 ? (
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-12 text-center">
          <p className="text-[var(--text-secondary)]">
            No skill categories yet. Add your first one!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {skills.map((cat) => (
            <div
              key={cat.id}
              className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                    {cat.category}
                  </h3>
                  <p className="text-sm text-[var(--text-secondary)] mt-0.5">
                    {cat.items.length} skill{cat.items.length !== 1 ? "s" : ""}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditForm(cat)}
                    className="p-2 text-[var(--text-secondary)] hover:text-[var(--accent)] hover:bg-[var(--accent)]/10 rounded-lg transition-colors"
                  >
                    <Pencil size={16} />
                  </button>
                  {confirmDeleteId === cat.id ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleDelete(cat.id)}
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
                      onClick={() => setConfirmDeleteId(cat.id)}
                      className="p-2 text-[var(--text-secondary)] hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>

              <div className="space-y-2.5">
                {cat.items.map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <span className="text-sm text-[var(--text-primary)] w-32 shrink-0">
                      {item.name}
                    </span>
                    <div className="flex-1 bg-[var(--bg-secondary)] rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full bg-[var(--accent)] rounded-full transition-all"
                        style={{ width: `${item.proficiency}%` }}
                      />
                    </div>
                    <span className="text-xs text-[var(--text-secondary)] w-10 text-right">
                      {item.proficiency}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
