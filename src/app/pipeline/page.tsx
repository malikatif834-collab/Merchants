"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Card, CardHeader, Pill } from "@/components/Card";
import { StageBadge } from "@/components/StageBadge";
import { PIPELINE } from "@/lib/data";
import { ageLabel, money } from "@/lib/format";
import { STAGE_LABEL, STAGE_ORDER, type DealStage } from "@/lib/types";

export default function PipelinePage() {
  const [stageFilter, setStageFilter] = useState<DealStage | "all">("all");
  const [search, setSearch] = useState("");
  const [showRiskOnly, setShowRiskOnly] = useState(false);

  const filtered = useMemo(() => {
    return PIPELINE.filter((d) => {
      if (stageFilter !== "all" && d.stage !== stageFilter) return false;
      if (showRiskOnly && !d.atRisk) return false;
      if (
        search &&
        !d.customer.toLowerCase().includes(search.toLowerCase()) &&
        !d.description.toLowerCase().includes(search.toLowerCase())
      )
        return false;
      return true;
    }).sort((a, b) => b.value - a.value);
  }, [stageFilter, search, showRiskOnly]);

  const totalValue = filtered.reduce((acc, d) => acc + d.value, 0);
  const atRiskValue = filtered.filter((d) => d.atRisk).reduce((a, d) => a + d.value, 0);

  return (
    <div className="mx-auto max-w-[1400px] px-6 py-8 space-y-6">
      <div>
        <h1 className="text-[28px] font-semibold text-white tracking-tight">Pipeline</h1>
        <p className="text-[13px] text-[var(--brand-muted)]">
          Every special order in flight. Filter, search, drill into the case file.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Stat label="Deals in flight" value={String(filtered.length)} />
        <Stat label="Total value" value={money(totalValue)} />
        <Stat label="At risk" value={money(atRiskValue)} tone="warn" />
        <Stat
          label="AI active"
          value={String(filtered.filter((d) => d.aiActive).length)}
          tone="brand"
        />
      </div>

      <Card>
        <div className="p-4 border-b border-[var(--brand-line)] flex flex-wrap gap-3 items-center">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search customer or description…"
            className="flex-1 min-w-[200px] bg-[var(--brand-ink)] border border-[var(--brand-line)] rounded-md px-3 py-2 text-[13px] text-white placeholder:text-[var(--brand-muted)]"
          />
          <select
            value={stageFilter}
            onChange={(e) => setStageFilter(e.target.value as DealStage | "all")}
            className="bg-[var(--brand-ink)] border border-[var(--brand-line)] rounded-md px-3 py-2 text-[13px] text-white"
          >
            <option value="all">All stages</option>
            {STAGE_ORDER.map((s) => (
              <option key={s} value={s}>
                {STAGE_LABEL[s]}
              </option>
            ))}
          </select>
          <label className="flex items-center gap-2 text-[13px] text-white px-3 py-2 rounded-md border border-[var(--brand-line)] cursor-pointer hover:bg-[var(--brand-charcoal-2)]">
            <input
              type="checkbox"
              checked={showRiskOnly}
              onChange={(e) => setShowRiskOnly(e.target.checked)}
              className="accent-[var(--brand-orange)]"
            />
            At risk only
          </label>
        </div>

        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-[13px]">
            <thead className="text-[11px] uppercase tracking-wider text-[var(--brand-muted)] border-b border-[var(--brand-line)]">
              <tr>
                <th className="text-left px-5 py-2.5 font-medium">PR #</th>
                <th className="text-left px-2 py-2.5 font-medium">Customer</th>
                <th className="text-left px-2 py-2.5 font-medium">Description</th>
                <th className="text-left px-2 py-2.5 font-medium">Rep</th>
                <th className="text-left px-2 py-2.5 font-medium">Stage</th>
                <th className="text-right px-2 py-2.5 font-medium">Value</th>
                <th className="text-right px-2 py-2.5 font-medium">Margin</th>
                <th className="text-right px-2 py-2.5 font-medium">Age</th>
                <th className="text-left px-5 py-2.5 font-medium">Flags</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((d) => (
                <tr
                  key={d.id}
                  className="border-b border-[var(--brand-line)]/40 last:border-0 hover:bg-[var(--brand-charcoal-2)]/60"
                >
                  <td className="px-5 py-2.5">
                    <Link href={`/case/${d.id}`} className="font-mono text-[12px] text-[var(--brand-orange)] hover:underline">
                      {d.procurementNo}
                    </Link>
                  </td>
                  <td className="px-2 py-2.5 text-white">{d.customer}</td>
                  <td className="px-2 py-2.5 text-[var(--brand-muted)]">{d.description}</td>
                  <td className="px-2 py-2.5 text-[var(--brand-muted)]">{d.rep}</td>
                  <td className="px-2 py-2.5"><StageBadge stage={d.stage} /></td>
                  <td className="px-2 py-2.5 text-right text-white tabular-nums">{money(d.value)}</td>
                  <td className="px-2 py-2.5 text-right text-[var(--brand-muted)] tabular-nums">{d.marginPct.toFixed(1)}%</td>
                  <td className="px-2 py-2.5 text-right text-[var(--brand-muted)] tabular-nums">{ageLabel(d.ageHours)}</td>
                  <td className="px-5 py-2.5">
                    <div className="flex gap-1.5">
                      {d.atRisk && <Pill tone="warn">at risk</Pill>}
                      {d.aiActive && <Pill tone="brand">AI</Pill>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="p-10 text-center text-[var(--brand-muted)] text-[13px]">No deals match your filters.</div>
          )}
        </div>
      </Card>
    </div>
  );
}

function Stat({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: string;
  tone?: "default" | "warn" | "brand";
}) {
  const colors = {
    default: "text-white",
    warn: "text-[var(--brand-amber)]",
    brand: "text-[var(--brand-orange)]",
  };
  return (
    <Card className="p-4">
      <div className="text-[10px] uppercase tracking-wider text-[var(--brand-muted)]">{label}</div>
      <div className={`text-[22px] font-semibold tabular-nums ${colors[tone]}`}>{value}</div>
    </Card>
  );
}
