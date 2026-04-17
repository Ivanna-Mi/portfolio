// src/app/api/github/route.ts
// Used by dashboard to trigger a re-sync or preview repos
import { NextResponse } from "next/server";
import { fetchGitHubRepos } from "@/lib/github";
import { loadPortfolioData } from "@/data/portfolio-server";

export async function GET() {
  try {
    const portfolioData = await loadPortfolioData();
    const { config } = portfolioData;
    
    const repos = await fetchGitHubRepos(
      config.githubUsername,
      config.githubToken,
      config.pinnedRepos
    );
    return NextResponse.json({ repos });
  } catch (error) {
    return NextResponse.json({ repos: [], error: "Failed to fetch repos" }, { status: 500 });
  }
}
