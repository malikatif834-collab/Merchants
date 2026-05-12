"use client";

import { useEffect, useState } from "react";

const ACTIVITIES = [
  {
    text: "Matching 200 cases nitrile gloves against 312 in-stock SKU NIT-BL-LG-100…",
    tag: "Stock match",
    case: "case-001",
  },
  {
    text: "Cross-referencing Lakeshore AR aging buckets (90+ day balance $14,800)…",
    tag: "AR risk",
    case: "case-002",
  },
  {
    text: "Parsing Cascades quote PDF — normalizing $/case, lead time, plate amortization…",
    tag: "Quote compare",
    case: "case-003",
  },
  {
    text: "Tone-matching follow-up draft to Tanya Mukherjee against last 6 emails…",
    tag: "Drafting",
    case: "case-004",
  },
  {
    text: "Detected supplier lead-time shift: Diversey Oxivir Plus 5d → 21d…",
    tag: "Supplier monitor",
  },
  {
    text: "Classifying inbound voicemail from Riverbend Suites · customer-initiated · qty 240…",
    tag: "Channel intake",
    case: "case-003",
  },
  {
    text: "Pre-filling Procurement Tool checklist (96% confidence) — awaiting Sales Assistant…",
    tag: "Checklist",
    case: "case-001",
  },
  {
    text: "Watching 12 silent quotes for stall threshold · 1 deal aged past 14 days…",
    tag: "Pipeline watch",
  },
  {
    text: "Comparing $45K Lakeshore order against last 4 quarters for pattern drift…",
    tag: "Pattern check",
    case: "case-002",
  },
];

export function AIWorkingNow() {
  const [i, setI] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const tick = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setI((prev) => (prev + 1) % ACTIVITIES.length);
        setFade(true);
      }, 220);
    }, 3400);
    return () => clearInterval(tick);
  }, []);

  const a = ACTIVITIES[i];
  return (
    <div className="rounded-lg border border-[var(--brand-line)] bg-[var(--brand-charcoal)] px-4 py-3 flex items-center gap-3">
      <div className="relative shrink-0">
        <span className="h-2 w-2 rounded-full bg-[var(--brand-orange)] pulse-orange block" />
      </div>
      <div className="text-[10px] uppercase tracking-wider text-[var(--brand-orange)] font-semibold shrink-0">
        AI working now
      </div>
      <div className="text-[10px] uppercase tracking-wider text-[var(--brand-muted)] shrink-0 hidden sm:block">
        · {a.tag}
      </div>
      <div
        className={`text-[13px] text-white/95 truncate flex-1 transition-opacity duration-200 ${fade ? "opacity-100" : "opacity-0"}`}
        title={a.text}
      >
        {a.text}
      </div>
      <div className="text-[10px] text-[var(--brand-muted)] tabular-nums shrink-0 font-mono">
        {String(i + 1).padStart(2, "0")} / {ACTIVITIES.length}
      </div>
    </div>
  );
}
