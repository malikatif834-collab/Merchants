"use client";

import { useEffect, useState } from "react";
import { Card, Pill } from "./Card";

const STORAGE_KEY = "merchants_ai_demo_key";

export function SetupBanner() {
  const [mounted, setMounted] = useState(false);
  const [hasKey, setHasKey] = useState(false);
  const [draft, setDraft] = useState("");
  const [masked, setMasked] = useState(true);
  const [showEdit, setShowEdit] = useState(false);
  const [testStatus, setTestStatus] = useState<
    "idle" | "testing" | "ok" | "fail"
  >("idle");
  const [testMessage, setTestMessage] = useState("");

  useEffect(() => {
    setMounted(true);
    if (typeof window === "undefined") return;
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) setHasKey(true);
  }, []);

  if (!mounted) return null;

  const save = (k: string) => {
    const trimmed = k.trim();
    if (typeof window === "undefined") return;
    if (trimmed) localStorage.setItem(STORAGE_KEY, trimmed);
    else localStorage.removeItem(STORAGE_KEY);
    setHasKey(!!trimmed);
    setShowEdit(false);
    setDraft("");
    setTestStatus("idle");
  };

  const test = async () => {
    setTestStatus("testing");
    setTestMessage("");
    const key =
      typeof window !== "undefined"
        ? localStorage.getItem(STORAGE_KEY) ?? ""
        : "";
    if (!key) {
      setTestStatus("fail");
      setTestMessage("No key set yet.");
      return;
    }
    try {
      const res = await fetch("/api/demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: "ping", clientKey: key }),
      });
      if (!res.ok) {
        const text = await res.text();
        let msg = text;
        try {
          msg = JSON.parse(text).error ?? text;
        } catch {}
        setTestStatus("fail");
        setTestMessage(msg);
        return;
      }
      // Consume just enough to know it streamed
      const reader = res.body?.getReader();
      if (!reader) {
        setTestStatus("fail");
        setTestMessage("No response body.");
        return;
      }
      const { value } = await reader.read();
      const decoded = new TextDecoder().decode(value);
      try {
        await reader.cancel();
      } catch {}
      if (decoded.includes("[AI error")) {
        setTestStatus("fail");
        setTestMessage(decoded);
      } else {
        setTestStatus("ok");
        setTestMessage("Connected. Ready to go.");
      }
    } catch (err) {
      setTestStatus("fail");
      setTestMessage(err instanceof Error ? err.message : String(err));
    }
  };

  if (hasKey && !showEdit) {
    return (
      <div className="rounded-md border border-[var(--brand-green)]/40 bg-[var(--brand-green)]/8 px-4 py-2.5 flex items-center gap-3 flex-wrap">
        <span className="h-2 w-2 rounded-full bg-[var(--brand-green)] shrink-0" />
        <span className="text-[12.5px] text-white">
          AI is connected and ready.
        </span>
        <button
          type="button"
          onClick={test}
          disabled={testStatus === "testing"}
          className="text-[11px] uppercase tracking-wider text-[var(--brand-green)] hover:text-white px-2 py-1 rounded border border-[var(--brand-green)]/40"
        >
          {testStatus === "testing" ? "Testing…" : "Test connection"}
        </button>
        <button
          type="button"
          onClick={() => {
            setShowEdit(true);
            setDraft("");
          }}
          className="text-[11px] uppercase tracking-wider text-[var(--brand-muted)] hover:text-white"
        >
          change key
        </button>
        <button
          type="button"
          onClick={() => save("")}
          className="text-[11px] uppercase tracking-wider text-[var(--brand-muted)] hover:text-[var(--brand-red)] ml-auto"
        >
          remove
        </button>
        {testMessage && (
          <div
            className={`w-full text-[11.5px] mt-1 ${
              testStatus === "ok"
                ? "text-[var(--brand-green)]"
                : "text-[var(--brand-red)]"
            }`}
          >
            {testMessage}
          </div>
        )}
      </div>
    );
  }

  return (
    <Card className="border-[var(--brand-orange)]/50 bg-gradient-to-br from-[var(--brand-orange)]/10 to-[var(--brand-charcoal)]">
      <div className="p-5">
        <div className="flex items-start gap-3 mb-3 flex-wrap">
          <div className="h-9 w-9 rounded-lg bg-[var(--brand-orange)] flex items-center justify-center text-[var(--brand-ink)] font-bold text-base shrink-0">
            1
          </div>
          <div className="flex-1 min-w-[260px]">
            <div className="text-[16px] font-semibold text-white tracking-tight">
              One-time setup — paste your Anthropic key
            </div>
            <div className="text-[12.5px] text-[var(--brand-muted)] mt-0.5">
              Lives in this browser only. Never leaves it. Never goes near the
              code or the server. Takes ten seconds.
            </div>
          </div>
          <Pill tone="brand">Required to use the AI</Pill>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <input
            type={masked ? "password" : "text"}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="sk-ant-api03-..."
            className="flex-1 min-w-[280px] bg-[var(--brand-ink)] border border-[var(--brand-line)] rounded-md px-3 py-2.5 text-[13px] text-white font-mono"
            spellCheck={false}
            autoComplete="off"
            onPaste={(e) => {
              const pasted = e.clipboardData.getData("text").trim();
              if (pasted.startsWith("sk-ant-")) {
                setDraft(pasted);
              }
            }}
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
            onClick={() => save(draft)}
            disabled={!draft.trim().startsWith("sk-ant-")}
            className="bg-[var(--brand-orange)] hover:bg-[var(--brand-orange-600)] text-[var(--brand-ink)] font-semibold px-4 py-2.5 rounded-md text-[13px] disabled:opacity-40"
          >
            Save & start
          </button>
        </div>

        <div className="mt-3 text-[11.5px] text-[var(--brand-muted)] leading-relaxed">
          Don&apos;t have a key?{" "}
          <a
            href="https://console.anthropic.com/settings/keys"
            target="_blank"
            rel="noopener"
            className="text-[var(--brand-orange)] hover:underline"
          >
            Get one in two minutes
          </a>{" "}
          ($5 free credit). The whole prototype will run for under a dollar of
          usage.
        </div>

        {showEdit && hasKey && (
          <button
            type="button"
            onClick={() => setShowEdit(false)}
            className="mt-3 text-[11px] text-[var(--brand-muted)] hover:text-white"
          >
            ← cancel, keep existing key
          </button>
        )}
      </div>
    </Card>
  );
}
