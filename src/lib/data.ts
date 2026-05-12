import type {
  CaseFile,
  Customer,
  KPIs,
  PipelineDeal,
  Product,
  Supplier,
} from "./types";

export const CUSTOMERS: Customer[] = [
  {
    id: "c-001",
    name: "Caesars Windsor — F&B",
    contact: "Mireille Lacasse",
    email: "m.lacasse@caesars-windsor.example",
    type: "hospitality",
    city: "Windsor, ON",
    ytdRevenue: 412_500,
    creditRating: "A",
    arAging: { current: 38_400, d30: 4_200, d60: 0, d90: 0 },
    paymentNotes: "Pays consistently within terms. Net-30.",
    avgDaysToPay: 27,
    termsDays: 30,
  },
  {
    id: "c-002",
    name: "Hiram Walker — Facilities",
    contact: "Doug Penner",
    email: "doug.penner@hiramwalker.example",
    type: "manufacturing",
    city: "Windsor, ON",
    ytdRevenue: 287_900,
    creditRating: "A",
    arAging: { current: 22_100, d30: 1_800, d60: 0, d90: 0 },
    paymentNotes: "Reliable. PO-driven, slightly slow on month-end.",
    avgDaysToPay: 31,
    termsDays: 30,
  },
  {
    id: "c-003",
    name: "Erie Shores Healthcare",
    contact: "Tanya Mukherjee",
    email: "tmukherjee@erieshores.example",
    type: "healthcare",
    city: "Leamington, ON",
    ytdRevenue: 198_300,
    creditRating: "A",
    arAging: { current: 14_500, d30: 0, d60: 0, d90: 0 },
    paymentNotes: "Public-sector. Always on time.",
    avgDaysToPay: 28,
    termsDays: 30,
  },
  {
    id: "c-004",
    name: "Lakeshore Hospitality Group",
    contact: "Rick Bonduriansky",
    email: "rick@lakeshorehg.example",
    type: "hospitality",
    city: "Kingsville, ON",
    ytdRevenue: 89_400,
    creditRating: "C",
    arAging: { current: 6_200, d30: 8_900, d60: 11_400, d90: 14_800 },
    paymentNotes: "Two NSF returns in last 90 days. AR has flagged.",
    avgDaysToPay: 68,
    termsDays: 30,
  },
  {
    id: "c-005",
    name: "St. Clair College — Facilities",
    contact: "Priya Anand",
    email: "panand@stclair.example",
    type: "education",
    city: "Windsor, ON",
    ytdRevenue: 156_200,
    creditRating: "A",
    arAging: { current: 9_300, d30: 0, d60: 0, d90: 0 },
    paymentNotes: "Public sector. Net-45 terms.",
    avgDaysToPay: 43,
    termsDays: 45,
  },
  {
    id: "c-006",
    name: "Windsor Assembly — Janitorial",
    contact: "Marc Tessier",
    email: "marc.tessier@windsorassembly.example",
    type: "automotive",
    city: "Windsor, ON",
    ytdRevenue: 612_400,
    creditRating: "A",
    arAging: { current: 71_200, d30: 3_400, d60: 0, d90: 0 },
    paymentNotes: "Largest account. Strict PO discipline.",
    avgDaysToPay: 29,
    termsDays: 30,
  },
  {
    id: "c-007",
    name: "Riverbend Suites & Conference",
    contact: "Jenna Albuquerque",
    email: "jenna@riverbendsuites.example",
    type: "hospitality",
    city: "LaSalle, ON",
    ytdRevenue: 64_800,
    creditRating: "B",
    arAging: { current: 4_100, d30: 2_200, d60: 0, d90: 0 },
    paymentNotes: "Occasionally late. Owner-operated.",
    avgDaysToPay: 41,
    termsDays: 30,
  },
];

export const SUPPLIERS: Supplier[] = [
  {
    id: "s-001",
    name: "Cascades Tissue",
    category: ["paper", "tissue"],
    avgResponseHours: 14,
    onTimeRate: 0.94,
    priceCompetitiveness: "medium",
    notes: "Strong on private-label runs. CleanBeyondGreen-eligible.",
  },
  {
    id: "s-002",
    name: "Kruger Products",
    category: ["paper", "tissue", "towels"],
    avgResponseHours: 26,
    onTimeRate: 0.91,
    priceCompetitiveness: "medium",
    notes: "Lead time tight on embossing — confirm capacity.",
  },
  {
    id: "s-003",
    name: "MediGlove International",
    category: ["safety", "ppe"],
    avgResponseHours: 8,
    onTimeRate: 0.88,
    priceCompetitiveness: "high",
    notes: "FDA-cert nitrile. Min order 100 cases.",
  },
  {
    id: "s-004",
    name: "Diversey Canada",
    category: ["chemicals", "janitorial"],
    avgResponseHours: 18,
    onTimeRate: 0.96,
    priceCompetitiveness: "low",
    notes: "Premium brand. Best for healthcare/food.",
  },
  {
    id: "s-005",
    name: "Atlas Industrial Packaging",
    category: ["packaging", "corrugated"],
    avgResponseHours: 22,
    onTimeRate: 0.93,
    priceCompetitiveness: "high",
    notes: "Custom corrugated specialty.",
  },
  {
    id: "s-006",
    name: "Northshore PPE Supply",
    category: ["safety", "ppe"],
    avgResponseHours: 11,
    onTimeRate: 0.92,
    priceCompetitiveness: "high",
    notes: "Volume-friendly. Slight quality variance batch-to-batch.",
  },
];

