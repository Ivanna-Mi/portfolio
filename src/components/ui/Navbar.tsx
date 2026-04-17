// src/components/ui/Navbar.tsx
"use client";

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavbarProps {
  name: string;
}

const navLinks = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
];

export function Navbar({ name }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled
            ? "border-b border-[var(--border)] backdrop-blur-md bg-[rgba(10,10,10,0.85)]"
            : "bg-transparent"
        )}
      >
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <a
            href="/"
            className="font-serif text-xl italic text-[var(--gold)] hover:opacity-80 transition-opacity"
          >
            {name.split(" ")[0][0]}
            {name.split(" ").slice(-1)[0][0]}.
          </a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="font-mono text-[10px] uppercase tracking-[0.1em] text-[var(--text3)] hover:text-[var(--text2)] transition-colors duration-200"
              >
                {link.label}
              </a>
            ))}
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noreferrer"
              className="font-mono text-[10px] uppercase tracking-[0.1em] px-4 py-2 border border-[var(--border2)] text-[var(--text2)] hover:border-[var(--maroon)] hover:text-[var(--text)] transition-all duration-200 rounded-sm"
            >
              Resume ↗
            </a>
          </nav>

          {/* Mobile toggle */}
          <button
            className="md:hidden text-[var(--text2)] hover:text-[var(--text)]"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      <div
        className={cn(
          "fixed inset-0 z-40 transition-all duration-300 md:hidden",
          mobileOpen ? "pointer-events-auto" : "pointer-events-none"
        )}
      >
        {/* Backdrop */}
        <div
          className={cn(
            "absolute inset-0 bg-[rgba(10,10,10,0.95)] backdrop-blur-md transition-opacity duration-300",
            mobileOpen ? "opacity-100" : "opacity-0"
          )}
          onClick={() => setMobileOpen(false)}
        />

        {/* Menu Panel */}
        <div
          className={cn(
            "absolute top-16 left-0 right-0 border-b border-[var(--border)] bg-[var(--bg)] px-6 py-8 transition-all duration-300",
            mobileOpen ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0"
          )}
        >
          <nav className="flex flex-col gap-6">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="font-mono text-sm uppercase tracking-[0.1em] text-[var(--text2)] hover:text-[var(--text)] transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <a
              href="/resume.pdf"
              target="_blank"
              rel="noreferrer"
              className="font-mono text-sm uppercase tracking-[0.1em] text-[var(--maroon-light)] hover:text-[var(--text)] transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              Download Resume ↗
            </a>
          </nav>
        </div>
      </div>
    </>
  );
}
