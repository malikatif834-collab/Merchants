import { Card, CardHeader, Pill } from "./Card";
import { relativeTime } from "@/lib/format";
import type {
  Customer,
  Inbound,
  PortalInbound,
  PhoneInbound,
  WalkupInbound,
  EmailInbound,
} from "@/lib/types";

const CHANNEL_LABEL: Record<Inbound["channel"], string> = {
  email: "Email",
  portal: "Customer portal",
  phone: "Voicemail / phone",
  walkup: "In-person walk-up",
};

const CHANNEL_ICON: Record<Inbound["channel"], string> = {
  email: "✉",
  portal: "▦",
  phone: "☎",
  walkup: "✎",
};

export function InboundCard({
  inbound,
  customer,
}: {
  inbound: Inbound;
  customer: Customer;
}) {
  return (
    <Card>
      <CardHeader
        title={
          <span className="flex items-center gap-2">
            <span>What started this</span>
            <Pill tone="brand">
              {CHANNEL_ICON[inbound.channel]} {CHANNEL_LABEL[inbound.channel]}
            </Pill>
          </span>
        }
        subtitle={`Inbound from ${customer.name}`}
        right={<Pill tone="info">{relativeTime(inbound.receivedAt)}</Pill>}
      />
      <div className="p-5">
        {inbound.channel === "email" && <EmailView inbound={inbound} />}
        {inbound.channel === "portal" && <PortalView inbound={inbound} />}
        {inbound.channel === "phone" && <PhoneView inbound={inbound} />}
        {inbound.channel === "walkup" && <WalkupView inbound={inbound} />}
      </div>
    </Card>
  );
}

function EmailView({ inbound }: { inbound: EmailInbound }) {
  return (
    <div>
      <Row label="From" value={inbound.from} />
      <Row label="Subject" value={inbound.subject} className="mt-3" />
      <div className="text-[11px] text-[var(--brand-muted)] mt-3 mb-1">Body</div>
      <pre className="bg-[var(--brand-ink)] border border-[var(--brand-line)]/60 rounded-md p-3 text-[13px] text-white/90 whitespace-pre-wrap font-sans leading-relaxed">
{inbound.body}
      </pre>
    </div>
  );
}

