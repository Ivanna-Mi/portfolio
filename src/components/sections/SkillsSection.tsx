// src/components/sections/SkillsSection.tsx
"use client";

import { FadeIn } from "@/components/ui/FadeIn";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { cn } from "@/lib/utils";
import type { Skill } from "@/types";

interface SkillsSectionProps {
  skills: Skill[];
}

const CATEGORIES = [
  { key: "frontend", label: "Frontend Core" },
  { key: "ui-motion", label: "UI & Motion" },
  { key: "backend", label: "Backend & Infra" },
  { key: "tooling", label: "Tooling" },
  { key: "other", label: "Other" },
] as const;

export function SkillsSection({ skills }: SkillsSectionProps) {
  return (
    <section id="skills" className="py-32 border-t border-[var(--border)] bg-[var(--bg2)]">
      <div className="max-w-6xl mx-auto px-6">
        <FadeIn>
          <SectionHeader
            title="Tech Stack"
            tag="/ skills"
            subtitle="Tools and technologies I work with daily — from pixel-perfect UI to backend plumbing."
          />
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {CATEGORIES.map(({ key, label }, catIndex) => {
            const catSkills = skills.filter((s) => s.category === key);
            if (catSkills.length === 0) return null;

            return (
              <FadeIn key={key} delay={catIndex * 0.1}>
                <div className="p-6 border border-[var(--border)] rounded-sm bg-[var(--surface)] hover:border-[rgba(139,26,26,0.25)] transition-all duration-300 h-full">
                  <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--maroon-light)] mb-5">
                    {label}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {catSkills.map((skill) => (
                      <SkillChip key={skill.id} skill={skill} />
                    ))}
                  </div>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function SkillChip({ skill }: { skill: Skill }) {
  return (
    <span
      className={cn(
        "px-3 py-1.5 font-mono text-[11px] border rounded-[3px] transition-all duration-200 cursor-default",
        skill.featured
          ? "border-[rgba(139,26,26,0.4)] bg-[rgba(139,26,26,0.08)] text-[#e8a0a0] hover:bg-[rgba(139,26,26,0.15)]"
          : "border-[var(--border2)] bg-transparent text-[var(--text3)] hover:border-[rgba(139,26,26,0.3)] hover:text-[var(--text2)]"
      )}
    >
      {skill.name}
    </span>
  );
}
