// src/lib/github.ts
import type { Project } from "@/types";

interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  topics: string[];
  language: string | null;
  stargazers_count: number;
  pushed_at: string;
}

export async function fetchGitHubRepos(
  username: string,
  token?: string,
  pinnedRepos?: string[]
): Promise<Project[]> {
  try {
    const headers: HeadersInit = {
      Accept: "application/vnd.github.v3+json",
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(
      `https://api.github.com/users/${username}/repos?sort=pushed&per_page=30&type=owner`,
      { headers, next: { revalidate: 3600 } } // cache 1hr
    );

    if (!res.ok) return [];

    const repos: GitHubRepo[] = await res.json();

    let filtered = repos.filter(
      (r) => !r.name.startsWith(".") && r.name !== username
    );

    // If pinned repos configured, filter to only those
    if (pinnedRepos && pinnedRepos.length > 0) {
      filtered = filtered.filter((r) => pinnedRepos.includes(r.name));
    }

    return filtered.slice(0, 12).map((repo) => ({
      id: `gh-${repo.id}`,
      name: repo.name,
      description: repo.description ?? "No description provided.",
      tags: [
        ...(repo.language ? [repo.language] : []),
        ...repo.topics.slice(0, 3),
      ],
      githubUrl: repo.html_url,
      liveUrl: repo.homepage ?? undefined,
      stars: repo.stargazers_count,
      updatedAt: repo.pushed_at,
      source: "github" as const,
      category: "GitHub",
    }));
  } catch {
    return [];
  }
}
