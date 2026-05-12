import Link from "next/link";
import { Card, CardHeader, Pill } from "@/components/Card";
import { StageBadge } from "@/components/StageBadge";
import { AIWorkingNow } from "@/components/AIWorkingNow";
import { LiveAIPanel } from "@/components/LiveAIPanel";
import { SetupBanner } from "@/components/SetupBanner";
import {
  CASE_FILES,
  KPIS,
  PHASE_ORDER,
  PIPELINE,
  pendingApprovals,
  pipelineByPhase,
  recentlyClosed,
  revenueBookedThisMonth,
} from "@/lib/data";
import { ageLabel, money } from "@/lib/format";
import { PHASE_LABEL, phaseFor } from "@/lib/types";

export default function HomePage() {
  const phases = pipelineByPhase();
  const closed = recentlyClosed();
  const revenue = revenueBookedThisMonth();
  const queue = pendingApprovals();
  const atRisk = PIPELINE.filter((d) => d.atRisk);

  return (
    <div className="mx-auto max-w-[1400px] px-6 py-7 space-y-7">
      <Hero />
      <SetupBanner />
      <AIWorkingNow />
      <KpiStrip revenue={revenue} />
      <LifecycleBoard phases={phases} />
      <LiveAIPanel compact />

      <div className="grid grid-cols-12 gap-6">
        <section className="col-span-12 lg:col-span-7 space-y-6">
          <ApprovalQueue queue={queue} />
        </section>

        <aside className="col-span-12 lg:col-span-5 space-y-6">
          <ActiveDeals />
          {atRisk.length > 0 && <AtRiskPanel deals={atRisk} />}
          <RecentlyClosed deals={closed} totalRevenue={revenue} />
        </aside>
      </div>
    </div>
  );
}

function Hero() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-[var(--brand-line)] bg-gradient-to-br from-[var(--brand-charcoal)] to-[var(--brand-ink)]">
      <div
        className="absolute right-0 top-0 h-full w-1/3 opacity-90 pointer-events-none"
        style={{
          background:
            "linear-gradient(105deg, transparent 0%, transparent 24%, var(--brand-orange) 24.2%, var(--brand-orange) 100%)",
        }}
      />
      <div className="relative p-7 lg:p-9 max-w-[820px]">
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <Pill tone="brand">For Carol &middot; President</Pill>
        </div>
        <h1 className="text-[30px] lg:text-[36px] leading-[1.1] font-semibold text-white tracking-tight">
          Your procurement, end to end.<br />
          <span className="text-[var(--brand-orange)]">One screen. Supervised by AI.</span>
        </h1>
        <p className="mt-3 text-[14px] text-[var(--brand-muted)] max-w-[640px]">
          Every special-order request — emails, phone calls, walk-ups, PDFs — flows through here.
          AI reads it, drafts the reply, talks to suppliers, tracks the order through fulfillment,
          and books the revenue. Your team approves every move. Nothing slips.
        </p>
      </div>
    </div>
  );
}

function KpiStrip({ revenue }: { revenue: number }) {
  const items = [
    {
      label: "Revenue booked this month",
      value: money(revenue, { compact: true }),
      sub: `${recentlyClosed().length} deals · paid / fulfilled`,
      tone: "ok" as const,
    },
    {
      label: "Cycle time",
      value: `${KPIS.cycleTimeNow}d`,
      sub: `down from ${KPIS.cycleTimeBefore}d before AI`,
      tone: "brand" as const,
    },
    {
      label: "Margin recovered (stock catches)",
      value: money(KPIS.stockRecovered, { compact: true }),
      sub: `${KPIS.stockRecoveredCount} would-be special orders this month`,
      tone: "ok" as const,
    },
    {
      label: "AR exposure caught",
      value: money(KPIS.arExposureCaught, { compact: true }),
      sub: "before sales spent time quoting",
      tone: "warn" as const,
    },
  ];
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {items.map((k, i) => (
        <Card key={i} className="p-4 fade-in-up">
          <div className="text-[10.5px] uppercase tracking-wider text-[var(--brand-muted)]">
            {k.label}
          </div>
          <div
            className={`mt-1 text-[26px] font-semibold tabular-nums leading-none ${
              k.tone === "ok"
                ? "text-[var(--brand-green)]"
                : k.tone === "warn"
                  ? "text-[var(--brand-amber)]"
                  : "text-[var(--brand-orange)]"
            }`}
          >
            {k.value}
          </div>
          <div className="mt-1.5 text-[11.5px] text-[var(--brand-muted)]">
            {k.sub}
          </div>
        </Card>
      ))}
    </div>
  );
}

