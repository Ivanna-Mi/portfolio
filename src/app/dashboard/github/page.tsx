// src/app/dashboard/github/page.tsx
"use client";

import { useState, useEffect } from "react";
import type { PortfolioData } from "@/types";
import { Github, Eye, EyeOff, RefreshCw, Info } from "lucide-react";

export default function GitHubConfigPage() {
  const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(null);
  const [config, setConfig] = useState({
    username: "",
    token: "",
    pinnedRepos: "",
  });
  const [showToken, setShowToken] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ repos: number; error?: string } | null>(null);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/portfolio")
      .then((res) => res.json())
      .then((data: PortfolioData) => {
        setPortfolioData(data);
        setConfig({
          username: data.config.githubUsername || "",
          token: data.config.githubToken || "",
          pinnedRepos: (data.config.pinnedRepos ?? []).join(", "),
        });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  async function testConnection() {
    setTesting(true);
    setTestResult(null);
    try {
      const res = await fetch("/api/github");
      const data = await res.json();
      setTestResult({ repos: data.repos?.length ?? 0 });
    } catch {
      setTestResult({ repos: 0, error: "Failed to connect." });
    } finally {
      setTesting(false);
    }
  }

  async function handleSave() {
    if (!portfolioData) return;
    
    const updatedData: PortfolioData = {
      ...portfolioData,
      config: {
        ...portfolioData.config,
        githubUsername: config.username,
        githubToken: config.token,
        pinnedRepos: config.pinnedRepos
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      },
    };

    try {
      const res = await fetch("/api/portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });
      
      if (res.ok) {
        setSaved(true);
        setPortfolioData(updatedData);
        setTimeout(() => setSaved(false), 2000);
      } else {
        alert("Failed to save changes");
      }
    } catch (error) {
      alert("Failed to save changes");
    }
  }

  const inputCls = "w-full px-3 py-2.5 bg-[var(--surface)] border border-[var(--border2)] rounded-sm font-mono text-sm text-[var(--text)] placeholder:text-[var(--text3)] outline-none focus:border-[var(--maroon)] transition-colors";

  return (
    <div className="max-w-xl space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-light text-[var(--text)] mb-1">GitHub Config</h1>
        <p className="font-mono text-[11px] text-[var(--text3)] uppercase tracking-widest">Connect your repositories</p>
      </div>

      <div className="flex gap-3 px-4 py-3 border border-[rgba(201,169,110,0.2)] bg-[rgba(201,169,110,0.05)] rounded-sm">
        <Info size={13} className="text-[var(--gold)] shrink-0 mt-0.5" />
        <div className="font-mono text-[10px] text-[var(--text3)] leading-relaxed space-y-1">
          <p>Add <code className="text-[var(--text2)]">GITHUB_TOKEN</code> to your <code className="text-[var(--text2)]">.env.local</code> for higher API rate limits (60 → 5000 req/hr).</p>
          <p>Token only needs <code className="text-[var(--text2)]">public_repo</code> read scope.</p>
        </div>
      </div>

      {loading ? (
        <div className="font-mono text-[12px] text-[var(--text3)]">Loading...</div>
      ) : (
      <div className="space-y-5">
        <div className="space-y-1.5">
          <label className="block font-mono text-[10px] uppercase tracking-[0.1em] text-[var(--text3)]">GitHub Username</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text3)]">
              <Github size={13} />
            </span>
            <input
              value={config.username}
              onChange={(e) => setConfig((p) => ({ ...p, username: e.target.value }))}
              placeholder="yourusername"
              disabled={loading}
              className={`${inputCls} pl-9 disabled:opacity-50`}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block font-mono text-[10px] uppercase tracking-[0.1em] text-[var(--text3)]">
            Personal Access Token <span className="text-[var(--text3)] normal-case">(optional)</span>
          </label>
          <div className="relative">
            <input
              type={showToken ? "text" : "password"}
              value={config.token}
              onChange={(e) => setConfig((p) => ({ ...p, token: e.target.value }))}
              placeholder="ghp_xxxxxxxxxxxx"
              disabled={loading}
              className={`${inputCls} pr-10 disabled:opacity-50`}
            />
            <button
              type="button"
              onClick={() => setShowToken(!showToken)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text3)] hover:text-[var(--text2)] transition-colors"
            >
              {showToken ? <EyeOff size={13} /> : <Eye size={13} />}
            </button>
          </div>
          <p className="font-mono text-[9px] text-[var(--text3)]">Store in .env.local as GITHUB_TOKEN. Never commit to git.</p>
        </div>

        <div className="space-y-1.5">
          <label className="block font-mono text-[10px] uppercase tracking-[0.1em] text-[var(--text3)]">
            Pinned Repos <span className="text-[var(--text3)] normal-case">(optional — comma separated)</span>
          </label>
          <input
            value={config.pinnedRepos}
            onChange={(e) => setConfig((p) => ({ ...p, pinnedRepos: e.target.value }))}
            placeholder="repo-name-1, repo-name-2"
            disabled={loading}
            className={`${inputCls} disabled:opacity-50`}
          />
          <p className="font-mono text-[9px] text-[var(--text3)]">Leave empty to show all public repos (newest first).</p>
        </div>
      </div>
      )}

      {/* Test connection */}
      <div className="pt-2">
        <button
          onClick={testConnection}
          disabled={testing || !config.username}
          className="flex items-center gap-2 px-5 py-2.5 border border-[var(--border2)] text-[var(--text2)] hover:border-[var(--maroon)] hover:text-[var(--text)] font-mono text-[11px] rounded-sm transition-all disabled:opacity-50"
        >
          <RefreshCw size={12} className={testing ? "animate-spin" : ""} />
          {testing ? "Testing…" : "Test Connection"}
        </button>

        {testResult && (
          <div className={`mt-3 px-4 py-2.5 rounded-sm border font-mono text-[11px] ${
            testResult.error
              ? "border-red-800/30 bg-red-900/10 text-red-400"
              : "border-[rgba(100,200,100,0.2)] bg-[rgba(100,200,100,0.05)] text-green-500"
          }`}>
            {testResult.error ?? `✓ Connected — fetched ${testResult.repos} repositories.`}
          </div>
        )}
      </div>

      <div className="flex items-center gap-4 pt-2 border-t border-[var(--border)]">
        <button
          onClick={handleSave}
          className="px-7 py-2.5 bg-[var(--maroon)] hover:bg-[var(--maroon2)] text-white font-medium text-[11px] uppercase tracking-[0.08em] rounded-sm transition-all"
        >
          Save Config
        </button>
        {saved && <span className="font-mono text-[11px] text-green-500 uppercase tracking-wide">✓ Saved</span>}
      </div>
    </div>
  );
}
