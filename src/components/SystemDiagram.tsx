import { Card } from "./Card";

const SOURCES = [
  { icon: "✉", name: "Email inbox", note: "from customers and suppliers" },
  { icon: "▤", name: "Order portal", note: "customers entering quote requests" },
  { icon: "☎", name: "Phone & voicemail", note: "transcribed calls, rep notes" },
  { icon: "✎", name: "Rep walk-up notes", note: "photos of notepads from visits" },
  { icon: "▦", name: "PDFs in", note: "customer RFQs, POs · supplier quotes" },
  { icon: "▤", name: "Product catalog", note: "what's in stock, what it costs" },
  { icon: "$", name: "AR ledger", note: "who owes what, how long" },
  { icon: "⛓", name: "Supplier history", note: "lead times, prior quotes" },
];

const STEPS = [
  { name: "Read it", note: "any format, any channel" },
  { name: "Pull out the details", note: "product, qty, customer, urgency" },
  { name: "Check inventory", note: "in stock vs. special order" },
  { name: "Check the money", note: "AR aging, credit, risk" },
  { name: "Find suppliers", note: "when special order is needed" },
  { name: "Write the reply", note: "quote, follow-up, supplier RFQ" },
  { name: "Ask the right person", note: "Sales Assistant, AR, or Purchasing" },
];

const SURFACES = [
  { icon: "✉", name: "Reply drafts in your inbox", note: "ready to send when you click" },
  { icon: "✓", name: "Approval buttons", note: "one click per decision" },
  { icon: "▤", name: "Procurement record", note: "case file, audit trail" },
  { icon: "📊", name: "Your numbers, daily", note: "cycle time, $ saved, $ at risk" },
  { icon: "↑", name: "PDFs out", note: "quotes, POs, supplier orders" },
  { icon: "👥", name: "Customers & suppliers", note: "only after a human approves" },
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
            AI sits between your information and your team. Nothing gets replaced — everything gets connected.
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mt-5 items-stretch">
          <Column
            title="What comes in"
            label="The information"
            colSpan={4}
            tone="info"
            items={SOURCES.map((s) => ({ label: s.name, sub: s.note, icon: s.icon }))}
          />
          <ArrowCol direction="→" />
          <Column
            title="What AI does"
            label="The work"
            colSpan={3}
            tone="brand"
            items={STEPS.map((s) => ({ label: s.name, sub: s.note }))}
          />
          <ArrowCol direction="→" />
          <Column
            title="What you see"
            label="The results"
            colSpan={4}
            tone="ok"
            items={SURFACES.map((s) => ({ label: s.name, sub: s.note, icon: s.icon }))}
          />
        </div>
        <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-3 text-[12px]">
          <Note color="info" body="The information stays where it already is — your inbox, your records, your portal. AI reads it." />
          <Note color="brand" body="One brain, one case file, one audit trail. Same MWI-0703-02 process — every step done faster." />
          <Note color="ok" body="People approve every reply, every quote, every order. Nothing goes out without a human green button." />
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
