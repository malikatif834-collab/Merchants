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
    label: "Voicemail",
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
    label: "Paste your own",
    channel: "Anything",
    text: "",
  },
];

type Status = "idle" | "thinking" | "streaming" | "done" | "error";
type PdfDirection = "customer" | "supplier";

const STEPS = [
  { key: "CLASSIFY", label: "Classifying channel & intent" },
  { key: "CHECKLIST", label: "Extracting procurement checklist" },
  { key: "STOCK_CHECK", label: "Checking inventory for stock match" },
  { key: "AR_RISK", label: "Assessing AR risk" },
  { key: "RECOMMENDATION", label: "Drafting recommendation" },
];

const STORAGE_KEY = "merchants_ai_demo_key";

export function LiveAIPanel({ compact = false }: { compact?: boolean }) {
  const [presetKey, setPresetKey] = useState<string>("email");
  const [input, setInput] = useState<string>(PRESETS[0].text);
  const [status, setStatus] = useState<Status>("idle");
  const [raw, setRaw] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  // PDF state
  const [pdfBase64, setPdfBase64] = useState<string>("");
  const [pdfName, setPdfName] = useState<string>("");
  const [pdfSizeKB, setPdfSizeKB] = useState<number>(0);
  const [pdfDirection, setPdfDirection] = useState<PdfDirection>("customer");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // API key state — stored in localStorage, sent in request body
  const [clientKey, setClientKey] = useState<string>("");
  const [keyMasked, setKeyMasked] = useState<boolean>(true);
  const [showKeyPanel, setShowKeyPanel] = useState<boolean>(false);

  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setClientKey(saved);

    // Pick up changes saved elsewhere (eg. SetupBanner) without a page reload.
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setClientKey(e.newValue ?? "");
    };
    const onCustom = () => {
      const v = localStorage.getItem(STORAGE_KEY);
      setClientKey(v ?? "");
    };
    window.addEventListener("storage", onStorage);
    window.addEventListener("merchants_ai_key_changed", onCustom);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("merchants_ai_key_changed", onCustom);
    };
  }, []);

  const saveKey = (k: string) => {
    setClientKey(k);
    if (typeof window !== "undefined") {
      if (k) localStorage.setItem(STORAGE_KEY, k);
      else localStorage.removeItem(STORAGE_KEY);
    }
  };

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

  const [pdfReading, setPdfReading] = useState(false);

  const onPdfPick = async (file: File | null) => {
    if (!file) {
      console.log("[PdfUploader] no file received");
      return;
    }
    console.log("[PdfUploader] file selected", {
      name: file.name,
      type: file.type,
      size: file.size,
    });
    // Some browsers report PDF type as application/x-pdf or empty; also accept by extension
    const looksLikePdf =
      file.type === "application/pdf" ||
      file.type === "application/x-pdf" ||
      file.type === "" ||
      file.name.toLowerCase().endsWith(".pdf");
    if (!looksLikePdf) {
      setError(
        `That file looks like ${file.type || "an unknown type"}. Please pick a .pdf file.`
      );
      return;
    }
    if (file.size > 3_000_000) {
      setError(
        `PDF is ${(file.size / 1_000_000).toFixed(1)} MB — maximum 3 MB for the live demo. Try a smaller file.`
      );
      return;
    }
    setError(null);
    setPdfReading(true);
    try {
      const buf = await file.arrayBuffer();
      const base64 = arrayBufferToBase64(buf);
      setPdfBase64(base64);
      setPdfName(file.name);
      setPdfSizeKB(Math.round(file.size / 1024));
      setRaw("");
      setStatus("idle");
      console.log("[PdfUploader] PDF ready", {
        name: file.name,
        base64Length: base64.length,
      });
    } catch (err) {
      console.error("[PdfUploader] failed to read file", err);
      setError(
        `Could not read that PDF: ${err instanceof Error ? err.message : String(err)}`
      );
    } finally {
      setPdfReading(false);
    }
  };

  const clearPdf = () => {
    setPdfBase64("");
    setPdfName("");
    setPdfSizeKB(0);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const run = async () => {
    if (status === "streaming" || status === "thinking") return;
    if (!input.trim() && !pdfBase64) return;
    setRaw("");
    setError(null);
    setStatus("thinking");

    // Re-read the key from storage at request time so a key saved elsewhere
    // (eg. by the SetupBanner) is picked up without a page reload.
    let keyToSend = clientKey;
    if (typeof window !== "undefined") {
      const fresh = localStorage.getItem(STORAGE_KEY);
      if (fresh) {
        keyToSend = fresh;
        if (fresh !== clientKey) setClientKey(fresh);
      }
    }

    const ac = new AbortController();
    abortRef.current = ac;

    try {
      const res = await fetch("/api/demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          input,
          clientKey: keyToSend || undefined,
          pdfBase64: pdfBase64 || undefined,
          pdfName: pdfName || undefined,
          pdfDirection: pdfBase64 ? pdfDirection : undefined,
        }),
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

  const busy = status === "streaming" || status === "thinking";

  return (
    <Card className="border-[var(--brand-orange)]/40">
      <div className="p-5 border-b border-[var(--brand-line)] flex items-start gap-3 flex-wrap">
        <div className="h-9 w-9 rounded-lg bg-[var(--brand-orange)] flex items-center justify-center text-[var(--brand-ink)] font-bold text-sm shrink-0">
          AI
        </div>
        <div className="flex-1 min-w-[200px]">
          <div className="text-[15px] font-semibold text-white tracking-tight">
            Run the AI on a real inbound — text or PDF, customer or supplier
          </div>
          <div className="text-[12px] text-[var(--brand-muted)] mt-0.5">
            Pick a channel, paste anything, or drop a PDF. Watch the model classify, extract, check, score, and draft — in real time.
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Pill tone="brand">claude-sonnet-4-6</Pill>
          <button
            type="button"
            onClick={() => setShowKeyPanel((s) => !s)}
            className="text-[11px] uppercase tracking-wider text-[var(--brand-muted)] hover:text-white px-2 py-1 rounded-md border border-[var(--brand-line)]"
            title="API key settings"
          >
            ⚙ Key
          </button>
        </div>
      </div>

      {showKeyPanel && (
        <KeyPanel
          clientKey={clientKey}
          setClientKey={saveKey}
          masked={keyMasked}
          setMasked={setKeyMasked}
          onClose={() => setShowKeyPanel(false)}
        />
      )}

      <div className="p-5 space-y-4">
        <FlowDirectionStrip pdfBase64={pdfBase64} pdfDirection={pdfDirection} />

        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.key}
              type="button"
              onClick={() => onPresetChange(p.key)}
              disabled={busy}
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
            disabled={busy}
            rows={compact ? 6 : 8}
            spellCheck={false}
            className="w-full font-mono bg-[var(--brand-ink)] border border-[var(--brand-line)] rounded-md p-3 text-[12.5px] text-white/95 placeholder:text-[var(--brand-muted)] disabled:opacity-60 resize-y"
            placeholder="Paste an email, a voicemail transcript, a portal submission, a rep's note — or leave blank and just attach a PDF below."
          />
          <div className="text-[10px] text-[var(--brand-muted)] mt-1 text-right tabular-nums">
            {input.length} / 8000 characters
          </div>
        </div>

        <PdfUploader
          pdfName={pdfName}
          pdfSizeKB={pdfSizeKB}
          pdfDirection={pdfDirection}
          setPdfDirection={setPdfDirection}
          onPick={onPdfPick}
          onClear={clearPdf}
          fileInputRef={fileInputRef}
          disabled={busy}
          reading={pdfReading}
        />

        <div className="flex items-center gap-3 flex-wrap">
          {busy ? (
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
              disabled={!input.trim() && !pdfBase64}
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
              Tip: click <span className="text-white">⚙ Key</span> above to paste an Anthropic API key — it stays in your browser, never in the repo.
            </div>
          </div>
        )}

        {(status === "thinking" || status === "streaming" || status === "done") && (
          <ProgressLadder stepIdx={currentStepIdx} status={status} />
        )}

        {(status === "streaming" || status === "done") && (
          <SectionsRender sections={sections} streaming={status === "streaming"} />
        )}

        {status === "done" && (
          <WhatHappensNext
            sections={sections}
            pdfDirection={pdfBase64 ? pdfDirection : null}
          />
        )}
      </div>
    </Card>
  );
}

