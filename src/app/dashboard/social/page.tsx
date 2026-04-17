// src/app/dashboard/social/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, GripVertical } from "lucide-react";
import type { SocialLink, PortfolioData } from "@/types";

const PLATFORMS: SocialLink["platform"][] = ["email", "linkedin", "github", "instagram", "whatsapp", "twitter"];

export default function SocialDashboardPage() {
  const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(null);
  const [links, setLinks] = useState<SocialLink[]>([]);
  const [form, setForm] = useState<Partial<SocialLink>>({ platform: "linkedin", label: "", value: "", displayValue: "" });
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/portfolio")
      .then((res) => res.json())
      .then((data: PortfolioData) => {
        setPortfolioData(data);
        setLinks(data.socials);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  function addLink() {
    if (!form.label?.trim() || !form.value?.trim()) return;
    const link: SocialLink = {
      id: `social-${Date.now()}`,
      platform: form.platform ?? "email",
      label: form.label!,
      value: form.value!,
      displayValue: form.displayValue ?? form.value!,
    };
    setLinks([...links, link]);
    setForm({ platform: "linkedin", label: "", value: "", displayValue: "" });
  }

  function removeLink(id: string) {
    setLinks(links.filter((l) => l.id !== id));
  }

  function updateLink(id: string, field: keyof SocialLink, val: string) {
    setLinks(links.map((l) => l.id === id ? { ...l, [field]: val } : l));
  }

  async function handleSave() {
    if (!portfolioData) return;
    
    const updatedData: PortfolioData = {
      ...portfolioData,
      socials: links,
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

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-light text-[var(--text)] mb-1">Social Links</h1>
        <p className="font-mono text-[11px] text-[var(--text3)] uppercase tracking-widest">{links.length} platforms configured</p>
      </div>

      {/* Existing links */}
      <div className="space-y-2">
        {links.map((link) => (
          <div key={link.id} className="flex items-center gap-3 px-4 py-3 border border-[var(--border)] rounded-sm bg-[var(--surface)] group hover:border-[var(--border2)] transition-colors">
            <GripVertical size={14} className="text-[var(--text3)] opacity-0 group-hover:opacity-100 cursor-grab shrink-0" />
            <select
              value={link.platform}
              onChange={(e) => updateLink(link.id, "platform", e.target.value)}
              className="w-28 px-2 py-1.5 bg-[var(--bg)] border border-[var(--border2)] rounded-sm font-mono text-[10px] text-[var(--text2)] outline-none focus:border-[var(--maroon)] transition-colors"
            >
              {PLATFORMS.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
            <input
              value={link.label}
              onChange={(e) => updateLink(link.id, "label", e.target.value)}
              placeholder="Label"
              className="w-24 px-2 py-1.5 bg-[var(--bg)] border border-[var(--border2)] rounded-sm font-mono text-[11px] text-[var(--text)] outline-none focus:border-[var(--maroon)] transition-colors"
            />
            <input
              value={link.value}
              onChange={(e) => updateLink(link.id, "value", e.target.value)}
              placeholder="URL or mailto:"
              className="flex-1 px-2 py-1.5 bg-[var(--bg)] border border-[var(--border2)] rounded-sm font-mono text-[11px] text-[var(--text)] outline-none focus:border-[var(--maroon)] transition-colors"
            />
            <input
              value={link.displayValue}
              onChange={(e) => updateLink(link.id, "displayValue", e.target.value)}
              placeholder="Display text"
              className="w-36 px-2 py-1.5 bg-[var(--bg)] border border-[var(--border2)] rounded-sm font-mono text-[11px] text-[var(--text)] outline-none focus:border-[var(--maroon)] transition-colors"
            />
            <button onClick={() => removeLink(link.id)} className="text-[var(--text3)] hover:text-red-500 transition-colors shrink-0 opacity-0 group-hover:opacity-100">
              <Trash2 size={13} />
            </button>
          </div>
        ))}
      </div>

      {/* Add new */}
      <div className="p-5 border border-dashed border-[var(--border2)] rounded-sm space-y-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-[var(--text3)]">Add Platform</p>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="font-mono text-[10px] uppercase tracking-[0.08em] text-[var(--text3)]">Platform</label>
            <select
              value={form.platform}
              onChange={(e) => setForm((p) => ({ ...p, platform: e.target.value as SocialLink["platform"] }))}
              className="w-full px-3 py-2.5 bg-[var(--surface)] border border-[var(--border2)] rounded-sm font-mono text-sm text-[var(--text)] outline-none focus:border-[var(--maroon)] transition-colors"
            >
              {PLATFORMS.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="font-mono text-[10px] uppercase tracking-[0.08em] text-[var(--text3)]">Label</label>
            <input
              value={form.label ?? ""}
              onChange={(e) => setForm((p) => ({ ...p, label: e.target.value }))}
              placeholder="e.g. LinkedIn"
              className="w-full px-3 py-2.5 bg-[var(--surface)] border border-[var(--border2)] rounded-sm font-mono text-sm text-[var(--text)] placeholder:text-[var(--text3)] outline-none focus:border-[var(--maroon)] transition-colors"
            />
          </div>
          <div className="space-y-1.5">
            <label className="font-mono text-[10px] uppercase tracking-[0.08em] text-[var(--text3)]">URL / Value</label>
            <input
              value={form.value ?? ""}
              onChange={(e) => setForm((p) => ({ ...p, value: e.target.value }))}
              placeholder="https://linkedin.com/in/..."
              className="w-full px-3 py-2.5 bg-[var(--surface)] border border-[var(--border2)] rounded-sm font-mono text-sm text-[var(--text)] placeholder:text-[var(--text3)] outline-none focus:border-[var(--maroon)] transition-colors"
            />
          </div>
          <div className="space-y-1.5">
            <label className="font-mono text-[10px] uppercase tracking-[0.08em] text-[var(--text3)]">Display Value</label>
            <input
              value={form.displayValue ?? ""}
              onChange={(e) => setForm((p) => ({ ...p, displayValue: e.target.value }))}
              placeholder="/in/username"
              className="w-full px-3 py-2.5 bg-[var(--surface)] border border-[var(--border2)] rounded-sm font-mono text-sm text-[var(--text)] placeholder:text-[var(--text3)] outline-none focus:border-[var(--maroon)] transition-colors"
            />
          </div>
        </div>
        <button onClick={addLink} className="flex items-center gap-2 px-5 py-2.5 bg-[var(--maroon)] hover:bg-[var(--maroon2)] text-white font-mono text-[11px] rounded-sm transition-all">
          <Plus size={12} /> Add Platform
        </button>
      </div>

      {/* Save */}
      <div className="flex items-center gap-4 pt-2">
        <button onClick={handleSave} className="px-7 py-2.5 bg-[var(--maroon)] hover:bg-[var(--maroon2)] text-white font-medium text-[11px] uppercase tracking-[0.08em] rounded-sm transition-all">
          Save Changes
        </button>
        {saved && <span className="font-mono text-[11px] text-green-500 uppercase tracking-wide">✓ Saved</span>}
      </div>
    </div>
  );
}
