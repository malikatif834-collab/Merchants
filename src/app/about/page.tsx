import Link from "next/link";
import { Card, CardHeader, Pill } from "@/components/Card";
import { SystemDiagram } from "@/components/SystemDiagram";

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-[980px] px-6 py-10 space-y-8">
      <div>
        <Pill tone="brand">How this works</Pill>
        <h1 className="mt-3 text-[34px] font-semibold text-white tracking-tight leading-tight">
          The same workflow you signed off on,<br />
          <span className="text-[var(--brand-orange)]">supervised by AI at every step.</span>
        </h1>
        <p className="mt-4 text-[14.5px] text-[var(--brand-muted)] max-w-[720px]">
          This prototype maps directly onto your existing Work Instruction
          MWI-0703-02 for Product Procurement. Nothing in the process changes.
          What changes is how much of the cognitive work your team does by hand,
          versus what AI prepares for their approval.
        </p>
      </div>

      <SystemDiagram />

      <Card>
        <CardHeader title="The principle" subtitle="Recommend → approve → execute" />
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Tile
            num="1"
            title="AI recommends"
            body="Drafts the checklist, the email, the supplier shortlist, the quote, the AR brief. Always with reasoning and a confidence score."
          />
          <Tile
            num="2"
            title="Human approves"
            body="Your team sees the recommendation in context and clicks Approve, Edit, or Reject. Nothing reaches a customer or supplier without it."
          />
          <Tile
            num="3"
            title="AI executes"
            body="Once approved, AI sends the email, updates the case file, advances the workflow stage. Then logs it to the audit trail."
          />
        </div>
      </Card>

      <Card>
        <CardHeader
          title="What the prototype covers"
          subtitle="Four real scenarios from your workflow, fully clickable"
        />
        <div className="divide-y divide-[var(--brand-line)]/60">
          <Row
            badge="Should have been stock"
            title="Customer asks for a special order — AI realizes it isn't"
            body="The first decision in your MWI-0703-02 workflow is 'can we fulfill from stock?' This is where AI semantically matches the request to your catalog and recovers margin lost to needless special-order markup."
            link="/case/case-001"
          />
          <Row
            badge="Credit risk caught early"
            title="$45K of effort prevented before it starts"
            body="When AR has cause for concern, AI prepares the brief — aging buckets, NSF history, YoY trend, and three concrete paths — so the Director of Sales call takes minutes, not days."
            link="/case/case-002"
          />
          <Row
            badge="Complex sourcing"
            title="Three suppliers, one comparable table, ready for a human to pick"
            body="For genuine special orders, AI shortlists suppliers from your history, drafts the RFQs, parses returned quote PDFs, and normalizes them into a single comparison view."
            link="/case/case-003"
          />
          <Row
            badge="Stalled deal rescue"
            title="AI doesn't just react — it watches"
            body="When quotes go silent, AI drafts the rescue email, surfaces lead-time alternatives if relevant, and flags the deal on your dashboard before it dies of neglect."
            link="/case/case-004"
          />
        </div>
      </Card>

      <Card className="border-[var(--brand-green)]/30">
        <CardHeader
          title="Phase 2 — embedded in your Google Workspace"
          subtitle="Once value is proven, this lives where your team already works"
          right={<Pill tone="ok">CleanBeyondGreen path</Pill>}
        />
        <div className="p-6 space-y-3 text-[13.5px]">
          <p className="text-[var(--brand-muted)] leading-relaxed">
            You&apos;re already paying for Google Enterprise Plus. Phase 2 surfaces this
            AI exactly where your team works today, not in a separate tool:
          </p>
          <ul className="space-y-2 text-[var(--brand-muted)]">
            <li className="flex gap-2"><span className="text-[var(--brand-green)]">▸</span><span><span className="text-white font-medium">Gmail sidecar</span> for reps and Sales Assistants — AI drafts replies and checklist entries in the message thread itself.</span></li>
            <li className="flex gap-2"><span className="text-[var(--brand-green)]">▸</span><span><span className="text-white font-medium">AppSheet</span> for the procurement case file and audit trail — no separate database to maintain.</span></li>
            <li className="flex gap-2"><span className="text-[var(--brand-green)]">▸</span><span><span className="text-white font-medium">Google Chat space</span> for AR and Purchasing approvals — buttons in the message, no logins.</span></li>
            <li className="flex gap-2"><span className="text-[var(--brand-green)]">▸</span><span><span className="text-white font-medium">Vertex AI / Gemini</span> as the brain — your data stays in your tenant.</span></li>
            <li className="flex gap-2"><span className="text-[var(--brand-green)]">▸</span><span><span className="text-white font-medium">Looker Studio</span> for the executive dashboard — exactly the numbers Carol sees here, on the same login.</span></li>
          </ul>
          <p className="text-[var(--brand-muted)] leading-relaxed mt-3">
            The prototype proves the workflow. Phase 2 plants it in the soil you already own.
          </p>
        </div>
      </Card>

      <Card>
        <CardHeader title="Trust ladder" subtitle="When does AI graduate from assistant to autonomous?" />
        <div className="p-6">
          <ol className="space-y-3 text-[13.5px]">
            <Step n="Now" body="AI recommends. Every action requires a human green button. You see every reason, every confidence score, every step." tone="brand" />
            <Step n="Next" body="Low-risk moves (RFQ sending, stalled-deal follow-ups, internal alerts) flip to auto-execute. Easy to reverse. High value, low downside." tone="info" />
            <Step n="Later" body="Once you trust specific moves at specific confidence levels, auto-execute expands. You configure the thresholds. Anything below threshold still asks." tone="ok" />
          </ol>
        </div>
      </Card>

      <div className="flex items-center justify-between gap-3 flex-wrap pt-2">
        <div className="text-[12px] text-[var(--brand-muted)]">
          Prototype for Merchants Paper Company Limited · {new Date().toLocaleDateString("en-CA")}
        </div>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-[var(--brand-orange)] hover:bg-[var(--brand-orange-600)] text-[var(--brand-ink)] font-semibold px-4 py-2 rounded-lg text-sm transition-colors"
        >
          Back to dashboard →
        </Link>
      </div>
    </div>
  );
}

