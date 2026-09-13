// src/components/sections/AboutSection.tsx
"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { SectionHeader } from "@/components/ui/SectionHeader";
import type {
  AboutSection as AboutSectionType,
  OrganizationExperience,
} from "@/types";

interface AboutSectionProps {
  about: AboutSectionType;
}

const organizationImages = [
  "82a0ad54-d7f6-4d49-b11a-dfd7ec917df8.jpg",
  "DSC03088.JPG",
  "FYP05872.JPG",
  "IMG_5442.HEIC.jpg",
  "Studi Banding dengan BCC UB.jpg",
  "WelcomingParty_2024.jpeg",
];

const fallbackOrganizations = (
  about: AboutSectionType,
): OrganizationExperience[] => [
  {
    id: "experience-file",
    organization: "BNCC Opening Season",
    role: "Frontend Developer",
    duration: "Current focus",
    description: about.description,
    image: `/organization-experience/${encodeURIComponent(organizationImages[0])}`,
  },
  {
    id: "field-notes",
    organization: "BNCC Synergy Camp",
    role: "UI Engineer",
    duration: "Ongoing research",
    description: about.experience,
    image: `/organization-experience/${encodeURIComponent(organizationImages[1])}`,
  },
  {
    id: "organization-file-3",
    organization: "Stuban BNCC X RAION",
    role: "UI Engineer",
    duration: "Ongoing research",
    description: about.experience,
    image: `/organization-experience/${encodeURIComponent(organizationImages[2])}`,
  },
  {
    id: "organization-file-4",
    organization: "TECHSPIRE",
    role: "UI Engineer",
    duration: "Ongoing research",
    description: about.experience,
    image: `/organization-experience/${encodeURIComponent(organizationImages[3])}`,
  },
  {
    id: "organization-file-5",
    organization: "Stuban BNCC X BCC",
    role: "UI Engineer",
    duration: "Ongoing research",
    description: about.experience,
    image: `/organization-experience/${encodeURIComponent(organizationImages[4])}`,
  },
  {
    id: "organization-file-6",
    organization: "BNCC Welcoming Party",
    role: "UI Engineer",
    duration: "Ongoing research",
    description: about.experience,
    image: `/organization-experience/${encodeURIComponent(organizationImages[5])}`,
  },
];

export function AboutSection({ about }: AboutSectionProps) {
  const boardRef = useRef<HTMLDivElement>(null);
  const stringsVisible = useInView(boardRef, { once: true, margin: "-120px" });
  const organizations = about.organizations?.length
    ? about.organizations
    : fallbackOrganizations(about);

  return (
    <section
      id="about"
      className="border-t border-[var(--border)] py-28 md:py-36"
    >
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeader
          title="Experience"
          tag="/ suspect & evidence"
          subtitle="My organization experience as a member of BNCC family"
        />

        <div
          ref={boardRef}
          className="relative overflow-hidden px-4 py-12 sm:px-10 md:px-16"
        >
          <div className="relative z-10 flex snap-x snap-mandatory gap-10 overflow-x-auto px-2 pb-6 pt-8 [scrollbar-color:#8f1e1e_transparent] [scrollbar-width:thin]">
            <motion.span
              aria-hidden="true"
              initial={{ scaleX: 0, opacity: 0 }}
              animate={
                stringsVisible
                  ? { scaleX: 1, opacity: 0.9 }
                  : { scaleX: 0, opacity: 0 }
              }
              transition={{ duration: 1, delay: 0.5, ease: "easeInOut" }}
              className="pointer-events-none absolute left-[148px] top-[28px] h-[3px] w-[1600px] origin-left bg-[#a52020] shadow-[0_0_5px_rgba(165,32,32,0.65)]"
            />
            {organizations.map((organization, index) => (
              <motion.article
                key={organization.id}
                initial={{ opacity: 0, y: 28, rotate: index % 2 ? 2.5 : -2 }}
                animate={
                  stringsVisible
                    ? { opacity: 1, y: 0, rotate: index % 2 ? 2.5 : -2 }
                    : undefined
                }
                transition={{
                  duration: 0.65,
                  delay: 0.25 + index * 0.16,
                  ease: [0.22, 1, 0.36, 1],
                }}
                whileHover={{ y: -10, rotate: 0, scale: 1.025 }}
                className="group relative flex h-[360px] w-[280px] min-w-[280px] snap-center flex-col bg-[#eee9df] px-3 pb-5 text-[#211b17] shadow-[8px_12px_18px_rgba(0,0,0,0.28)] transition-shadow hover:shadow-[12px_18px_24px_rgba(0,0,0,0.36)]"
              >
                <span className="absolute -top-3 left-1/2 z-30 h-6 w-6 -translate-x-1/2 rounded-full border border-[#651719] bg-[#8f1e1e] shadow-[1px_3px_5px_rgba(0,0,0,0.45)]" />
                <span className="absolute -top-1 left-1/2 z-40 h-2 w-2 -translate-x-1/2 rounded-full bg-[#d65d4e]" />
                <div className="flex aspect-[4/3] shrink-0 items-center justify-center overflow-hidden bg-[#c8b8a5] text-center shadow-inner mt-3">
                  {organization.image ? (
                    <img
                      src={organization.image}
                      alt=""
                      className="h-full w-full object-cover grayscale-[0.25]"
                    />
                  ) : (
                    <div className="px-5">
                      <span className="font-serif text-5xl text-[#8f1e1e]">
                        {organization.organization.charAt(0)}
                      </span>
                      <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.16em] text-[#5a4435]">
                        Evidence photo
                      </p>
                    </div>
                  )}
                </div>
                <div className="px-2 pt-4">
                  <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-[#8f1e1e]">
                    File 0{index + 1}
                  </p>
                  <h3 className="mt-1 font-serif text-xl leading-tight">
                    {organization.organization}
                  </h3>
                </div>
              </motion.article>
            ))}
          </div>

          <div className="relative z-10 mt-2 flex items-center justify-between border-t border-[#795542] pt-4 font-mono text-[9px] uppercase tracking-[0.12em] text-[#c9a98a]">
            <span>{organizations.length} files pinned</span>
            <span>Scroll to investigate →</span>
          </div>
        </div>
      </div>
    </section>
  );
}
