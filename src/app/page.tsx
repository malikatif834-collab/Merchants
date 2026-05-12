import Link from "next/link";
import { Card, CardHeader, Pill } from "@/components/Card";
import { StageBadge } from "@/components/StageBadge";
import { Sparkbar } from "@/components/Sparkbar";
import { AIWorkingNow } from "@/components/AIWorkingNow";
import {
  CASE_FILES,
  KPIS,
  PIPELINE,
  RECENT_ACTIVITY,
  pipelineByStage,
} from "@/lib/data";
import { ageLabel, money, num, relativeTime } from "@/lib/format";
import { STAGE_LABEL, STAGE_ORDER, type DealStage } from "@/lib/types";

export default function Dashboard() {
  const stageMap = pipelineByStage();
  const atRisk = PIPELINE.filter((d) => d.atRisk);
  const cycleTimeDelta =
    ((KPIS.cycleTimeNow - KPIS.cycleTimeBefore) / KPIS.cycleTimeBefore) * 100;

  return (
    <div className="mx-auto max-w-[1400px] px-6 py-8 space-y-8">
      <Hero />
      <AIWorkingNow />
      <KpiStrip cycleDelta={cycleTimeDelta} />

      <div className="grid grid-cols-12 gap-6">
        <section className="col-span-12 lg:col-span-8 space-y-6">
          <ScenarioGallery />
          <FunnelCard stageMap={stageMap} />
          <PipelineTable />
        </section>

        <aside className="col-span-12 lg:col-span-4 space-y-6">
          <AtRiskPanel deals={atRisk} />
          <ActivityFeed />
          <HumanInLoopPanel />
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
      <div className="relative p-8 lg:p-10 max-w-[820px]">
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <Pill tone="brand">For Carol &middot; President</Pill>
          <Pill tone="info">Prototype &middot; live data simulated</Pill>
        </div>
        <h1 className="text-[34px] lg:text-[42px] leading-[1.05] font-semibold text-white tracking-tight">
          Your procurement process,
          <br />
          <span className="text-[var(--brand-orange)]">supervised by AI.</span>
        </h1>
        <p className="mt-4 text-[15px] text-[var(--brand-muted)] max-w-[640px]">
          Every special order in the MWI-0703-02 workflow, watched in real time.
          AI drafts, recommends, and flags. Your team approves. Nothing reaches
          a customer or supplier without a human signing off.
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Link
            href="/demo"
            className="inline-flex items-center gap-2 bg-[var(--brand-orange)] hover:bg-[var(--brand-orange-600)] text-[var(--brand-ink)] font-semibold px-4 py-2.5 rounded-lg text-sm transition-colors"
          >
            ▶ Run the AI live
          </Link>
          <Link
            href="/case/case-001"
            className="inline-flex items-center gap-2 border border-[var(--brand-line)] hover:bg-[var(--brand-charcoal-2)] text-white px-4 py-2.5 rounded-lg text-sm transition-colors"
          >
            Walk through a case file →
          </Link>
          <Link
            href="/about"
            className="inline-flex items-center gap-2 text-[var(--brand-muted)] hover:text-white px-2 py-2.5 text-sm transition-colors"
          >
            How it works →
          </Link>
        </div>
      </div>
    </div>
  );
}

