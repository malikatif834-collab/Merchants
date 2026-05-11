import { cn } from "@/lib/cn";

export function Card({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-xl border border-[var(--brand-line)] bg-[var(--brand-charcoal)]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  title,
  subtitle,
  right,
}: {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  right?: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 p-5 border-b border-[var(--brand-line)]">
      <div>
        <div className="text-[15px] font-semibold text-white tracking-tight">{title}</div>
        {subtitle && (
          <div className="text-[12px] text-[var(--brand-muted)] mt-0.5">{subtitle}</div>
        )}
      </div>
      {right && <div className="shrink-0">{right}</div>}
    </div>
  );
}

export function Pill({
  tone = "neutral",
  children,
}: {
  tone?: "neutral" | "ok" | "warn" | "danger" | "brand" | "info";
  children: React.ReactNode;
}) {
  const colors: Record<string, string> = {
    neutral: "bg-[var(--brand-charcoal-2)] text-[var(--brand-muted)] border-[var(--brand-line)]",
    ok: "bg-[var(--brand-green)]/10 text-[var(--brand-green)] border-[var(--brand-green)]/30",
    warn: "bg-[var(--brand-amber)]/10 text-[var(--brand-amber)] border-[var(--brand-amber)]/30",
    danger: "bg-[var(--brand-red)]/10 text-[var(--brand-red)] border-[var(--brand-red)]/30",
    brand: "bg-[var(--brand-orange)]/15 text-[var(--brand-orange)] border-[var(--brand-orange)]/40",
    info: "bg-white/5 text-white/80 border-white/10",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[11px] font-medium tracking-wide",
        colors[tone]
      )}
    >
      {children}
    </span>
  );
}
