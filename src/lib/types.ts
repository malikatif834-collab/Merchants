export type DealStage =
  | "inquiry_received"
  | "stock_check"
  | "checklist"
  | "ar_review"
  | "purchasing_review"
  | "sourcing"
  | "quote_drafted"
  | "quote_sent"
  | "awaiting_customer"
  | "order_placed"
  | "closed_won"
  | "closed_lost";

export const STAGE_LABEL: Record<DealStage, string> = {
  inquiry_received: "Inquiry received",
  stock_check: "Stock check",
  checklist: "Checklist",
  ar_review: "AR review",
  purchasing_review: "Purchasing review",
  sourcing: "Sourcing",
  quote_drafted: "Quote drafted",
  quote_sent: "Quote sent",
  awaiting_customer: "Awaiting customer",
  order_placed: "Order placed",
  closed_won: "Closed — won",
  closed_lost: "Closed — lost",
};

export const STAGE_ORDER: DealStage[] = [
  "inquiry_received",
  "stock_check",
  "checklist",
  "ar_review",
  "purchasing_review",
  "sourcing",
  "quote_drafted",
  "quote_sent",
  "awaiting_customer",
  "order_placed",
];

export type CustomerType =
  | "hospitality"
  | "manufacturing"
  | "healthcare"
  | "education"
  | "retail"
  | "office"
  | "automotive"
  | "food_service";

export interface Customer {
  id: string;
  name: string;
  contact: string;
  email: string;
  type: CustomerType;
  city: string;
  ytdRevenue: number;
  creditRating: "A" | "B" | "C" | "D";
  arAging: { current: number; d30: number; d60: number; d90: number };
  paymentNotes: string;
  avgDaysToPay: number;
  termsDays: number;
}

export interface Supplier {
  id: string;
  name: string;
  category: string[];
  avgResponseHours: number;
  onTimeRate: number;
  priceCompetitiveness: "high" | "medium" | "low";
  notes: string;
}

export interface Product {
  sku: string;
  name: string;
  category: string;
  uom: string;
  inStock: boolean;
  qtyAvailable?: number;
  unitCost?: number;
  unitPrice?: number;
}

export type RecType =
  | "stock_match"
  | "credit_flag"
  | "supplier_suggest"
  | "rfq_draft"
  | "quote_compare"
  | "quote_draft"
  | "follow_up"
  | "checklist_extract"
  | "classification"
  | "risk_summary";

export type RecStatus = "pending" | "approved" | "edited" | "rejected";

export interface AIRecommendation {
  id: string;
  type: RecType;
  title: string;
  summary: string;
  rationale: string[];
  confidence: number;
  suggestedAction: string;
  payload?: Record<string, unknown>;
  status: RecStatus;
  decidedBy?: string;
  decidedAt?: string;
}

export interface AuditEntry {
  at: string;
  actor: string;
  action: string;
  detail?: string;
  icon?: "ai" | "human" | "system" | "email" | "approve" | "reject";
}

export type ScenarioKey =
  | "stock_save"
  | "credit_catch"
  | "complex_sourcing"
  | "stalled_rescue";

export type InboundChannel = "email" | "phone" | "portal" | "walkup";

export interface EmailInbound {
  channel: "email";
  from: string;
  subject: string;
  body: string;
  receivedAt: string;
}

export interface PortalInbound {
  channel: "portal";
  formName: string;
  submittedBy: string;
  submittedAt: string;
  formFields: Array<{ label: string; value: string }>;
  notes?: string;
  receivedAt: string;
}

export interface PhoneInbound {
  channel: "phone";
  from: string;
  durationSeconds: number;
  transcript: Array<{ speaker: "customer" | "rep" | "vm"; text: string }>;
  capturedBy: string;
  receivedAt: string;
}

export interface WalkupInbound {
  channel: "walkup";
  capturedBy: string;
  location: string;
  rawNote: string;
  aiTranscription: string;
  receivedAt: string;
}

export type Inbound =
  | EmailInbound
  | PortalInbound
  | PhoneInbound
  | WalkupInbound;

export type DataSource =
  | "Gmail"
  | "Customer Portal"
  | "Phone Notes"
  | "Walk-up Capture"
  | "Catalog DB"
  | "AR Ledger"
  | "Supplier History"
  | "Procurement Tool"
  | "Customer Master"
  | "Prior Quotes"
  | "AI Inference";

export interface DataPoint {
  field: string;
  value: string;
  source: DataSource;
  confidence?: number;
}

export interface CaseFile {
  id: string;
  procurementNo: string;
  scenarioKey: ScenarioKey;
  scenarioLabel: string;
  scenarioBlurb: string;
  title: string;
  customer: Customer;
  inbound: Inbound;
  request: {
    description: string;
    quantity: number;
    targetPrice?: number;
    neededBy?: string;
    notes?: string;
  };
  salesRep: string;
  stage: DealStage;
  estValue: number;
  estMargin: number;
  estMarginPct: number;
  recommendations: AIRecommendation[];
  auditLog: AuditEntry[];
  dataCaptured: DataPoint[];
  openedAt: string;
  lastActivity: string;
  flags?: string[];
}

export interface PipelineDeal {
  id: string;
  procurementNo: string;
  customer: string;
  customerType: CustomerType;
  rep: string;
  description: string;
  stage: DealStage;
  value: number;
  marginPct: number;
  ageHours: number;
  atRisk?: boolean;
  riskReason?: string;
  aiActive?: boolean;
}

export interface KPIs {
  cycleTimeBefore: number;
  cycleTimeNow: number;
  stockRecovered: number;
  stockRecoveredCount: number;
  arExposureCaught: number;
  hoursSaved: number;
  marginLiftPct: number;
  specialOrdersThisMonth: number;
  winRateBefore: number;
  winRateNow: number;
  pipelineValue: number;
  atRiskValue: number;
}
