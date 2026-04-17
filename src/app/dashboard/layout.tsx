// src/app/dashboard/layout.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  User,
  Code2,
  FolderKanban,
  Share2,
  Palette,
  Github,
  Search,
  LogOut,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

type NavItem = {
  href: string;
  label: string;
  icon: React.ComponentType<{ size?: number | string; className?: string }>;
  exact?: boolean;
};

type NavGroup = {
  label: string;
  items: NavItem[];
};

const NAV_GROUPS: NavGroup[] = [
  {
    label: "Overview",
    items: [
      { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, exact: true },
    ],
  },
  {
    label: "Content",
    items: [
      { href: "/dashboard/profile", label: "Profile", icon: User },
      { href: "/dashboard/skills", label: "Skills", icon: Code2 },
      { href: "/dashboard/projects", label: "Projects", icon: FolderKanban },
      { href: "/dashboard/social", label: "Social", icon: Share2 },
    ],
  },
  {
    label: "Settings",
    items: [
      { href: "/dashboard/theme", label: "Theme & SEO", icon: Palette },
      { href: "/dashboard/github", label: "GitHub Config", icon: Github },
    ],
  },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  function isActive(href: string, exact?: boolean) {
    return exact ? pathname === href : pathname.startsWith(href) && href !== "/dashboard";
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] flex flex-col">
      {/* Top bar */}
      <header className="h-12 border-b border-[var(--border)] bg-[var(--bg2)] flex items-center px-4 gap-3 shrink-0 z-30">
        <button
          className="lg:hidden text-[var(--text3)] hover:text-[var(--text2)]"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
        </button>

        <span className="font-serif text-base italic text-[var(--gold)]">RP. Admin</span>
        <div className="w-px h-4 bg-[var(--border2)] mx-1" />
        <span className="font-mono text-[10px] text-[var(--text3)] uppercase tracking-widest">Portfolio CMS</span>

        <div className="ml-auto flex items-center gap-3">
          <Link
            href="/"
            target="_blank"
            className="font-mono text-[10px] uppercase tracking-widest text-[var(--text3)] hover:text-[var(--text2)] flex items-center gap-1.5 transition-colors"
          >
            View Site <ChevronRight size={10} />
          </Link>
          <div className="w-7 h-7 rounded-full bg-[rgba(139,26,26,0.2)] border border-[rgba(139,26,26,0.3)] flex items-center justify-center">
            <span className="font-mono text-[9px] text-[var(--maroon-light)]">RP</span>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar overlay (mobile) */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-20 bg-[rgba(0,0,0,0.7)] lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={cn(
            "w-52 shrink-0 border-r border-[var(--border)] bg-[var(--bg2)] flex flex-col py-4 overflow-y-auto",
            "fixed lg:relative inset-y-0 left-0 z-20 transition-transform duration-200",
            "top-12 h-[calc(100vh-3rem)]",
            sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          )}
        >
          {NAV_GROUPS.map((group) => (
            <div key={group.label} className="mb-4">
              <p className="px-4 mb-1 font-mono text-[9px] uppercase tracking-[0.12em] text-[var(--text3)]">
                {group.label}
              </p>
              {group.items.map((item) => {
                const active = isActive(item.href, item.exact);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={cn(
                      "flex items-center gap-2.5 px-4 py-2 text-[11px] font-medium border-l-2 transition-all duration-150",
                      active
                        ? "border-[var(--maroon2)] bg-[rgba(139,26,26,0.1)] text-[var(--text)]"
                        : "border-transparent text-[var(--text3)] hover:text-[var(--text2)] hover:bg-[rgba(255,255,255,0.03)]"
                    )}
                  >
                    <item.icon size={13} className={active ? "text-[var(--maroon-light)]" : ""} />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          ))}

          {/* Bottom actions */}
          <div className="mt-auto px-4 pb-2 space-y-1">
            <button className="flex items-center gap-2.5 w-full px-0 py-2 text-[11px] font-medium text-[var(--text3)] hover:text-[var(--text2)] transition-colors">
              <Search size={13} />
              Quick Search
              <kbd className="ml-auto font-mono text-[9px] px-1 border border-[var(--border2)] rounded text-[var(--text3)]">⌘K</kbd>
            </button>
            <Link
              href="/"
              className="flex items-center gap-2.5 py-2 text-[11px] font-medium text-[var(--text3)] hover:text-[var(--text2)] transition-colors"
            >
              <LogOut size={13} />
              Exit Dashboard
            </Link>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 overflow-auto p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
