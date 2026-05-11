"use client";

import { useState } from "react";
import { Card, Pill } from "./Card";
import type { AIRecommendation, RecStatus } from "@/lib/types";
import { money } from "@/lib/format";

const TYPE_ICON: Record<string, string> = {
  stock_match: "📦",
  credit_flag: "⚠",
  supplier_suggest: "🔍",
  rfq_draft: "✉",
  quote_compare: "⚖",
  quote_draft: "📝",
  follow_up: "↩",
  checklist_extract: "📋",
  classification: "🏷",
  risk_summary: "📊",
};

const TYPE_LABEL: Record<string, string> = {
  stock_match: "Stock match",
  credit_flag: "Credit flag",
  supplier_suggest: "Supplier shortlist",
  rfq_draft: "RFQ draft",
  quote_compare: "Quote comparison",
  quote_draft: "Quote draft",
  follow_up: "Follow-up email",
  checklist_extract: "Checklist extract",
  classification: "Classification",
  risk_summary: "Risk brief",
};

export function RecommendationCard({ rec }: { rec: AIRecommendation }) {
  const [status, setStatus] = useState<RecStatus>(rec.status);
  const [editing, setEditing] = useState(false);
  const [decidedBy, setDecidedBy] = useState(rec.decidedBy);
  const [decidedAt, setDecidedAt] = useState(rec.decidedAt);

  const decide = (next: RecStatus) => {
    setStatus(next);
    setDecidedBy(next === "rejected" ? "Carol Whitehead" : "Carol Whitehead");
    setDecidedAt(new Date().toISOString());
    setEditing(false);
  };

  const isPending = status === "pending";
  const borderTone =
    status === "approved"
      ? "border-[var(--brand-green)]/40"
      : status === "rejected"
        ? "border-[var(--brand-red)]/40"
        : status === "edited"
          ? "border-[var(--brand-amber)]/40"
          : "border-[var(--brand-orange)]/40";

  return (
    <Card className={`${borderTone} relative`}>
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3 flex-wrap">
          <div className="flex items-start gap-3">
            <div className="h-8 w-8 rounded-lg bg-[var(--brand-orange)]/15 border border-[var(--brand-orange)]/30 flex items-center justify-center text-sm">
              {TYPE_ICON[rec.type] ?? "✨"}
            </div>
            <div>
              <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                <span className="text-[10px] uppercase tracking-wider text-[var(--brand-orange)] font-semibold">
                  {TYPE_LABEL[rec.type] ?? rec.type}
                </span>
                <ConfidencePill confidence={rec.confidence} />
                <StatusPill status={status} />
              </div>
              <div className="text-[15px] font-semibold text-white leading-snug">
                {rec.title}
              </div>
            </div>
          </div>
        </div>

        <p className="text-[13px] text-[var(--brand-muted)] mb-4 leading-relaxed">
          {rec.summary}
        </p>

        <RecBody rec={rec} />

        <div className="mt-4">
          <details className="group">
            <summary className="text-[12px] text-[var(--brand-muted)] hover:text-white cursor-pointer flex items-center gap-1.5">
              <span className="group-open:rotate-90 transition-transform">›</span>
              Why AI suggests this ({rec.rationale.length} reasons)
            </summary>
            <ul className="mt-2 ml-3 space-y-1 text-[12.5px] text-[var(--brand-muted)] list-disc list-outside pl-3 marker:text-[var(--brand-orange)]/60">
              {rec.rationale.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </details>
        </div>

        {isPending ? (
          <div className="mt-5 flex items-center gap-2 flex-wrap">
            <button
              onClick={() => decide("approved")}
              className="inline-flex items-center gap-1.5 bg-[var(--brand-green)] hover:bg-[var(--brand-green)]/85 text-[var(--brand-ink)] font-semibold px-3.5 py-2 rounded-md text-[13px] transition-colors"
            >
              ✓ Approve — {rec.suggestedAction}
            </button>
            <button
              onClick={() => {
                setEditing((e) => !e);
                decide("edited");
              }}
              className="inline-flex items-center gap-1.5 bg-[var(--brand-amber)]/15 hover:bg-[var(--brand-amber)]/25 border border-[var(--brand-amber)]/40 text-[var(--brand-amber)] font-medium px-3.5 py-2 rounded-md text-[13px] transition-colors"
            >
              ✎ Edit
            </button>
            <button
              onClick={() => decide("rejected")}
              className="inline-flex items-center gap-1.5 bg-[var(--brand-red)]/10 hover:bg-[var(--brand-red)]/20 border border-[var(--brand-red)]/40 text-[var(--brand-red)] font-medium px-3.5 py-2 rounded-md text-[13px] transition-colors"
            >
              ✕ Reject
            </button>
            <div className="ml-auto text-[11px] text-[var(--brand-muted)]">
              Your call — nothing sends without it.
            </div>
          </div>
        ) : (
          <div className="mt-5 flex items-center justify-between gap-2 p-3 bg-[var(--brand-ink)] border border-[var(--brand-line)]/60 rounded-md">
            <div className="text-[12px] text-[var(--brand-muted)]">
              <span className="text-white font-medium">
                {status === "approved" ? "Approved" : status === "rejected" ? "Rejected" : "Edited"}
              </span>
              {decidedBy && ` by ${decidedBy}`}
              {decidedAt && (
                <span className="ml-1">
                  · {new Date(decidedAt).toLocaleString("en-CA", { hour: "numeric", minute: "2-digit" })}
                </span>
              )}
            </div>
            <button
              onClick={() => {
                setStatus("pending");
                setDecidedBy(undefined);
                setDecidedAt(undefined);
              }}
              className="text-[11px] text-[var(--brand-muted)] hover:text-white"
            >
              Undo
            </button>
          </div>
        )}

        {editing && status === "edited" && (
          <div className="mt-3 p-3 bg-[var(--brand-amber)]/5 border border-[var(--brand-amber)]/30 rounded-md">
            <div className="text-[11px] uppercase tracking-wider text-[var(--brand-amber)] mb-2 font-semibold">
              Edit before approving
            </div>
            <textarea
              defaultValue={rec.summary}
              rows={3}
              className="w-full bg-[var(--brand-ink)] border border-[var(--brand-line)] rounded-md p-2 text-[13px] text-white"
            />
            <div className="mt-2 flex gap-2">
              <button
                onClick={() => decide("approved")}
                className="text-[12px] bg-[var(--brand-green)] text-[var(--brand-ink)] px-3 py-1.5 rounded-md font-medium"
              >
                Save and approve
              </button>
              <button
                onClick={() => {
                  setStatus("pending");
                  setEditing(false);
                  setDecidedBy(undefined);
                  setDecidedAt(undefined);
                }}
                className="text-[12px] text-[var(--brand-muted)] hover:text-white px-2"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}

function ConfidencePill({ confidence }: { confidence: number }) {
  const tone = confidence >= 0.9 ? "ok" : confidence >= 0.8 ? "info" : "warn";
  return <Pill tone={tone}>{Math.round(confidence * 100)}% confidence</Pill>;
}

function StatusPill({ status }: { status: RecStatus }) {
  if (status === "pending") return <Pill tone="brand">awaiting approval</Pill>;
  if (status === "approved") return <Pill tone="ok">approved</Pill>;
  if (status === "edited") return <Pill tone="warn">edited & approved</Pill>;
  return <Pill tone="danger">rejected</Pill>;
}

function RecBody({ rec }: { rec: AIRecommendation }) {
  const p = rec.payload as Record<string, unknown> | undefined;
  if (!p) return null;

  if (rec.type === "stock_match") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
        <ProductCell
          label="Customer's usual SKU"
          sku={String(p.primarySku)}
          price={Number(p.primaryUnitPrice)}
          total={Number(p.totalPrimary)}
          tone="primary"
        />
        <ProductCell
          label="Value-grade alternative"
          sku={String(p.alternativeSku)}
          price={Number(p.alternativeUnitPrice)}
          total={Number(p.totalAlternative)}
          tone="alt"
        />
        <div className="md:col-span-2 p-3 rounded-md bg-[var(--brand-green)]/10 border border-[var(--brand-green)]/30 text-[12.5px] text-[var(--brand-green)]">
          ✓ Margin recovered vs. running this as a special order:{" "}
          <span className="font-semibold">{money(Number(p.marginRecovered))}</span>
        </div>
      </div>
    );
  }

  if (rec.type === "credit_flag") {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
        <Tile label="Total AR" value={money(Number(p.totalAR))} tone="warn" />
        <Tile label="90+ days" value={money(Number(p.d90Plus))} tone="danger" />
        <Tile label="NSFs / 90d" value={String(p.nsfCount90d)} tone="danger" />
        <Tile
          label="YTD revenue"
          value={`${Math.round(Number(p.ytdRevenueChange) * 100)}%`}
          tone="warn"
        />
        <div className="col-span-2 md:col-span-4 p-3 rounded-md bg-[var(--brand-amber)]/10 border border-[var(--brand-amber)]/30 text-[12.5px] text-[var(--brand-amber)] mt-1">
          <span className="font-semibold">Recommended path:</span>{" "}
          {String(p.recommendation)}
        </div>
      </div>
    );
  }

  if (rec.type === "quote_compare") {
    const suppliers = (p.suppliers ?? []) as Array<{
      name: string;
      unit: number;
      total: number;
      lead: number;
      plate: string;
      note: string;
    }>;
    const cheapest = Math.min(...suppliers.map((s) => s.total));
    const fastest = Math.min(...suppliers.map((s) => s.lead));
    return (
      <div className="mt-2 overflow-x-auto rounded-lg border border-[var(--brand-line)]/60">
        <table className="w-full text-[13px]">
          <thead className="bg-[var(--brand-ink)] text-[10.5px] uppercase tracking-wider text-[var(--brand-muted)]">
            <tr>
              <th className="text-left px-3 py-2 font-medium">Supplier</th>
              <th className="text-right px-2 py-2 font-medium">$/case</th>
              <th className="text-right px-2 py-2 font-medium">Total</th>
              <th className="text-right px-2 py-2 font-medium">Lead time</th>
              <th className="text-left px-2 py-2 font-medium">Plate</th>
              <th className="text-left px-3 py-2 font-medium">Trade-off</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.map((s, i) => (
              <tr key={i} className="border-t border-[var(--brand-line)]/40">
                <td className="px-3 py-2 text-white font-medium">{s.name}</td>
                <td className="px-2 py-2 text-right text-white tabular-nums">${s.unit.toFixed(2)}</td>
                <td className={`px-2 py-2 text-right tabular-nums ${s.total === cheapest ? "text-[var(--brand-green)] font-semibold" : "text-white"}`}>
                  ${s.total.toFixed(0)}
                </td>
                <td className={`px-2 py-2 text-right tabular-nums ${s.lead === fastest ? "text-[var(--brand-green)] font-semibold" : "text-white"}`}>
                  {s.lead}d
                </td>
                <td className="px-2 py-2 text-[var(--brand-muted)]">{s.plate}</td>
                <td className="px-3 py-2 text-[var(--brand-muted)]">{s.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (rec.type === "quote_draft" || rec.type === "follow_up") {
    const subj = (p.draftSubject as string) ?? "";
    const body = (p.draftBody as string) ?? "";
    return (
      <div className="mt-2 rounded-md border border-[var(--brand-line)]/60 bg-[var(--brand-ink)] overflow-hidden">
        <div className="px-3 py-2 border-b border-[var(--brand-line)]/60 text-[11px] text-[var(--brand-muted)]">
          <span className="text-white/80 font-medium">Subject:</span> {subj}
        </div>
        <pre className="px-3 py-3 text-[12.5px] text-white/90 whitespace-pre-wrap font-sans leading-relaxed">
{body}
        </pre>
      </div>
    );
  }

  if (rec.type === "checklist_extract") {
    return (
      <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-2">
        {Object.entries(p).map(([k, v]) => (
          <div key={k} className="rounded-md bg-[var(--brand-ink)] border border-[var(--brand-line)]/60 p-2">
            <div className="text-[10px] uppercase tracking-wider text-[var(--brand-muted)]">{k}</div>
            <div className="text-[13px] text-white font-medium">{String(v)}</div>
          </div>
        ))}
      </div>
    );
  }

  return null;
}

function ProductCell({
  label,
  sku,
  price,
  total,
  tone,
}: {
  label: string;
  sku: string;
  price: number;
  total: number;
  tone: "primary" | "alt";
}) {
  return (
    <div
      className={`p-3 rounded-md border ${tone === "primary" ? "bg-[var(--brand-orange)]/10 border-[var(--brand-orange)]/30" : "bg-[var(--brand-charcoal-2)] border-[var(--brand-line)]/60"}`}
    >
      <div className="text-[10px] uppercase tracking-wider text-[var(--brand-muted)] mb-1">{label}</div>
      <div className="font-mono text-[11px] text-white/80">{sku}</div>
      <div className="mt-1 flex items-baseline justify-between">
        <span className="text-[20px] font-semibold text-white tabular-nums">
          ${price.toFixed(2)}
        </span>
        <span className="text-[12px] text-[var(--brand-muted)]">/case</span>
      </div>
      <div className="text-[11px] text-[var(--brand-muted)] mt-1">
        Total: <span className="text-white font-medium">{money(total)}</span>
      </div>
    </div>
  );
}

function Tile({
  label,
  value,
  tone = "info",
}: {
  label: string;
  value: string;
  tone?: "ok" | "warn" | "danger" | "info";
}) {
  const colors = {
    ok: "text-[var(--brand-green)] border-[var(--brand-green)]/30",
    warn: "text-[var(--brand-amber)] border-[var(--brand-amber)]/30",
    danger: "text-[var(--brand-red)] border-[var(--brand-red)]/30",
    info: "text-white border-[var(--brand-line)]",
  };
  return (
    <div className={`rounded-md p-2 bg-[var(--brand-ink)] border ${colors[tone]}`}>
      <div className="text-[10px] uppercase tracking-wider text-[var(--brand-muted)]">{label}</div>
      <div className={`text-[18px] font-semibold tabular-nums ${colors[tone].split(" ")[0]}`}>
        {value}
      </div>
    </div>
  );
}