function KpiStrip({ cycleDelta }: { cycleDelta: number }) {
  const items = [
    {
      label: "Special-order cycle time",
      value: `${KPIS.cycleTimeNow}d`,
      sub: `was ${KPIS.cycleTimeBefore}d`,
      delta: `${Math.round(cycleDelta)}%`,
      good: true,
      spark: [6.2, 5.9, 5.4, 4.6, 3.8, 2.9, 2.3, 1.8],
    },
    {
      label: "Margin recovered (stock catches)",
      value: money(KPIS.stockRecovered, { compact: true }),
      sub: `${KPIS.stockRecoveredCount} would-be special orders this month`,
      delta: "+$34K",
      good: true,
      spark: [2, 3, 4, 5, 7, 9, 11, 14],
    },
    {
      label: "AR exposure caught early",
      value: money(KPIS.arExposureCaught, { compact: true }),
      sub: "before sales effort was spent",
      delta: "5 deals",
      good: true,
      spark: [1, 2, 1, 3, 4, 3, 5, 6],
    },
    {
      label: "Team hours redirected",
      value: `${KPIS.hoursSaved}h`,
      sub: "this week, away from data entry",
      delta: "+31.5h",
      good: true,
      spark: [4, 8, 12, 16, 20, 24, 28, 31],
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {items.map((k, i) => (
        <Card key={i} className="p-5 fade-in-up">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="text-[11px] uppercase tracking-wider text-[var(--brand-muted)]">
                {k.label}
              </div>
              <div className="mt-1 text-[28px] font-semibold text-white leading-none">
                {k.value}
              </div>
              <div className="mt-1.5 text-[12px] text-[var(--brand-muted)]">{k.sub}</div>
            </div>
            <Sparkbar values={k.spark} />
          </div>
          <div className="mt-3 flex items-center gap-2">
            <Pill tone={k.good ? "ok" : "danger"}>
              {k.good ? "▲" : "▼"} {k.delta}
            </Pill>
            <span className="text-[11px] text-[var(--brand-muted)]">vs. pre-AI baseline</span>
          </div>
        </Card>
      ))}
    </div>
  );
}

function ScenarioGallery() {
  return (
    <Card>
      <CardHeader
        title="The four AI plays, live right now"
        subtitle="Click any to walk through the case file end-to-end"
        right={<Pill tone="brand">{CASE_FILES.length} active</Pill>}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-4">
        {CASE_FILES.map((c) => (
          <Link
            key={c.id}
            href={`/case/${c.id}`}
            className="group relative rounded-lg border border-[var(--brand-line)] hover:border-[var(--brand-orange)]/60 bg-[var(--brand-charcoal-2)] hover:bg-[var(--brand-charcoal-3)] transition-all p-4 block"
          >
            <div className="flex items-start justify-between gap-3 mb-2 flex-wrap">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] uppercase tracking-[0.16em] text-[var(--brand-orange)] font-semibold">
                  {c.scenarioLabel}
                </span>
                {c.flags?.length ? <Pill tone="warn">{c.flags[0]}</Pill> : null}
              </div>
              <StageBadge stage={c.stage} />
            </div>
            <div className="text-[15px] font-semibold text-white leading-snug mb-1">
              {c.title}
            </div>
            <div className="text-[12px] text-[var(--brand-muted)] mb-3 line-clamp-2">
              {c.scenarioBlurb}
            </div>
            <div className="grid grid-cols-3 gap-2 text-[11px]">
              <Stat label="Customer" value={c.customer.name.split(" — ")[0]} />
              <Stat label="Value" value={money(c.estValue, { compact: true })} />
              <Stat label="AI pending" value={`${c.recommendations.filter((r) => r.status === "pending").length}`} />
            </div>
            <div className="absolute right-3 bottom-3 text-[var(--brand-muted)] group-hover:text-[var(--brand-orange)] transition-colors">
              →
            </div>
          </Link>
        ))}
      </div>
    </Card>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-[var(--brand-ink)]/60 rounded-md px-2 py-1.5 border border-[var(--brand-line)]/60">
      <div className="text-[9px] uppercase tracking-wider text-[var(--brand-muted)]">{label}</div>
      <div className="text-[12px] text-white font-medium truncate">{value}</div>
    </div>
  );
}

