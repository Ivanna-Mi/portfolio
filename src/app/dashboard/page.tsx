// src/app/dashboard/page.tsx
"use client";

import Link from "next/link";
import { portfolioData } from "@/data/portfolio";
import { User, Code2, FolderKanban, Share2, ArrowRight, RefreshCw, Github } from "lucide-react";
import { useState } from "react";
import { formatDate } from "@/lib/utils";

export default function DashboardPage() {
  const { profile, skills, projects, socials, config } = portfolioData;
  const [syncing, setSyncing] = useState(false);
  const [syncMsg, setSyncMsg] = useState("");

  async function handleSync() {
    setSyncing(true);
    setSyncMsg("");
    try {
      const res = await fetch("/api/github");
      const data = await res.json();
      setSyncMsg(`Fetched ${data.repos.length} repos from GitHub.`);
    } catch {
      setSyncMsg("Failed to reach GitHub API.");
    } finally {
      setSyncing(false);
    }
  }

  const stats = [
    { label: "Projects", value: projects.length, sub: "manual entries", icon: FolderKanban },
    { label: "Skills", value: skills.length, sub: `${skills.filter((s) => s.featured).length} featured`, icon: Code2 },
    { label: "Social Links", value: socials.length, sub: "platforms", icon: Share2 },
    { label: "GitHub Repos", value: "—", sub: config.githubUsername || "not set", icon: Github },
  ];

  const quickLinks = [
    { href: "/dashboard/profile", label: "Edit Profile", icon: User, desc: "Name, role, tagline, photo" },
    { href: "/dashboard/skills", label: "Manage Skills", icon: Code2, desc: "Add, edit, or remove skills" },
    { href: "/dashboard/projects", label: "Manage Projects", icon: FolderKanban, desc: "CRUD + GitHub sync" },
    { href: "/dashboard/github", label: "GitHub Config", icon: Github, desc: `@${config.githubUsername || "username"}` },
  ];

  return (
    <div className="max-w-4xl space-y-10">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-serif text-3xl font-light text-[var(--text)] mb-1">
            Good day, <em className="italic text-[var(--gold)]">{profile.name}</em>
          </h1>
          <p className="font-mono text-[11px] text-[var(--text3)] uppercase tracking-widest">
            Dashboard overview
          </p>
        </div>
        <button
          onClick={handleSync}
          disabled={syncing}
          className="flex items-center gap-2 px-5 py-2.5 bg-[var(--maroon)] hover:bg-[var(--maroon2)] disabled:opacity-50 text-white text-[11px] font-medium uppercase tracking-[0.08em] rounded-sm transition-all"
        >
          <RefreshCw size={12} className={syncing ? "animate-spin" : ""} />
          {syncing ? "Syncing…" : "Sync GitHub"}
        </button>
      </div>

      {syncMsg && (
        <div className="px-4 py-2 border border-[rgba(139,26,26,0.3)] bg-[rgba(139,26,26,0.06)] rounded-sm">
          <p className="font-mono text-[11px] text-[var(--maroon-light)]">{syncMsg}</p>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="p-5 border border-[var(--border)] rounded-sm bg-[var(--surface)]">
            <div className="flex items-center gap-2 mb-3">
              <stat.icon size={13} className="text-[var(--text3)]" />
              <p className="font-mono text-[10px] uppercase tracking-[0.1em] text-[var(--text3)]">{stat.label}</p>
            </div>
            <p className="font-serif text-4xl font-light text-[var(--text)] mb-1">{stat.value}</p>
            <p className="font-mono text-[10px] text-[var(--text3)]">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Quick links */}
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--text3)] mb-4">Quick actions</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {quickLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center justify-between px-5 py-4 border border-[var(--border)] rounded-sm bg-[var(--surface)] hover:border-[rgba(139,26,26,0.35)] hover:bg-[rgba(139,26,26,0.04)] transition-all group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-sm bg-[var(--surface2)] flex items-center justify-center group-hover:bg-[rgba(139,26,26,0.12)] transition-colors">
                  <link.icon size={13} className="text-[var(--text3)] group-hover:text-[var(--maroon-light)] transition-colors" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[var(--text2)] group-hover:text-[var(--text)] transition-colors">{link.label}</p>
                  <p className="font-mono text-[10px] text-[var(--text3)]">{link.desc}</p>
                </div>
              </div>
              <ArrowRight size={13} className="text-[var(--text3)] group-hover:text-[var(--maroon-light)] transition-all group-hover:translate-x-0.5" />
            </Link>
          ))}
        </div>
      </div>

      {/* Recent projects table */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--text3)]">Recent Projects</p>
          <Link href="/dashboard/projects" className="font-mono text-[10px] text-[var(--text3)] hover:text-[var(--text2)] uppercase tracking-widest flex items-center gap-1">
            Manage <ArrowRight size={10} />
          </Link>
        </div>
        <div className="border border-[var(--border)] rounded-sm overflow-hidden">
          {projects.slice(0, 5).map((project, i) => (
            <div
              key={project.id}
              className={`flex items-center justify-between px-5 py-3.5 ${i !== projects.slice(0, 5).length - 1 ? "border-b border-[var(--border)]" : ""} hover:bg-[var(--surface)] transition-colors`}
            >
              <div>
                <p className="font-mono text-sm text-[var(--text2)]">{project.name}</p>
                <p className="font-mono text-[10px] text-[var(--text3)]">
                  {project.tags.slice(0, 3).join(", ")} {project.updatedAt ? `· ${formatDate(project.updatedAt)}` : ""}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-0.5 rounded-full font-mono text-[9px] uppercase tracking-widest border ${
                  project.liveUrl
                    ? "bg-[rgba(100,200,100,0.1)] border-[rgba(100,200,100,0.2)] text-green-500"
                    : project.source === "github"
                    ? "bg-[rgba(139,26,26,0.1)] border-[rgba(139,26,26,0.2)] text-[#d08080]"
                    : "bg-[var(--surface2)] border-[var(--border)] text-[var(--text3)]"
                }`}>
                  {project.liveUrl ? "Live" : project.source === "github" ? "GitHub" : "Draft"}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
