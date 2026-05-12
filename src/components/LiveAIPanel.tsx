"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Card, Pill } from "./Card";

interface Preset {
  key: string;
  label: string;
  channel: string;
  text: string;
}

const PRESETS: Preset[] = [
  {
    key: "email",
    label: "Inbound email",
    channel: "Email · Caesars Windsor",
    text: `From: Mireille Lacasse <m.lacasse@caesars-windsor.example>
Subject: Re: glove restock — need 200 cases this week

Hi Sarah,

We're going through gloves faster than expected on the casino floor and back-of-house. Can you get me a quote for 200 cases of nitrile gloves — powder free, blue, large? We need them by Friday if at all possible.

Last time we ordered from you it was a special order so I'm flagging it early.

Thanks,
Mireille
F&B Operations, Caesars Windsor`,
  },
  {
    key: "portal",
    label: "Portal form",
    channel: "Customer portal · Lakeshore Hospitality",
    text: `merchants.ca · Quote Request form
Submitted by: Rick Bonduriansky · rick@lakeshorehg.example
Customer: Lakeshore Hospitality Group (LHG-0042)
Properties: 3 (Kingsville, Leamington, Pelee)

Line 1: Diversey Oxivir Plus — 24 cases
Line 2: Floor stripper concentrate — 12 drums
Line 3: Glass cleaner concentrate — 18 cases
Line 4: Laundry detergent commercial — 30 jugs
Line 5: Misc dispensers and refills

Target value: ~$45,000 CAD
Needed by: end of next week
Notes: Same list as last quarter, roughly.`,
  },
  {
    key: "phone",
    label: "Voicemail transcript",
    channel: "Phone · Riverbend Suites",
    text: `Voicemail received Friday 4:42 PM. Caller: Jenna Albuquerque, Riverbend Suites & Conference. Duration: 1:32.

Transcript:
"Hey Sarah, it's Jenna over at Riverbend. So we're upgrading our amenities and want to go to a logo-embossed roll towel for the guest rooms and conference areas. We'd want to do this in your CleanBeyondGreen eco-line — the natural color one — with our Riverbend mark embossed once per foot or so. Hardwound, around 800 feet per roll, six rolls per case I think is what your spec sheet had. We'd need 240 cases for the initial rollout. And then if it goes well, we'd probably want to do a quarterly recurring after that. So can you put together a number for us? Cost and lead time both. Call me back when you can. Thanks!"`,
  },
  {
    key: "walkup",
    label: "Walk-up note",
    channel: "In-person · Erie Shores Healthcare",
    text: `Rep walk-up capture by Marco Ruiz at Erie Shores Healthcare, Materials office, Leamington.

Photo of notepad (handwriting transcribed):
"Tanya - planning next 6mo
Oxivir Plus same as fall '25
~120 cs / qtr cadence
budget cycle approves end of month
quote this week pls"`,
  },
  {
    key: "blank",
    label: "Blank — paste your own",
    channel: "Anything",
    text: "",
  },
];

type Status = "idle" | "thinking" | "streaming" | "done" | "error";

const STEPS = [
  { key: "CLASSIFY", label: "Classifying channel & intent" },
  { key: "CHECKLIST", label: "Extracting procurement checklist" },
  { key: "STOCK_CHECK", label: "Checking inventory for stock match" },
  { key: "AR_RISK", label: "Assessing AR risk" },
  { key: "RECOMMENDATION", label: "Drafting recommendation" },
];

