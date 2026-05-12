"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "merchants_ai_notice_dismissed";

export function PrototypeNotice() {
  const [mounted, setMounted] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window === "undefined") return;
    setDismissed(localStorage.getItem(STORAGE_KEY) === "1");
  }, []);

  if (!mounted || dismissed) return null;

  const dismiss = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, "1");
    }
    setDismissed(true);
  };

  return (
    <div className="rounded-lg border border-[var(--brand-amber)]/35 bg-gradient-to-br from-[var(--brand-amber)]/8 to-transparent p-4 flex items-start gap-3 flex-wrap">
      <div className="h-8 w-8 rounded-md bg-[var(--brand-amber)]/15 border border-[var(--brand-amber)]/30 flex items-center justify-center text-[var(--brand-amber)] text-sm shrink-0">
        ⓘ
      </div>
      <div className="flex-1 min-w-[260px] space-y-1.5">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] uppercase tracking-[0.18em] text-[var(--brand-amber)] font-semibold">
            Prototype · for conceptualization
          </span>
        </div>
        <div className="text-[13px] text-white leading-snug font-medium">
          This is a concept demo. Some things may be rough — it&apos;s meant to help you see how AI-supervised procurement could look, not to be used day-to-day.
        </div>
        <div className="text-[12px] text-[var(--brand-muted)] leading-relaxed">
          The real product is meant to live inside the Google tools your team already uses — Gmail, a shared Sheet, Google Chat for approvals — not on a separate URL like this one. That&apos;s where Phase 2 takes us. Standing up a dedicated tool like this one is always an option if some piece can&apos;t live in Google.
        </div>
      </div>
      <button
        type="button"
        onClick={dismiss}
        className="text-[10.5px] uppercase tracking-wider text-[var(--brand-muted)] hover:text-white px-2 py-1 rounded-md border border-[var(--brand-line)] shrink-0"
      >
        Got it
      </button>
    </div>
  );
}
