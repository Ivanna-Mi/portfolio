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
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

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
    <section id="contact" className="py-32 border-t border-[var(--border)] bg-[var(--bg2)]">
      <div className="max-w-6xl mx-auto px-6">
        <FadeIn>
          <SectionHeader
            title="Let's Talk"
            tag="/ contact"
          />
        </FadeIn>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Left: Quote + Socials */}
          <FadeIn delay={0.1} className="space-y-8">
            <blockquote className="font-serif text-2xl md:text-3xl italic text-[var(--text)] leading-[1.5] font-light">
              "Have a project in mind?<br />
              Let's build something{" "}
              <em className="text-[var(--gold)]">remarkable</em>{" "}
              together."
            </blockquote>

            <p className="text-[var(--text3)] leading-relaxed">
              I'm always open to interesting projects, freelance work, or just a friendly chat about frontend craft.
            </p>

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
                      <Icon size={15} className="text-[var(--text3)] group-hover:text-[var(--maroon-light)] transition-colors" />
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

          {/* Right: Form */}
          <FadeIn delay={0.2}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <FormField label="Name" error={errors.name?.message}>
                <input
                  {...register("name")}
                  placeholder="Your name"
                  className={cn(
                    "w-full px-4 py-3 bg-[var(--surface)] border rounded-sm font-sans text-sm text-[var(--text)] placeholder:text-[var(--text3)] outline-none transition-all duration-200",
                    errors.name
                      ? "border-red-800/50 focus:border-red-700"
                      : "border-[var(--border2)] focus:border-[var(--maroon)]"
                  )}
                />
              </FormField>

              <FormField label="Email" error={errors.email?.message}>
                <input
                  {...register("email")}
                  type="email"
                  placeholder="your@email.com"
                  className={cn(
                    "w-full px-4 py-3 bg-[var(--surface)] border rounded-sm font-sans text-sm text-[var(--text)] placeholder:text-[var(--text3)] outline-none transition-all duration-200",
                    errors.email
                      ? "border-red-800/50 focus:border-red-700"
                      : "border-[var(--border2)] focus:border-[var(--maroon)]"
                  )}
                />
              </FormField>

              <FormField label="Message" error={errors.message?.message}>
                <textarea
                  {...register("message")}
                  rows={5}
                  placeholder="Tell me about your project or just say hi..."
                  className={cn(
                    "w-full px-4 py-3 bg-[var(--surface)] border rounded-sm font-sans text-sm text-[var(--text)] placeholder:text-[var(--text3)] outline-none transition-all duration-200 resize-none",
                    errors.message
                      ? "border-red-800/50 focus:border-red-700"
                      : "border-[var(--border2)] focus:border-[var(--maroon)]"
                  )}
                />
              </FormField>

              {/* Submit */}
              <div className="flex items-center gap-4 pt-2">
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="px-8 py-3 bg-[var(--maroon)] hover:bg-[var(--maroon2)] disabled:opacity-50 disabled:cursor-not-allowed text-white font-sans font-medium text-[11px] uppercase tracking-[0.08em] rounded-sm transition-all duration-200"
                >
                  {status === "loading" ? "Sending..." : "Send Message"}
                </button>

                {status === "success" && (
                  <p className="font-mono text-[11px] text-green-500 uppercase tracking-wide">
                    ✓ Message sent!
                  </p>
                )}
                {status === "error" && (
                  <p className="font-mono text-[11px] text-red-500 uppercase tracking-wide">
                    Something went wrong. Try email instead.
                  </p>
                )}
              </div>
            </form>
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
      {error && (
        <p className="font-mono text-[10px] text-red-500">{error}</p>
      )}
    </div>
  );
}
