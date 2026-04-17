// src/app/dashboard/theme/page.tsx
"use client";

import { useState, useEffect } from "react";
import type { PortfolioData } from "@/types";

const ACCENT_PRESETS = [
  { label: "Wine Red", value: "#8B1A1A" },
  { label: "Burgundy", value: "#722F37" },
  { label: "Crimson", value: "#7B1818" },
  { label: "Ember", value: "#8B3A1A" },
  { label: "Slate", value: "#1A2A3A" },
  { label: "Forest", value: "#1A3A1A" },
];

export default function ThemeDashboardPage() {
  const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(null);
  const [config, setConfig] = useState<{ title: string; description: string; accentColor: string; seoDescription: string; ogImage?: string }>({ title: "", description: "", accentColor: "#8B1A1A", seoDescription: "", ogImage: "" });
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/portfolio")
      .then((res) => res.json())
      .then((data: PortfolioData) => {
        setPortfolioData(data);
        setConfig({ ...data.config });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setConfig((p) => ({ ...p, [e.target.name]: e.target.value }));
  }

  async function handleSave() {
    if (!portfolioData) return;
    
    const updatedData: PortfolioData = {
      ...portfolioData,
      config: {
        ...portfolioData.config,
        ...config,
      },
    };

    try {
      const res = await fetch("/api/portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });
      
      if (res.ok) {
        setSaved(true);
        setPortfolioData(updatedData);
        setTimeout(() => setSaved(false), 2000);
      } else {
        alert("Failed to save changes");
      }
    } catch (error) {
      alert("Failed to save changes");
    }
  }

  const inputCls = "w-full px-3 py-2.5 bg-[var(--surface)] border border-[var(--border2)] rounded-sm font-mono text-sm text-[var(--text)] placeholder:text-[var(--text3)] outline-none focus:border-[var(--maroon)] transition-colors";

  return (
    <div className="max-w-xl space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-light text-[var(--text)] mb-1">Theme & SEO</h1>
        <p className="font-mono text-[11px] text-[var(--text3)] uppercase tracking-widest">Site identity and metadata</p>
      </div>

      {/* Theme */}
      <div className="space-y-5">
        <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--text3)] pb-2 border-b border-[var(--border)]">Accent Color</p>

        <div className="flex flex-wrap gap-2">
          {ACCENT_PRESETS.map((preset) => (
            <button
              key={preset.value}
              onClick={() => setConfig((p) => ({ ...p, accentColor: preset.value }))}
              className={`flex items-center gap-2 px-3 py-2 border rounded-sm font-mono text-[10px] transition-all ${
                config.accentColor === preset.value
                  ? "border-[var(--text2)] text-[var(--text)]"
                  : "border-[var(--border)] text-[var(--text3)] hover:border-[var(--border2)]"
              }`}
            >
              <span
                className="w-3 h-3 rounded-full shrink-0"
                style={{ backgroundColor: preset.value }}
              />
              {preset.label}
            </button>
          ))}
        </div>

        <div className="space-y-1.5">
          <label className="block font-mono text-[10px] uppercase tracking-[0.1em] text-[var(--text3)]">Custom Accent Color</label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={config.accentColor}
              onChange={(e) => setConfig((p) => ({ ...p, accentColor: e.target.value }))}
              className="w-10 h-10 rounded-sm border border-[var(--border2)] bg-[var(--surface)] cursor-pointer"
            />
            <input
              name="accentColor"
              value={config.accentColor}
              onChange={handleChange}
              placeholder="#8B1A1A"
              className={`flex-1 ${inputCls}`}
            />
          </div>
          <div
            className="mt-2 h-8 rounded-sm border border-[var(--border)]"
            style={{ backgroundColor: config.accentColor }}
          />
        </div>
      </div>

      {/* SEO */}
      <div className="space-y-5">
        <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--text3)] pb-2 border-b border-[var(--border)]">SEO & Metadata</p>

        <div className="space-y-1.5">
          <label className="block font-mono text-[10px] uppercase tracking-[0.1em] text-[var(--text3)]">Site Title</label>
          <input name="title" value={config.title} onChange={handleChange} className={inputCls} />
        </div>

        <div className="space-y-1.5">
          <label className="block font-mono text-[10px] uppercase tracking-[0.1em] text-[var(--text3)]">SEO Description</label>
          <textarea
            name="seoDescription"
            value={config.seoDescription}
            onChange={handleChange}
            rows={3}
            className={`${inputCls} resize-none`}
          />
          <p className="font-mono text-[9px] text-[var(--text3)]">
            {config.seoDescription.length} / 160 characters recommended
          </p>
        </div>

        <div className="space-y-1.5">
          <label className="block font-mono text-[10px] uppercase tracking-[0.1em] text-[var(--text3)]">OG Image URL <span className="text-[var(--text3)] normal-case">(optional)</span></label>
          <input name="ogImage" value={config.ogImage ?? ""} onChange={handleChange} placeholder="https://..." className={inputCls} />
          <p className="font-mono text-[9px] text-[var(--text3)]">Recommended size: 1200×630px. Used for social share previews.</p>
        </div>
      </div>

      {/* Preview */}
      <div className="space-y-3">
        <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--text3)]">Search Result Preview</p>
        <div className="p-4 border border-[var(--border)] rounded-sm bg-[var(--surface)] space-y-1">
          <p className="text-base font-medium text-[#8ab4f8]">{config.title}</p>
          <p className="font-mono text-[10px] text-green-600">yourdomain.com</p>
          <p className="text-[13px] text-[var(--text3)] leading-relaxed">{config.seoDescription.slice(0, 160)}</p>
        </div>
      </div>

      {/* Save */}
      <div className="flex items-center gap-4 pt-2">
        <button
          onClick={handleSave}
          className="px-7 py-2.5 bg-[var(--maroon)] hover:bg-[var(--maroon2)] text-white font-medium text-[11px] uppercase tracking-[0.08em] rounded-sm transition-all"
        >
          Save Changes
        </button>
        {saved && <span className="font-mono text-[11px] text-green-500 uppercase tracking-wide">✓ Saved</span>}
      </div>
    </div>
  );
}
