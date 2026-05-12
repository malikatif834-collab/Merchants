import Link from "next/link";
import { Card, Pill } from "@/components/Card";
import { money } from "@/lib/format";
import { KPIS, revenueBookedThisMonth } from "@/lib/data";

export default function AboutPage() {
  const revenue = revenueBookedThisMonth();
  return (
    <div className="mx-auto max-w-[860px] px-6 py-10 space-y-10">
      <header>
        <Pill tone="brand">What this does</Pill>
        <h1 className="mt-3 text-[36px] font-semibold text-white tracking-tight leading-[1.05]">
          AI does the paperwork.<br />
          <span className="text-[var(--brand-orange)]">Your team makes the calls.</span>
        </h1>
        <p className="mt-4 text-[15px] text-[var(--brand-muted)] leading-relaxed max-w-[620px]">
          Every customer request — email, phone, walk-in, PDF — flows through one place.
          AI reads it, drafts the answer, talks to suppliers, tracks the order, and books the
          revenue. Your team approves every step. Same procurement process you already use,
          just faster and with nothing falling through the cracks.
        </p>
      </header>

      {/* SECTION 1: NUMBERS */}
      <section className="space-y-3">
        <div className="text-[11px] uppercase tracking-[0.18em] text-[var(--brand-orange)] font-semibold">
          1 · What changes for Merchants
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Number value={`${KPIS.cycleTimeBefore}d → ${KPIS.cycleTimeNow}d`} label="Faster quotes" />
          <Number value={money(KPIS.stockRecovered, { compact: true })} label="Margin recovered" />
          <Number value={money(KPIS.arExposureCaught, { compact: true })} label="AR risk caught" />
          <Number value={`${KPIS.hoursSaved}h / wk`} label="Hours back to your team" />
        </div>
        <p className="text-[12.5px] text-[var(--brand-muted)] italic leading-relaxed pt-1">
          Plus {money(revenue, { compact: true })} of orders fulfilled and paid this month — tracked from
          the customer&apos;s first email all the way through to revenue booked.
        </p>
      </section>

      {/* SECTION 2: THE FLOW */}
      <section className="space-y-3">
        <div className="text-[11px] uppercase tracking-[0.18em] text-[var(--brand-orange)] font-semibold">
          2 · The whole flow, both ways
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FlowCard
            tone="in"
            title="Coming in"
            items={[
              "Customer email asking for a quote",
              "Customer PDF (RFQ, PO, spec sheet)",
              "Voicemail or phone call",
              "Rep's note from a customer visit",
              "Order portal submission",
              "Supplier's quote coming back as a PDF",
            ]}
          />
          <FlowCard
            tone="out"
            title="Going out (only after a person approves)"
            items={[
              "Quote reply to the customer",
              "Follow-up on a stalled quote",
              "RFQ to suppliers",
              "Signed Special Order Confirmation",
              "PO sent to supplier",
              "Order tracking → delivery → invoice → revenue",
            ]}
          />
        </div>
        <div className="rounded-md border border-[var(--brand-line)] bg-[var(--brand-charcoal-2)] p-3 text-[12.5px] text-[var(--brand-muted)] leading-relaxed">
          The flow follows your existing Work Instruction MWI-0703-02 step for step.
          AI doesn&apos;t replace any of it — it just does the typing, looking-up,
          and chasing while your people focus on the judgment calls.
        </div>
      </section>

      {/* SECTION 3: PHASE 2 */}
      <section className="space-y-3">
        <div className="text-[11px] uppercase tracking-[0.18em] text-[var(--brand-orange)] font-semibold">
          3 · What Phase 2 looks like — inside your existing tools
        </div>
        <div className="rounded-lg border border-[var(--brand-green)]/30 bg-[var(--brand-green)]/5 p-5 space-y-2.5 text-[13.5px] text-white/90 leading-relaxed">
          <p>
            Right now this prototype lives on its own URL so you can poke at it. Once you say go,
            we move it inside the Google tools your team already opens every morning. No new
            software to learn. No new logins.
          </p>
          <ul className="space-y-1.5 pt-1">
            <Phase2Line bold="In your team's Gmail." body="AI's draft replies appear in the message itself. Rep edits if they want, then hits Send." />
            <Phase2Line bold="In a shared spreadsheet you already keep." body="The procurement record for every order lives in a familiar Sheet — not a new system to maintain." />
            <Phase2Line bold="A message for approvals." body="AR or Purchasing gets a chat: 'Approve this hold?' with the reasoning. They click Approve or Reject." />
            <Phase2Line bold="Your daily numbers report." body="One bookmarked page — cycle time, hours saved, revenue, deals at risk. Your existing Google login." />
            <Phase2Line bold="Your data stays yours." body="Runs inside your Google account. Customer info, AR ledger, supplier history — never leaves." />
          </ul>
        </div>
      </section>

      <footer className="flex items-center justify-between gap-3 flex-wrap pt-4 border-t border-[var(--brand-line)]/60">
        <div className="text-[12px] text-[var(--brand-muted)]">
          Merchants Paper Company &middot; the friendly supply house. since 1941.
        </div>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-[var(--brand-orange)] hover:bg-[var(--brand-orange-600)] text-[var(--brand-ink)] font-semibold px-4 py-2 rounded-lg text-sm transition-colors"
        >
          Back to your dashboard →
        </Link>
      </footer>
    </div>
  );
}

function Number({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-lg border border-[var(--brand-line)] bg-[var(--brand-charcoal-2)] p-4">
      <div className="text-[22px] lg:text-[26px] font-semibold text-[var(--brand-orange)] tabular-nums leading-none">
        {value}
      </div>
      <div className="text-[11.5px] text-[var(--brand-muted)] mt-2 leading-tight">
        {label}
      </div>
    </div>
  );
}

function FlowCard({
  tone,
  title,
  items,
}: {
  tone: "in" | "out";
  title: string;
  items: string[];
}) {
  const accent =
    tone === "in"
      ? "border-[var(--brand-orange)]/40 bg-[var(--brand-orange)]/5"
      : "border-[var(--brand-green)]/40 bg-[var(--brand-green)]/5";
  const arrow = tone === "in" ? "↓" : "↑";
  const arrowColor = tone === "in" ? "text-[var(--brand-orange)]" : "text-[var(--brand-green)]";
  return (
    <div className={`rounded-lg border ${accent} p-4`}>
      <div className="flex items-center gap-2 mb-3">
        <span className={`text-[22px] ${arrowColor} leading-none`}>{arrow}</span>
        <span className="text-[12px] uppercase tracking-wider text-white font-semibold">
          {title}
        </span>
      </div>
      <ul className="space-y-1.5">
        {items.map((it) => (
          <li
            key={it}
            className="flex items-start gap-2 text-[13px] text-white/90"
          >
            <span
              className={`mt-1.5 h-1 w-1 rounded-full shrink-0 ${tone === "in" ? "bg-[var(--brand-orange)]" : "bg-[var(--brand-green)]"}`}
            />
            <span>{it}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function Phase2Line({ bold, body }: { bold: string; body: string }) {
  return (
    <li className="flex gap-2.5">
      <span className="text-[var(--brand-green)] shrink-0">▸</span>
      <span>
        <span className="text-white font-medium">{bold}</span> {body}
      </span>
    </li>
  );
}
