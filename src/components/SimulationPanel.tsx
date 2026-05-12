"use client";

import { Card, Pill } from "./Card";
import type { SimDeal, SimStage } from "@/lib/scenarioSchema";
import { stageLabel } from "@/lib/scenarioSchema";
import { money } from "@/lib/format";

const CHANNEL_LABEL: Record<string, string> = {
  email: "Email",
  portal: "Customer portal",
  phone: "Phone / voicemail",
  walkup: "Walk-up note",
  customer_pdf: "Customer PDF",
};

const CHANNEL_ICON: Record<string, string> = {
  email: "✉",
  portal: "▦",
  phone: "☎",
  walkup: "✎",
  customer_pdf: "▤",
};

const ALL_STAGES: SimStage[] = [
  "incoming",
  "intake",
  "stock_check",
  "ar_review",
  "sourcing_rfq",
  "sourcing_quotes",
  "quote_drafted",
  "quote_sent",
  "awaiting_customer",
  "order_placed",
  "shipped",
  "delivered",
  "invoiced",
  "paid",
];

export function SimulationPanel({
  deals,
  isGenerating,
  error,
  generateAndRun,
  clear,
}: {
  deals: SimDeal[];
  isGenerating: boolean;
  error: string | null;
  generateAndRun: (hint?: string) => Promise<void>;
  clear: () => void;
}) {
  const active = deals.filter(
    (d) => d.stage !== "paid" && d.stage !== "closed_lost"
  );
  const completed = deals.filter(
    (d) => d.stage === "paid" || d.stage === "closed_lost"
  );

  return (
    <Card className="border-[var(--brand-orange)]/40">
      <div className="p-5 border-b border-[var(--brand-line)] flex items-start gap-3 flex-wrap">
        <div className="h-9 w-9 rounded-lg bg-[var(--brand-orange)] flex items-center justify-center text-[var(--brand-ink)] font-bold text-sm shrink-0">
          ▶
        </div>
        <div className="flex-1 min-w-[260px]">
          <div className="text-[16px] font-semibold text-white tracking-tight">
            Run the procurement workflow live
          </div>
          <div className="text-[12.5px] text-[var(--brand-muted)] mt-0.5">
            Click below — AI generates a fresh inbound (as if your procurement
            tool just ingested it), then runs it end-to-end through
            MWI-0703-02: extracts, stock-checks, AR reviews, negotiates with
            suppliers, quotes the customer, places the order, tracks
            fulfillment, and books revenue. You watch the whole thing.
          </div>
        </div>
        <Pill tone="brand">Live AI</Pill>
      </div>

      <div className="p-5 space-y-4">
        <div className="flex items-center gap-3 flex-wrap">
          <button
            type="button"
            onClick={() => generateAndRun()}
            disabled={isGenerating}
            className="inline-flex items-center gap-2 bg-[var(--brand-orange)] hover:bg-[var(--brand-orange-600)] text-[var(--brand-ink)] font-semibold px-5 py-3 rounded-lg text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <>
                <span className="inline-block h-3 w-3 rounded-full border-2 border-[var(--brand-ink)] border-t-transparent animate-spin" />
                AI is generating a new inbound…
              </>
            ) : (
              <>+ Pull in next inbound from procurement tool</>
            )}
          </button>
          {deals.length > 0 && (
            <button
              type="button"
              onClick={clear}
              className="text-[11px] uppercase tracking-wider text-[var(--brand-muted)] hover:text-white px-2 py-1.5 rounded border border-[var(--brand-line)]"
            >
              Clear simulation
            </button>
          )}
          <div className="text-[12px] text-[var(--brand-muted)] ml-auto">
            {active.length} in flight · {completed.length} completed
          </div>
        </div>

        {error && (
          <div className="rounded-md border border-[var(--brand-red)]/40 bg-[var(--brand-red)]/10 p-3 text-[12.5px] text-[var(--brand-red)]">
            <span className="font-semibold">Couldn&apos;t generate scenario.</span>{" "}
            {error}
          </div>
        )}

        {deals.length === 0 && !isGenerating && (
          <div className="rounded-md border border-dashed border-[var(--brand-line)] bg-[var(--brand-ink)]/40 p-6 text-center">
            <div className="text-[13px] text-white font-medium mb-1">
              Nothing running yet
            </div>
            <div className="text-[11.5px] text-[var(--brand-muted)] max-w-[440px] mx-auto leading-relaxed">
              Click the button above. AI will invent a brand-new customer
              inquiry (different every time — different customer, channel,
              product, supplier dynamic, outcome) and run it through the entire
              procurement workflow live on this page.
            </div>
          </div>
        )}

        <div className="space-y-4">
          {deals.map((d) => (
            <DealCard key={d.id} deal={d} />
          ))}
        </div>
      </div>
    </Card>
  );
}

