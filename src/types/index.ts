// src/types/index.ts

export interface Profile {
  name: string;
  nameItalic: string; // Last name rendered in italic serif
  role: string[];     // Multiple roles for typing animation
  tagline: string;
  bio: string;
  photoUrl: string;
  resumeUrl: string;
  available: boolean;
  stats: {
    years: number;
    projects: number;
    clients: number;
  };
}

export interface AboutSection {
  description: string;
  experience: string;
  focus: string[];
}

export interface Skill {
  id: string;
  name: string;
  category: "frontend" | "ui-motion" | "backend" | "tooling" | "other";
  featured?: boolean;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  tags: string[];
  githubUrl?: string;
  liveUrl?: string;
  thumbnail?: string;
  featured?: boolean;
  category?: string;
  stars?: number;
  updatedAt?: string;
  source: "manual" | "github";
}

export interface SocialLink {
  id: string;
  platform: "email" | "linkedin" | "github" | "instagram" | "whatsapp" | "twitter";
  label: string;
  value: string; // URL or handle
  displayValue: string;
}

export interface SiteConfig {
  title: string;
  description: string;
  accentColor: string;
  seoDescription: string;
  ogImage?: string;
  githubUsername: string;
  githubToken?: string; // Optional, for higher rate limits
  pinnedRepos?: string[]; // Filter to specific repos
}

export interface PortfolioData {
  profile: Profile;
  about: AboutSection;
  skills: Skill[];
  projects: Project[];
  socials: SocialLink[];
  config: SiteConfig;
}