function LifecycleBoard({
  phases,
}: {
  phases: ReturnType<typeof pipelineByPhase>;
}) {
  return (
    <Card>
      <CardHeader
        title="The whole procurement lifecycle, live"
        subtitle="From customer ask → supplier negotiation → order placed → shipped → invoiced → paid"
        right={<Pill tone="brand">{PIPELINE.length} deals in flight</Pill>}
      />
      <div className="p-4 overflow-x-auto scrollbar-thin">
        <div className="grid grid-cols-6 gap-2 min-w-[760px]">
          {PHASE_ORDER.map((p, i) => {
            const cell = phases[p];
            const phaseDeals = PIPELINE.filter((d) => phaseFor(d.stage) === p);
            const isRevenue = p === "revenue";
            return (
              <div
                key={p}
                className={`rounded-lg border ${
                  isRevenue
                    ? "border-[var(--brand-green)]/40 bg-[var(--brand-green)]/5"
                    : "border-[var(--brand-line)] bg-[var(--brand-charcoal-2)]"
                } p-3 flex flex-col`}
              >
                <div className="flex items-center justify-between gap-1 mb-2">
                  <span className="text-[9.5px] uppercase tracking-wider text-[var(--brand-muted)] font-semibold">
                    {i + 1}
                  </span>
                  {i < PHASE_ORDER.length - 1 && (
                    <span className="text-[var(--brand-muted)]/60 text-[10px]">→</span>
                  )}
                </div>
                <div
                  className={`text-[12px] font-semibold leading-tight ${
                    isRevenue ? "text-[var(--brand-green)]" : "text-white"
                  }`}
                >
                  {PHASE_LABEL[p]}
                </div>
                <div className="mt-2 flex items-baseline gap-1.5">
                  <span className="text-[20px] font-semibold tabular-nums text-white">
                    {cell.count}
                  </span>
                  <span className="text-[10px] text-[var(--brand-muted)]">deals</span>
                </div>
                <div
                  className={`text-[11px] tabular-nums mt-0.5 ${
                    isRevenue ? "text-[var(--brand-green)]" : "text-[var(--brand-muted)]"
                  }`}
                >
                  {money(cell.value, { compact: true })}
                </div>
                <div className="mt-2 pt-2 border-t border-[var(--brand-line)]/60 space-y-1">
                  {phaseDeals.slice(0, 3).map((d) => (
                    <Link
                      key={d.id}
                      href={`/case/${d.id}`}
                      className="block text-[10.5px] text-[var(--brand-muted)] hover:text-white truncate"
                      title={`${d.customer} · ${d.description}`}
                    >
                      · {d.customer.split(" — ")[0]}
                    </Link>
                  ))}
                  {phaseDeals.length > 3 && (
                    <div className="text-[10px] text-[var(--brand-muted)] italic">
                      +{phaseDeals.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}

function ApprovalQueue({
  queue,
}: {
  queue: ReturnType<typeof pendingApprovals>;
}) {
  return (
    <Card>
      <CardHeader
        title="Waiting for your team's approval"
        subtitle="AI did the work. People decide."
        right={<Pill tone="brand">{queue.length} pending</Pill>}
      />
      <div className="divide-y divide-[var(--brand-line)]/60">
        {queue.length === 0 && (
          <div className="p-6 text-center text-[var(--brand-muted)] text-[13px]">
            Nothing waiting. Inbox zero.
          </div>
        )}
        {queue.map(({ rec, c }) => (
          <Link
            key={rec.id}
            href={`/case/${c.id}`}
            className="block p-4 hover:bg-[var(--brand-charcoal-2)]/60 transition-colors"
          >
            <div className="flex items-start justify-between gap-3 mb-1 flex-wrap">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono text-[11px] text-[var(--brand-orange)]">{c.procurementNo}</span>
                <StageBadge stage={c.stage} />
                <RecTypeBadge type={rec.type} />
              </div>
              <div className="text-[11.5px] text-[var(--brand-muted)]">
                {c.customer.name.split(" — ")[0]} · {money(c.estValue, { compact: true })}
              </div>
            </div>
            <div className="text-[13.5px] text-white font-medium leading-snug mb-0.5">
              {rec.title}
            </div>
            <div className="text-[12px] text-[var(--brand-muted)] line-clamp-1">
              {rec.summary}
            </div>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-[11px] text-[var(--brand-muted)]">
                AI {Math.round(rec.confidence * 100)}% confident · awaiting{" "}
                <span className="text-white">human approval</span>
              </span>
            </div>
          </Link>
        ))}
      </div>
    </Card>
  );
}

function RecTypeBadge({ type }: { type: string }) {
  const tone =
    type === "credit_flag" || type === "risk_summary"
      ? "warn"
      : type === "stock_match"
        ? "ok"
        : "info";
  const labels: Record<string, string> = {
    stock_match: "Stock match",
    credit_flag: "AR risk",
    supplier_suggest: "Supplier shortlist",
    rfq_draft: "RFQ draft",
    quote_compare: "Quote comparison",
    quote_draft: "Quote draft",
    follow_up: "Follow-up",
    checklist_extract: "Checklist",
    classification: "Classification",
    risk_summary: "Risk brief",
  };
  return <Pill tone={tone as never}>{labels[type] ?? type}</Pill>;
}

function ActiveDeals() {
  return (
    <Card>
      <CardHeader
        title="Active deals"
        subtitle="Click any to walk through end-to-end"
      />
      <div className="divide-y divide-[var(--brand-line)]/60">
        {CASE_FILES.map((c) => (
          <Link
            key={c.id}
            href={`/case/${c.id}`}
            className="block p-3 hover:bg-[var(--brand-charcoal-2)]/60 transition-colors"
          >
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="text-[10px] uppercase tracking-wider text-[var(--brand-orange)] font-semibold">
                {c.scenarioLabel}
              </span>
              <StageBadge stage={c.stage} />
            </div>
            <div className="text-[13px] text-white font-medium leading-snug">
              {c.customer.name.split(" — ")[0]} · {money(c.estValue, { compact: true })}
            </div>
            <div className="text-[11.5px] text-[var(--brand-muted)] line-clamp-1">
              {c.title}
            </div>
          </Link>
        ))}
      </div>
    </Card>
  );
}

function AtRiskPanel({ deals }: { deals: typeof PIPELINE }) {
  return (
    <Card className="border-[var(--brand-amber)]/30">
      <CardHeader
        title="At risk"
        subtitle="AI flagged these for you"
        right={<Pill tone="warn">{deals.length}</Pill>}
      />
      <div className="divide-y divide-[var(--brand-line)]/60">
        {deals.map((d) => (
          <Link
            key={d.id}
            href={`/case/${d.id}`}
            className="block p-3 hover:bg-[var(--brand-charcoal-2)]/60 transition-colors"
          >
            <div className="flex items-center justify-between gap-2 mb-0.5">
              <span className="text-[13px] text-white font-medium">{d.customer}</span>
              <span className="text-[11.5px] text-white tabular-nums">{money(d.value, { compact: true })}</span>
            </div>
            <div className="text-[11.5px] text-[var(--brand-amber)]">⚠ {d.riskReason}</div>
          </Link>
        ))}
      </div>
    </Card>
  );
}

function RecentlyClosed({
  deals,
  totalRevenue,
}: {
  deals: typeof PIPELINE;
  totalRevenue: number;
}) {
  return (
    <Card className="border-[var(--brand-green)]/30">
      <CardHeader
        title="Recently closed"
        subtitle="Fulfilled + paid"
        right={<Pill tone="ok">{money(totalRevenue, { compact: true })}</Pill>}
      />
      <div className="divide-y divide-[var(--brand-line)]/60">
        {deals.map((d) => (
          <div key={d.id} className="p-3 flex items-center justify-between gap-2">
            <div className="min-w-0">
              <div className="text-[13px] text-white font-medium truncate">
                {d.customer.split(" — ")[0]}
              </div>
              <div className="text-[11px] text-[var(--brand-muted)] truncate">
                {d.description}
              </div>
            </div>
            <div className="text-right shrink-0">
              <div className="text-[13px] text-[var(--brand-green)] tabular-nums font-semibold">
                {money(d.value, { compact: true })}
              </div>
              <div className="text-[10px] text-[var(--brand-muted)]">
                {ageLabel(d.ageHours)} ago
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