function DealCard({ deal }: { deal: SimDeal }) {
  const s = deal.scenario;
  const isPaid = deal.stage === "paid";
  const isLost = deal.stage === "closed_lost";
  const terminal = isPaid || isLost;
  const channelKey = s.inboundChannel;

  return (
    <div
      className={`rounded-lg border ${
        isPaid
          ? "border-[var(--brand-green)]/50 bg-[var(--brand-green)]/5"
          : isLost
            ? "border-[var(--brand-red)]/40 bg-[var(--brand-red)]/5"
            : "border-[var(--brand-orange)]/40 bg-[var(--brand-orange)]/5"
      } overflow-hidden`}
    >
      {/* Top strip: PR# · channel · customer · value */}
      <div className="px-4 py-2.5 border-b border-[var(--brand-line)]/60 bg-[var(--brand-charcoal-2)] flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-mono text-[11px] text-[var(--brand-orange)] tracking-wider">
            {s.prNo}
          </span>
          <span className="text-[var(--brand-muted)]">·</span>
          <Pill tone="brand">
            {CHANNEL_ICON[channelKey] ?? "·"} {CHANNEL_LABEL[channelKey] ?? channelKey}
          </Pill>
          <span className="text-[12.5px] text-white font-medium">
            {s.customerName}
          </span>
          {terminal && (
            <Pill tone={isPaid ? "ok" : "danger"}>
              {isPaid ? "✓ Paid" : "Lost"}
            </Pill>
          )}
        </div>
        <div className="text-right">
          <div className="text-[10px] uppercase tracking-wider text-[var(--brand-muted)]">
            Est value
          </div>
          <div className="text-[14px] font-semibold text-white tabular-nums">
            {money(s.estimatedValue)}
          </div>
        </div>
      </div>

      {/* Inbound preview */}
      <div className="px-4 py-3 border-b border-[var(--brand-line)]/60 bg-[var(--brand-ink)]/40">
        <div className="text-[10px] uppercase tracking-wider text-[var(--brand-muted)] mb-1">
          Inbound
        </div>
        <div className="text-[12.5px] text-white/90 leading-relaxed">
          {s.inboundSummary}
        </div>
      </div>

      {/* Workflow track */}
      <div className="px-4 py-3 border-b border-[var(--brand-line)]/60">
        <WorkflowTracker deal={deal} />
      </div>

      {/* Adaptive content based on current stage */}
      <StageContent deal={deal} />

      {/* Footer outcome (when terminal) */}
      {terminal && (
        <div className="px-4 py-3 border-t border-[var(--brand-line)]/60 bg-[var(--brand-charcoal-2)]">
          <div className="grid grid-cols-3 gap-3 text-[11.5px]">
            <Stat label="Revenue booked" value={isPaid ? money(s.finalRevenue) : "$0"} tone={isPaid ? "ok" : "neutral"} />
            <Stat label="Margin" value={isPaid ? money(s.finalMarginDollars) : "—"} tone={isPaid ? "ok" : "neutral"} />
            <Stat label="Cycle" value={cycleLabel(deal)} tone="neutral" />
          </div>
          <div className="mt-2 text-[12px] text-white/85 leading-relaxed italic">
            <span className="text-[var(--brand-orange)] font-semibold not-italic">AI close:</span>{" "}
            {s.advice.onClose}
          </div>
        </div>
      )}
    </div>
  );
}

