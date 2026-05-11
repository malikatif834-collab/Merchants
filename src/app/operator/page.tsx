"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardHeader, Pill } from "@/components/Card";
import { StageBadge } from "@/components/StageBadge";
import { CASE_FILES } from "@/lib/data";
import { money, relativeTime } from "@/lib/format";

type Lane = "sales_assistant" | "ar" | "purchasing";

const LANE_LABEL: Record<Lane, string> = {
  sales_assistant: "Sales Assistant",
  ar: "Accounts Receivable",
  purchasing: "Purchasing",
};

const LANE_BLURB: Record<Lane, string> = {
  sales_assistant:
    "Inbound inquiries land here. AI extracts the checklist; you verify and approve.",
  ar: "Credit reviews. AI prepares the AR brief; you sign off the call.",
  purchasing: "Sourcing and quoting. AI shortlists suppliers, drafts RFQs, parses quotes.",
};

const LANE_FILTERS: Record<Lane, (rec: { type: string }) => boolean> = {
  sales_assistant: (r) =>
    r.type === "checklist_extract" || r.type === "classification" || r.type === "follow_up" || r.type === "quote_draft",
  ar: (r) => r.type === "credit_flag" || r.type === "risk_summary",
  purchasing: (r) =>
    r.type === "supplier_suggest" || r.type === "rfq_draft" || r.type === "quote_compare" || r.type === "stock_match",
};

export default function OperatorPage() {
  const [lane, setLane] = useState<Lane>("sales_assistant");

  const items = CASE_FILES.flatMap((c) =>
    c.recommendations.filter(LANE_FILTERS[lane]).map((r) => ({ rec: r, c }))
  );
  const pending = items.filter((i) => i.rec.status === "pending");
  const done = items.filter((i) => i.rec.status !== "pending");

  return (
    <div className="mx-auto max-w-[1400px] px-6 py-8 space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-[28px] font-semibold text-white tracking-tight">Operator view</h1>
          <p className="text-[13px] text-[var(--brand-muted)]">
            What your team sees in their workday. AI surfaces what needs them; nothing else.
          </p>
        </div>
        <div className="inline-flex rounded-lg border border-[var(--brand-line)] bg-[var(--brand-charcoal)] p-1">
          {(Object.keys(LANE_LABEL) as Lane[]).map((l) => (
            <button
              key={l}
              onClick={() => setLane(l)}
              className={`px-3.5 py-1.5 rounded-md text-[12.5px] font-medium transition-colors ${
                lane === l
                  ? "bg-[var(--brand-orange)] text-[var(--brand-ink)]"
                  : "text-[var(--brand-muted)] hover:text-white"
              }`}
            >
              {LANE_LABEL[l]}
            </button>
          ))}
        </div>
      </div>

      <Card className="bg-[var(--brand-charcoal-2)] border-[var(--brand-orange)]/30">
        <div className="p-4 flex items-start gap-3">
          <div className="h-8 w-8 rounded-lg bg-[var(--brand-orange)]/15 border border-[var(--brand-orange)]/30 flex items-center justify-center text-[var(--brand-orange)] font-semibold text-[13px]">
            AI
          </div>
          <div>
            <div className="text-[14px] text-white font-medium">{LANE_LABEL[lane]} workday</div>
            <div className="text-[12.5px] text-[var(--brand-muted)] mt-0.5">{LANE_BLURB[lane]}</div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-12 gap-6">
        <section className="col-span-12 lg:col-span-8 space-y-4">
          <SectionHead title="Awaiting you" count={pending.length} />
          {pending.length === 0 && (
            <Card className="p-6 text-center text-[var(--brand-muted)] text-[13px]">
              Nothing waiting. AI is quiet.
            </Card>
          )}
          {pending.map(({ rec, c }) => (
            <Card key={rec.id} className="border-[var(--brand-orange)]/40">
              <div className="p-5">
                <div className="flex items-start justify-between gap-3 mb-2 flex-wrap">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-[11px] text-[var(--brand-orange)]">{c.procurementNo}</span>
                    <Pill tone="brand">awaiting approval</Pill>
                    <StageBadge stage={c.stage} />
                  </div>
                  <div className="text-[11px] text-[var(--brand-muted)]">
                    {c.customer.name} · {money(c.estValue, { compact: true })}
                  </div>
                </div>
                <div className="text-[15px] font-semibold text-white mb-1">{rec.title}</div>
                <p className="text-[13px] text-[var(--brand-muted)] mb-3">{rec.summary}</p>
                <Link
                  href={`/case/${c.id}`}
                  className="inline-flex items-center gap-1.5 bg-[var(--brand-orange)] hover:bg-[var(--brand-orange-600)] text-[var(--brand-ink)] font-semibold px-3.5 py-2 rounded-md text-[13px] transition-colors"
                >
                  Open case file →
                </Link>
              </div>
            </Card>
          ))}
        </section>

        <aside className="col-span-12 lg:col-span-4 space-y-4">
          <SectionHead title="Recently handled" count={done.length} muted />
          <Card>
            <ul className="divide-y divide-[var(--brand-line)]/60">
              {done.slice(0, 8).map(({ rec, c }) => (
                <li key={rec.id} className="p-3.5">
                  <div className="text-[12px] text-[var(--brand-muted)] flex items-center gap-2">
                    <span className="text-white/80 font-medium">{rec.decidedBy ?? "—"}</span>
                    <span>·</span>
                    <span>{rec.decidedAt ? relativeTime(rec.decidedAt) : ""}</span>
                  </div>
                  <Link href={`/case/${c.id}`} className="text-[13px] text-white hover:text-[var(--brand-orange)]">
                    {rec.title}
                  </Link>
                  <div className="text-[11px] text-[var(--brand-muted)]">{c.customer.name}</div>
                </li>
              ))}
            </ul>
          </Card>
        </aside>
      </div>
    </div>
  );
}

function SectionHead({
  title,
  count,
  muted,
}: {
  title: string;
  count: number;
  muted?: boolean;
}) {
  return (
    <div className="flex items-center gap-2">
      <div className={`text-[13px] font-semibold ${muted ? "text-[var(--brand-muted)]" : "text-white"}`}>
        {title}
      </div>
      <Pill tone={muted ? "neutral" : "brand"}>{count}</Pill>
    </div>
  );
}
