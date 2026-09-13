// src/components/sections/ContactSection.tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FadeIn } from "@/components/ui/FadeIn";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { cn } from "@/lib/utils";
import { Mail, Linkedin, Github, Instagram, MessageCircle } from "lucide-react";
import type { SocialLink } from "@/types";

const SOCIAL_ICONS: Record<string, React.ElementType> = {
  email: Mail,
  linkedin: Linkedin,
  github: Github,
  instagram: Instagram,
  whatsapp: MessageCircle,
  twitter: Github,
};

interface ContactSectionProps {
  socials: SocialLink[];
}

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormData = z.infer<typeof contactSchema>;

export function ContactSection({ socials }: ContactSectionProps) {
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({ resolver: zodResolver(contactSchema) });

  const onSubmit = async (data: ContactFormData) => {
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        setStatus("success");
        reset();
        setTimeout(() => setStatus("idle"), 4000);
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <section
      id="contact"
      className="py-32 border-t border-[var(--border)] bg-[var(--bg2)]"
    >
      <div className="max-w-6xl mx-auto px-6">
        <FadeIn>
          <SectionHeader title="Let's Talk" tag="/ contact" />
        </FadeIn>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left: Quote + Socials */}
          <FadeIn delay={0.1} className="space-y-8">
            <blockquote className="font-serif text-2xl md:text-3xl italic text-[var(--text)] leading-[1.5] font-light">
              "Let us turn the{" "}
              <em className="text-[var(--gold)]">impossible</em> dream
              <br />
              into the greatest{" "}
              <em className="text-[var(--gold)]">innovation</em> the world has
              ever known."
            </blockquote>

            <p className="text-[var(--text3)] leading-relaxed">
              I'm always open to interesting projects, freelance work, or just a
              friendly chat about any topic.
            </p>
          </FadeIn>

          {/* Right: Form */}
          <FadeIn delay={0.2}>
            <div className="space-y-3">
              {socials.map((social) => {
                const Icon = SOCIAL_ICONS[social.platform] ?? Mail;
                return (
                  <a
                    key={social.id}
                    href={social.value}
                    target={social.platform !== "email" ? "_blank" : undefined}
                    rel="noreferrer"
                    className="flex items-center gap-4 px-5 py-3.5 border border-[var(--border)] rounded-sm bg-[var(--surface)] hover:border-[rgba(139,26,26,0.35)] hover:bg-[rgba(139,26,26,0.05)] transition-all duration-200 group"
                  >
                    <div className="w-9 h-9 rounded-sm bg-[var(--surface2)] flex items-center justify-center shrink-0 group-hover:bg-[rgba(139,26,26,0.15)] transition-colors">
                      <Icon
                        size={15}
                        className="text-[var(--text3)] group-hover:text-[var(--maroon-light)] transition-colors"
                      />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-[var(--text2)] group-hover:text-[var(--text)] transition-colors">
                        {social.label}
                      </p>
                      <p className="font-mono text-[10px] text-[var(--text3)]">
                        {social.displayValue}
                      </p>
                    </div>
                  </a>
                );
              })}
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}

function FormField({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label className="block font-mono text-[10px] uppercase tracking-[0.1em] text-[var(--text3)]">
        {label}
      </label>
      {children}
      {error && <p className="font-mono text-[10px] text-red-500">{error}</p>}
    </div>
  );
}
