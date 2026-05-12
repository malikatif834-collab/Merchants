// Schema for an AI-generated procurement scenario.
// One AI call produces a complete deal: inbound, customer, decisions, supplier
// negotiation, outcome, and AI commentary at each stage. The client then
// animates this through the workflow stages with timing.

import type { DealStage, InboundChannel } from "./types";

export interface SupplierQuoteSim {
  name: string;
  unitPrice: number;
  totalPrice: number;
  leadDays: number;
  note: string;
}

export interface ScenarioAdvice {
  onIntake: string;
  onStock: string;
  onAR: string;
  onSourcing: string;
  onQuote: string;
  onClose: string;
}

export interface GeneratedScenario {
  // Identity
  prNo: string;
  customerName: string;
  customerContact: string;
  customerType:
    | "hospitality"
    | "manufacturing"
    | "healthcare"
    | "education"
    | "retail"
    | "office"
    | "automotive"
    | "food_service";
  customerCreditRating: "A" | "B" | "C" | "D";
  customerArStatus: string; // free-text e.g. "clean" / "moderate aging" / "90+ day balance flagged"

  // Inbound
  inboundChannel: InboundChannel | "customer_pdf";
  inboundSummary: string; // one sentence
  inboundBody: string; // 2-5 sentence email-like text

  // Request
  productDescription: string;
  productQty: number;
  productUom: string; // "case" | "drum" | "jug" | "pallet" | ...

  estimatedValue: number; // CAD
  marginTargetPct: number; // 18-32

  // Stock decision
  isStockMatch: boolean;
  stockSku: string | null;
  stockOnHand: number | null;
  alternativeSku: string | null;

  // AR
  arRisk: "low" | "medium" | "high" | "critical";
  arDecision: "proceed" | "hold_pending_review" | "prepay_required" | "decline";

  // Sourcing (only meaningful when not stock match)
  isSpecialOrder: boolean;
  supplierQuotes: SupplierQuoteSim[];
  recommendedSupplier: string | null;
  marginAfterSourcingPct: number; // can shift after supplier pick

  // Customer outcome
  customerResponse: "accepted" | "declined" | "negotiating" | "silent";

  // Final
  finalOutcome: "won" | "lost";
  finalRevenue: number; // 0 if lost
  finalMarginDollars: number; // 0 if lost

  // AI commentary at each stage
  advice: ScenarioAdvice;
}

// Lightweight simulation deal state for animation.
export type SimStage =
  | "incoming"
  | "intake"
  | "stock_check"
  | "ar_review"
  | "sourcing_rfq"
  | "sourcing_quotes"
  | "quote_drafted"
  | "quote_sent"
  | "awaiting_customer"
  | "order_placed"
  | "shipped"
  | "delivered"
  | "invoiced"
  | "paid"
  | "closed_lost";

export interface SimDeal {
  id: string;
  scenario: GeneratedScenario;
  stage: SimStage;
  progressedAt: string; // ISO of last stage change
  history: Array<{ at: string; stage: SimStage; note?: string }>;
  startedAt: string;
}

export function simStageToPhase(s: SimStage): string {
  switch (s) {
    case "incoming":
    case "intake":
    case "stock_check":
      return "inbound";
    case "ar_review":
      return "qualify";
    case "sourcing_rfq":
    case "sourcing_quotes":
      return "sourcing";
    case "quote_drafted":
    case "quote_sent":
    case "awaiting_customer":
      return "quote";
    case "order_placed":
    case "shipped":
    case "delivered":
      return "fulfillment";
    case "invoiced":
    case "paid":
    case "closed_lost":
      return "revenue";
  }
}

export function simStageToDealStage(s: SimStage): DealStage {
  switch (s) {
    case "incoming":
      return "inquiry_received";
    case "intake":
      return "checklist";
    case "stock_check":
      return "stock_check";
    case "ar_review":
      return "ar_review";
    case "sourcing_rfq":
    case "sourcing_quotes":
      return "sourcing";
    case "quote_drafted":
      return "quote_drafted";
    case "quote_sent":
      return "quote_sent";
    case "awaiting_customer":
      return "awaiting_customer";
    case "order_placed":
      return "order_placed";
    case "shipped":
      return "shipped";
    case "delivered":
      return "delivered";
    case "invoiced":
      return "invoiced";
    case "paid":
      return "paid";
    case "closed_lost":
      return "closed_lost";
  }
}

export function stageLabel(s: SimStage): string {
  const map: Record<SimStage, string> = {
    incoming: "Inbound received",
    intake: "Checklist extracted",
    stock_check: "Stock check",
    ar_review: "AR risk review",
    sourcing_rfq: "RFQs out to suppliers",
    sourcing_quotes: "Supplier quotes back · comparing",
    quote_drafted: "Quote drafted",
    quote_sent: "Quote sent to customer",
    awaiting_customer: "Awaiting customer",
    order_placed: "Order placed with supplier",
    shipped: "Shipped",
    delivered: "Delivered to customer",
    invoiced: "Invoiced",
    paid: "Paid — revenue booked",
    closed_lost: "Closed — lost",
  };
  return map[s];
}
