// src/components/sections/ProjectsSection.tsx
"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Github, Star, X } from "lucide-react";
import { FadeIn } from "@/components/ui/FadeIn";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { formatDate } from "@/lib/utils";
import type { Project } from "@/types";

interface ProjectsSectionProps {
  projects: Project[];
}

export function ProjectsSection({ projects }: ProjectsSectionProps) {
  const [selectedCase, setSelectedCase] = useState<number | null>(null);
  const [mobileDossierPage, setMobileDossierPage] = useState<0 | 1>(0);

  useEffect(() => {
    if (selectedCase === null) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedCase(null);
    };

    document.addEventListener("keydown", closeOnEscape);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      document.body.style.overflow = "";
    };
  }, [selectedCase]);

  useEffect(() => {
    setMobileDossierPage(0);
  }, [selectedCase]);

  const caseFiles = [1, 2, 3];
  const caseLinks: Record<number, string> = {
    1: "https://github.com/Ivanna-Mi/TPM-Final-Project",
    2: "https://technoscape.id/",
    3: "https://fe-eatery.vercel.app/dashboard",
  };
  const caseTitles: Record<number, string> = {
    1: "TPM Final Project",
    2: "TechnoScape",
    3: "Cafe Management",
  };
  const caseThumbnails: Record<number, string> = {
    1: "/case-01-thumbnail.png",
    2: "/case-02-thumbnail.png",
  };
  const caseScreenshots: Record<number, string[]> = {
    1: ["/case-01-ss1.png", "/case-01-ss2.png"],
    2: [
      "/case-02-ss1.png",
      "/case-02-ss2.png",
      "/case-02-ss3.png",
      "/case-02-ss4.png",
    ],
    3: [
      "/case-03-ss1.png",
      "/case-03-ss2.png",
      "/case-03-ss3.png",
      "/case-03-ss4.png",
    ],
  };

  return (
    <section
      id="projects"
      className="py-32 border-t border-[var(--border)] bg-[var(--bg2)]"
    >
      <div className="max-w-6xl mx-auto px-6">
        <FadeIn>
          <SectionHeader
            title="Project"
            tag="/ case files"
            subtitle="A few of the many projects I've worked on."
          />
        </FadeIn>

        <div className="grid grid-cols-1 items-start gap-8 sm:grid-cols-3 sm:gap-6 lg:gap-10">
          <AnimatePresence mode="popLayout">
            {caseFiles.map((caseNumber, i) => (
              <motion.div
                key={caseNumber}
                layout
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.35, delay: i * 0.06 }}
              >
                <button
                  type="button"
                  onClick={() => setSelectedCase(caseNumber)}
                  className="group block w-full text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--maroon-light)] focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--bg2)]"
                  aria-label={`Open case file ${caseNumber}`}
                >
                  <div className="relative overflow-hidden transition duration-300 group-hover:-translate-y-2 group-hover:scale-[1.015]">
                    <img
                      src={`/case-file-${caseNumber}.svg`}
                      alt={`Case file ${caseNumber}`}
                      className="h-auto w-full drop-shadow-[0_18px_18px_rgba(0,0,0,0.28)]"
                    />
                  </div>
                  <p className="mt-4 text-center font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--text3)] transition-colors group-hover:text-[var(--maroon-light)]">
                    Case File 0{caseNumber}
                  </p>
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {selectedCase !== null && (
          <motion.div
            className="fixed inset-0 z-[70] flex items-center justify-center bg-black/85 p-5 backdrop-blur-sm sm:p-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedCase(null)}
            role="dialog"
            aria-modal="true"
            aria-label={`Case file ${selectedCase} details`}
          >
            <motion.div
              className="relative max-h-[92vh] max-w-5xl"
              initial={{ opacity: 0, y: 20, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.98 }}
              transition={{ duration: 0.25 }}
              onClick={(event) => event.stopPropagation()}
            >
              {(() => {
                const project = projects[selectedCase - 1];
                const projectName =
                  caseTitles[selectedCase] ??
                  project?.name ??
                  `Case File 0${selectedCase}`;
                const projectDescription =
                  selectedCase === 3
                    ? "This project was created to fulfill the requirements of a web programming course. I focused on cafe management features designed to make operations easier for the owner and staff."
                    : selectedCase === 2
                      ? "This project was created for the TechnoScape 2026 event organized by BNCC. It was developed by a Web Development team consisting of six frontend and five backend developers."
                      : selectedCase === 1
                        ? "This project was created in late 2024 as the final project for the TPM program. The program was organized by BNCC."
                        : "Project details will appear here once this case file is connected to a project.";
                const projectLink =
                  caseLinks[selectedCase] ??
                  project?.liveUrl ??
                  project?.githubUrl;
                const projectThumbnail =
                  caseThumbnails[selectedCase] ?? project?.thumbnail;
                const projectScreenshots = caseScreenshots[selectedCase] ?? [];

                return (
                  <>
                    <div className="pointer-events-none absolute inset-0 z-10 hidden grid-cols-2 text-[#211b17] min-[801px]:grid">
                      <div className="pointer-events-auto relative flex flex-col px-[7%] pb-[7%] pt-[8%] before:absolute before:inset-x-[4%] before:inset-y-[3%] before:-z-0 before:bg-[#FFFFFF] before:shadow-[2px_4px_10px_rgba(33,27,23,0.16)] sm:px-[8%]">
                        <div className="relative z-10 flex h-full flex-col">
                          <div className="flex flex-col gap-3">
                            <div className="relative h-[clamp(150px,28vw,230px)] w-full shrink-0 overflow-hidden border-2 border-[#211b17]/70 bg-[#d9c79f] shadow-[3px_4px_0_rgba(33,27,23,0.18)]">
                              {selectedCase === 3 && projectLink ? (
                                <iframe
                                  src={projectLink}
                                  title={`${projectName} live preview`}
                                  tabIndex={-1}
                                  aria-hidden="true"
                                  className="pointer-events-none absolute left-0 top-0 h-[800px] w-[1000px] origin-top-left scale-[0.42] border-0"
                                  loading="lazy"
                                />
                              ) : projectThumbnail ? (
                                <img
                                  src={projectThumbnail}
                                  alt=""
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <span className="px-2 text-center font-mono text-[8px] uppercase tracking-[0.08em]">
                                  {projectLink
                                    ? "Preview unavailable"
                                    : "Project preview"}
                                </span>
                              )}
                            </div>
                            <div className="min-w-0 pt-1">
                              <p className="font-mono text-[clamp(7px,0.8vw,10px)] uppercase tracking-[0.12em] text-[#8f1e1e]">
                                case / 0{selectedCase}
                              </p>
                              <h2 className="mt-1 break-words font-serif text-[clamp(15px,2vw,28px)] leading-[0.95]">
                                {projectName}
                              </h2>
                              <p className="mt-3 font-mono text-[clamp(12px,0.7vw,9px)] uppercase tracking-[0.08em] text-[#514338]">
                                {selectedCase === 3
                                  ? "Backend Developer"
                                  : "Frontend Developer"}
                              </p>
                            </div>
                          </div>

                          <div className=" pt-3">
                            <p className="max-w-full mt-3 font-mono text-[clamp(15px,0.75vw,10px)] leading-[1.35] text-[#000]">
                              {projectDescription}
                            </p>
                          </div>
                          <div className="flex justify-end mt-auto mb-3">
                            {projectLink && (
                              <a
                                href={projectLink}
                                target="_blank"
                                rel="noreferrer"
                                className="mt-2 inline-block font-mono text-[clamp(7px,0.7vw,9px)] uppercase tracking-[0.08em] text-[#8f1e1e] underline underline-offset-2"
                              >
                                Open project link
                              </a>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="pointer-events-auto relative flex flex-col gap-3 px-[7%] pb-[7%] pt-[8%] before:absolute before:inset-x-[4%] before:inset-y-[3%] before:-z-0 before:bg-[#FFFFFF] before:shadow-[2px_4px_10px_rgba(33,27,23,0.16)] sm:px-[8%]">
                        <div className="relative z-10 flex h-full flex-col gap-3">
                          <p className="font-mono text-[clamp(7px,0.8vw,10px)] uppercase tracking-[0.12em] text-[#8f1e1e]">
                            Screenshots / findings
                          </p>
                          <div className="grid grid-cols-2 gap-2">
                            {(projectScreenshots.length > 0
                              ? projectScreenshots
                              : [undefined, undefined]
                            ).map((shotSrc, shot) => (
                              <div
                                key={shot}
                                className="flex aspect-[4/3] items-center justify-center overflow-hidden border-2 border-[#211b17]/60 bg-[#d9c79f] shadow-[2px_3px_0_rgba(33,27,23,0.16)]"
                              >
                                {shotSrc ? (
                                  <img
                                    src={shotSrc}
                                    alt={`${projectName} screenshot ${shot + 1}`}
                                    className="h-full w-full object-cover"
                                  />
                                ) : (
                                  <span className="font-mono text-[8px] uppercase tracking-[0.08em]">
                                    Screenshot {shot + 1}
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="pointer-events-none absolute inset-x-0 top-[15%] z-10 h-[70%] min-[422px]:max-[450px]:top-[13%] min-[422px]:max-[450px]:h-[73%] min-[451px]:max-[500px]:top-[11%] min-[451px]:max-[500px]:h-[77%] min-[501px]:max-[800px]:top-[0%] min-[501px]:max-[800px]:h-[100%] min-[801px]:hidden">
                      <div className="absolute inset-0 left-12 right-8 bg-white">
                        <button
                          type="button"
                          onClick={() =>
                            setMobileDossierPage((page) => (page === 0 ? 1 : 0))
                          }
                          className="pointer-events-auto relative flex h-full w-full flex-col px-[10%] pb-[9%] pt-[9%] text-left text-[#211b17]"
                          aria-label={
                            mobileDossierPage === 0
                              ? "Show case findings"
                              : "Show project overview"
                          }
                        >
                          {mobileDossierPage === 0 ? (
                            <>
                              <div className="relative flex h-[40%] w-full items-center justify-center overflow-hidden border-2 border-[#211b17]/70 bg-[#d9c79f] shadow-[3px_4px_0_rgba(33,27,23,0.18)]">
                                {selectedCase === 3 && projectLink ? (
                                  <iframe
                                    src={projectLink}
                                    title={`${projectName} live preview`}
                                    tabIndex={-1}
                                    aria-hidden="true"
                                    className="pointer-events-none absolute left-0 top-0 h-[800px] w-[1000px] origin-top-left scale-[0.23] min-[421px]:max-[500px]:scale-[0.32] min-[500px]:max-[800px]:scale-[0.37] border-0"
                                    loading="lazy"
                                  />
                                ) : projectThumbnail ? (
                                  <img
                                    src={projectThumbnail}
                                    alt=""
                                    className="h-full w-full object-cover"
                                  />
                                ) : (
                                  <span className="font-mono text-[9px] uppercase tracking-[0.08em] ">
                                    Project preview
                                  </span>
                                )}
                              </div>
                              <p className="mt-5 font-mono text-[9px] uppercase tracking-[0.12em] text-[#8f1e1e]">
                                case / 0{selectedCase}
                              </p>
                              <h2 className="mt-2 font-serif text-[clamp(14px,8vw,22px)] leading-none">
                                {projectName}
                              </h2>
                              <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.08em] text-[#514338]">
                                {selectedCase === 3
                                  ? "Backend Developer"
                                  : "Frontend Developer"}
                              </p>
                              <p className="mt-3 font-mono text-[10px] tracking-[0.08em] text-black">
                                {projectDescription}
                              </p>
                              <p className="mt-auto flex justify-end font-mono text-[10px] leading-[1.45] text-[#2a1c1c">
                                Next page →
                              </p>
                            </>
                          ) : (
                            <>
                              <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-[#8f1e1e]">
                                Screenshots
                              </p>
                              <div className="mt-4 grid grid-cols-2 gap-3">
                                {[0, 1].map((shot) => (
                                  <div
                                    key={shot}
                                    className="flex aspect-[4/3] items-center justify-center overflow-hidden border-2 border-[#211b17]/60 bg-[#d9c79f]"
                                  >
                                    {project?.thumbnail ? (
                                      <img
                                        src={project.thumbnail}
                                        alt={`${projectName} screenshot ${shot + 1}`}
                                        className="h-full w-full object-cover"
                                      />
                                    ) : (
                                      <span className="font-mono text-[8px] uppercase tracking-[0.08em]">
                                        Screenshot {shot + 1}
                                      </span>
                                    )}
                                  </div>
                                ))}
                              </div>
                              <p className="mt-6 font-mono text-[10px] leading-[1.45] text-[#8f1e1e]">
                                {projectLink && (
                                  <a
                                    href={projectLink}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="mt-2 inline-block font-mono text-[clamp(7px,0.7vw,9px)] uppercase tracking-[0.08em] text-[#8f1e1e] underline underline-offset-2"
                                  >
                                    Open project link
                                  </a>
                                )}
                              </p>
                              <span className="mt-auto flex justify-end font-mono text-[10px] tracking-[0.1em] text-[#2a1c1c">
                                ← Previous Page
                              </span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                    <img
                      src="/case-file-mobile.svg"
                      alt={`Mobile case file ${selectedCase}`}
                      className="relative z-0 block h-auto max-h-[82vh] h-[620px] w-auto max-w-full object-contain drop-shadow-[0_24px_50px_rgba(0,0,0,0.5)] min-[801px]:hidden"
                    />
                  </>
                );
              })()}
              <img
                src="/case-file-inside.svg"
                alt={`Inside case file ${selectedCase}`}
                className="max-h-[82vh] w-auto max-w-full object-contain drop-shadow-[0_24px_50px_rgba(0,0,0,0.5)] min-[801px]:block max-[800px]:hidden"
              />
              <button
                type="button"
                onClick={() => setSelectedCase(null)}
                className="absolute -right-2 -top-2 flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-[var(--surface)] text-[var(--text2)] transition-colors hover:text-[var(--text)]"
                aria-label="Close case file"
              >
                <X size={16} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
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
              <span className="font-mono text-[10px] text-[var(--text3)]">
                {project.stars}
              </span>
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
