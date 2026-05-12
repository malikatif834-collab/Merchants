"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type {
  GeneratedScenario,
  SimDeal,
  SimStage,
} from "@/lib/scenarioSchema";

const STORAGE_KEY = "merchants_ai_demo_key";

// Stage progression rules. Each deal advances stage-by-stage on a timer.
// Time between stages is randomized in a small window to feel organic.
const STAGE_DURATIONS_MS: Record<SimStage, [number, number]> = {
  incoming: [1200, 1800],
  intake: [1600, 2400],
  stock_check: [1500, 2400],
  ar_review: [2000, 3000],
  sourcing_rfq: [2200, 3200],
  sourcing_quotes: [3000, 4500],
  quote_drafted: [1800, 2500],
  quote_sent: [1800, 2500],
  awaiting_customer: [2500, 4000],
  order_placed: [1800, 2500],
  shipped: [2000, 3000],
  delivered: [1500, 2500],
  invoiced: [1500, 2500],
  paid: [0, 0], // terminal
  closed_lost: [0, 0], // terminal
};

function rand(min: number, max: number): number {
  return Math.floor(min + Math.random() * (max - min));
}

function nextStage(stage: SimStage, s: GeneratedScenario): SimStage | null {
  switch (stage) {
    case "incoming":
      return "intake";
    case "intake":
      return "stock_check";
    case "stock_check":
      // If AR risk is non-trivial OR deal is large, route to AR review
      if (
        s.arRisk === "high" ||
        s.arRisk === "critical" ||
        s.estimatedValue >= 10_000
      ) {
        return "ar_review";
      }
      // Otherwise jump straight forward
      return s.isStockMatch ? "quote_drafted" : "sourcing_rfq";
    case "ar_review":
      if (s.arDecision === "decline") return "closed_lost";
      // Hold-pending-review usually means stalled silent → closed lost in sim
      if (s.arDecision === "hold_pending_review") return "closed_lost";
      return s.isStockMatch ? "quote_drafted" : "sourcing_rfq";
    case "sourcing_rfq":
      return "sourcing_quotes";
    case "sourcing_quotes":
      return "quote_drafted";
    case "quote_drafted":
      return "quote_sent";
    case "quote_sent":
      return "awaiting_customer";
    case "awaiting_customer":
      if (s.customerResponse === "accepted") return "order_placed";
      if (
        s.customerResponse === "negotiating" &&
        s.finalOutcome === "won"
      )
        return "order_placed";
      return "closed_lost";
    case "order_placed":
      return "shipped";
    case "shipped":
      return "delivered";
    case "delivered":
      return "invoiced";
    case "invoiced":
      return "paid";
    case "paid":
    case "closed_lost":
      return null;
  }
}

function isTerminal(stage: SimStage): boolean {
  return stage === "paid" || stage === "closed_lost";
}

export interface UseSimulationReturn {
  deals: SimDeal[];
  recent: SimDeal[];
  isGenerating: boolean;
  error: string | null;
  generateAndRun: (hint?: string) => Promise<void>;
  clear: () => void;
}

export function useSimulation(): UseSimulationReturn {
  const [deals, setDeals] = useState<SimDeal[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Map of deal id → timeout handle, for cleanup
  const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(
    new Map()
  );

  // Schedule next-stage advancement for a deal.
  const scheduleAdvance = useCallback((dealId: string) => {
    setDeals((prev) => {
      const d = prev.find((x) => x.id === dealId);
      if (!d) return prev;
      const next = nextStage(d.stage, d.scenario);
      if (!next) return prev; // terminal — nothing to schedule

      const [minMs, maxMs] = STAGE_DURATIONS_MS[d.stage];
      const wait = rand(minMs, maxMs);

      const handle = setTimeout(() => {
        setDeals((cur) =>
          cur.map((x) =>
            x.id === dealId
              ? {
                  ...x,
                  stage: next,
                  progressedAt: new Date().toISOString(),
                  history: [
                    ...x.history,
                    { at: new Date().toISOString(), stage: next },
                  ],
                }
              : x
          )
        );
        // Recurse — schedule the next advance
        if (!isTerminal(next)) {
          scheduleAdvance(dealId);
        }
      }, wait);
      timersRef.current.set(dealId, handle);
      return prev;
    });
  }, []);

  // Cleanup all timers on unmount
  useEffect(() => {
    const map = timersRef.current;
    return () => {
      for (const h of map.values()) clearTimeout(h);
      map.clear();
    };
  }, []);

  const generateAndRun = useCallback(
    async (hint?: string) => {
      if (isGenerating) return;
      setError(null);
      setIsGenerating(true);
      try {
        const clientKey =
          typeof window !== "undefined"
            ? localStorage.getItem(STORAGE_KEY) ?? ""
            : "";
        const res = await fetch("/api/scenario", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            clientKey: clientKey || undefined,
            hint: hint || undefined,
            seed: Date.now() + "-" + Math.random().toString(36).slice(2, 8),
          }),
        });
        if (!res.ok) {
          const text = await res.text();
          let msg = text;
          try {
            msg = JSON.parse(text).error ?? text;
          } catch {}
          setError(msg);
          setIsGenerating(false);
          return;
        }
        const scenario = (await res.json()) as GeneratedScenario;
        const id = `sim-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
        const now = new Date().toISOString();
        const deal: SimDeal = {
          id,
          scenario,
          stage: "incoming",
          progressedAt: now,
          startedAt: now,
          history: [{ at: now, stage: "incoming" }],
        };
        setDeals((prev) => [deal, ...prev]);
        // Kick off the stage progression
        scheduleAdvance(id);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setIsGenerating(false);
      }
    },
    [isGenerating, scheduleAdvance]
  );

  const clear = useCallback(() => {
    for (const h of timersRef.current.values()) clearTimeout(h);
    timersRef.current.clear();
    setDeals([]);
  }, []);

  // Recent (terminal) deals for the "what just happened" view
  const recent = deals.filter((d) => isTerminal(d.stage));

  return { deals, recent, isGenerating, error, generateAndRun, clear };
}
