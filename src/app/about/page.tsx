import Link from "next/link";
import { Card, CardHeader, Pill } from "@/components/Card";
import { SystemDiagram } from "@/components/SystemDiagram";

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-[980px] px-6 py-10 space-y-8">
      <div>
        <Pill tone="brand">How this works</Pill>
        <h1 className="mt-3 text-[34px] font-semibold text-white tracking-tight leading-tight">
          Same process you already use,<br />
          <span className="text-[var(--brand-orange)]">finished in a fraction of the time.</span>
        </h1>
        <p className="mt-4 text-[15px] text-[var(--brand-muted)] max-w-[720px]">
          This sits alongside your existing procurement workflow (MWI-0703-02). Nothing about
          who does what changes. What changes is that AI reads everything that comes in,
          drafts the boring parts, and shows it to the right person to approve.
          More deals closed. Less time chasing paperwork.
        </p>
      </div>

      <SystemDiagram />

      <Card>
        <CardHeader title="The money picture" subtitle="What changes for Merchants once this is on" />
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <NumberTile
            value="6.2d → 1.8d"
            label="Special-order cycle time"
            body="From the moment a customer asks, to the moment they get a quote. Faster quote, more wins."
          />
          <NumberTile
            value="$34K"
            label="Margin recovered every month"
            body="AI catches requests that look like 'special orders' but are actually in stock. No supplier markup needed."
          />
          <NumberTile
            value="$127K"
            label="AR exposure caught before it became a problem"
            body="Before sales spends hours quoting a customer with stale receivables, AI flags it."
          />
          <NumberTile
            value="31.5h / week"
            label="Hours your team gets back"
            body="Less re-keying, less chasing, less back-and-forth. More selling."
          />
        </div>
      </Card>

      <Card>
        <CardHeader
          title="The principle"
          subtitle="AI drafts. People decide. AI then sends what was approved."
        />
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Tile
            num="1"
            title="AI reads & drafts"
            body="Email, voicemail, walk-up note, PDF, portal form — AI pulls out what matters and writes a draft response."
          />
          <Tile
            num="2"
            title="A person approves"
            body="Sales Assistant, AR, or Purchasing clicks Approve, Edit, or Reject. Nothing leaves Merchants without that click."
          />
          <Tile
            num="3"
            title="AI does the busywork"
            body="Once approved, AI sends the email, files the case, updates the audit trail, and moves on to the next thing."
          />
        </div>
      </Card>

      <Card>
        <CardHeader
          title="What you can put into it"
          subtitle="Both directions — customers in, suppliers in. Quotes & orders out."
        />
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <DirectionTile
            arrow="↓"
            tone="in"
            title="Coming IN"
            items={[
              "Customer emails asking for quotes",
              "Customer-uploaded PDFs (RFQs, POs, specs)",
              "Voicemails from customers",
              "A rep's notes from a customer visit",
              "Portal form submissions",
              "Supplier quotes coming back as PDFs",
              "Supplier lead-time updates",
            ]}
          />
          <DirectionTile
            arrow="↑"
            tone="out"
            title="Going OUT (after a human approves)"
            items={[
              "Quote replies to customers",
              "Follow-ups on stalled quotes",
              "RFQs sent to suppliers",
              "Special Order Confirmations to customers",
              "POs to suppliers",
              "Internal notes to AR, Purchasing, Sales",
            ]}
          />
        </div>
        <div className="px-6 pb-5 text-[12.5px] text-[var(--brand-muted)] italic">
          Try it now — go to <Link href="/demo" className="text-[var(--brand-orange)] hover:underline">Run AI live</Link> and drop in a PDF from a customer or a supplier. Watch it process either direction.
        </div>
      </Card>

      <Card>
        <CardHeader
          title="The four scenarios this prototype covers"
          subtitle="Each one is a fully clickable case file"
        />
        <div className="divide-y divide-[var(--brand-line)]/60">
          <Row
            badge="Should have been stock"
            title="Customer asks for a special order — AI realizes it isn't"
            body="The first decision in your MWI-0703-02 workflow is 'can we fulfill from stock?' AI checks the catalog before anyone starts working — recovers margin lost to needless special-order markup."
            link="/case/case-001"
          />
          <Row
            badge="Credit risk caught early"
            title="$45K of effort prevented before it starts"
            body="When AR has cause for concern, AI prepares the brief — aging buckets, NSF history, year-over-year trend, and three concrete paths — so the Director of Sales call takes minutes, not days."
            link="/case/case-002"
          />
          <Row
            badge="Complex sourcing"
            title="Three supplier quotes, one comparison table — ready for a human to pick"
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

      <Card>
        <CardHeader
          title="Trust grows over time"
          subtitle="AI starts as an assistant. It only earns more autonomy by proving itself."
        />
        <div className="p-6">
          <ol className="space-y-3 text-[13.5px]">
            <Step n="Today" body="AI suggests, drafts, scores. Every reply, every quote, every order requires a person to click Approve. You see every reason, every confidence score, every step." tone="brand" />
            <Step n="In a few months" body="Once you trust certain moves (sending RFQs to your usual suppliers, following up on a stalled quote), you flip them to auto. Easy to reverse. Easy to undo." tone="info" />
            <Step n="Later" body="More autonomy on the things that are working. The risky stuff — pricing, big customers, contract terms — still asks. You set the thresholds." tone="ok" />
          </ol>
        </div>
      </Card>

      <Card className="border-[var(--brand-green)]/30">
        <CardHeader
          title="Phase 2 — bringing this into your existing tools"
          subtitle="You're already paying for Google. This lives inside the tools your team already uses."
          right={<Pill tone="ok">No new logins</Pill>}
        />
        <div className="p-6 space-y-3 text-[13.5px]">
          <p className="text-[var(--brand-muted)] leading-relaxed">
            Right now this is a prototype on its own URL. The plan for Phase 2 is to move it
            inside the Google tools your team already opens every morning — no new software
            to learn, no new logins:
          </p>
          <ul className="space-y-2 text-[var(--brand-muted)]">
            <li className="flex gap-2"><span className="text-[var(--brand-green)]">▸</span><span><span className="text-white font-medium">In your team&apos;s Gmail.</span> When a customer email arrives, AI&apos;s draft reply appears in the message itself. The rep edits it if they want, then hits Send.</span></li>
            <li className="flex gap-2"><span className="text-[var(--brand-green)]">▸</span><span><span className="text-white font-medium">In a shared Sheet you already maintain.</span> The case file for each special order — what was extracted, who approved what, when — lives in a familiar spreadsheet, not a new system.</span></li>
            <li className="flex gap-2"><span className="text-[var(--brand-green)]">▸</span><span><span className="text-white font-medium">A message in Google Chat for approvals.</span> AR or Purchasing gets a Chat message: &ldquo;Approve this credit hold?&rdquo; with the AI&apos;s reasoning underneath. They click Approve or Reject right there.</span></li>
            <li className="flex gap-2"><span className="text-[var(--brand-green)]">▸</span><span><span className="text-white font-medium">Your daily numbers report.</span> A simple page you bookmark — cycle time, hours saved, money recovered, deals at risk. Same numbers you see here, but on your existing Google login.</span></li>
            <li className="flex gap-2"><span className="text-[var(--brand-green)]">▸</span><span><span className="text-white font-medium">Your data stays yours.</span> Everything runs inside your Google account. Nothing about your customers or AR ledger ever leaves your tenant.</span></li>
          </ul>
          <p className="text-[var(--brand-muted)] leading-relaxed mt-3">
            The prototype proves it works. Phase 2 plants it in the tools you already own.
          </p>
        </div>
      </Card>

      <div className="flex items-center justify-between gap-3 flex-wrap pt-2">
        <div className="text-[12px] text-[var(--brand-muted)]">
          Prototype for Merchants Paper Company Limited
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