function WorkflowTracker({ deal }: { deal: SimDeal }) {
  const currentIdx = ALL_STAGES.indexOf(deal.stage);
  const isLost = deal.stage === "closed_lost";

  // Stages this deal touches
  const path = stagesForDeal(deal);
  return (
    <div className="flex items-center gap-0.5 overflow-x-auto scrollbar-thin">
      {path.map((s, i) => {
        const stageIdx = ALL_STAGES.indexOf(s);
        const done =
          stageIdx >= 0 &&
          currentIdx >= 0 &&
          (stageIdx < currentIdx ||
            (deal.stage === "paid" && s === "paid"));
        const here = s === deal.stage;
        return (
          <div key={s} className="flex items-center gap-1 shrink-0">
            <div
              className={`px-2 py-1 rounded text-[10.5px] font-medium whitespace-nowrap transition-colors ${
                here
                  ? isLost
                    ? "bg-[var(--brand-red)] text-[var(--brand-ink)]"
                    : "bg-[var(--brand-orange)] text-[var(--brand-ink)] pulse-orange"
                  : done
                    ? "bg-[var(--brand-green)]/15 text-[var(--brand-green)] border border-[var(--brand-green)]/30"
                    : "bg-[var(--brand-charcoal-3)] text-[var(--brand-muted)]"
              }`}
            >
              {stageLabel(s)}
            </div>
            {i < path.length - 1 && (
              <span
                className={`text-[10px] ${done ? "text-[var(--brand-green)]" : "text-[var(--brand-muted)]/60"}`}
              >
                →
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}

function stagesForDeal(deal: SimDeal): SimStage[] {
  const s = deal.scenario;
  const path: SimStage[] = ["incoming", "intake", "stock_check"];

  const goesToAR =
    s.arRisk === "high" ||
    s.arRisk === "critical" ||
    s.estimatedValue >= 10_000;
  if (goesToAR) path.push("ar_review");

  // Early lost from AR review
  if (
    goesToAR &&
    (s.arDecision === "decline" || s.arDecision === "hold_pending_review")
  ) {
    path.push("closed_lost");
    return path;
  }

  if (!s.isStockMatch) {
    path.push("sourcing_rfq", "sourcing_quotes");
  }
  path.push("quote_drafted", "quote_sent", "awaiting_customer");

  if (s.finalOutcome === "won") {
    path.push("order_placed", "shipped", "delivered", "invoiced", "paid");
  } else {
    path.push("closed_lost");
  }
  return path;
}

function StageContent({ deal }: { deal: SimDeal }) {
  const s = deal.scenario;
  const stage = deal.stage;

  // Show different sub-content based on stage
  if (stage === "incoming" || stage === "intake") {
    return (
      <div className="p-4 space-y-2">
        <AdviceLine label="Intake" text={s.advice.onIntake} />
        <Mini label="Product" value={`${s.productDescription} · ${s.productQty} ${s.productUom}`} />
      </div>
    );
  }

  if (stage === "stock_check") {
    return (
      <div className="p-4 space-y-2">
        <AdviceLine label="Stock" text={s.advice.onStock} />
        <div className="grid grid-cols-2 gap-2">
          <Mini
            label="Match"
            value={
              s.isStockMatch
                ? `${s.stockSku} · ${s.stockOnHand ?? "—"} on hand`
                : "No match → special order"
            }
          />
          <Mini
            label="Margin target"
            value={`${s.marginTargetPct.toFixed(1)}%`}
          />
        </div>
      </div>
    );
  }

  if (stage === "ar_review") {
    return (
      <div className="p-4 space-y-2">
        <AdviceLine label="AR" text={s.advice.onAR} />
        <div className="grid grid-cols-3 gap-2">
          <Mini label="Credit" value={s.customerCreditRating} />
          <Mini label="Risk" value={s.arRisk} />
          <Mini
            label="Decision"
            value={s.arDecision.replace(/_/g, " ")}
          />
        </div>
      </div>
    );
  }

  if (stage === "sourcing_rfq") {
    return (
      <div className="p-4 space-y-2">
        <AdviceLine label="Sourcing" text="RFQs going out to suppliers…" />
        <div className="flex items-center gap-2 text-[11.5px] text-[var(--brand-muted)]">
          {s.supplierQuotes.map((q) => (
            <span
              key={q.name}
              className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-[var(--brand-charcoal-2)] border border-[var(--brand-line)]"
            >
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--brand-orange)] animate-pulse" />
              {q.name}
            </span>
          ))}
        </div>
      </div>
    );
  }

  if (
    stage === "sourcing_quotes" ||
    stage === "quote_drafted" ||
    stage === "quote_sent" ||
    stage === "awaiting_customer"
  ) {
    return (
      <div className="p-4 space-y-3">
        {s.supplierQuotes.length > 0 && (
          <>
            <AdviceLine label="Sourcing" text={s.advice.onSourcing} />
            <div className="overflow-x-auto rounded-md border border-[var(--brand-line)]/60">
              <table className="w-full text-[11.5px]">
                <thead className="bg-[var(--brand-charcoal-2)] text-[9.5px] uppercase tracking-wider text-[var(--brand-muted)]">
                  <tr>
                    <th className="text-left px-2.5 py-1.5 font-medium">Supplier</th>
                    <th className="text-right px-2 py-1.5 font-medium">$/unit</th>
                    <th className="text-right px-2 py-1.5 font-medium">Total</th>
                    <th className="text-right px-2 py-1.5 font-medium">Lead</th>
                    <th className="text-left px-2.5 py-1.5 font-medium">Note</th>
                  </tr>
                </thead>
                <tbody>
                  {s.supplierQuotes.map((q) => {
                    const recommended = q.name === s.recommendedSupplier;
                    return (
                      <tr
                        key={q.name}
                        className={`border-t border-[var(--brand-line)]/40 ${recommended ? "bg-[var(--brand-green)]/8" : ""}`}
                      >
                        <td className={`px-2.5 py-1.5 ${recommended ? "text-[var(--brand-green)] font-semibold" : "text-white"}`}>
                          {recommended && "★ "}
                          {q.name}
                        </td>
                        <td className="px-2 py-1.5 text-right tabular-nums text-white">
                          ${q.unitPrice.toFixed(2)}
                        </td>
                        <td className="px-2 py-1.5 text-right tabular-nums text-white">
                          ${q.totalPrice.toFixed(0)}
                        </td>
                        <td className="px-2 py-1.5 text-right tabular-nums text-white">
                          {q.leadDays}d
                        </td>
                        <td className="px-2.5 py-1.5 text-[var(--brand-muted)]">
                          {q.note}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
        <AdviceLine label="Quote" text={s.advice.onQuote} />
      </div>
    );
  }

  if (
    stage === "order_placed" ||
    stage === "shipped" ||
    stage === "delivered" ||
    stage === "invoiced"
  ) {
    return (
      <div className="p-4 space-y-2">
        <div className="text-[12.5px] text-white/90 leading-relaxed">
          <span className="text-[var(--brand-green)] font-semibold">✓ Customer accepted.</span>{" "}
          Order tracking through fulfillment.
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Mini label="Selling at" value={money(s.estimatedValue)} />
          <Mini
            label="Margin"
            value={`${s.marginAfterSourcingPct.toFixed(1)}%`}
          />
        </div>
      </div>
    );
  }

  return null;
}

function AdviceLine({ label, text }: { label: string; text: string }) {
  return (
    <div className="flex items-start gap-2 text-[12.5px] leading-relaxed">
      <span className="shrink-0 px-1.5 py-0.5 rounded text-[9.5px] uppercase tracking-wider font-semibold bg-[var(--brand-orange)]/15 text-[var(--brand-orange)] mt-0.5">
        AI · {label}
      </span>
      <span className="text-white/90">{text}</span>
    </div>
  );
}

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-[var(--brand-charcoal-2)] border border-[var(--brand-line)]/60 px-2.5 py-1.5">
      <div className="text-[9.5px] uppercase tracking-wider text-[var(--brand-muted)]">
        {label}
      </div>
      <div className="text-[12px] text-white font-medium truncate capitalize" title={value}>
        {value}
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  tone = "neutral",
}: {
  label: string;
  value: string;
  tone?: "ok" | "warn" | "neutral";
}) {
  const color =
    tone === "ok"
      ? "text-[var(--brand-green)]"
      : tone === "warn"
        ? "text-[var(--brand-amber)]"
        : "text-white";
  return (
    <div>
      <div className="text-[9.5px] uppercase tracking-wider text-[var(--brand-muted)]">
        {label}
      </div>
      <div className={`text-[14px] font-semibold tabular-nums ${color}`}>
        {value}
      </div>
    </div>
  );
}

function cycleLabel(deal: SimDeal): string {
  // In sim time, this is a few seconds. Render as "real" cycle equivalent.
  const elapsedSec = (Date.now() - new Date(deal.startedAt).getTime()) / 1000;
  // Map sim time to plausible business days: 1 sim-sec ≈ 0.1 business days
  const days = Math.max(0.6, Math.min(elapsedSec * 0.12, 8));
  return `${days.toFixed(1)}d`;
}
