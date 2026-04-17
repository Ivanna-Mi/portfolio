// src/app/dashboard/projects/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, ExternalLink, Github, RefreshCw, Eye, EyeOff } from "lucide-react";
import type { Project, PortfolioData } from "@/types";
import { formatDate } from "@/lib/utils";

type FormState = Partial<Project> & {
  tagsRaw: string;
};

export default function ProjectsDashboardPage() {
  const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [githubProjects, setGithubProjects] = useState<Project[]>([]);
  const [syncing, setSyncing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<FormState>({
    name: "", description: "", tagsRaw: "", githubUrl: "", liveUrl: "", category: "App", featured: false,
  });

  useEffect(() => {
    fetch("/api/portfolio")
      .then((res) => res.json())
      .then((data: PortfolioData) => {
        setPortfolioData(data);
        setProjects(data.projects);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  function handleFormChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  }

  function startEdit(project: Project) {
    setEditId(project.id);
    setForm({ ...project, tagsRaw: project.tags.join(", ") });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelForm() {
    setShowForm(false);
    setEditId(null);
    setForm({ name: "", description: "", tagsRaw: "", githubUrl: "", liveUrl: "", category: "App", featured: false });
  }

  function saveProject() {
    if (!form.name?.trim()) return;
    const tags = form.tagsRaw?.split(",").map((t) => t.trim()).filter(Boolean) ?? [];
    const project: Project = {
      id: editId ?? `manual-${Date.now()}`,
      name: form.name!,
      description: form.description ?? "",
      tags,
      githubUrl: form.githubUrl,
      liveUrl: form.liveUrl,
      featured: form.featured,
      category: form.category ?? "App",
      source: "manual",
      updatedAt: new Date().toISOString(),
    };

    if (editId) {
      setProjects(projects.map((p) => p.id === editId ? project : p));
    } else {
      setProjects([project, ...projects]);
    }
    cancelForm();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function removeProject(id: string) {
    setProjects(projects.filter((p) => p.id !== id));
  }

  async function syncGitHub() {
    setSyncing(true);
    try {
      const res = await fetch("/api/github");
      const data = await res.json();
      setGithubProjects(data.repos ?? []);
    } catch {
      // handle silently
    } finally {
      setSyncing(false);
    }
  }

  function importGitHubRepo(repo: Project) {
    const already = projects.some((p) => p.name === repo.name);
    if (!already) setProjects([...projects, { ...repo, source: "manual" }]);
  }

  async function handleSave() {
    if (!portfolioData) return;
    
    const updatedData: PortfolioData = {
      ...portfolioData,
      projects,
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-light text-[var(--text)] mb-1">Projects</h1>
          <p className="font-mono text-[11px] text-[var(--text3)] uppercase tracking-widest">{projects.length} projects</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={syncGitHub}
            disabled={syncing}
            className="flex items-center gap-2 px-4 py-2 border border-[var(--border2)] text-[var(--text2)] hover:border-[var(--maroon)] hover:text-[var(--text)] font-mono text-[11px] rounded-sm transition-all disabled:opacity-50"
          >
            <RefreshCw size={11} className={syncing ? "animate-spin" : ""} />
            {syncing ? "Syncing…" : "Sync GitHub"}
          </button>
          <button
            onClick={() => { setShowForm(true); setEditId(null); }}
            className="flex items-center gap-2 px-4 py-2 bg-[var(--maroon)] hover:bg-[var(--maroon2)] text-white font-mono text-[11px] rounded-sm transition-all"
          >
            <Plus size={11} /> Add Project
          </button>
        </div>
      </div>

      {saved && <p className="font-mono text-[11px] text-green-500 uppercase tracking-wide">✓ Saved</p>}

      {/* Add/Edit Form */}
      {showForm && (
        <div className="p-6 border border-[var(--border2)] rounded-sm bg-[var(--surface)] space-y-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--text3)]">
            {editId ? "Edit Project" : "New Project"}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Name">
              <input name="name" value={form.name ?? ""} onChange={handleFormChange} placeholder="project-name" className={inputCls} />
            </FormField>
            <FormField label="Category">
              <select name="category" value={form.category ?? "App"} onChange={handleFormChange} className={inputCls}>
                {["App", "Library", "Experiment", "Client", "Open Source"].map((c) => <option key={c}>{c}</option>)}
              </select>
            </FormField>
          </div>
          <FormField label="Description">
            <textarea name="description" value={form.description ?? ""} onChange={handleFormChange} rows={2} placeholder="Short description…" className={`${inputCls} resize-none`} />
          </FormField>
          <FormField label="Tags (comma separated)">
            <input name="tagsRaw" value={form.tagsRaw ?? ""} onChange={handleFormChange} placeholder="React, TypeScript, Next.js" className={inputCls} />
          </FormField>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="GitHub URL">
              <input name="githubUrl" value={form.githubUrl ?? ""} onChange={handleFormChange} placeholder="https://github.com/..." className={inputCls} />
            </FormField>
            <FormField label="Live URL (optional)">
              <input name="liveUrl" value={form.liveUrl ?? ""} onChange={handleFormChange} placeholder="https://..." className={inputCls} />
            </FormField>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setForm((p) => ({ ...p, featured: !p.featured }))}
              className={`relative w-10 h-5 rounded-full transition-colors ${form.featured ? "bg-[var(--maroon)]" : "bg-[var(--surface2)]"}`}
            >
              <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${form.featured ? "left-5" : "left-0.5"}`} />
            </button>
            <span className="font-mono text-[11px] text-[var(--text2)]">Mark as featured</span>
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={saveProject} className="px-6 py-2.5 bg-[var(--maroon)] hover:bg-[var(--maroon2)] text-white font-mono text-[11px] rounded-sm transition-all">
              {editId ? "Update" : "Add Project"}
            </button>
            <button onClick={cancelForm} className="px-6 py-2.5 border border-[var(--border2)] text-[var(--text2)] font-mono text-[11px] rounded-sm hover:border-[var(--text3)] transition-all">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Manual Projects */}
      <div className="space-y-2">
        {projects.map((project) => (
          <div key={project.id} className="flex items-center justify-between px-5 py-4 border border-[var(--border)] rounded-sm bg-[var(--surface)] hover:border-[var(--border2)] transition-colors group">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-0.5">
                <p className="font-mono text-sm text-[var(--text2)] truncate">{project.name}</p>
                {project.featured && <span className="shrink-0 px-1.5 py-0.5 bg-[rgba(201,169,110,0.1)] border border-[rgba(201,169,110,0.25)] text-[var(--gold)] font-mono text-[9px] uppercase rounded-[2px]">Featured</span>}
              </div>
              <p className="font-mono text-[10px] text-[var(--text3)]">
                {project.tags.slice(0, 4).join(", ")}
                {project.updatedAt ? ` · ${formatDate(project.updatedAt)}` : ""}
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0 ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
              {project.githubUrl && <a href={project.githubUrl} target="_blank" rel="noreferrer" className="text-[var(--text3)] hover:text-[var(--text2)]"><Github size={13} /></a>}
              {project.liveUrl && <a href={project.liveUrl} target="_blank" rel="noreferrer" className="text-[var(--text3)] hover:text-[var(--maroon-light)]"><ExternalLink size={13} /></a>}
              <button onClick={() => startEdit(project)} className="text-[var(--text3)] hover:text-[var(--text2)] font-mono text-[11px] px-2 py-1 border border-[var(--border)] rounded-sm hover:border-[var(--border2)] transition-all">Edit</button>
              <button onClick={() => removeProject(project.id)} className="text-[var(--text3)] hover:text-red-500 transition-colors"><Trash2 size={13} /></button>
            </div>
          </div>
        ))}
      </div>

      {/* GitHub Repos Preview */}
      {githubProjects.length > 0 && (
        <div className="space-y-3">
          <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--text3)] pb-2 border-b border-[var(--border)]">
            GitHub Repos — click to import
          </p>
          {githubProjects.map((repo) => {
            const imported = projects.some((p) => p.name === repo.name);
            return (
              <div key={repo.id} className="flex items-center justify-between px-5 py-3.5 border border-[var(--border)] rounded-sm bg-[var(--bg2)] hover:border-[var(--border2)] transition-colors">
                <div>
                  <p className="font-mono text-sm text-[var(--text2)]">{repo.name}</p>
                  <p className="font-mono text-[10px] text-[var(--text3)]">{repo.tags.slice(0, 3).join(", ")}</p>
                </div>
                <button
                  onClick={() => importGitHubRepo(repo)}
                  disabled={imported}
                  className="flex items-center gap-1.5 px-3 py-1.5 border border-[var(--border2)] text-[var(--text3)] font-mono text-[10px] rounded-sm hover:border-[var(--maroon)] hover:text-[var(--text2)] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  {imported ? <><Eye size={11} /> Imported</> : <><Plus size={11} /> Import</>}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

const inputCls = "w-full px-3 py-2.5 bg-[var(--bg)] border border-[var(--border2)] rounded-sm font-mono text-sm text-[var(--text)] placeholder:text-[var(--text3)] outline-none focus:border-[var(--maroon)] transition-colors";

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="block font-mono text-[10px] uppercase tracking-[0.08em] text-[var(--text3)]">{label}</label>
      {children}
    </div>
  );
}
