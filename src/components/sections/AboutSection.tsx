// src/components/sections/AboutSection.tsx
import { FadeIn } from "@/components/ui/FadeIn";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type { AboutSection as AboutSectionType } from "@/types";

interface AboutSectionProps {
  about: AboutSectionType;
}

export function AboutSection({ about }: AboutSectionProps) {
  return (
    <section id="about" className="py-32 border-t border-[var(--border)]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-20 items-start">
          <FadeIn>
            <SectionHeader
              title="About Me"
              tag="/ background"
            />
          </FadeIn>

          <FadeIn delay={0.15} className="space-y-8 pt-0 lg:pt-28">
            <p className="text-[var(--text2)] text-lg leading-[1.85] tracking-wide">
              {about.description}
            </p>

            <div className="border-l-2 border-[var(--maroon)] pl-6">
              <p className="text-[var(--text3)] text-base leading-relaxed font-light">
                {about.experience}
              </p>
            </div>

            <div>
              <p className="font-mono text-[10px] text-[var(--text3)] uppercase tracking-[0.1em] mb-4">
                Areas of focus
              </p>
              <div className="flex flex-wrap gap-2">
                {about.focus.map((item) => (
                  <span
                    key={item}
                    className="px-4 py-1.5 border border-[var(--border2)] text-[var(--text2)] font-mono text-[11px] uppercase tracking-[0.06em] rounded-full hover:border-[var(--maroon)] hover:text-[var(--text)] transition-all duration-200 cursor-default"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-4 pt-4">
              <a
                href="#contact"
                className="inline-flex items-center gap-3 group"
              >
                <div className="w-10 h-px bg-[var(--maroon2)] group-hover:w-16 transition-all duration-300" />
                <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-[var(--text2)] group-hover:text-[var(--text)] transition-colors">
                  Get in touch
                </span>
              </a>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
