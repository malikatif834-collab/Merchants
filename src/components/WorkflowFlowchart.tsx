import type { DealStage } from "@/lib/types";

type StepKind = "process" | "decision" | "terminal";

interface FlowStep {
  id: string;
  label: string;
  kind: StepKind;
  stage?: DealStage;
  branch?: {
    yes?: { label: string; terminal?: string };
    no?: { label: string; terminal?: string };
  };
}

const STEPS: FlowStep[] = [
  {
    id: "opportunity",
    label: "Rep / Cust Svc identifies an opportunity",
    kind: "process",
    stage: "inquiry_received",
  },
  {
    id: "stock_q",
    label: "Can opportunity be fulfilled with a stock item?",
    kind: "decision",
    stage: "stock_check",
    branch: { yes: { label: "Yes", terminal: "Do so. Close procurement." } },
  },
  {
    id: "checklist",
    label: "Product Procurement Checklist filled out & submitted to Sales Assistant",
    kind: "process",
    stage: "checklist",
  },
  {
    id: "enter_tool",
    label: "Sales Assistant verifies form and enters into Procurement Tool",
    kind: "process",
    stage: "checklist",
  },
  {
    id: "notify_ar",
    label: "Notification of new Procurement sent to Accounts Receivable",
    kind: "process",
    stage: "ar_review",
  },
  {
    id: "ar_q",
    label: "Does A/R have cause for concern?",
    kind: "decision",
    stage: "ar_review",
    branch: {
      yes: {
        label: "Yes",
        terminal:
          "AR discusses with Sales Manager / Delegate · if Director agrees with AR, credit not approved, procurement closed.",
      },
    },
  },
  {
    id: "purchasing_notify",
    label: "Procurement Tool sends notification to Purchasing for approval",
    kind: "process",
    stage: "purchasing_review",
  },
  {
    id: "purchasing_q",
    label: "Does Purchasing Dept agree?",
    kind: "decision",
    stage: "purchasing_review",
    branch: {
      no: {
        label: "No",
        terminal: "Purchasing Dept denies request · notification sent to Sales Assistant & rep.",
      },
    },
  },
  {
    id: "source",
    label: "Purchasing sources, gets pricing, MOQs, delivery options, closes procurement",
    kind: "process",
    stage: "sourcing",
  },
  {
    id: "review_basis",
    label: "Director of Sales / Delegate reviews basis to bring product in",
    kind: "process",
    stage: "quote_drafted",
  },
  {
    id: "quote",
    label: "Quote issued by Sales Assistant or Sales Rep",
    kind: "process",
    stage: "quote_drafted",
  },
  {
    id: "followup",
    label: "Quote followed up by originator",
    kind: "process",
    stage: "quote_sent",
  },
  {
    id: "customer_q",
    label: "Does customer wish to proceed?",
    kind: "decision",
    stage: "awaiting_customer",
    branch: {
      no: { label: "No", terminal: "Originator finds an alternative solution to satisfy customer." },
    },
  },
  {
    id: "notify_purchasing",
    label: "Sales Assistant notifies Purchasing of sell price + RFQ / Procurement #",
    kind: "process",
    stage: "order_placed",
  },
  {
    id: "soc",
    label: "Purchasing prepares Special Order Confirmation, customer signs",
    kind: "process",
    stage: "order_placed",
  },
  {
    id: "submit",
    label: "Purchasing submits Customer Order to supplier",
    kind: "process",
    stage: "order_placed",
  },
];

const STAGE_RANK: Record<DealStage, number> = {
  inquiry_received: 0,
  stock_check: 1,
  checklist: 2,
  ar_review: 3,
  purchasing_review: 4,
  sourcing: 5,
  quote_drafted: 6,
  quote_sent: 7,
  awaiting_customer: 8,
  order_placed: 9,
  closed_won: 10,
  closed_lost: 10,
};

function statusFor(step: FlowStep, currentStage: DealStage): "done" | "current" | "future" {
  if (!step.stage) return "future";
  const cur = STAGE_RANK[currentStage];
  const st = STAGE_RANK[step.stage];
  if (st < cur) return "done";
  if (st === cur) return "current";
  return "future";
}

export function WorkflowFlowchart({ currentStage }: { currentStage: DealStage }) {
  return (
    <div className="space-y-2">
      <div className="text-[10px] uppercase tracking-wider text-[var(--brand-muted)] mb-2">
        MWI-0703-02 · Rev 1.6
      </div>
      {STEPS.map((s, i) => {
        const status = statusFor(s, currentStage);
        const isLast = i === STEPS.length - 1;
        return (
          <div key={s.id}>
            <Node step={s} status={status} />
            {!isLast && <Connector />}
          </div>
        );
      })}
    </div>
  );
}

function Node({
  step,
  status,
}: {
  step: FlowStep;
  status: "done" | "current" | "future";
}) {
  const tone =
    status === "current"
      ? "border-[var(--brand-orange)] bg-[var(--brand-orange)]/8"
      : status === "done"
        ? "border-[var(--brand-green)]/40 bg-[var(--brand-green)]/5"
        : "border-[var(--brand-line)] bg-[var(--brand-charcoal-2)]";

  const text =
    status === "current"
      ? "text-white"
      : status === "done"
        ? "text-white/85"
        : "text-[var(--brand-muted)]";

  if (step.kind === "decision") {
    return (
      <div>
        <div
          className={`relative rounded-md border-2 ${tone} p-2.5 pl-3 text-[11.5px] leading-snug ${text}`}
        >
          <div className="flex items-start gap-2">
            <span className="font-mono text-[10px] mt-0.5 text-[var(--brand-orange)] shrink-0">◇</span>
            <span>{step.label}</span>
            {status === "current" && <Dot />}
          </div>
        </div>
        {step.branch && (
          <div className="ml-4 mt-1 space-y-1">
            {step.branch.yes && (
              <BranchLine label={step.branch.yes.label} terminal={step.branch.yes.terminal} />
            )}
            {step.branch.no && (
              <BranchLine label={step.branch.no.label} terminal={step.branch.no.terminal} />
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className={`relative rounded-md border ${tone} p-2.5 text-[11.5px] leading-snug ${text}`}
    >
      <div className="flex items-start gap-2">
        {status === "done" && <span className="text-[var(--brand-green)] mt-0.5">✓</span>}
        <span>{step.label}</span>
        {status === "current" && <Dot />}
      </div>
    </div>
  );
}

function Dot() {
  return (
    <span className="ml-auto h-2 w-2 rounded-full bg-[var(--brand-orange)] pulse-orange mt-1.5 shrink-0" />
  );
}

function Connector() {
  return (
    <div className="ml-3 my-1 h-3 w-[2px] bg-[var(--brand-line)]" aria-hidden />
  );
}

function BranchLine({ label, terminal }: { label: string; terminal?: string }) {
  return (
    <div className="flex items-start gap-2 text-[10.5px] text-[var(--brand-muted)] leading-snug">
      <span className="px-1.5 py-0.5 rounded bg-[var(--brand-charcoal-3)] border border-[var(--brand-line)] text-[9.5px] uppercase tracking-wider shrink-0 mt-0.5">
        {label}
      </span>
      {terminal && <span className="italic">{terminal}</span>}
    </div>
  );
}