export const STOCK_HINTS: Product[] = [
  {
    sku: "NIT-BL-LG-100",
    name: "Nitrile Gloves, Powder-Free, Blue, Large — 100/box, 10 boxes/case",
    category: "Safety / PPE",
    uom: "case",
    inStock: true,
    qtyAvailable: 312,
    unitCost: 38.40,
    unitPrice: 52.95,
  },
  {
    sku: "NIT-BL-LG-ECO",
    name: "Nitrile Gloves, Powder-Free, Blue, Large — Value Grade — 100/box, 10 boxes/case",
    category: "Safety / PPE",
    uom: "case",
    inStock: true,
    qtyAvailable: 188,
    unitCost: 31.20,
    unitPrice: 44.50,
  },
  {
    sku: "CBG-HRT-800",
    name: "CleanBeyondGreen Hardwound Roll Towel, Natural — 800ft, 6/case",
    category: "Paper / Towels",
    uom: "case",
    inStock: true,
    qtyAvailable: 95,
    unitCost: 28.10,
    unitPrice: 39.95,
  },
];

export const KPIS: KPIs = {
  cycleTimeBefore: 6.2,
  cycleTimeNow: 1.8,
  stockRecovered: 34_180,
  stockRecoveredCount: 23,
  arExposureCaught: 127_400,
  hoursSaved: 31.5,
  marginLiftPct: 2.3,
  specialOrdersThisMonth: 47,
  winRateBefore: 0.41,
  winRateNow: 0.58,
  pipelineValue: 384_200,
  atRiskValue: 52_800,
};

export const PIPELINE: PipelineDeal[] = [
  {
    id: "case-001",
    procurementNo: "PR-24118",
    customer: "Caesars Windsor — F&B",
    customerType: "hospitality",
    rep: "Sarah Pham",
    description: "200 cases nitrile gloves, blue, L",
    stage: "stock_check",
    value: 10_590,
    marginPct: 27.4,
    ageHours: 2,
    aiActive: true,
  },
  {
    id: "case-002",
    procurementNo: "PR-24119",
    customer: "Lakeshore Hospitality Group",
    customerType: "hospitality",
    rep: "Dan Friesen",
    description: "$45K cleaning chemicals quarterly fill",
    stage: "ar_review",
    value: 45_200,
    marginPct: 19.6,
    ageHours: 5,
    atRisk: true,
    riskReason: "AR aging 90+ days, two NSFs",
    aiActive: true,
  },
  {
    id: "case-003",
    procurementNo: "PR-24120",
    customer: "Riverbend Suites & Conference",
    customerType: "hospitality",
    rep: "Sarah Pham",
    description: "Custom-embossed CleanBeyondGreen roll towels",
    stage: "sourcing",
    value: 28_400,
    marginPct: 22.8,
    ageHours: 36,
    aiActive: true,
  },
  {
    id: "case-004",
    procurementNo: "PR-24105",
    customer: "Erie Shores Healthcare",
    customerType: "healthcare",
    rep: "Marco Ruiz",
    description: "Diversey Oxivir disinfectant — 6 month supply",
    stage: "awaiting_customer",
    value: 18_900,
    marginPct: 24.1,
    ageHours: 14 * 24,
    atRisk: true,
    riskReason: "14 days silent post-quote",
    aiActive: true,
  },
  {
    id: "p-005",
    procurementNo: "PR-24121",
    customer: "Windsor Assembly — Janitorial",
    customerType: "automotive",
    rep: "Marco Ruiz",
    description: "Industrial degreaser drum, custom blend",
    stage: "purchasing_review",
    value: 12_300,
    marginPct: 26.0,
    ageHours: 9,
  },
  {
    id: "p-006",
    procurementNo: "PR-24115",
    customer: "St. Clair College — Facilities",
    customerType: "education",
    rep: "Sarah Pham",
    description: "Branded napkin run for student union",
    stage: "quote_sent",
    value: 6_800,
    marginPct: 31.5,
    ageHours: 48,
  },
  {
    id: "p-007",
    procurementNo: "PR-24122",
    customer: "Hiram Walker — Facilities",
    customerType: "manufacturing",
    rep: "Dan Friesen",
    description: "Specialty wipes, lint-free, 5 gal",
    stage: "quote_drafted",
    value: 9_400,
    marginPct: 28.2,
    ageHours: 6,
  },
  {
    id: "p-008",
    procurementNo: "PR-24117",
    customer: "Caesars Windsor — F&B",
    customerType: "hospitality",
    rep: "Marco Ruiz",
    description: "Compostable food trays — custom print",
    stage: "order_placed",
    value: 22_700,
    marginPct: 20.9,
    ageHours: 96,
  },
  {
    id: "p-009",
    procurementNo: "PR-24112",
    customer: "Erie Shores Healthcare",
    customerType: "healthcare",
    rep: "Sarah Pham",
    description: "Isolation gowns, AAMI Level 2 — 40 cases",
    stage: "checklist",
    value: 14_200,
    marginPct: 23.4,
    ageHours: 4,
  },
  {
    id: "p-010",
    procurementNo: "PR-24123",
    customer: "Lakeshore Hospitality Group",
    customerType: "hospitality",
    rep: "Dan Friesen",
    description: "Pool chemicals seasonal restock",
    stage: "inquiry_received",
    value: 8_900,
    marginPct: 18.0,
    ageHours: 1,
  },
];