function Tile({ num, title, body }: { num: string; title: string; body: string }) {
  return (
    <div className="rounded-lg border border-[var(--brand-line)] bg-[var(--brand-charcoal-2)] p-4">
      <div className="h-7 w-7 rounded-md bg-[var(--brand-orange)] text-[var(--brand-ink)] font-bold flex items-center justify-center text-[14px] mb-2">
        {num}
      </div>
      <div className="text-[15px] font-semibold text-white mb-1">{title}</div>
      <p className="text-[12.5px] text-[var(--brand-muted)] leading-relaxed">{body}</p>
    </div>
  );
}

function Row({
  badge,
  title,
  body,
  link,
}: {
  badge: string;
  title: string;
  body: string;
  link: string;
}) {
  return (
    <div className="p-5 flex flex-col md:flex-row gap-4 md:items-center hover:bg-[var(--brand-charcoal-2)]/40 transition-colors">
      <div className="md:w-44 shrink-0">
        <span className="text-[10px] uppercase tracking-[0.16em] text-[var(--brand-orange)] font-semibold">{badge}</span>
      </div>
      <div className="flex-1">
        <div className="text-[15px] font-semibold text-white mb-0.5">{title}</div>
        <div className="text-[12.5px] text-[var(--brand-muted)] leading-relaxed">{body}</div>
      </div>
      <Link href={link} className="text-[12.5px] text-[var(--brand-orange)] hover:underline shrink-0">
        Walk through →
      </Link>
    </div>
  );
}

function Step({
  n,
  body,
  tone,
}: {
  n: string;
  body: string;
  tone: "brand" | "info" | "ok";
}) {
  const colors = {
    brand: "bg-[var(--brand-orange)] text-[var(--brand-ink)]",
    info: "bg-white/10 text-white",
    ok: "bg-[var(--brand-green)] text-[var(--brand-ink)]",
  };
  return (
    <li className="flex gap-3 items-start">
      <span className={`text-[11px] uppercase tracking-wider font-semibold px-2.5 py-1 rounded-md ${colors[tone]} shrink-0`}>
        {n}
      </span>
      <span className="text-[var(--brand-muted)] leading-relaxed pt-0.5">{body}</span>
    </li>
  );
}