export function LiveAIPanel({ compact = false }: { compact?: boolean }) {
  const [presetKey, setPresetKey] = useState<string>("email");
  const [input, setInput] = useState<string>(PRESETS[0].text);
  const [status, setStatus] = useState<Status>("idle");
  const [raw, setRaw] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const sections = useMemo(() => parseSections(raw), [raw]);

  const currentStepIdx = useMemo(() => {
    if (status === "idle") return -1;
    if (status === "thinking") return 0;
    let idx = 0;
    for (let i = 0; i < STEPS.length; i++) {
      if (sections[STEPS[i].key]) idx = i + 1;
    }
    return Math.min(idx, STEPS.length);
  }, [status, sections]);

  const onPresetChange = (key: string) => {
    if (status === "streaming" || status === "thinking") return;
    const p = PRESETS.find((x) => x.key === key);
    if (!p) return;
    setPresetKey(key);
    setInput(p.text);
    setRaw("");
    setError(null);
    setStatus("idle");
  };

  const run = async () => {
    if (!input.trim() || status === "streaming" || status === "thinking") return;
    setRaw("");
    setError(null);
    setStatus("thinking");

    const ac = new AbortController();
    abortRef.current = ac;

    try {
      const res = await fetch("/api/demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input }),
        signal: ac.signal,
      });

      if (!res.ok) {
        const text = await res.text();
        let msg = text;
        try {
          msg = JSON.parse(text).error ?? text;
        } catch {}
        setError(msg || `HTTP ${res.status}`);
        setStatus("error");
        return;
      }
      if (!res.body) {
        setError("Empty response body.");
        setStatus("error");
        return;
      }

      setStatus("streaming");
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setRaw(acc);
      }
      setStatus("done");
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") {
        setStatus("idle");
        return;
      }
      setError(err instanceof Error ? err.message : String(err));
      setStatus("error");
    } finally {
      abortRef.current = null;
    }
  };

  const cancel = () => {
    abortRef.current?.abort();
    setStatus("idle");
  };

  return (
    <Card className="border-[var(--brand-orange)]/40">
      <div className="p-5 border-b border-[var(--brand-line)] flex items-start gap-3 flex-wrap">
        <div className="h-9 w-9 rounded-lg bg-[var(--brand-orange)] flex items-center justify-center text-[var(--brand-ink)] font-bold text-sm shrink-0">
          AI
        </div>
        <div className="flex-1 min-w-[200px]">
          <div className="text-[15px] font-semibold text-white tracking-tight">
            Run the AI on a real inbound, live
          </div>
          <div className="text-[12px] text-[var(--brand-muted)] mt-0.5">
            Pick a channel or paste anything. Watch the model classify, extract, check, score, and draft — in real time.
          </div>
        </div>
        <Pill tone="brand">claude-sonnet-4-6</Pill>
      </div>

      <div className="p-5 space-y-4">
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.key}
              type="button"
              onClick={() => onPresetChange(p.key)}
              disabled={status === "streaming" || status === "thinking"}
              className={`px-3 py-1.5 rounded-full text-[12px] font-medium border transition-colors disabled:opacity-50 ${
                presetKey === p.key
                  ? "bg-[var(--brand-orange)] text-[var(--brand-ink)] border-[var(--brand-orange)]"
                  : "bg-[var(--brand-charcoal-2)] text-[var(--brand-muted)] border-[var(--brand-line)] hover:text-white hover:border-[var(--brand-orange)]/60"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        <div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={status === "streaming" || status === "thinking"}
            rows={compact ? 6 : 9}
            spellCheck={false}
            className="w-full font-mono bg-[var(--brand-ink)] border border-[var(--brand-line)] rounded-md p-3 text-[12.5px] text-white/95 placeholder:text-[var(--brand-muted)] disabled:opacity-60 resize-y"
            placeholder="Paste an email, a voicemail transcript, a portal submission, a rep's note — anything."
          />
          <div className="text-[10px] text-[var(--brand-muted)] mt-1 text-right tabular-nums">
            {input.length} / 8000 characters
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {status === "streaming" || status === "thinking" ? (
            <button
              type="button"
              onClick={cancel}
              className="inline-flex items-center gap-2 bg-[var(--brand-red)]/15 hover:bg-[var(--brand-red)]/25 border border-[var(--brand-red)]/40 text-[var(--brand-red)] font-medium px-3.5 py-2 rounded-md text-[13px]"
            >
              ■ Stop
            </button>
          ) : (
            <button
              type="button"
              onClick={run}
              disabled={!input.trim()}
              className="inline-flex items-center gap-2 bg-[var(--brand-orange)] hover:bg-[var(--brand-orange-600)] text-[var(--brand-ink)] font-semibold px-4 py-2.5 rounded-lg text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ▶ Run AI live
            </button>
          )}
          <StatusLine status={status} stepIdx={currentStepIdx} />
        </div>

        {error && (
          <div className="rounded-md border border-[var(--brand-red)]/40 bg-[var(--brand-red)]/10 p-3 text-[12.5px] text-[var(--brand-red)]">
            <span className="font-semibold">AI unavailable.</span> {error}
            <div className="text-[var(--brand-muted)] mt-1">
              Tip: set <code className="font-mono text-white/80">ANTHROPIC_API_KEY</code> in Vercel project settings → Environment Variables, then redeploy.
            </div>
          </div>
        )}

        {(status === "thinking" || status === "streaming" || status === "done") && (
          <ProgressLadder stepIdx={currentStepIdx} status={status} />
        )}

        {(status === "streaming" || status === "done") && (
          <SectionsRender sections={sections} streaming={status === "streaming"} />
        )}
      </div>
    </Card>
  );
}

function StatusLine({ status, stepIdx }: { status: Status; stepIdx: number }) {
  if (status === "idle") {
    return (
      <span className="text-[12px] text-[var(--brand-muted)]">
        Ready when you are.
      </span>
    );
  }
  if (status === "thinking") {
    return (
      <span className="text-[12px] text-[var(--brand-orange)] flex items-center gap-2">
        <Spinner /> Thinking…
      </span>
    );
  }
  if (status === "streaming") {
    const cur = STEPS[Math.min(stepIdx, STEPS.length - 1)];
    return (
      <span className="text-[12px] text-[var(--brand-orange)] flex items-center gap-2">
        <Spinner /> {cur?.label}…
      </span>
    );
  }
  if (status === "done") {
    return <span className="text-[12px] text-[var(--brand-green)]">✓ Done</span>;
  }
  if (status === "error") {
    return <span className="text-[12px] text-[var(--brand-red)]">Error</span>;
  }
  return null;
}

function Spinner() {
  return (
    <span className="inline-block h-3 w-3 rounded-full border-2 border-[var(--brand-orange)] border-t-transparent animate-spin" />
  );
}

function ProgressLadder({ stepIdx, status }: { stepIdx: number; status: Status }) {
  return (
    <div className="rounded-md border border-[var(--brand-line)] bg-[var(--brand-charcoal-2)] p-3">
      <div className="text-[10px] uppercase tracking-wider text-[var(--brand-muted)] mb-2">
        Working through the steps
      </div>
      <ol className="space-y-1.5">
        {STEPS.map((s, i) => {
          const done = i < stepIdx;
          const here = i === stepIdx && status !== "done";
          const future = i > stepIdx;
          return (
            <li key={s.key} className="flex items-center gap-2.5 text-[12.5px]">
              <span
                className={`inline-flex h-4 w-4 items-center justify-center rounded-full text-[10px] shrink-0 ${
                  done
                    ? "bg-[var(--brand-green)] text-[var(--brand-ink)]"
                    : here
                      ? "bg-[var(--brand-orange)] text-[var(--brand-ink)] pulse-orange"
                      : "bg-[var(--brand-charcoal-3)] text-[var(--brand-muted)]"
                }`}
              >
                {done ? "✓" : i + 1}
              </span>
              <span
                className={
                  done
                    ? "text-white/85"
                    : here
                      ? "text-white font-medium"
                      : future
                        ? "text-[var(--brand-muted)]/70"
                        : "text-white"
                }
              >
                {s.label}
              </span>
              {here && (
                <span className="ml-2 inline-block h-1.5 w-1.5 rounded-full bg-[var(--brand-orange)] animate-pulse" />
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function SectionsRender({
  sections,
  streaming,
}: {
  sections: Record<string, string>;
  streaming: boolean;
}) {
  const order = ["CLASSIFY", "CHECKLIST", "STOCK_CHECK", "AR_RISK", "RECOMMENDATION"];
  const titles: Record<string, string> = {
    CLASSIFY: "1 · Channel intake & classification",
    CHECKLIST: "2 · Procurement checklist",
    STOCK_CHECK: "3 · Stock match",
    AR_RISK: "4 · AR risk",
    RECOMMENDATION: "5 · Recommendation",
  };
  const icons: Record<string, string> = {
    CLASSIFY: "🏷",
    CHECKLIST: "📋",
    STOCK_CHECK: "📦",
    AR_RISK: "⚠",
    RECOMMENDATION: "✨",
  };
  return (
    <div className="space-y-3">
      {order.map((k) => {
        const body = sections[k];
        if (!body) return null;
        const isLastWithContent =
          streaming &&
          order.indexOf(k) ===
            order.map((kk) => !!sections[kk]).lastIndexOf(true);
        return (
          <div
            key={k}
            className="rounded-lg border border-[var(--brand-line)] bg-[var(--brand-ink)]/60 overflow-hidden fade-in-up"
          >
            <div className="px-4 py-2 border-b border-[var(--brand-line)]/60 flex items-center justify-between gap-2 bg-[var(--brand-charcoal-2)]">
              <div className="flex items-center gap-2">
                <span className="text-[14px]">{icons[k]}</span>
                <span className="text-[10px] uppercase tracking-[0.16em] text-[var(--brand-orange)] font-semibold">
                  {titles[k]}
                </span>
              </div>
              {isLastWithContent && (
                <span className="text-[10px] uppercase tracking-wider text-[var(--brand-orange)] flex items-center gap-1.5">
                  <Spinner /> streaming
                </span>
              )}
            </div>
            <div className="p-4">
              {k === "RECOMMENDATION" ? (
                <RecommendationBody text={body} />
              ) : (
                <FieldList text={body} />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function FieldList({ text }: { text: string }) {
  const lines = text.split("\n").filter((l) => l.trim());
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
      {lines.map((line, i) => {
        const m = /^[-•]\s*([^:]+):\s*(.+)$/.exec(line.trim());
        if (!m) {
          return (
            <div key={i} className="sm:col-span-2 text-[12.5px] text-[var(--brand-muted)] italic">
              {line.trim()}
            </div>
          );
        }
        const [, label, value] = m;
        return (
          <div
            key={i}
            className="rounded-md bg-[var(--brand-charcoal)] border border-[var(--brand-line)]/60 px-3 py-2"
          >
            <div className="text-[10px] uppercase tracking-wider text-[var(--brand-muted)]">
              {label.trim()}
            </div>
            <div className="text-[13px] text-white font-medium">{value.trim()}</div>
          </div>
        );
      })}
    </div>
  );
}

function RecommendationBody({ text }: { text: string }) {
  const draftMarker = "Draft customer reply:";
  let fields = text;
  let draft = "";
  const idx = text.indexOf(draftMarker);
  if (idx !== -1) {
    fields = text.slice(0, idx).trim();
    draft = text.slice(idx + draftMarker.length).trim();
    draft = draft.replace(/^-\s*/, "");
  }
  return (
    <div className="space-y-4">
      <FieldList text={fields} />
      {draft && (
        <div className="rounded-md border border-[var(--brand-orange)]/40 bg-[var(--brand-orange)]/5 overflow-hidden">
          <div className="px-3 py-2 border-b border-[var(--brand-orange)]/30 text-[10px] uppercase tracking-wider text-[var(--brand-orange)] font-semibold">
            ✉ Draft customer reply (awaiting human approval)
          </div>
          <pre className="p-3 text-[13px] text-white/95 whitespace-pre-wrap font-sans leading-relaxed">
{draft}
          </pre>
          <div className="px-3 py-2 border-t border-[var(--brand-orange)]/20 flex items-center gap-2 bg-[var(--brand-ink)]/40">
            <button className="text-[12px] bg-[var(--brand-green)] text-[var(--brand-ink)] font-semibold px-3 py-1.5 rounded-md">
              ✓ Approve & send
            </button>
            <button className="text-[12px] border border-[var(--brand-amber)]/40 text-[var(--brand-amber)] font-medium px-3 py-1.5 rounded-md">
              ✎ Edit
            </button>
            <button className="text-[12px] border border-[var(--brand-red)]/40 text-[var(--brand-red)] font-medium px-3 py-1.5 rounded-md">
              ✕ Reject
            </button>
            <span className="ml-auto text-[10px] text-[var(--brand-muted)]">
              Human-in-loop — nothing sends without you
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

function parseSections(raw: string): Record<string, string> {
  if (!raw) return {};
  const out: Record<string, string> = {};
  const regex = /^##\s+(CLASSIFY|CHECKLIST|STOCK_CHECK|AR_RISK|RECOMMENDATION)\s*$/gm;
  const matches: Array<{ key: string; start: number; end: number }> = [];
  let m: RegExpExecArray | null;
  while ((m = regex.exec(raw)) !== null) {
    matches.push({ key: m[1], start: m.index, end: m.index + m[0].length });
  }
  for (let i = 0; i < matches.length; i++) {
    const current = matches[i];
    const next = matches[i + 1];
    const body = raw.slice(current.end, next ? next.start : raw.length).trim();
    out[current.key] = body;
  }
  return out;
}
