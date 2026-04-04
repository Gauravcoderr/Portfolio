"use client";

import { useState, useEffect } from "react";
import { fetchPortfolioClient, updateTheme } from "@/lib/api";
import { useTheme } from "@/context/ThemeContext";
import { Check } from "lucide-react";

const presets = [
  { name: "Indigo", color: "#6366f1" },
  { name: "Emerald", color: "#10b981" },
  { name: "Cyan", color: "#06b6d4" },
  { name: "Rose", color: "#f43f5e" },
  { name: "Amber", color: "#f59e0b" },
  { name: "Violet", color: "#8b5cf6" },
  { name: "Blue", color: "#3b82f6" },
  { name: "Orange", color: "#f97316" },
];

export default function AdminThemePage() {
  const { accentColor, setAccentColor } = useTheme();
  const [selectedColor, setSelectedColor] = useState(accentColor);
  const [customHex, setCustomHex] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const data = await fetchPortfolioClient();
        if (data.theme?.accent_color) {
          setSelectedColor(data.theme.accent_color);
          setAccentColor(data.theme.accent_color);
        }
      } catch {
        setError("Failed to load theme");
      } finally {
        setLoading(false);
      }
    };
    loadTheme();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectPreset = (color: string) => {
    setSelectedColor(color);
    setCustomHex("");
    setAccentColor(color);
  };

  const handleCustomHex = (value: string) => {
    setCustomHex(value);
    if (/^#[0-9A-Fa-f]{6}$/.test(value)) {
      setSelectedColor(value);
      setAccentColor(value);
    }
  };

  const getPresetName = (color: string): string => {
    const preset = presets.find(
      (p) => p.color.toLowerCase() === color.toLowerCase()
    );
    return preset ? preset.name : "Custom";
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      await updateTheme({
        accent_color: selectedColor,
        accent_color_name: getPresetName(selectedColor),
      });
      setSuccess("Theme updated successfully");
      setTimeout(() => setSuccess(""), 3000);
    } catch {
      setError("Failed to update theme");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-[var(--text-secondary)]">Loading theme...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-8">
        Theme Settings
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

      {/* Preset Colors */}
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-6 mb-6">
        <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
          Accent Color
        </h2>
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-4">
          {presets.map((preset) => (
            <button
              key={preset.name}
              onClick={() => selectPreset(preset.color)}
              className="flex flex-col items-center gap-2 group"
            >
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                  selectedColor.toLowerCase() === preset.color.toLowerCase()
                    ? "ring-2 ring-offset-2 ring-offset-[var(--bg-card)]"
                    : "hover:scale-110"
                }`}
                style={{
                  backgroundColor: preset.color,
                  ringColor: preset.color,
                }}
              >
                {selectedColor.toLowerCase() ===
                  preset.color.toLowerCase() && (
                  <Check size={18} className="text-white" />
                )}
              </div>
              <span className="text-xs text-[var(--text-secondary)] group-hover:text-[var(--text-primary)]">
                {preset.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Custom Color */}
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-6 mb-6">
        <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
          Custom Color
        </h2>
        <div className="flex items-center gap-4">
          <div
            className="w-12 h-12 rounded-lg border border-[var(--border)] shrink-0"
            style={{ backgroundColor: selectedColor }}
          />
          <input
            type="text"
            value={customHex || selectedColor}
            onChange={(e) => handleCustomHex(e.target.value)}
            className="w-full bg-[var(--bg-card)] border border-[var(--border)] rounded-lg px-4 py-3 text-white focus:border-[var(--accent)] outline-none transition-colors font-mono"
            placeholder="#6366f1"
            maxLength={7}
          />
          <input
            type="color"
            value={selectedColor}
            onChange={(e) => {
              setSelectedColor(e.target.value);
              setCustomHex(e.target.value);
              setAccentColor(e.target.value);
            }}
            className="w-12 h-12 rounded-lg cursor-pointer border-0 bg-transparent shrink-0"
          />
        </div>
      </div>

      {/* Live Preview */}
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-6 mb-8">
        <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
          Live Preview
        </h2>
        <div className="space-y-4">
          <div className="flex items-center gap-3 flex-wrap">
            <button
              className="px-4 py-2 rounded-lg text-white font-medium text-sm"
              style={{ backgroundColor: selectedColor }}
            >
              Primary Button
            </button>
            <button
              className="px-4 py-2 rounded-lg font-medium text-sm border"
              style={{
                borderColor: selectedColor,
                color: selectedColor,
              }}
            >
              Outline Button
            </button>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span
              className="text-xs px-3 py-1 rounded-full font-medium"
              style={{
                backgroundColor: `${selectedColor}1a`,
                color: selectedColor,
              }}
            >
              Badge
            </span>
            <span
              className="text-xs px-3 py-1 rounded-full font-medium text-white"
              style={{ backgroundColor: selectedColor }}
            >
              Solid Badge
            </span>
          </div>

          <div>
            <p style={{ color: selectedColor }} className="font-medium">
              Accent colored text looks like this
            </p>
            <p className="text-[var(--text-secondary)] text-sm mt-1">
              Regular secondary text for comparison
            </p>
          </div>

          <div
            className="w-full h-2 rounded-full overflow-hidden"
            style={{ backgroundColor: `${selectedColor}1a` }}
          >
            <div
              className="h-full rounded-full"
              style={{ backgroundColor: selectedColor, width: "65%" }}
            />
          </div>
        </div>
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="bg-[var(--accent)] hover:opacity-90 text-white rounded-lg px-6 py-2.5 font-medium transition-opacity disabled:opacity-50"
      >
        {saving ? "Saving..." : "Save Theme"}
      </button>
    </div>
  );
}