function FunnelCard({
  stageMap,
}: {
  stageMap: Record<string, { count: number; value: number }>;
}) {
  const totalValue = STAGE_ORDER.reduce(
    (acc, s) => acc + (stageMap[s]?.value || 0),
    0
  );
  const maxCount = Math.max(
    ...STAGE_ORDER.map((s) => stageMap[s]?.count || 0),
    1
  );

  return (
    <Card>
      <CardHeader
        title="Special-order pipeline"
        subtitle={`${PIPELINE.length} deals in flight · ${money(totalValue)} total value`}
        right={<Pill tone="info">Live</Pill>}
      />
      <div className="p-5 space-y-2">
        {STAGE_ORDER.filter((s) => stageMap[s]).map((s) => {
          const cell = stageMap[s];
          const w = (cell.count / maxCount) * 100;
          return (
            <div key={s} className="flex items-center gap-4">
              <div className="w-44 shrink-0 text-[13px] text-[var(--brand-muted)]">
                {STAGE_LABEL[s as DealStage]}
              </div>
              <div className="flex-1 h-7 bg-[var(--brand-ink)] rounded-md overflow-hidden border border-[var(--brand-line)]/60 relative">
                <div
                  className="h-full bg-gradient-to-r from-[var(--brand-orange)]/85 to-[var(--brand-orange)]/35 transition-all"
                  style={{ width: `${w}%` }}
                />
                <div className="absolute inset-0 flex items-center px-3 text-[11px] text-white/95">
                  {cell.count} deal{cell.count !== 1 ? "s" : ""} &middot; {money(cell.value, { compact: true })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

function PipelineTable() {
  const sorted = [...PIPELINE].sort((a, b) => b.value - a.value).slice(0, 8);
  return (
    <Card>
      <CardHeader
        title="Top deals by value"
        subtitle="Live pipeline, sorted by deal size"
        right={
          <Link href="/pipeline" className="text-[12px] text-[var(--brand-orange)] hover:underline">
            See all →
          </Link>
        }
      />
      <div className="overflow-x-auto scrollbar-thin">
        <table className="w-full text-[13px]">
          <thead className="text-[11px] uppercase tracking-wider text-[var(--brand-muted)] border-b border-[var(--brand-line)]">
            <tr>
              <th className="text-left px-5 py-2 font-medium">PR #</th>
              <th className="text-left px-2 py-2 font-medium">Customer</th>
              <th className="text-left px-2 py-2 font-medium">Description</th>
              <th className="text-left px-2 py-2 font-medium">Stage</th>
              <th className="text-right px-2 py-2 font-medium">Value</th>
              <th className="text-right px-2 py-2 font-medium">Margin</th>
              <th className="text-right px-5 py-2 font-medium">Age</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((d) => (
              <tr key={d.id} className="border-b border-[var(--brand-line)]/40 last:border-0 hover:bg-[var(--brand-charcoal-2)]/60">
                <td className="px-5 py-2.5">
                  <Link href={`/case/${d.id}`} className="font-mono text-[12px] text-[var(--brand-orange)] hover:underline">
                    {d.procurementNo}
                  </Link>
                </td>
                <td className="px-2 py-2.5 text-white">{d.customer}</td>
                <td className="px-2 py-2.5 text-[var(--brand-muted)]">{d.description}</td>
                <td className="px-2 py-2.5"><StageBadge stage={d.stage} /></td>
                <td className="px-2 py-2.5 text-right text-white tabular-nums">{money(d.value)}</td>
                <td className="px-2 py-2.5 text-right text-[var(--brand-muted)] tabular-nums">{d.marginPct.toFixed(1)}%</td>
                <td className="px-5 py-2.5 text-right text-[var(--brand-muted)] tabular-nums">{ageLabel(d.ageHours)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

function AtRiskPanel({ deals }: { deals: typeof PIPELINE }) {
  return (
    <Card>
      <CardHeader
        title="Deals at risk"
        subtitle="AI is watching, awaiting your call"
        right={<Pill tone="warn">{deals.length}</Pill>}
      />
      <div className="divide-y divide-[var(--brand-line)]/60">
        {deals.map((d) => (
          <Link
            key={d.id}
            href={`/case/${d.id}`}
            className="block p-4 hover:bg-[var(--brand-charcoal-2)]/60 transition-colors"
          >
            <div className="flex items-start justify-between gap-2 mb-1">
              <div className="text-[13px] font-medium text-white leading-tight">{d.customer}</div>
              <div className="text-[12px] text-white tabular-nums">{money(d.value, { compact: true })}</div>
            </div>
            <div className="text-[12px] text-[var(--brand-muted)] mb-1.5 line-clamp-1">{d.description}</div>
            <div className="flex items-center gap-2">
              <Pill tone="warn">⚠ {d.riskReason}</Pill>
            </div>
          </Link>
        ))}
      </div>
    </Card>
  );
}

function ActivityFeed() {
  return (
    <Card>
      <CardHeader title="AI agent activity" subtitle="Last 8 hours" />
      <ul className="divide-y divide-[var(--brand-line)]/60 max-h-[360px] overflow-auto scrollbar-thin">
        {RECENT_ACTIVITY.map((a, i) => (
          <li key={i} className="p-3.5 flex items-start gap-3">
            <span
              className={`mt-1 h-1.5 w-1.5 rounded-full shrink-0 ${
                a.tone === "warn"
                  ? "bg-[var(--brand-amber)]"
                  : a.tone === "ok"
                    ? "bg-[var(--brand-green)]"
                    : "bg-[var(--brand-orange)]"
              }`}
            />
            <div className="min-w-0 flex-1">
              <div className="text-[12px] text-[var(--brand-muted)] flex items-center gap-1.5">
                <span className="text-white/80 font-medium">{a.actor}</span>
                <span>·</span>
                <span>{relativeTime(a.at)}</span>
              </div>
              <div className="text-[13px] text-white leading-snug mt-0.5">
                {a.caseId ? (
                  <Link href={`/case/${a.caseId}`} className="hover:text-[var(--brand-orange)]">
                    {a.action}
                  </Link>
                ) : (
                  a.action
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}

function HumanInLoopPanel() {
  return (
    <Card className="border-[var(--brand-orange)]/40">
      <div className="p-5">
        <div className="flex items-center gap-2 mb-2">
          <span className="h-2 w-2 rounded-full bg-[var(--brand-orange)] pulse-orange" />
          <div className="text-[11px] uppercase tracking-wider text-[var(--brand-orange)] font-semibold">
            Human-in-loop
          </div>
        </div>
        <div className="text-[14px] text-white font-medium mb-1">
          You are always the final approver.
        </div>
        <p className="text-[12px] text-[var(--brand-muted)] leading-relaxed">
          AI extracts, drafts, scores, and recommends. Every action that touches a
          customer or supplier waits for a green button from your team.
        </p>
        <div className="grid grid-cols-3 gap-2 mt-4">
          <Mini label="Approved" value="47" tone="ok" />
          <Mini label="Edited" value="11" tone="warn" />
          <Mini label="Rejected" value="4" tone="danger" />
        </div>
        <div className="mt-3 text-[10px] text-[var(--brand-muted)]">
          last 7 days · {num(47 + 11 + 4)} AI recommendations
        </div>
      </div>
    </Card>
  );
}

function Mini({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone: "ok" | "warn" | "danger";
}) {
  const colors = {
    ok: "text-[var(--brand-green)]",
    warn: "text-[var(--brand-amber)]",
    danger: "text-[var(--brand-red)]",
  };
  return (
    <div className="rounded-md bg-[var(--brand-ink)] border border-[var(--brand-line)]/60 p-2">
      <div className={`text-[18px] font-semibold tabular-nums ${colors[tone]}`}>
        {value}
      </div>
      <div className="text-[10px] uppercase tracking-wider text-[var(--brand-muted)]">
        {label}
      </div>
    </div>
  );
}
