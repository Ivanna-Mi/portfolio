// src/app/page.tsx
import { Navbar } from "@/components/ui/Navbar";
import { HeroSection } from "@/components/sections/HeroSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { SkillsSection } from "@/components/sections/SkillsSection";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { Footer } from "@/components/ui/Footer";
import { loadPortfolioData } from "@/data/portfolio-server";
import { fetchGitHubRepos } from "@/lib/github";

export default async function Home() {
  const { profile, about, skills, projects, socials, config } = await loadPortfolioData();

  // Fetch GitHub repos server-side (cached 1hr)
  const githubProjects = await fetchGitHubRepos(
    config.githubUsername,
    config.githubToken,
    config.pinnedRepos
  );

  // Merge: manual projects first, then GitHub (deduplicated by name)
  const manualNames = new Set(projects.map((p) => p.name));
  const allProjects = [
    ...projects,
    ...githubProjects.filter((p) => !manualNames.has(p.name)),
  ];

  return (
    <main className="min-h-screen bg-[var(--bg)]">
      <Navbar name={`${profile.name} ${profile.nameItalic}`} />
      <HeroSection profile={profile} />
      <AboutSection about={about} />
      <SkillsSection skills={skills} />
      <ProjectsSection projects={allProjects} />
      <ContactSection socials={socials} />
      <Footer profile={profile} />
    </main>
  );
}