// ============================================================
// THE FOUR SCENARIOS — fully fleshed case files for the demo
// ============================================================

const t = (offsetMinutes: number) => {
  const base = new Date("2026-05-11T07:30:00-04:00");
  base.setMinutes(base.getMinutes() + offsetMinutes);
  return base.toISOString();
};

const tDays = (daysAgo: number) => {
  const base = new Date("2026-05-11T14:00:00-04:00");
  base.setDate(base.getDate() - daysAgo);
  return base.toISOString();
};

export const CASE_FILES: CaseFile[] = [
  // -----------------------------------------------------------
  // 1. STOCK SAVE — Caesars Windsor F&B
  // -----------------------------------------------------------
  {
    id: "case-001",
    procurementNo: "PR-24118",
    scenarioKey: "stock_save",
    scenarioLabel: "Should have been stock",
    scenarioBlurb:
      "Customer requests a special order. AI realizes it matches an existing stock SKU — plus a cheaper substitute — and saves the margin.",
    title: "Nitrile gloves request looks like a special order — it isn't",
    customer: CUSTOMERS[0],
    inbound: {
      channel: "email",
      from: "Mireille Lacasse <m.lacasse@caesars-windsor.example>",
      subject: "Re: glove restock — need 200 cases this week",
      body: `Hi Sarah,

We're going through gloves faster than expected on the casino floor and back-of-house. Can you get me a quote for 200 cases of nitrile gloves — powder free, blue, large? We need them by Friday if at all possible.

Last time we ordered from you it was a special order so I'm flagging it early.

Thanks,
Mireille
F&B Operations, Caesars Windsor`,
      receivedAt: t(-90),
    },
    request: {
      description: "Nitrile gloves, powder-free, blue, large",
      quantity: 200,
      neededBy: "2026-05-15",
      notes: "Customer believes this is a special order.",
    },
    salesRep: "Sarah Pham",
    stage: "stock_check",
    estValue: 10_590,
    estMargin: 2_902,
    estMarginPct: 27.4,
    flags: ["Stock-eligible — AI flagged"],
    openedAt: t(-85),
    lastActivity: t(-3),
    recommendations: [
      {
        id: "r-001-a",
        type: "checklist_extract",
        title: "Procurement checklist drafted from inbound email",
        summary:
          "Extracted product, quantity, delivery date, customer, urgency. Ready for Sales Assistant review.",
        rationale: [
          "Parsed Mireille's email — product spec inferred from prior order history.",
          "Urgency: HIGH (4-day window).",
          "Customer flagged it as 'special order' from memory — AI is checking stock anyway.",
        ],
        confidence: 0.96,
        suggestedAction: "Open prefilled checklist",
        payload: {
          product: "Nitrile gloves, powder-free, blue, large",
          quantity: 200,
          uom: "case",
          neededBy: "Friday 2026-05-15",
          urgency: "high",
        },
        status: "approved",
        decidedBy: "Sales Assistant (auto-approved high-confidence extract)",
        decidedAt: t(-83),
      },
      {
        id: "r-001-b",
        type: "stock_match",
        title: "This is NOT a special order — match found in stock",
        summary:
          "SKU NIT-BL-LG-100 is in stock (312 cases). Plus a value-grade alternative NIT-BL-LG-ECO (188 cases) at 16% lower cost.",
        rationale: [
          "Customer's spec matches SKU NIT-BL-LG-100 exactly (powder-free, blue, large, 100/box, 10 boxes/case).",
          "On-hand: 312 cases at Windsor warehouse. No special order needed.",
          "Alternative: NIT-BL-LG-ECO, value-grade, $44.50/case vs $52.95 — would land Caesars 16% cheaper if they accept the value tier.",
          "Last 6 Caesars glove orders were all on the premium SKU. Recommend premium quote with optional value-grade line.",
        ],
        confidence: 0.93,
        suggestedAction: "Convert to standard order — close procurement loop",
        payload: {
          primarySku: "NIT-BL-LG-100",
          alternativeSku: "NIT-BL-LG-ECO",
          primaryUnitPrice: 52.95,
          alternativeUnitPrice: 44.50,
          totalPrimary: 10590,
          totalAlternative: 8900,
          marginRecovered: 1100,
        },
        status: "pending",
        decidedBy: undefined,
        decidedAt: undefined,
      },
      {
        id: "r-001-c",
        type: "quote_draft",
        title: "Customer email + quote drafted",
        summary:
          "Reply to Mireille confirming availability, offering both grades, with a same-day shipment option.",
        rationale: [
          "Customer relationship tone (warm, first-name, casual sign-off).",
          "Margin held at category target (27%).",
          "Offers value-grade option transparently — keeps Mireille's trust.",
        ],
        confidence: 0.88,
        suggestedAction: "Review draft and send",
        payload: {
          draftSubject: "Re: glove restock — good news, this one's in stock",
          draftBody: `Hi Mireille,

Good news — I caught this before it went into our special-order queue. The blue powder-free large nitrile (your usual SKU) is in stock at our Crawford warehouse. I can have 200 cases on a truck to you Wednesday morning.

Pricing on your usual SKU: $52.95/case, total $10,590 net of tax.
If you'd like to try our value-grade equivalent it's $44.50/case ($8,900 total) — same spec, slightly thinner, very popular with the manufacturing accounts. Happy to send a sample box ahead if you want to compare.

Want me to lock it in?

Sarah
Merchants Paper — the friendly supply house. since 1941.`,
        },
        status: "pending",
      },
    ],
    auditLog: [
      { at: t(-90), actor: "Customer", action: "Inbound email received", detail: "Subject: glove restock — need 200 cases this week", icon: "email" },
      { at: t(-89), actor: "AI Agent", action: "Email parsed and classified as procurement inquiry", icon: "ai" },
      { at: t(-87), actor: "AI Agent", action: "Procurement checklist drafted (96% confidence)", icon: "ai" },
      { at: t(-83), actor: "Sales Assistant", action: "Checklist auto-approved (high confidence)", icon: "approve" },
      { at: t(-80), actor: "AI Agent", action: "Stock check: matched SKU NIT-BL-LG-100, 312 cases on hand", icon: "ai" },
      { at: t(-78), actor: "AI Agent", action: "Value-grade alternative identified (NIT-BL-LG-ECO)", icon: "ai" },
      { at: t(-15), actor: "AI Agent", action: "Customer reply drafted, awaiting human approval", detail: "Margin held at 27.4%", icon: "ai" },
    ],
    dataCaptured: [
      { field: "Customer", value: "Caesars Windsor — F&B", source: "Customer Master", confidence: 1.0 },
      { field: "Contact", value: "Mireille Lacasse", source: "Gmail" },
      { field: "Product", value: "Nitrile gloves, powder-free, blue, large", source: "Gmail", confidence: 0.96 },
      { field: "Quantity", value: "200 cases", source: "Gmail", confidence: 0.99 },
      { field: "Urgency", value: "High (by Friday)", source: "AI Inference", confidence: 0.93 },
      { field: "Stock match", value: "NIT-BL-LG-100 · 312 on hand", source: "Catalog DB", confidence: 0.97 },
      { field: "Alternative SKU", value: "NIT-BL-LG-ECO · 188 on hand", source: "Catalog DB", confidence: 0.91 },
      { field: "Last 6 orders SKU", value: "NIT-BL-LG-100 (premium)", source: "Prior Quotes", confidence: 0.99 },
      { field: "Credit rating", value: "A", source: "AR Ledger" },
    ],
  },

  // -----------------------------------------------------------
  // 2. CREDIT CATCH — Lakeshore Hospitality Group
  // -----------------------------------------------------------
  {
    id: "case-002",
    procurementNo: "PR-24119",
    scenarioKey: "credit_catch",
    scenarioLabel: "Credit risk caught early",
    scenarioBlurb:
      "A large special-order request from a customer with stale AR. AI surfaces the risk before sales effort is spent.",
    title: "$45K chemicals order — AR risk surfaced before quoting",
    customer: CUSTOMERS[3],
    inbound: {
      channel: "portal",
      formName: "merchants.ca · Quote Request",
      submittedBy: "Rick Bonduriansky (Lakeshore Hospitality Group)",
      submittedAt: t(-300),
      formFields: [
        { label: "Customer account", value: "Lakeshore Hospitality Group — LHG-0042" },
        { label: "Submitted by", value: "Rick Bonduriansky · rick@lakeshorehg.example" },
        { label: "Request type", value: "Recurring quarterly fill" },
        { label: "Properties", value: "3 (Kingsville, Leamington, Pelee)" },
        { label: "Line 1", value: "Diversey Oxivir Plus — 24 cases" },
        { label: "Line 2", value: "Floor stripper concentrate — 12 drums" },
        { label: "Line 3", value: "Glass cleaner concentrate — 18 cases" },
        { label: "Line 4", value: "Laundry detergent commercial — 30 jugs" },
        { label: "Line 5", value: "Misc dispensers and refills" },
        { label: "Target value", value: "~$45,000 CAD" },
        { label: "Needed by", value: "End of next week" },
      ],
      notes: "Same list as last quarter, roughly.",
      receivedAt: t(-300),
    },
    request: {
      description: "Quarterly cleaning chemicals across 3 properties",
      quantity: 1,
      targetPrice: 45000,
      notes: "Recurring order pattern, but customer AR has deteriorated.",
    },
    salesRep: "Dan Friesen",
    stage: "ar_review",
    estValue: 45_200,
    estMargin: 8_859,
    estMarginPct: 19.6,
    flags: ["AR exposure flagged", "Recommend hold or prepay"],
    openedAt: t(-295),
    lastActivity: t(-12),
    recommendations: [
      {
        id: "r-002-a",
        type: "checklist_extract",
        title: "Multi-line procurement checklist drafted",
        summary:
          "Five product lines extracted from email. Two are stock SKUs, three need supplier confirmation.",
        rationale: [
          "Line-by-line parse from Rick's email.",
          "Cross-matched against last quarter's invoice (same property, same period).",
          "Two SKUs in stock, three require supplier confirmation but are usual-supply.",
        ],
        confidence: 0.91,
        suggestedAction: "Open checklist",
        status: "approved",
        decidedBy: "Sales Assistant",
        decidedAt: t(-290),
      },
      {
        id: "r-002-b",
        type: "credit_flag",
        title: "AR risk: recommend hold pending payment plan",
        summary:
          "Lakeshore is 90+ days past on $14,800 with two NSF returns in the last 90 days. Sourcing this order without terms revision exposes Merchants to $45K+ of credit risk on a customer trending downward.",
        rationale: [
          "AR aging: $14,800 at 90+ days, $11,400 at 60+, $8,900 at 30+. Current $6,200.",
          "Two NSF returns in last 90 days — first NSFs from this customer in 4 years.",
          "YTD revenue down 23% YoY. Two of three properties operating below capacity (industry data).",
          "Margin on this order is 19.6% — below category average (24%). Bad risk-adjusted return.",
          "Recommend: hold special order, propose 50% prepay + Net-15 on balance, or reduce PO size by ~40%.",
        ],
        confidence: 0.94,
        suggestedAction: "Send to Director of Sales with proposed terms revision",
        payload: {
          totalAR: 41_300,
          d90Plus: 14_800,
          nsfCount90d: 2,
          ytdRevenueChange: -0.23,
          recommendation: "50% prepay + Net-15, or reduce order size by 40%",
        },
        status: "pending",
      },
      {
        id: "r-002-c",
        type: "risk_summary",
        title: "One-page customer risk brief drafted for Director of Sales",
        summary:
          "AR aging summary, payment trend chart, recommended terms revision language, draft email to Rick with options.",
        rationale: [
          "Director of Sales / Delegate path triggered by AR flag — this is the brief they'll need.",
          "Includes plain-English summary, the numbers, and three concrete paths forward.",
        ],
        confidence: 0.89,
        suggestedAction: "Forward to Director of Sales",
        status: "pending",
      },
    ],
    auditLog: [
      { at: t(-300), actor: "Customer", action: "Portal form submitted", detail: "merchants.ca · Quote Request · 5 line items", icon: "email" },
      { at: t(-298), actor: "AI Agent", action: "Form parsed; multi-line checklist extracted (91% confidence)", icon: "ai" },
      { at: t(-290), actor: "Sales Assistant", action: "Checklist approved", icon: "approve" },
      { at: t(-285), actor: "AI Agent", action: "Routed to AR for credit review", detail: "Threshold: $10K+ to AR auto-route", icon: "system" },
      { at: t(-275), actor: "AI Agent", action: "AR risk analysis completed", detail: "90+ day balance + NSF pattern detected", icon: "ai" },
      { at: t(-30), actor: "AI Agent", action: "One-page brief drafted for Director of Sales", icon: "ai" },
    ],
    dataCaptured: [
      { field: "Customer", value: "Lakeshore Hospitality Group", source: "Customer Master", confidence: 1.0 },
      { field: "Submitted by", value: "Rick Bonduriansky", source: "Customer Portal" },
      { field: "Line items", value: "5 (mixed chemicals + dispensers)", source: "Customer Portal", confidence: 0.99 },
      { field: "Target value", value: "~$45,000 CAD", source: "Customer Portal" },
      { field: "Total AR", value: "$41,300", source: "AR Ledger" },
      { field: "90+ day balance", value: "$14,800", source: "AR Ledger", confidence: 1.0 },
      { field: "NSFs / 90d", value: "2 returns", source: "AR Ledger", confidence: 1.0 },
      { field: "YoY revenue trend", value: "-23%", source: "AR Ledger" },
      { field: "Pattern match", value: "Same SKUs as Q4 2025 invoice", source: "Prior Quotes", confidence: 0.94 },
      { field: "Recommended action", value: "Hold or revise terms", source: "AI Inference", confidence: 0.94 },
    ],
  },

  // -----------------------------------------------------------
  // 3. COMPLEX SOURCING — Riverbend Suites CleanBeyondGreen
  // -----------------------------------------------------------
  {
    id: "case-003",
    procurementNo: "PR-24120",
    scenarioKey: "complex_sourcing",
    scenarioLabel: "Complex sourcing",
    scenarioBlurb:
      "Custom-embossed paper towel run with no stock match. AI drafts RFQs, parses quotes, builds a side-by-side comparison.",
    title: "Custom-embossed CleanBeyondGreen — 3 suppliers, one comparable table",
    customer: CUSTOMERS[6],
    inbound: {
      channel: "phone",
      from: "Jenna Albuquerque · Riverbend Suites & Conference",
      durationSeconds: 92,
      capturedBy: "Sarah Pham (voicemail · transcribed by AI)",
      transcript: [
        { speaker: "vm", text: "Voicemail received Friday 4:42 PM. Caller ID: Jenna Albuquerque, Riverbend Suites." },
        { speaker: "customer", text: "Hey Sarah, it's Jenna over at Riverbend. So we're upgrading our amenities and want to go to a logo-embossed roll towel for the guest rooms and conference areas." },
        { speaker: "customer", text: "We'd want to do this in your CleanBeyondGreen eco-line — the natural color one — with our Riverbend mark embossed, you know, once per foot or so." },
        { speaker: "customer", text: "Hardwound, around 800 feet per roll, six rolls per case I think is what your spec sheet had. We'd need 240 cases for the initial rollout." },
        { speaker: "customer", text: "And then if it goes well, we'd probably want to do a quarterly recurring after that. So can you put together a number for us? Cost and lead time both. Call me back when you can. Thanks!" },
      ],
      receivedAt: tDays(2),
    },
    request: {
      description:
        "Custom-embossed CleanBeyondGreen hardwound roll towel, natural, 800ft, 6/case",
      quantity: 240,
      neededBy: "2026-06-15",
      notes: "Embossed logo run. Potential recurring quarterly.",
    },
    salesRep: "Sarah Pham",
    stage: "sourcing",
    estValue: 28_400,
    estMargin: 6_475,
    estMarginPct: 22.8,
    openedAt: tDays(2),
    lastActivity: t(-180),
    recommendations: [
      {
        id: "r-003-a",
        type: "supplier_suggest",
        title: "3 suppliers shortlisted from history",
        summary:
          "Cascades, Kruger, and a vetted contract embosser. Selection based on past CleanBeyondGreen runs and embossing capability.",
        rationale: [
          "Cascades: last 4 CleanBeyondGreen orders all here. 94% on-time. Likely fastest.",
          "Kruger: stronger pricing historically but tighter embossing lead times. Worth pinging.",
          "Atlas Industrial Packaging: contract embosser — only if we want full-margin control.",
        ],
        confidence: 0.92,
        suggestedAction: "Send RFQs to all three",
        status: "approved",
        decidedBy: "Purchasing",
        decidedAt: tDays(2),
      },
      {
        id: "r-003-b",
        type: "rfq_draft",
        title: "RFQs drafted (3 versions)",
        summary:
          "Supplier-specific draft RFQs with embossing spec, quantity tiers, lead time question, and pricing for recurring contract.",
        rationale: [
          "Spec extracted from Jenna's email + cross-referenced against CBG-HRT-800 standard SKU.",
          "Tier pricing requested: 240 cases initial, then 240/quarter recurring.",
          "Each RFQ tone-matched to supplier rep history.",
        ],
        confidence: 0.9,
        suggestedAction: "Review and send",
        status: "approved",
        decidedBy: "Purchasing",
        decidedAt: tDays(1.8),
      },
      {
        id: "r-003-c",
        type: "quote_compare",
        title: "Supplier quotes parsed and compared",
        summary:
          "All 3 quotes back. AI normalized units, extracted lead time, total landed cost, and called out trade-offs.",
        rationale: [
          "Cascades $26.10/case, 11-day lead, free embossing plate amortized.",
          "Kruger $24.80/case, 18-day lead, $850 one-time plate charge.",
          "Atlas $25.40/case, 14-day lead, plate already on file (prior job).",
          "If Riverbend's deadline matters: Cascades wins on lead time at $312 premium over Kruger.",
          "Long-term: Atlas wins if recurring confirmed (plate on file, faster reorders).",
        ],
        confidence: 0.95,
        suggestedAction: "Present comparison to Sales for customer-facing recommendation",
        payload: {
          suppliers: [
            { name: "Cascades", unit: 26.10, total: 6264, lead: 11, plate: "amortized", note: "Best lead time" },
            { name: "Kruger", unit: 24.80, total: 5952, lead: 18, plate: "$850 one-time", note: "Best unit price" },
            { name: "Atlas Industrial Packaging", unit: 25.40, total: 6096, lead: 14, plate: "on file", note: "Best recurring economics" },
          ],
        },
        status: "pending",
      },
      {
        id: "r-003-d",
        type: "quote_draft",
        title: "Customer quote drafted — Cascades primary, Atlas alt for recurring",
        summary:
          "Quote PDF draft, customer-facing email, talking points for Sarah on lead-time vs total-cost trade-off.",
        rationale: [
          "Recommended primary: Cascades for the initial run (deadline-driven, plate amortized).",
          "Pitch Atlas as Phase 2 if Jenna confirms quarterly recurring.",
          "Margin: 22.8% baseline, 24.6% if Riverbend commits to the recurring lane.",
        ],
        confidence: 0.86,
        suggestedAction: "Review and send",
        status: "pending",
      },
    ],
    auditLog: [
      { at: tDays(2), actor: "Customer", action: "Voicemail received and transcribed", detail: "92s voicemail, customer-initiated", icon: "email" },
      { at: tDays(2), actor: "AI Agent", action: "Transcript parsed; checklist extracted; stock match attempted (no match)", icon: "ai" },
      { at: tDays(2), actor: "AI Agent", action: "Special order opened, routed to Purchasing", icon: "system" },
      { at: tDays(2), actor: "AI Agent", action: "3 candidate suppliers shortlisted", icon: "ai" },
      { at: tDays(2), actor: "Purchasing", action: "Supplier shortlist approved", icon: "approve" },
      { at: tDays(2), actor: "AI Agent", action: "3 RFQs drafted", icon: "ai" },
      { at: tDays(1.8), actor: "Purchasing", action: "RFQs sent", icon: "approve" },
      { at: tDays(1), actor: "Cascades", action: "Quote received and parsed", icon: "email" },
      { at: tDays(0.8), actor: "Kruger", action: "Quote received and parsed", icon: "email" },
      { at: tDays(0.5), actor: "Atlas", action: "Quote received and parsed", icon: "email" },
      { at: t(-180), actor: "AI Agent", action: "Comparison table built, customer quote drafted", icon: "ai" },
    ],
    dataCaptured: [
      { field: "Customer", value: "Riverbend Suites & Conference", source: "Customer Master", confidence: 1.0 },
      { field: "Contact", value: "Jenna Albuquerque", source: "Phone Notes" },
      { field: "Channel", value: "Voicemail (92s)", source: "Phone Notes", confidence: 1.0 },
      { field: "Product spec", value: "CBG hardwound 800ft, 6/case, embossed", source: "Phone Notes", confidence: 0.92 },
      { field: "Quantity", value: "240 cases initial + quarterly recurring", source: "Phone Notes", confidence: 0.96 },
      { field: "Stock match", value: "None (custom embossing)", source: "Catalog DB", confidence: 0.99 },
      { field: "Candidate suppliers", value: "Cascades, Kruger, Atlas", source: "Supplier History", confidence: 0.94 },
      { field: "Plate availability — Atlas", value: "On file (prior job)", source: "Supplier History" },
      { field: "Diversey lead time", value: "11–18d range across suppliers", source: "Supplier History" },
      { field: "Estimated margin", value: "22.8% baseline / 24.6% recurring", source: "AI Inference", confidence: 0.86 },
    ],
  },

  // -----------------------------------------------------------
  // 4. STALLED RESCUE — Erie Shores Healthcare
  // -----------------------------------------------------------
  {
    id: "case-004",
    procurementNo: "PR-24105",
    scenarioKey: "stalled_rescue",
    scenarioLabel: "Stalled deal rescue",
    scenarioBlurb:
      "Quote sent two weeks ago, customer silent. AI drafts a tactful nudge and surfaces a more available alternative.",
    title: "Diversey Oxivir quote silent for 14 days — rescue plan ready",
    customer: CUSTOMERS[2],
    inbound: {
      channel: "walkup",
      capturedBy: "Marco Ruiz (in person at Erie Shores)",
      location: "Erie Shores Healthcare — Materials office, Leamington",
      rawNote: `Tanya - planning next 6mo
Oxivir Plus same as fall '25
~120 cs / qtr cadence
budget cycle approves end of month
quote this week pls`,
      aiTranscription:
        "Tanya Mukherjee (Materials Manager, Erie Shores Healthcare) is planning the next 6-month supply of Diversey Oxivir Plus disinfectant. She referenced the prior fall 2025 order — same cadence, approximately 120 cases per quarter. Budget cycle approval lands end of this month. She has asked for a quote within the week.",
      receivedAt: tDays(15),
    },
    request: {
      description: "Diversey Oxivir Plus, 6-month supply",
      quantity: 120,
      notes: "Quote sent 14 days ago, no response since.",
    },
    salesRep: "Marco Ruiz",
    stage: "awaiting_customer",
    estValue: 18_900,
    estMargin: 4_561,
    estMarginPct: 24.1,
    flags: ["At-risk — 14 days silent post-quote"],
    openedAt: tDays(15),
    lastActivity: tDays(14),
    recommendations: [
      {
        id: "r-004-a",
        type: "follow_up",
        title: "Drafted tactful follow-up email to Tanya",
        summary:
          "Warm-tone follow-up, references prior order pattern, offers a brief call if there's a budget question, no pressure on price.",
        rationale: [
          "Tone-matched to last 6 Tanya emails (warm, brief, public-sector cadence).",
          "Public-sector buyers often pause for budget cycle approval — language acknowledges this without assuming it.",
          "No price change suggested. Hold margin.",
        ],
        confidence: 0.91,
        suggestedAction: "Review and send",
        payload: {
          draftSubject: "Re: Oxivir 6-month — checking in",
          draftBody: `Hi Tanya,

Just circling back on the Oxivir Plus quote I sent over a couple weeks ago. Totally understand if you're waiting on a budget cycle or want to compare — happy to extend the price through end of month if that helps.

If there's anything you'd like to tweak about the order (different cadence, split delivery, etc.) just let me know and I'll rework it.

Marco
Merchants Paper`,
        },
        status: "pending",
      },
      {
        id: "r-004-b",
        type: "classification",
        title: "Alternative product surfaced — better availability",
        summary:
          "Oxivir Plus has 3-week supplier lead time right now. Suggesting Oxivir Tb (smaller pack, ready stock) as a bridge or alternative.",
        rationale: [
          "Diversey's current Oxivir Plus lead time is up from 5 days to 21 days — confirmed via supplier portal Friday.",
          "Erie Shores has used Oxivir Tb in the past for ICU areas — similar efficacy, smaller pack.",
          "If lead time is the silent reason, this gives Tanya a fast option without re-spec.",
        ],
        confidence: 0.83,
        suggestedAction: "Include as optional second line on follow-up",
        status: "pending",
      },
      {
        id: "r-004-c",
        type: "risk_summary",
        title: "Pipeline impact flagged on Carol's dashboard",
        summary:
          "Deal moved to at-risk. If lost: $18.9K revenue, $4.6K margin, and a repeat customer breaks pattern. Pulled forward to the watchlist.",
        rationale: [
          "Erie Shores has placed Oxivir orders in 6 of the last 6 half-year cycles.",
          "Breaking the pattern would be a leading indicator worth Carol's attention.",
        ],
        confidence: 0.97,
        suggestedAction: "Acknowledged (auto-applied to dashboard)",
        status: "approved",
        decidedBy: "System",
        decidedAt: tDays(0.5),
      },
    ],
    auditLog: [
      { at: tDays(15), actor: "Marco Ruiz", action: "Captured walk-up note at Erie Shores", detail: "Photo of notepad uploaded from phone", icon: "human" },
      { at: tDays(15), actor: "AI Agent", action: "Note transcribed; checklist extracted; routed to sourcing", icon: "ai" },
      { at: tDays(14.5), actor: "Purchasing", action: "Pricing confirmed with Diversey", icon: "approve" },
      { at: tDays(14), actor: "Marco Ruiz", action: "Quote sent to Tanya", icon: "human" },
      { at: tDays(7), actor: "AI Agent", action: "First check-in (no response): no action taken — within normal pause", icon: "ai" },
      { at: tDays(2), actor: "AI Agent", action: "Stall detected (14d silent). Flagged to dashboard.", icon: "ai" },
      { at: tDays(0.5), actor: "AI Agent", action: "Diversey supplier lead time increase detected (5d → 21d)", icon: "ai" },
      { at: t(-60), actor: "AI Agent", action: "Follow-up + alternative drafted, awaiting human approval", icon: "ai" },
    ],
    dataCaptured: [
      { field: "Customer", value: "Erie Shores Healthcare", source: "Customer Master", confidence: 1.0 },
      { field: "Contact", value: "Tanya Mukherjee", source: "Walk-up Capture" },
      { field: "Channel", value: "In-person walk-up (Leamington)", source: "Walk-up Capture", confidence: 1.0 },
      { field: "Product", value: "Diversey Oxivir Plus", source: "Walk-up Capture", confidence: 0.96 },
      { field: "Quantity", value: "~120 cases / quarter", source: "Walk-up Capture", confidence: 0.92 },
      { field: "Prior pattern", value: "6 of last 6 half-year cycles", source: "Prior Quotes", confidence: 0.99 },
      { field: "Budget cycle", value: "Approves end of month", source: "Walk-up Capture", confidence: 0.88 },
      { field: "Quote status", value: "Sent 14d ago · silent", source: "Procurement Tool", confidence: 1.0 },
      { field: "Supplier lead time", value: "Up from 5d → 21d (Friday)", source: "Supplier History", confidence: 1.0 },
      { field: "Alternative SKU", value: "Oxivir Tb (faster availability)", source: "AI Inference", confidence: 0.83 },
    ],
  },
];

