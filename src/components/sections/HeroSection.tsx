// src/components/sections/HeroSection.tsx
"use client";

import { TypeAnimation } from "react-type-animation";
import { motion } from "framer-motion";
import Image from "next/image";
import type { Profile } from "@/types";

interface HeroSectionProps {
  profile: Profile;
}

export function HeroSection({ profile }: HeroSectionProps) {
  // Build TypeAnimation sequence from role array
  const sequence = profile.role.flatMap((role) => [role, 2200]);

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center overflow-hidden noise-bg"
    >
      {/* Grid background */}
      <div className="absolute inset-0 grid-bg opacity-50 pointer-events-none" />

      {/* Maroon radial glow */}
      <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] rounded-full bg-[rgba(139,26,26,0.06)] blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 w-full pt-24 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-16 items-center">

          {/* Left: Text Content */}
          <div>
            {/* Available badge */}
            {profile.available && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="inline-flex items-center gap-2 mb-8 px-4 py-1.5 rounded-full border border-[rgba(139,26,26,0.35)] bg-[rgba(139,26,26,0.08)]"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--maroon-light)] animate-pulse" />
                <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-[var(--maroon-light)]">
                  Available for work
                </span>
              </motion.div>
            )}

            {/* Name */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="font-serif text-[clamp(3.5rem,8vw,6.5rem)] font-light leading-[1.02] tracking-[-0.02em] mb-4"
            >
              {profile.name}
              <br />
              <em className="text-[var(--gold)]">{profile.nameItalic}</em>
            </motion.h1>

            {/* Typing role */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex items-center gap-3 mb-6"
            >
              <div className="w-6 h-px bg-[var(--maroon2)]" />
              <span className="font-mono text-sm text-[var(--text2)] tracking-[0.04em] min-h-[1.5em]">
                <TypeAnimation
                  sequence={sequence}
                  wrapper="span"
                  speed={50}
                  repeat={Infinity}
                />
              </span>
            </motion.div>

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.55 }}
              className="text-[var(--text2)] text-lg leading-relaxed max-w-lg mb-10"
            >
              {profile.tagline}
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.65 }}
              className="flex flex-wrap gap-3 mb-14"
            >
              <a
                href="#projects"
                className="px-7 py-3 bg-[var(--maroon)] hover:bg-[var(--maroon2)] text-white font-sans font-medium text-[11px] uppercase tracking-[0.08em] rounded-sm transition-all duration-200 hover:shadow-[0_0_30px_rgba(139,26,26,0.3)]"
              >
                View Projects
              </a>
              <a
                href="#contact"
                className="px-7 py-3 border border-[var(--border2)] hover:border-[var(--text3)] text-[var(--text2)] hover:text-[var(--text)] font-sans font-medium text-[11px] uppercase tracking-[0.08em] rounded-sm transition-all duration-200"
              >
                Contact Me
              </a>
              <a
                href="/resume.pdf"
                target="_blank"
                rel="noreferrer"
                className="px-7 py-3 border border-[var(--border)] hover:border-[rgba(201,169,110,0.4)] text-[var(--text3)] hover:text-[var(--gold)] font-sans font-medium text-[11px] uppercase tracking-[0.08em] rounded-sm transition-all duration-200"
              >
                Download CV ↗
              </a>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="flex gap-10 pt-8 border-t border-[var(--border)]"
            >
              {[
                { num: `${profile.stats.years}+`, label: "Years exp" },
                { num: `${profile.stats.projects}`, label: "Projects shipped" },
                { num: `${profile.stats.clients}`, label: "Happy clients" },
              ].map((stat, i) => (
                <div key={i} className="flex flex-col gap-1">
                  <span className="font-serif text-4xl font-light text-[var(--text)] leading-none">
                    {stat.num}
                  </span>
                  <span className="font-mono text-[10px] text-[var(--text3)] uppercase tracking-[0.1em]">
                    {stat.label}
                  </span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right: Photo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="relative hidden lg:block"
          >
            <div className="relative w-full aspect-[3/4] rounded-sm overflow-hidden border border-[var(--border)] bg-[var(--bg2)]">
              {/* Grid overlay */}
              <div className="absolute inset-0 grid-bg z-10 pointer-events-none" />

              {profile.photoUrl ? (
                <Image
                  src={profile.photoUrl}
                  alt={`${profile.name} ${profile.nameItalic}`}
                  fill
                  className="object-cover grayscale contrast-110"
                  priority
                />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  {/* Placeholder */}
                  <div className="relative">
                    <div className="absolute inset-0 rounded-full bg-[rgba(139,26,26,0.15)] blur-2xl scale-150" />
                    <div className="relative w-40 h-40 rounded-full border-2 border-[rgba(139,26,26,0.35)] bg-[var(--surface)] flex items-center justify-center">
                      <span className="font-serif text-5xl italic text-[var(--gold)] font-light">
                        {profile.name[0]}{profile.nameItalic[0]}
                      </span>
                    </div>
                  </div>
                  <p className="mt-6 font-mono text-[10px] text-[var(--text3)] uppercase tracking-widest">
                    Add photo in data/portfolio.ts
                  </p>
                </div>
              )}
            </div>

            {/* Decorative corner accent */}
            <div className="absolute -bottom-3 -right-3 w-24 h-24 border-r-2 border-b-2 border-[var(--maroon)] opacity-30 rounded-br-sm" />
            <div className="absolute -top-3 -left-3 w-24 h-24 border-l-2 border-t-2 border-[var(--gold)] opacity-20 rounded-tl-sm" />
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="font-mono text-[9px] text-[var(--text3)] uppercase tracking-widest">Scroll</span>
        <div className="w-px h-12 bg-gradient-to-b from-[var(--text3)] to-transparent" />
      </motion.div>
    </section>
  );
}
