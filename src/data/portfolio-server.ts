// src/data/portfolio-server.ts
// Server-only functions for loading portfolio data from JSON
// Do NOT import this in client components

import type { PortfolioData } from "@/types";
import { promises as fs } from "fs";
import path from "path";

const dataFilePath = path.join(process.cwd(), "src", "data", "portfolio.json");

let cachedData: PortfolioData | null = null;

export async function loadPortfolioData(): Promise<PortfolioData> {
  if (cachedData) return cachedData;
  
  try {
    const fileData = await fs.readFile(dataFilePath, "utf8");
    cachedData = JSON.parse(fileData) as PortfolioData;
    return cachedData;
  } catch (error) {
    console.error("Failed to load portfolio data:", error);
    throw new Error("Failed to load portfolio data");
  }
}
