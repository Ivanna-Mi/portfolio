// src/components/ui/SectionHeader.tsx
interface SectionHeaderProps {
  title: string;
  tag: string;
  subtitle?: string;
}

export function SectionHeader({ title, tag, subtitle }: SectionHeaderProps) {
  return (
    <div className="mb-16">
      <div className="flex items-center gap-4 mb-4">
        <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--maroon-light)]">
          {tag}
        </span>
        <div className="flex-1 h-px bg-[var(--border)]" />
      </div>
      <h2 className="font-serif text-5xl md:text-6xl font-light text-[var(--text)] leading-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 font-mono text-sm text-[var(--text3)] max-w-lg">
          {subtitle}
        </p>
      )}
    </div>
  );
}