function NumberTile({
  value,
  label,
  body,
}: {
  value: string;
  label: string;
  body: string;
}) {
  return (
    <div className="rounded-lg border border-[var(--brand-line)] bg-[var(--brand-charcoal-2)] p-5">
      <div className="text-[28px] font-semibold text-[var(--brand-orange)] tabular-nums leading-none">
        {value}
      </div>
      <div className="text-[12px] uppercase tracking-wider text-white/85 font-medium mt-1.5 mb-1">
        {label}
      </div>
      <p className="text-[12.5px] text-[var(--brand-muted)] leading-relaxed">{body}</p>
    </div>
  );
}

function DirectionTile({
  arrow,
  tone,
  title,
  items,
}: {
  arrow: string;
  tone: "in" | "out";
  title: string;
  items: string[];
}) {
  const accent =
    tone === "in"
      ? "border-[var(--brand-orange)]/40 bg-[var(--brand-orange)]/5"
      : "border-[var(--brand-green)]/40 bg-[var(--brand-green)]/5";
  const arrowColor = tone === "in" ? "text-[var(--brand-orange)]" : "text-[var(--brand-green)]";
  return (
    <div className={`rounded-lg border ${accent} p-4`}>
      <div className="flex items-center gap-2 mb-3">
        <span className={`text-[20px] ${arrowColor}`}>{arrow}</span>
        <span className="text-[11px] uppercase tracking-wider text-white font-semibold">
          {title}
        </span>
      </div>
      <ul className="space-y-1.5">
        {items.map((it) => (
          <li
            key={it}
            className="flex items-start gap-2 text-[12.5px] text-white/90"
          >
            <span className={`mt-1 h-1 w-1 rounded-full shrink-0 ${tone === "in" ? "bg-[var(--brand-orange)]" : "bg-[var(--brand-green)]"}`} />
            <span>{it}</span>
          </li>
        ))}
      </ul>
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
