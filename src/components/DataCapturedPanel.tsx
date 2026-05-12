import { Card, CardHeader, Pill } from "./Card";
import type { DataPoint, DataSource } from "@/lib/types";

const SOURCE_TONE: Record<DataSource, "brand" | "ok" | "warn" | "info" | "neutral"> = {
  Gmail: "info",
  "Customer Portal": "info",
  "Phone Notes": "info",
  "Walk-up Capture": "info",
  "Catalog DB": "ok",
  "AR Ledger": "warn",
  "Supplier History": "ok",
  "Procurement Tool": "brand",
  "Customer Master": "neutral",
  "Prior Quotes": "neutral",
  "AI Inference": "brand",
};

const SOURCE_ICON: Record<DataSource, string> = {
  Gmail: "✉",
  "Customer Portal": "▦",
  "Phone Notes": "☎",
  "Walk-up Capture": "✎",
  "Catalog DB": "▤",
  "AR Ledger": "$",
  "Supplier History": "⛓",
  "Procurement Tool": "⚙",
  "Customer Master": "◎",
  "Prior Quotes": "❝",
  "AI Inference": "✨",
};

export function DataCapturedPanel({ data }: { data: DataPoint[] }) {
  const sources = Array.from(new Set(data.map((d) => d.source)));
  return (
    <Card>
      <CardHeader
        title="Data captured by AI"
        subtitle={`${data.length} fields · ${sources.length} sources`}
      />
      <div className="p-3">
        <div className="flex flex-wrap gap-1.5 mb-3">
          {sources.map((s) => (
            <Pill key={s} tone={SOURCE_TONE[s]}>
              <span className="opacity-75">{SOURCE_ICON[s]}</span>
              <span>{s}</span>
            </Pill>
          ))}
        </div>
        <ul className="divide-y divide-[var(--brand-line)]/60">
          {data.map((d, i) => (
            <li key={i} className="py-2.5 px-1 flex items-start gap-3">
              <div className="flex-1 min-w-0">
                <div className="text-[10.5px] uppercase tracking-wider text-[var(--brand-muted)]">
                  {d.field}
                </div>
                <div className="text-[13px] text-white leading-snug">{d.value}</div>
              </div>
              <div className="shrink-0 flex flex-col items-end gap-1">
                <Pill tone={SOURCE_TONE[d.source]}>
                  <span className="opacity-75">{SOURCE_ICON[d.source]}</span>
                  <span>{d.source}</span>
                </Pill>
                {typeof d.confidence === "number" && (
                  <span className="text-[10px] text-[var(--brand-muted)] tabular-nums">
                    {Math.round(d.confidence * 100)}%
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
}
