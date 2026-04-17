// src/app/dashboard/skills/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Star } from "lucide-react";
import type { Skill, PortfolioData } from "@/types";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  { value: "frontend", label: "Frontend Core" },
  { value: "ui-motion", label: "UI & Motion" },
  { value: "backend", label: "Backend & Infra" },
  { value: "tooling", label: "Tooling" },
  { value: "other", label: "Other" },
] as const;

export default function SkillsDashboardPage() {
  const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [newSkill, setNewSkill] = useState({ name: "", category: "frontend" as Skill["category"], featured: false });
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/portfolio")
      .then((res) => res.json())
      .then((data: PortfolioData) => {
        setPortfolioData(data);
        setSkills(data.skills);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  function addSkill() {
    if (!newSkill.name.trim()) return;
    const skill: Skill = {
      id: newSkill.name.toLowerCase().replace(/\s+/g, "-") + "-" + Date.now(),
      name: newSkill.name.trim(),
      category: newSkill.category,
      featured: newSkill.featured,
    };
    setSkills([...skills, skill]);
    setNewSkill({ name: "", category: "frontend", featured: false });
  }

  function removeSkill(id: string) {
    setSkills(skills.filter((s) => s.id !== id));
  }

  function toggleFeatured(id: string) {
    setSkills(skills.map((s) => s.id === id ? { ...s, featured: !s.featured } : s));
  }

  async function handleSave() {
    if (!portfolioData) return;
    
    const updatedData: PortfolioData = {
      ...portfolioData,
      skills,
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
    <div className="max-w-3xl space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-light text-[var(--text)] mb-1">Skills</h1>
        <p className="font-mono text-[11px] text-[var(--text3)] uppercase tracking-widest">
          {skills.length} skills across {CATEGORIES.length} categories
        </p>
      </div>

      {/* Add new skill */}
      <div className="p-5 border border-dashed border-[var(--border2)] rounded-sm space-y-4">
        <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-[var(--text3)]">Add New Skill</p>
        <div className="grid grid-cols-1 sm:grid-cols-[1fr_160px_auto_auto] gap-3 items-end">
          <div className="space-y-1.5">
            <label className="font-mono text-[10px] uppercase tracking-[0.08em] text-[var(--text3)]">Name</label>
            <input
              value={newSkill.name}
              onChange={(e) => setNewSkill((p) => ({ ...p, name: e.target.value }))}
              onKeyDown={(e) => e.key === "Enter" && addSkill()}
              placeholder="e.g. SvelteKit"
              className="w-full px-3 py-2.5 bg-[var(--surface)] border border-[var(--border2)] rounded-sm font-mono text-sm text-[var(--text)] placeholder:text-[var(--text3)] outline-none focus:border-[var(--maroon)] transition-colors"
            />
          </div>
          <div className="space-y-1.5">
            <label className="font-mono text-[10px] uppercase tracking-[0.08em] text-[var(--text3)]">Category</label>
            <select
              value={newSkill.category}
              onChange={(e) => setNewSkill((p) => ({ ...p, category: e.target.value as Skill["category"] }))}
              className="w-full px-3 py-2.5 bg-[var(--surface)] border border-[var(--border2)] rounded-sm font-mono text-sm text-[var(--text)] outline-none focus:border-[var(--maroon)] transition-colors appearance-none"
            >
              {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>
          <button
            onClick={() => setNewSkill((p) => ({ ...p, featured: !p.featured }))}
            className={cn(
              "flex items-center gap-1.5 px-3 py-2.5 border rounded-sm font-mono text-[11px] transition-all self-end",
              newSkill.featured
                ? "border-[rgba(201,169,110,0.4)] bg-[rgba(201,169,110,0.08)] text-[var(--gold)]"
                : "border-[var(--border2)] text-[var(--text3)] hover:border-[var(--border)]"
            )}
          >
            <Star size={11} className={newSkill.featured ? "fill-[var(--gold)]" : ""} />
            {newSkill.featured ? "Featured" : "Feature?"}
          </button>
          <button
            onClick={addSkill}
            className="flex items-center gap-2 px-4 py-2.5 bg-[var(--maroon)] hover:bg-[var(--maroon2)] text-white font-mono text-[11px] rounded-sm transition-all self-end"
          >
            <Plus size={13} /> Add
          </button>
        </div>
      </div>

      {/* Skill list by category */}
      {CATEGORIES.map(({ value, label }) => {
        const catSkills = skills.filter((s) => s.category === value);
        if (catSkills.length === 0) return null;
        return (
          <div key={value}>
            <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--maroon-light)] mb-3">{label}</p>
            <div className="space-y-1.5">
              {catSkills.map((skill) => (
                <div
                  key={skill.id}
                  className="flex items-center justify-between px-4 py-3 border border-[var(--border)] rounded-sm bg-[var(--surface)] hover:border-[var(--border2)] transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-sm text-[var(--text2)]">{skill.name}</span>
                    {skill.featured && (
                      <Star size={10} className="text-[var(--gold)] fill-[var(--gold)]" />
                    )}
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => toggleFeatured(skill.id)}
                      className={cn(
                        "p-1.5 rounded-sm transition-colors",
                        skill.featured ? "text-[var(--gold)]" : "text-[var(--text3)] hover:text-[var(--gold)]"
                      )}
                      title={skill.featured ? "Remove featured" : "Mark as featured"}
                    >
                      <Star size={12} className={skill.featured ? "fill-[var(--gold)]" : ""} />
                    </button>
                    <button
                      onClick={() => removeSkill(skill.id)}
                      className="p-1.5 text-[var(--text3)] hover:text-red-500 rounded-sm transition-colors"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}

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