export function getCase(id: string): CaseFile | undefined {
  return CASE_FILES.find((c) => c.id === id);
}

export const SCENARIOS_BY_KEY = {
  stock_save: CASE_FILES[0],
  credit_catch: CASE_FILES[1],
  complex_sourcing: CASE_FILES[2],
  stalled_rescue: CASE_FILES[3],
};

// Recent activity feed for the dashboard
export const RECENT_ACTIVITY = [
  { at: t(-3), actor: "AI Agent", action: "Caesars Windsor glove order — quote drafted, awaiting Sarah", caseId: "case-001", tone: "info" as const },
  { at: t(-12), actor: "AI Agent", action: "Lakeshore $45K chemicals — AR brief ready for Director of Sales", caseId: "case-002", tone: "warn" as const },
  { at: t(-60), actor: "AI Agent", action: "Erie Shores 14-day silent quote — rescue email drafted", caseId: "case-004", tone: "warn" as const },
  { at: t(-180), actor: "AI Agent", action: "Riverbend embossing — 3-supplier comparison built", caseId: "case-003", tone: "info" as const },
  { at: t(-240), actor: "Sarah Pham", action: "Approved AI quote draft for St. Clair napkin run", tone: "ok" as const },
  { at: t(-360), actor: "AI Agent", action: "Hiram Walker degreaser — RFQ sent to 2 suppliers", tone: "info" as const },
  { at: t(-420), actor: "Dan Friesen", action: "Closed PR-24114 — Windsor Assembly $9.8K", tone: "ok" as const },
];

// Stage counts for funnel
export function pipelineByStage() {
  const counts: Record<string, { count: number; value: number }> = {};
  for (const d of PIPELINE) {
    if (!counts[d.stage]) counts[d.stage] = { count: 0, value: 0 };
    counts[d.stage].count += 1;
    counts[d.stage].value += d.value;
  }
  return counts;
}