function PortalView({ inbound }: { inbound: PortalInbound }) {
  return (
    <div>
      <div className="rounded-md border border-[var(--brand-line)]/60 bg-[var(--brand-ink)] overflow-hidden">
        <div className="px-4 py-2.5 border-b border-[var(--brand-line)]/60 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] text-[var(--brand-orange)]">{inbound.formName}</span>
          </div>
          <div className="text-[11px] text-[var(--brand-muted)]">
            Submitted {relativeTime(inbound.submittedAt)} by {inbound.submittedBy}
          </div>
        </div>
        <table className="w-full text-[13px]">
          <tbody>
            {inbound.formFields.map((f, i) => (
              <tr
                key={i}
                className="border-b border-[var(--brand-line)]/40 last:border-0"
              >
                <td className="px-4 py-2 text-[11.5px] text-[var(--brand-muted)] w-1/3">
                  {f.label}
                </td>
                <td className="px-4 py-2 text-white">{f.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {inbound.notes && (
          <div className="px-4 py-3 border-t border-[var(--brand-line)]/60 text-[12px] text-[var(--brand-muted)]">
            <span className="text-white/80 font-medium">Notes:</span> {inbound.notes}
          </div>
        )}
      </div>
    </div>
  );
}

function PhoneView({ inbound }: { inbound: PhoneInbound }) {
  const mins = Math.floor(inbound.durationSeconds / 60);
  const secs = inbound.durationSeconds % 60;
  return (
    <div>
      <div className="flex items-center justify-between gap-3 mb-3">
        <div>
          <Row label="From" value={inbound.from} />
          <Row label="Captured by" value={inbound.capturedBy} className="mt-2" />
        </div>
        <div className="text-right">
          <div className="text-[10px] uppercase tracking-wider text-[var(--brand-muted)]">Duration</div>
          <div className="text-[18px] font-semibold text-white tabular-nums">
            {mins}:{String(secs).padStart(2, "0")}
          </div>
        </div>
      </div>

      <Waveform />

      <div className="mt-3 text-[11px] text-[var(--brand-muted)] mb-2">
        AI transcription
      </div>
      <div className="rounded-md border border-[var(--brand-line)]/60 bg-[var(--brand-ink)] p-3 space-y-2.5">
        {inbound.transcript.map((line, i) => (
          <div key={i} className="flex gap-3 text-[13px]">
            <span
              className={`text-[10px] uppercase tracking-wider shrink-0 mt-1 w-16 ${
                line.speaker === "customer"
                  ? "text-[var(--brand-orange)]"
                  : line.speaker === "rep"
                    ? "text-[var(--brand-green)]"
                    : "text-[var(--brand-muted)]"
              }`}
            >
              {line.speaker === "vm" ? "system" : line.speaker}
            </span>
            <span
              className={
                line.speaker === "vm"
                  ? "italic text-[var(--brand-muted)] text-[12px]"
                  : "text-white/90 leading-relaxed"
              }
            >
              {line.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Waveform() {
  const bars = Array.from({ length: 64 }, (_, i) =>
    0.25 + 0.55 * Math.abs(Math.sin(i * 0.43) + 0.3 * Math.cos(i * 0.17))
  );
  return (
    <div className="rounded-md border border-[var(--brand-line)]/60 bg-[var(--brand-ink)] p-3">
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="h-9 w-9 rounded-full bg-[var(--brand-orange)] text-[var(--brand-ink)] font-bold flex items-center justify-center shrink-0"
          aria-label="Play voicemail"
        >
          ▶
        </button>
        <div className="flex-1 flex items-center gap-[2px] h-9 overflow-hidden">
          {bars.map((h, i) => (
            <div
              key={i}
              className="w-[3px] rounded-full bg-[var(--brand-orange)]/60"
              style={{ height: `${Math.min(100, h * 100)}%` }}
            />
          ))}
        </div>
        <div className="text-[11px] text-[var(--brand-muted)] tabular-nums">0:00 / 1:32</div>
      </div>
    </div>
  );
}

function WalkupView({ inbound }: { inbound: WalkupInbound }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      <div>
        <div className="text-[11px] text-[var(--brand-muted)] mb-1">
          Captured by {inbound.capturedBy}
        </div>
        <div className="text-[11px] text-[var(--brand-muted)] mb-2">
          {inbound.location}
        </div>
        <div
          className="rounded-md p-4 text-[14px] leading-relaxed font-mono text-[#2b2b2b] shadow-inner"
          style={{
            background:
              "repeating-linear-gradient(to bottom, #FAF5DC 0px, #FAF5DC 26px, #E8DFA9 27px, #FAF5DC 28px)",
            border: "1px solid #C5BB7E",
          }}
        >
          <pre className="whitespace-pre-wrap font-mono">{inbound.rawNote}</pre>
        </div>
        <div className="mt-2 text-[10px] text-[var(--brand-muted)] uppercase tracking-wider">
          📷 Photo of rep&apos;s notepad
        </div>
      </div>
      <div>
        <div className="text-[11px] text-[var(--brand-muted)] mb-2">AI transcription &amp; structuring</div>
        <div className="rounded-md border border-[var(--brand-orange)]/30 bg-[var(--brand-orange)]/5 p-3 text-[13px] text-white/95 leading-relaxed">
          {inbound.aiTranscription}
        </div>
        <div className="mt-2 text-[11px] text-[var(--brand-muted)]">
          Recognized handwriting · matched customer from photo metadata + rep context
        </div>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  className,
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <div className="text-[11px] text-[var(--brand-muted)] mb-1">{label}</div>
      <div className="text-[13.5px] text-white font-medium">{value}</div>
    </div>
  );
}
