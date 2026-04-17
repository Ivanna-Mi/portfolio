// src/app/api/portfolio/route.ts
import { NextResponse } from "next/server";
import { loadPortfolioData } from "@/data/portfolio-server";
import { promises as fs } from "fs";
import path from "path";

const dataFilePath = path.join(process.cwd(), "src", "data", "portfolio.json");

export async function GET() {
  try {
    const data = await loadPortfolioData();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Failed to read portfolio data" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2), "utf8");
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to save portfolio data" }, { status: 500 });
  }
}
