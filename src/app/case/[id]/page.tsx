import { notFound } from "next/navigation";
import Link from "next/link";
import { Card, CardHeader, Pill } from "@/components/Card";
import { StageBadge } from "@/components/StageBadge";
import { WorkflowTrack } from "@/components/WorkflowTrack";
import { RecommendationCard } from "@/components/RecommendationCard";
import { CASE_FILES, getCase } from "@/lib/data";
import { money, relativeTime } from "@/lib/format";

export function generateStaticParams() {
  return CASE_FILES.map((c) => ({ id: c.id }));
}

export default async function CaseFilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const c = getCase(id);
  if (!c) notFound();

  const arTotal =
    c.customer.arAging.current +
    c.customer.arAging.d30 +
    c.customer.arAging.d60 +
    c.customer.arAging.d90;

  return (
    <div className="mx-auto max-w-[1400px] px-6 py-8 space-y-6">
      <div className="flex items-center gap-3 text-[12px] text-[var(--brand-muted)]">
        <Link href="/" className="hover:text-white">← Dashboard</Link>
        <span>/</span>
        <span>Case file</span>
        <span>/</span>
        <span className="text-white font-mono">{c.procurementNo}</span>
      </div>

      <CaseHeader c={c} />

      <div className="grid grid-cols-12 gap-6">
        <section className="col-span-12 lg:col-span-8 space-y-6">
          <InboundCard c={c} />
          <RecommendationsStack c={c} />
        </section>

        <aside className="col-span-12 lg:col-span-4 space-y-6">
          <Card>
            <CardHeader title="Workflow progress" subtitle="Per MWI-0703-02" />
            <div className="p-5">
              <WorkflowTrack stage={c.stage} />
            </div>
          </Card>

          <Card>
            <CardHeader
              title="Customer snapshot"
              subtitle={c.customer.name}
              right={<Pill tone={c.customer.creditRating === "A" ? "ok" : c.customer.creditRating === "C" ? "danger" : "warn"}>Credit {c.customer.creditRating}</Pill>}
            />
            <div className="p-5 space-y-3 text-[13px]">
              <Field label="Contact" value={`${c.customer.contact} · ${c.customer.email}`} />
              <Field label="Type" value={c.customer.type.replace("_", " ")} />
              <Field label="YTD revenue" value={money(c.customer.ytdRevenue)} />
              <Field label="Avg days to pay" value={`${c.customer.avgDaysToPay}d (terms ${c.customer.termsDays}d)`} />
              <div className="pt-2 border-t border-[var(--brand-line)]/60">
                <div className="text-[10px] uppercase tracking-wider text-[var(--brand-muted)] mb-1.5">
                  AR aging
                </div>
                <ARBars aging={c.customer.arAging} total={arTotal} />
              </div>
              <div className="text-[12px] text-[var(--brand-muted)] italic pt-1">
                {c.customer.paymentNotes}
              </div>
            </div>
          </Card>

          <Card>
            <CardHeader title="Audit log" subtitle="Every step, every actor" />
            <ol className="divide-y divide-[var(--brand-line)]/60 max-h-[480px] overflow-auto scrollbar-thin">
              {c.auditLog.map((a, i) => (
                <li key={i} className="p-3.5 flex items-start gap-3">
                  <ActorIcon icon={a.icon} />
                  <div className="min-w-0 flex-1">
                    <div className="text-[11px] text-[var(--brand-muted)] flex items-center gap-1.5">
                      <span className="text-white/80 font-medium">{a.actor}</span>
                      <span>·</span>
                      <span>{relativeTime(a.at)}</span>
                    </div>
                    <div className="text-[13px] text-white leading-snug">{a.action}</div>
                    {a.detail && (
                      <div className="text-[11.5px] text-[var(--brand-muted)] mt-0.5">{a.detail}</div>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </Card>
        </aside>
      </div>
    </div>
  );
}

function CaseHeader({ c }: { c: ReturnType<typeof getCase> & object }) {
  return (
    <Card className="relative overflow-hidden">
      <div
        className="absolute right-0 top-0 h-full w-1/4 opacity-90 pointer-events-none"
        style={{
          background:
            "linear-gradient(105deg, transparent 0%, transparent 30%, var(--brand-orange) 30.2%, var(--brand-orange) 100%)",
        }}
      />
      <div className="relative p-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="font-mono text-[12px] text-[var(--brand-orange)] tracking-wider">{c.procurementNo}</span>
              <span className="text-[var(--brand-muted)]">·</span>
              <span className="text-[10px] uppercase tracking-[0.18em] text-[var(--brand-orange)] font-semibold">{c.scenarioLabel}</span>
              <StageBadge stage={c.stage} />
              {c.flags?.map((f) => (
                <Pill key={f} tone="warn">{f}</Pill>
              ))}
            </div>
            <h1 className="text-[26px] lg:text-[30px] font-semibold text-white leading-tight tracking-tight">
              {c.title}
            </h1>
            <p className="text-[13.5px] text-[var(--brand-muted)] mt-1.5 max-w-[680px]">
              {c.scenarioBlurb}
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3 text-right shrink-0">
            <StatCard label="Customer" value={c.customer.name.split(" — ")[0]} />
            <StatCard label="Value" value={money(c.estValue)} />
            <StatCard label="Margin" value={`${c.estMarginPct.toFixed(1)}%`} sub={money(c.estMargin)} />
          </div>
        </div>
      </div>
    </Card>
  );
}

function StatCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-lg border border-[var(--brand-line)] bg-[var(--brand-ink)]/60 px-4 py-2.5 text-left">
      <div className="text-[10px] uppercase tracking-wider text-[var(--brand-muted)]">{label}</div>
      <div className="text-[16px] font-semibold text-white tabular-nums leading-tight">{value}</div>
      {sub && <div className="text-[11px] text-[var(--brand-muted)] tabular-nums">{sub}</div>}
    </div>
  );
}

function InboundCard({ c }: { c: ReturnType<typeof getCase> & object }) {
  return (
    <Card>
      <CardHeader
        title="What started this"
        subtitle={`Inbound ${c.inbound.channel} from ${c.customer.name}`}
        right={<Pill tone="info">{relativeTime(c.inbound.receivedAt)}</Pill>}
      />
      <div className="p-5">
        <div className="text-[11px] text-[var(--brand-muted)] mb-1">From</div>
        <div className="text-[13.5px] text-white font-medium">{c.inbound.from}</div>
        <div className="text-[11px] text-[var(--brand-muted)] mt-3 mb-1">Subject</div>
        <div className="text-[13.5px] text-white">{c.inbound.subject}</div>
        <div className="text-[11px] text-[var(--brand-muted)] mt-3 mb-1">Body</div>
        <pre className="bg-[var(--brand-ink)] border border-[var(--brand-line)]/60 rounded-md p-3 text-[13px] text-white/90 whitespace-pre-wrap font-sans leading-relaxed">
{c.inbound.body}
        </pre>
      </div>
    </Card>
  );
}

function RecommendationsStack({ c }: { c: ReturnType<typeof getCase> & object }) {
  const pendingCount = c.recommendations.filter((r) => r.status === "pending").length;
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2 px-1">
        <div>
          <div className="text-[18px] font-semibold text-white tracking-tight">
            AI recommendations
          </div>
          <div className="text-[12px] text-[var(--brand-muted)]">
            {c.recommendations.length} suggestions · {pendingCount} awaiting your approval
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Pill tone="brand">Human-in-loop</Pill>
        </div>
      </div>
      {c.recommendations.map((rec) => (
        <RecommendationCard key={rec.id} rec={rec} />
      ))}
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <span className="text-[11px] uppercase tracking-wider text-[var(--brand-muted)]">{label}</span>
      <span className="text-[13px] text-white text-right capitalize">{value}</span>
    </div>
  );
}

function ARBars({
  aging,
  total,
}: {
  aging: { current: number; d30: number; d60: number; d90: number };
  total: number;
}) {
  const segs: Array<[string, number, string]> = [
    ["Current", aging.current, "var(--brand-green)"],
    ["30d", aging.d30, "var(--brand-amber)"],
    ["60d", aging.d60, "#E07A2C"],
    ["90d+", aging.d90, "var(--brand-red)"],
  ];
  return (
    <div>
      <div className="flex h-2.5 rounded-full overflow-hidden bg-[var(--brand-ink)] border border-[var(--brand-line)]/60">
        {segs.map(([label, v, color], i) => (
          <div
            key={i}
            style={{ width: `${total > 0 ? (v / total) * 100 : 0}%`, background: color }}
            title={`${label}: ${money(v)}`}
          />
        ))}
      </div>
      <div className="grid grid-cols-4 gap-2 mt-2 text-[11px]">
        {segs.map(([label, v, color], i) => (
          <div key={i}>
            <div className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: color }} />
              <span className="text-[var(--brand-muted)]">{label}</span>
            </div>
            <div className="text-white tabular-nums">{money(v, { compact: true })}</div>
          </div>
        ))}
      </div>
      <div className="mt-2 text-[11px] text-[var(--brand-muted)]">
        Total AR: <span className="text-white font-medium">{money(total)}</span>
      </div>
    </div>
  );
}

function ActorIcon({ icon }: { icon?: string }) {
  const map: Record<string, { bg: string; ch: string; fg: string }> = {
    ai: { bg: "bg-[var(--brand-orange)]/15", ch: "AI", fg: "text-[var(--brand-orange)]" },
    human: { bg: "bg-white/10", ch: "H", fg: "text-white" },
    approve: { bg: "bg-[var(--brand-green)]/15", ch: "✓", fg: "text-[var(--brand-green)]" },
    reject: { bg: "bg-[var(--brand-red)]/15", ch: "✕", fg: "text-[var(--brand-red)]" },
    email: { bg: "bg-white/5", ch: "✉", fg: "text-white/70" },
    system: { bg: "bg-white/5", ch: "⚙", fg: "text-white/60" },
  };
  const cfg = map[icon ?? "system"] ?? map.system;
  return (
    <div className={`mt-0.5 h-6 w-6 shrink-0 rounded-md flex items-center justify-center text-[11px] font-semibold ${cfg.bg} ${cfg.fg}`}>
      {cfg.ch}
    </div>
  );
}
