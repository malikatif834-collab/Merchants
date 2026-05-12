import { Card } from "./Card";

const SOURCES = [
  { icon: "✉", name: "Gmail", note: "customer & supplier email" },
  { icon: "▦", name: "Customer Portal", note: "merchants.ca quote requests" },
  { icon: "☎", name: "Phone Notes", note: "voicemail · call transcripts" },
  { icon: "✎", name: "Walk-up Capture", note: "rep notepad photos" },
  { icon: "▤", name: "Catalog DB", note: "SKUs · stock on hand · pricing" },
  { icon: "$", name: "AR Ledger", note: "aging · payment history · NSF" },
  { icon: "⛓", name: "Supplier History", note: "lead times · quotes · plates" },
  { icon: "⚙", name: "Procurement Tool", note: "case file · stages · audit" },
];

const STEPS = [
  { name: "Channel intake", note: "any inbound → one checklist" },
  { name: "Checklist extraction", note: "fields + confidence + sources" },
  { name: "Stock match", note: "semantic match against catalog" },
  { name: "Risk scoring", note: "AR aging, NSF, margin floor" },
  { name: "Sourcing", note: "supplier shortlist, RFQ, quote parse" },
  { name: "Drafting", note: "quotes, follow-ups, briefs" },
  { name: "Approval routing", note: "right person, right moment" },
];

const SURFACES = [
  { icon: "✉", name: "Gmail sidecar", note: "drafts appear in the thread" },
  { icon: "💬", name: "Chat approvals", note: "AR / Purchasing one-click" },
  { icon: "▤", name: "AppSheet case file", note: "lives next to Sheets" },
  { icon: "📊", name: "Looker dashboard", note: "Carol's numbers, same login" },
  { icon: "↩", name: "Procurement Tool write-back", note: "stages + audit log sync" },
  { icon: "👥", name: "Customer & supplier", note: "humans-approved emails out" },
];

export function SystemDiagram() {
  return (
    <Card>
      <div className="p-6">
        <div className="flex items-baseline justify-between gap-3 flex-wrap mb-1">
          <div className="text-[16px] font-semibold text-white tracking-tight">
            Where this lives in your business
          </div>
          <div className="text-[11px] text-[var(--brand-muted)]">
            AI sits between your data and your team. Nothing replaces, everything connects.
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mt-5 items-stretch">
          <Column
            title="What AI reads from"
            label="Data sources"
            colSpan={4}
            tone="info"
            items={SOURCES.map((s) => ({ label: s.name, sub: s.note, icon: s.icon }))}
          />
          <ArrowCol direction="→" />
          <Column
            title="AI orchestration layer"
            label="Procurement brain"
            colSpan={3}
            tone="brand"
            items={STEPS.map((s) => ({ label: s.name, sub: s.note }))}
          />
          <ArrowCol direction="→" />
          <Column
            title="Where humans interact"
            label="Output surfaces"
            colSpan={4}
            tone="ok"
            items={SURFACES.map((s) => ({ label: s.name, sub: s.note, icon: s.icon }))}
          />
        </div>
        <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-3 text-[12px]">
          <Note color="info" body="Reads through APIs and connectors. Your data stays in your tenant." />
          <Note color="brand" body="One brain, one case file, one audit log. AI orchestrates across all stages." />
          <Note color="ok" body="Humans approve every customer- or supplier-facing move." />
        </div>
      </div>
    </Card>
  );
}

function Column({
  title,
  label,
  items,
  colSpan,
  tone,
}: {
  title: string;
  label: string;
  items: Array<{ label: string; sub?: string; icon?: string }>;
  colSpan: number;
  tone: "info" | "brand" | "ok";
}) {
  const accent = {
    info: "text-white/90 border-[var(--brand-line)] bg-[var(--brand-charcoal-2)]",
    brand: "text-white border-[var(--brand-orange)]/50 bg-[var(--brand-orange)]/8",
    ok: "text-white/90 border-[var(--brand-green)]/40 bg-[var(--brand-green)]/5",
  }[tone];
  const dot = {
    info: "bg-white/40",
    brand: "bg-[var(--brand-orange)]",
    ok: "bg-[var(--brand-green)]",
  }[tone];
  return (
    <div className={`md:col-span-${colSpan} flex flex-col`}>
      <div className="text-[10px] uppercase tracking-wider text-[var(--brand-muted)] mb-1">
        {title}
      </div>
      <div className={`flex-1 rounded-lg border ${accent} p-3`}>
        <div className="flex items-center gap-2 mb-2.5">
          <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
          <span className="text-[12px] uppercase tracking-wider text-white/90 font-semibold">
            {label}
          </span>
        </div>
        <ul className="space-y-1.5">
          {items.map((it) => (
            <li
              key={it.label}
              className="flex items-start gap-2 rounded-md bg-[var(--brand-ink)]/60 border border-[var(--brand-line)]/60 px-2.5 py-1.5"
            >
              {it.icon && (
                <span className="text-[11px] text-[var(--brand-orange)] w-4 shrink-0 mt-0.5">
                  {it.icon}
                </span>
              )}
              <div className="min-w-0">
                <div className="text-[12.5px] text-white font-medium leading-tight">
                  {it.label}
                </div>
                {it.sub && (
                  <div className="text-[10.5px] text-[var(--brand-muted)] leading-tight">
                    {it.sub}
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function ArrowCol({ direction }: { direction: string }) {
  return (
    <div className="hidden md:flex md:col-span-[0.5] items-center justify-center text-[var(--brand-orange)] text-2xl">
      {direction}
    </div>
  );
}

function Note({ color, body }: { color: "info" | "brand" | "ok"; body: string }) {
  const dot = {
    info: "bg-white/40",
    brand: "bg-[var(--brand-orange)]",
    ok: "bg-[var(--brand-green)]",
  }[color];
  return (
    <div className="flex items-start gap-2 rounded-md bg-[var(--brand-ink)] border border-[var(--brand-line)]/60 px-3 py-2 text-[var(--brand-muted)] leading-relaxed">
      <span className={`mt-1.5 h-1.5 w-1.5 rounded-full ${dot}`} />
      <span>{body}</span>
    </div>
  );
}
