// src/app/dashboard/profile/page.tsx
"use client";

import { useState, useEffect } from "react";
import type { PortfolioData } from "@/types";
import { Save, Info } from "lucide-react";

export default function ProfileDashboardPage() {
  const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(null);
  const [form, setForm] = useState({ name: "", nameItalic: "", tagline: "", bio: "", photoUrl: "", resumeUrl: "", available: true, stats: { years: 0, projects: 0, clients: 0 } });
  const [roles, setRoles] = useState<string[]>([]);
  const [newRole, setNewRole] = useState("");
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/portfolio")
      .then((res) => res.json())
      .then((data: PortfolioData) => {
        setPortfolioData(data);
        setForm({ ...data.profile });
        setRoles(data.profile.role);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function addRole() {
    if (newRole.trim()) {
      setRoles([...roles, newRole.trim()]);
      setNewRole("");
    }
  }

  function removeRole(index: number) {
    setRoles(roles.filter((_, i) => i !== index));
  }

  async function handleSave() {
    if (!portfolioData) return;
    
    const updatedData: PortfolioData = {
      ...portfolioData,
      profile: {
        ...form,
        role: roles,
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

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-light text-[var(--text)] mb-1">Profile</h1>
        <p className="font-mono text-[11px] text-[var(--text3)] uppercase tracking-widest">
          Edit your personal information
        </p>
      </div>

      <InfoBanner text="Changes here update portfolioData.profile. To persist after restart, connect a database or update src/data/portfolio.ts directly." />

      <Section title="Basic Info">
        <div className="grid grid-cols-2 gap-4">
          <Field label="First Name" name="name" value={form.name} onChange={handleChange} />
          <Field label="Last Name (italic)" name="nameItalic" value={form.nameItalic} onChange={handleChange} />
        </div>
        <Field label="Tagline" name="tagline" value={form.tagline} onChange={handleChange} />
        <Field label="Short Bio" name="bio" value={form.bio} onChange={handleChange} textarea />
        <Field label="Photo URL" name="photoUrl" value={form.photoUrl} onChange={handleChange} placeholder="https://... (leave empty for initials placeholder)" />
        <Field label="Resume URL" name="resumeUrl" value={form.resumeUrl} onChange={handleChange} placeholder="/resume.pdf" />
      </Section>

      <Section title="Roles (Typing Animation)">
        <div className="space-y-2">
          {roles.map((role, i) => (
            <div key={i} className="flex items-center gap-3">
              <input
                value={role}
                onChange={(e) => {
                  const updated = [...roles];
                  updated[i] = e.target.value;
                  setRoles(updated);
                }}
                className="flex-1 px-3 py-2 bg-[var(--surface)] border border-[var(--border2)] rounded-sm font-mono text-sm text-[var(--text)] outline-none focus:border-[var(--maroon)] transition-colors"
              />
              <button
                onClick={() => removeRole(i)}
                className="text-[var(--text3)] hover:text-red-500 font-mono text-lg leading-none transition-colors"
              >
                ×
              </button>
            </div>
          ))}
          <div className="flex gap-2 mt-3">
            <input
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addRole()}
              placeholder="Add new role…"
              className="flex-1 px-3 py-2 bg-[var(--surface)] border border-dashed border-[var(--border2)] rounded-sm font-mono text-sm text-[var(--text)] placeholder:text-[var(--text3)] outline-none focus:border-[var(--maroon)] transition-colors"
            />
            <button
              onClick={addRole}
              className="px-4 py-2 border border-[var(--border2)] text-[var(--text2)] hover:border-[var(--maroon)] hover:text-[var(--text)] font-mono text-xs rounded-sm transition-all"
            >
              Add
            </button>
          </div>
        </div>
      </Section>

      <Section title="Availability & Stats">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={() => setForm((p) => ({ ...p, available: !p.available }))}
            className={`relative w-10 h-5 rounded-full transition-colors ${form.available ? "bg-[var(--maroon)]" : "bg-[var(--surface2)]"}`}
          >
            <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${form.available ? "left-5" : "left-0.5"}`} />
          </button>
          <span className="font-mono text-[11px] text-[var(--text2)]">
            {form.available ? "Available for work" : "Not available"}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <Field label="Years Exp" name="stats.years" value={String(form.stats.years)}
            onChange={(e) => setForm((p) => ({ ...p, stats: { ...p.stats, years: Number(e.target.value) } }))}
          />
          <Field label="Projects" name="stats.projects" value={String(form.stats.projects)}
            onChange={(e) => setForm((p) => ({ ...p, stats: { ...p.stats, projects: Number(e.target.value) } }))}
          />
          <Field label="Clients" name="stats.clients" value={String(form.stats.clients)}
            onChange={(e) => setForm((p) => ({ ...p, stats: { ...p.stats, clients: Number(e.target.value) } }))}
          />
        </div>
      </Section>

      {/* Save */}
      <div className="flex items-center gap-4 pt-2">
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-7 py-2.5 bg-[var(--maroon)] hover:bg-[var(--maroon2)] text-white font-medium text-[11px] uppercase tracking-[0.08em] rounded-sm transition-all"
        >
          <Save size={13} />
          Save Changes
        </button>
        {saved && (
          <span className="font-mono text-[11px] text-green-500 uppercase tracking-wide">✓ Saved</span>
        )}
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--text3)] pb-2 border-b border-[var(--border)]">
        {title}
      </p>
      {children}
    </div>
  );
}

function Field({
  label, name, value, onChange, placeholder, textarea,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  placeholder?: string;
  textarea?: boolean;
}) {
  const cls = "w-full px-3 py-2.5 bg-[var(--surface)] border border-[var(--border2)] rounded-sm font-mono text-sm text-[var(--text)] placeholder:text-[var(--text3)] outline-none focus:border-[var(--maroon)] transition-colors";
  return (
    <div className="space-y-1.5">
      <label className="block font-mono text-[10px] uppercase tracking-[0.1em] text-[var(--text3)]">{label}</label>
      {textarea ? (
        <textarea name={name} value={value} onChange={onChange} placeholder={placeholder} rows={3} className={`${cls} resize-none`} />
      ) : (
        <input name={name} value={value} onChange={onChange} placeholder={placeholder} className={cls} />
      )}
    </div>
  );
}

function InfoBanner({ text }: { text: string }) {
  return (
    <div className="flex gap-3 px-4 py-3 border border-[rgba(201,169,110,0.2)] bg-[rgba(201,169,110,0.05)] rounded-sm">
      <Info size={13} className="text-[var(--gold)] shrink-0 mt-0.5" />
      <p className="font-mono text-[10px] text-[var(--text3)] leading-relaxed">{text}</p>
    </div>
  );
}
