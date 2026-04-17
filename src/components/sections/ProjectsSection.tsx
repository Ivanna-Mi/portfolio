// src/components/sections/ProjectsSection.tsx
"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Github, ExternalLink, Star } from "lucide-react";
import { FadeIn } from "@/components/ui/FadeIn";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/utils";
import type { Project } from "@/types";

interface ProjectsSectionProps {
  projects: Project[];
}

export function ProjectsSection({ projects }: ProjectsSectionProps) {
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const [showAll, setShowAll] = useState(false);

  // Build filter categories from project data
  const categories = useMemo(() => {
    const cats = new Set(projects.map((p) => p.category ?? "Other"));
    return ["All", ...Array.from(cats)];
  }, [projects]);

  const filtered = useMemo(() => {
    if (activeFilter === "All") return projects;
    return projects.filter((p) => (p.category ?? "Other") === activeFilter);
  }, [projects, activeFilter]);

  const displayed = showAll ? filtered : filtered.slice(0, 6);

  return (
    <section id="projects" className="py-32 border-t border-[var(--border)]">
      <div className="max-w-6xl mx-auto px-6">
        <FadeIn>
          <SectionHeader
            title="Projects"
            tag="/ work"
            subtitle="A selection of things I've built — personal projects, OSS contributions, and client work."
          />
        </FadeIn>

        {/* Category Filter */}
        <FadeIn delay={0.1}>
          <div className="flex flex-wrap gap-2 mb-12">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => { setActiveFilter(cat); setShowAll(false); }}
                className={cn(
                  "px-5 py-2 font-mono text-[10px] uppercase tracking-[0.1em] border rounded-full transition-all duration-200",
                  activeFilter === cat
                    ? "border-[var(--maroon)] bg-[rgba(139,26,26,0.12)] text-[var(--maroon-light)]"
                    : "border-[var(--border)] text-[var(--text3)] hover:border-[var(--border2)] hover:text-[var(--text2)]"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </FadeIn>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          <AnimatePresence mode="popLayout">
            {displayed.map((project, i) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.35, delay: i * 0.06 }}
              >
                <ProjectCard project={project} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Show More */}
        {filtered.length > 6 && (
          <div className="mt-10 text-center">
            <button
              onClick={() => setShowAll(!showAll)}
              className="px-8 py-3 border border-[var(--border2)] text-[var(--text2)] font-mono text-[11px] uppercase tracking-[0.1em] rounded-sm hover:border-[var(--maroon)] hover:text-[var(--text)] transition-all duration-200"
            >
              {showAll ? "Show Less" : `Show All (${filtered.length})`}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="group relative flex flex-col border border-[var(--border)] rounded-sm bg-[var(--surface)] hover:border-[rgba(139,26,26,0.35)] transition-all duration-300 hover:-translate-y-1 overflow-hidden h-full">
      {/* Thumbnail / Header */}
      <div className="relative h-44 overflow-hidden bg-[var(--bg2)] flex items-center justify-center">
        {project.thumbnail ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={project.thumbnail}
            alt={project.name}
            className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-300"
          />
        ) : (
          <ProjectThumbnailPlaceholder name={project.name} />
        )}

        {/* Source badge */}
        <div className="absolute top-3 right-3">
          {project.source === "github" ? (
            <span className="px-2 py-1 bg-[rgba(0,0,0,0.7)] border border-[var(--border2)] text-[var(--text3)] font-mono text-[9px] uppercase tracking-widest rounded-[2px]">
              GitHub
            </span>
          ) : project.liveUrl ? (
            <span className="px-2 py-1 bg-[rgba(139,26,26,0.3)] border border-[rgba(139,26,26,0.4)] text-[#d08080] font-mono text-[9px] uppercase tracking-widest rounded-[2px]">
              Live
            </span>
          ) : null}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5">
        <div className="flex items-start justify-between gap-2 mb-3">
          <h3 className="font-mono text-sm font-medium text-[var(--text)] group-hover:text-[var(--text)] leading-tight">
            {project.name}
          </h3>
          {project.stars !== undefined && project.stars > 0 && (
            <div className="flex items-center gap-1 shrink-0">
              <Star size={11} className="text-[var(--gold)]" />
              <span className="font-mono text-[10px] text-[var(--text3)]">{project.stars}</span>
            </div>
          )}
        </div>

        <p className="text-[var(--text3)] text-[13px] leading-relaxed mb-4 flex-1">
          {project.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {project.tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 bg-[rgba(139,26,26,0.1)] border border-[rgba(139,26,26,0.2)] text-[#c08080] font-mono text-[9px] uppercase tracking-[0.06em] rounded-[2px]"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Footer: date + links */}
        <div className="flex items-center justify-between pt-4 border-t border-[var(--border)]">
          {project.updatedAt && (
            <span className="font-mono text-[9px] text-[var(--text3)] uppercase tracking-widest">
              {formatDate(project.updatedAt)}
            </span>
          )}
          <div className="flex items-center gap-3 ml-auto">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="text-[var(--text3)] hover:text-[var(--text)] transition-colors"
                aria-label="GitHub"
              >
                <Github size={15} />
              </a>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer"
                className="text-[var(--text3)] hover:text-[var(--maroon-light)] transition-colors"
                aria-label="Live demo"
              >
                <ExternalLink size={15} />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const PLACEHOLDER_COLORS: Record<string, string> = {
  0: "linear-gradient(135deg, #1a0e0e 0%, #0f1520 100%)",
  1: "linear-gradient(135deg, #0d1a0d 0%, #1a1a0d 100%)",
  2: "linear-gradient(135deg, #0d0d1a 0%, #1a0d1a 100%)",
  3: "linear-gradient(135deg, #1a0d0d 0%, #1a1a0d 100%)",
  4: "linear-gradient(135deg, #0f1520 0%, #1a0e14 100%)",
  5: "linear-gradient(135deg, #1a0e14 0%, #0f1a1a 100%)",
};

function ProjectThumbnailPlaceholder({ name }: { name: string }) {
  const colorIndex = String(name.charCodeAt(0) % 6);
  const symbols = ["◈", "⬡", "▲", "◎", "◆", "◐"];
  const symbol = symbols[name.charCodeAt(0) % symbols.length];

  return (
    <div
      className="absolute inset-0 flex items-center justify-center"
      style={{ background: PLACEHOLDER_COLORS[colorIndex] }}
    >
      {/* Grid lines */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      />
      <span className="text-4xl opacity-25 relative z-10">{symbol}</span>
    </div>
  );
}
