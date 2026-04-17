// src/components/ui/Footer.tsx
"use client";

import type { Profile } from "@/types";

interface FooterProps {
  profile: Profile;
}

export function Footer({ profile }: FooterProps) {
  return (
    <footer className="border-t border-[var(--border)] py-10">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="font-serif text-xl italic text-[var(--gold)]">
          {profile.name[0]}{profile.nameItalic[0]}.
        </div>
        <p className="font-mono text-[10px] text-[var(--text3)] tracking-widest uppercase">
          {new Date().getFullYear()} — {profile.name} {profile.nameItalic}
        </p>
        <a
          href="#"
          onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}
          className="font-mono text-[10px] uppercase tracking-[0.1em] text-[var(--text3)] hover:text-[var(--text2)] transition-colors"
        >
          Back to top ↑
        </a>
      </div>
    </footer>
  );
}