function KeyPanel({
  clientKey,
  setClientKey,
  masked,
  setMasked,
  onClose,
}: {
  clientKey: string;
  setClientKey: (k: string) => void;
  masked: boolean;
  setMasked: (b: boolean) => void;
  onClose: () => void;
}) {
  const [draft, setDraft] = useState(clientKey);
  const has = !!clientKey;
  return (
    <div className="border-b border-[var(--brand-line)] bg-[var(--brand-charcoal-2)] p-4 space-y-2">
      <div className="flex items-center gap-2">
        <span className="text-[11px] uppercase tracking-wider text-[var(--brand-orange)] font-semibold">
          Anthropic API key (browser-only)
        </span>
        {has && <Pill tone="ok">key set</Pill>}
        <button
          type="button"
          onClick={onClose}
          className="ml-auto text-[11px] text-[var(--brand-muted)] hover:text-white"
        >
          close
        </button>
      </div>
      <div className="text-[11.5px] text-[var(--brand-muted)] leading-relaxed">
        Your key is stored in this browser only (localStorage). It travels in the request body to <code className="text-white/80">/api/demo</code> over HTTPS and is used to call Anthropic. It is never committed to the repo, never logged, never visible to anyone else. Clear it any time.
      </div>
      <div className="flex items-center gap-2">
        <input
          type={masked ? "password" : "text"}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="sk-ant-api03-..."
          className="flex-1 bg-[var(--brand-ink)] border border-[var(--brand-line)] rounded-md px-3 py-2 text-[12.5px] text-white font-mono"
          spellCheck={false}
          autoComplete="off"
        />
        <button
          type="button"
          onClick={() => setMasked(!masked)}
          className="text-[11px] text-[var(--brand-muted)] hover:text-white px-2"
        >
          {masked ? "show" : "hide"}
        </button>
        <button
          type="button"
          onClick={() => setClientKey(draft.trim())}
          className="bg-[var(--brand-green)] text-[var(--brand-ink)] font-semibold px-3 py-1.5 rounded-md text-[12px]"
        >
          Save
        </button>
        {has && (
          <button
            type="button"
            onClick={() => {
              setClientKey("");
              setDraft("");
            }}
            className="border border-[var(--brand-red)]/40 text-[var(--brand-red)] px-3 py-1.5 rounded-md text-[12px]"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
}

function PdfUploader({
  pdfName,
  pdfSizeKB,
  pdfDirection,
  setPdfDirection,
  onPick,
  onClear,
  fileInputRef,
  disabled,
  reading,
}: {
  pdfName: string;
  pdfSizeKB: number;
  pdfDirection: PdfDirection;
  setPdfDirection: (d: PdfDirection) => void;
  onPick: (f: File | null) => void;
  onClear: () => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  disabled: boolean;
  reading: boolean;
}) {
  const has = !!pdfName;
  const [dragOver, setDragOver] = useState(false);

  const openPicker = () => {
    if (disabled || reading) return;
    fileInputRef.current?.click();
  };

  return (
    <div
      className={`rounded-md border-2 border-dashed ${dragOver ? "border-[var(--brand-orange)] bg-[var(--brand-orange)]/8" : "border-[var(--brand-line)] bg-[var(--brand-ink)]/40"} p-3 transition-colors`}
      onDragOver={(e) => {
        e.preventDefault();
        if (!disabled && !reading) setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragOver(false);
        const f = e.dataTransfer.files?.[0];
        if (f) onPick(f);
      }}
    >
      <div className="flex items-center justify-between gap-3 mb-2 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[11px] uppercase tracking-wider text-[var(--brand-orange)] font-semibold">
            ▤ Attach a PDF (optional)
          </span>
          <span className="text-[11px] text-[var(--brand-muted)]">
            Customer RFQ / PO — or a supplier&apos;s returned quote
          </span>
        </div>
        <div className="inline-flex rounded-md border border-[var(--brand-line)] bg-[var(--brand-charcoal)] p-0.5">
          <button
            type="button"
            disabled={disabled}
            onClick={() => setPdfDirection("customer")}
            className={`px-2.5 py-1 rounded-sm text-[11px] font-medium transition-colors ${
              pdfDirection === "customer"
                ? "bg-[var(--brand-orange)] text-[var(--brand-ink)]"
                : "text-[var(--brand-muted)] hover:text-white"
            }`}
          >
            ↓ From customer
          </button>
          <button
            type="button"
            disabled={disabled}
            onClick={() => setPdfDirection("supplier")}
            className={`px-2.5 py-1 rounded-sm text-[11px] font-medium transition-colors ${
              pdfDirection === "supplier"
                ? "bg-[var(--brand-orange)] text-[var(--brand-ink)]"
                : "text-[var(--brand-muted)] hover:text-white"
            }`}
          >
            ↑ From supplier
          </button>
        </div>
      </div>

      {/* Hidden file input — kept out of the layout, triggered by the button below */}
      <input
        ref={fileInputRef}
        type="file"
        accept="application/pdf,.pdf"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0] ?? null;
          onPick(f);
          // Reset so re-selecting the same file fires onChange again
          if (e.target) e.target.value = "";
        }}
      />

      {has ? (
        <div className="flex items-center gap-3 bg-[var(--brand-charcoal-2)] border border-[var(--brand-line)]/60 rounded-md p-2.5">
          <div className="h-8 w-8 rounded-md bg-[var(--brand-red)]/20 text-[var(--brand-red)] flex items-center justify-center text-[11px] font-bold shrink-0">
            PDF
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[12.5px] text-white font-medium truncate">{pdfName}</div>
            <div className="text-[10.5px] text-[var(--brand-muted)]">
              {pdfSizeKB} KB · {pdfDirection === "customer" ? "treated as inbound from customer" : "treated as supplier quote response"}
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              if (fileInputRef.current) fileInputRef.current.value = "";
              onClear();
            }}
            disabled={disabled}
            className="text-[11px] text-[var(--brand-muted)] hover:text-[var(--brand-red)]"
          >
            remove
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={openPicker}
          disabled={disabled || reading}
          className={`w-full flex items-center justify-center gap-2 rounded-md border border-[var(--brand-line)]/60 bg-[var(--brand-charcoal-2)]/60 hover:bg-[var(--brand-charcoal-2)] hover:border-[var(--brand-orange)]/60 cursor-pointer text-[13px] text-white/85 py-4 transition-colors ${disabled || reading ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {reading ? (
            <>
              <span className="inline-block h-3 w-3 rounded-full border-2 border-[var(--brand-orange)] border-t-transparent animate-spin" />
              Reading PDF…
            </>
          ) : (
            <>📎 Click to choose a PDF — or drag &amp; drop it here (max 3 MB)</>
          )}
        </button>
      )}
    </div>
  );
}

function FlowDirectionStrip({
  pdfBase64,
  pdfDirection,
}: {
  pdfBase64: string;
  pdfDirection: PdfDirection;
}) {
  return (
    <div className="rounded-md border border-[var(--brand-line)] bg-[var(--brand-charcoal-2)] px-3 py-2 flex items-center gap-2 text-[11.5px]">
      <span className="text-[10px] uppercase tracking-wider text-[var(--brand-muted)] font-semibold">
        Flow
      </span>
      {pdfBase64 ? (
        pdfDirection === "customer" ? (
          <span className="text-white">
            <span className="text-[var(--brand-orange)]">Customer PDF</span> → Merchants procurement workflow → human approves → quote out to customer
          </span>
        ) : (
          <span className="text-white">
            <span className="text-[var(--brand-orange)]">Supplier PDF (quote return)</span> → AI normalizes into comparison → human approves → order to supplier
          </span>
        )
      ) : (
        <span className="text-white">
          Any inbound (email · portal · phone · walk-up) → AI extracts → human approves → quote out
        </span>
      )}
    </div>
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
            ✉ Draft reply (awaiting human approval)
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

function WhatHappensNext({
  sections,
  pdfDirection,
}: {
  sections: Record<string, string>;
  pdfDirection: PdfDirection | null;
}) {
  // Parse a few key values out of the AI output for the routing summary.
  const get = (sec: string, key: string): string => {
    const body = sections[sec];
    if (!body) return "—";
    const m = new RegExp(`^[-•]\\s*${key}\\s*:\\s*(.+)$`, "im").exec(body);
    return m ? m[1].trim() : "—";
  };

  const customer = get("CLASSIFY", "Customer match");
  const intent = get("CLASSIFY", "Intent");
  const urgency = get("CLASSIFY", "Urgency");
  const stockMatch = get("STOCK_CHECK", "Match found");
  const risk = get("AR_RISK", "Risk level");
  const owner = get("RECOMMENDATION", "Human approval needed from");

  const isSupplier = pdfDirection === "supplier";
  const isStockMatch = /yes/i.test(stockMatch);
  const isHighRisk = /high|critical/i.test(risk);

  let landingStage = "Inquiry Received";
  let phaseHint = "Inbound";
  if (isSupplier) {
    landingStage = "Sourcing";
    phaseHint = "Supplier negotiation";
  } else if (isStockMatch) {
    landingStage = "Stock Check → Quote Drafted (no special order needed)";
    phaseHint = "Quote";
  } else if (isHighRisk) {
    landingStage = "AR Review";
    phaseHint = "Qualify";
  } else {
    landingStage = "Stock Check / Checklist";
    phaseHint = "Inbound → Qualify";
  }

  // Use a synthetic PR number based on current minute, so demo-runs feel real
  const prNo = `PR-2412${String(Math.floor(Math.random() * 10) + 4)}`;

  return (
    <div className="rounded-lg border border-[var(--brand-green)]/35 bg-[var(--brand-green)]/5 overflow-hidden">
      <div className="px-4 py-2.5 border-b border-[var(--brand-green)]/25 bg-[var(--brand-green)]/8 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <span className="text-[12px]">→</span>
          <span className="text-[10.5px] uppercase tracking-[0.16em] text-[var(--brand-green)] font-semibold">
            What happens next in your MWI-0703-02 workflow
          </span>
        </div>
        <span className="font-mono text-[11px] text-[var(--brand-green)]">{prNo} created</span>
      </div>
      <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3 text-[12.5px]">
        <NextRow
          n="1"
          title="Draft case file created"
          body={`Auto-generated procurement number ${prNo}. Stored in your Procurement Tool with the AI's full analysis attached.`}
        />
        <NextRow
          n="2"
          title="Phase assigned"
          body={`This deal lands in the "${phaseHint}" phase of your pipeline, at the "${landingStage}" stage.`}
        />
        <NextRow
          n="3"
          title={`Routed to ${owner === "—" ? "the right person" : owner}`}
          body={`The approval buttons above wire to this person. They get a notification with the AI's draft + reasoning. They click Approve, Edit, or Reject.`}
        />
        <NextRow
          n="4"
          title="Then it flows through the rest of MWI-0703-02"
          body={
            isSupplier
              ? "Supplier quote slots into the comparison table. Once Purchasing picks a winner, RFQ → PO → shipped → delivered → invoiced → paid."
              : isStockMatch
                ? "Quote goes out from stock (no special order opens). Customer accepts → order picked → shipped → invoiced → paid → revenue booked."
                : "Sales Assistant confirms → AR clears (if needed) → Purchasing sources → quote out → customer accepts → order → ship → invoice → paid. Each step audited."
          }
        />
        <div className="md:col-span-2 mt-1 pt-3 border-t border-[var(--brand-green)]/25 grid grid-cols-2 md:grid-cols-4 gap-3 text-[11.5px]">
          <Field label="Customer" value={customer} />
          <Field label="Intent" value={intent} />
          <Field label="Urgency" value={urgency} />
          <Field label="Risk" value={risk} />
        </div>
        <div className="md:col-span-2 text-[11px] text-[var(--brand-muted)] leading-relaxed italic">
          In Phase 2 (Google Workspace) each of these actions writes back to your shared Sheet, sends the approval message in Chat, and updates Carol&apos;s daily numbers report — same flow, just inside the tools you already use.
        </div>
      </div>
    </div>
  );
}

function NextRow({ n, title, body }: { n: string; title: string; body: string }) {
  return (
    <div className="flex gap-3">
      <div className="h-6 w-6 rounded-md bg-[var(--brand-green)] text-[var(--brand-ink)] font-bold flex items-center justify-center text-[11px] shrink-0">
        {n}
      </div>
      <div className="min-w-0">
        <div className="text-[13px] text-white font-medium leading-snug">{title}</div>
        <div className="text-[11.5px] text-[var(--brand-muted)] leading-relaxed mt-0.5">{body}</div>
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-[var(--brand-ink)] border border-[var(--brand-line)]/60 px-2.5 py-1.5">
      <div className="text-[9.5px] uppercase tracking-wider text-[var(--brand-muted)]">{label}</div>
      <div className="text-[12px] text-white font-medium truncate" title={value}>{value}</div>
    </div>
  );
}

function arrayBufferToBase64(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf);
  let binary = "";
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode.apply(
      null,
      Array.from(bytes.subarray(i, i + chunkSize))
    );
  }
  if (typeof window !== "undefined" && typeof window.btoa === "function") {
    return window.btoa(binary);
  }
  // Fallback for non-browser contexts (shouldn't happen — this is a client component)
  return Buffer.from(binary, "binary").toString("base64");
}
