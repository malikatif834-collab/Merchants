import Link from "next/link";
import { Pill } from "@/components/Card";
import { LiveAIPanel } from "@/components/LiveAIPanel";

export default function DemoPage() {
  return (
    <div className="mx-auto max-w-[1100px] px-6 py-10 space-y-6">
      <div className="flex items-center gap-3 text-[12px] text-[var(--brand-muted)]">
        <Link href="/" className="hover:text-white">← Dashboard</Link>
        <span>/</span>
        <span>Run AI live</span>
      </div>

      <div>
        <Pill tone="brand">Live AI demo</Pill>
        <h1 className="mt-3 text-[30px] font-semibold text-white tracking-tight">
          Watch the AI process a real inbound, end-to-end.
        </h1>
        <p className="mt-2 text-[14px] text-[var(--brand-muted)] max-w-[720px]">
          This is the same model your team will use in production. Pick a channel below
          (or paste your own inbound), click Run, and watch the AI classify, extract,
          stock-check, AR-score, and draft a customer reply in real time. Nothing sends —
          every recommendation waits for a human green button.
        </p>
      </div>

      <LiveAIPanel />

      <div className="rounded-lg border border-[var(--brand-line)] bg-[var(--brand-charcoal-2)] p-4 text-[12.5px] text-[var(--brand-muted)] leading-relaxed">
        <div className="text-white font-medium mb-1 text-[13px]">How this works</div>
        <ul className="space-y-1">
          <li>· The model is <span className="text-white">claude-opus-4-7</span> with adaptive thinking. It runs on Anthropic&apos;s infrastructure.</li>
          <li>· The system prompt is grounded in your real catalog SKUs, customers, AR data, and supplier history.</li>
          <li>· Output streams back as five structured sections: classify → checklist → stock-check → AR risk → recommendation.</li>
          <li>· In Phase 2 (Google Workspace), this same brain runs against your live Gmail, Sheets, AppSheet case file, and Looker dashboard.</li>
        </ul>
      </div>
    </div>
  );
}
