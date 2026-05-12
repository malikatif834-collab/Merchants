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

export interface AdviceStep {
  next: string; // imperative — what to do next ("Approve and route to AR")
  why: string; // reasoning — short, controller-tone
}

export interface ScenarioAdvice {
  onIntake: AdviceStep;
  onStock: AdviceStep;
  onAR: AdviceStep;
  onSourcing: AdviceStep;
  onQuote: AdviceStep;
  onClose: AdviceStep;
}

export interface NegotiationRound {
  ask: string; // what AI proposed to the supplier
  response: string; // what the supplier came back with
  savings: number; // $ savings vs initial quote (0 if none)
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
  customerArStatus: string;

  // Inbound
  inboundChannel: "email" | "portal" | "phone" | "walkup" | "customer_pdf";
  inboundSummary: string;
  inboundBody: string;

  // Request
  productDescription: string;
  productQty: number;
  productUom: string;

  estimatedValue: number;
  marginTargetPct: number;

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
  marginAfterSourcingPct: number;

  // Negotiation round (only when special-order with quotes)
  negotiationAttempted: boolean;
  negotiationRound: NegotiationRound | null;
  finalSupplierPrice: number | null;

  // Customer outcome
  customerResponse: "accepted" | "declined" | "negotiating" | "silent";

  // Final
  finalOutcome: "won" | "lost";
  finalRevenue: number;
  finalMarginDollars: number;

  // AI commentary — butler style
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
