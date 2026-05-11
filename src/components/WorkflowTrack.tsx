import { STAGE_LABEL, STAGE_ORDER, type DealStage } from "@/lib/types";

export function WorkflowTrack({ stage }: { stage: DealStage }) {
  const currentIdx = STAGE_ORDER.indexOf(stage);
  return (
    <div className="space-y-1.5">
      {STAGE_ORDER.map((s, i) => {
        const done = i < currentIdx;
        const here = i === currentIdx;
        return (
          <div key={s} className="flex items-center gap-3">
            <span
              className={`h-2 w-2 rounded-full shrink-0 ${
                done
                  ? "bg-[var(--brand-green)]"
                  : here
                    ? "bg-[var(--brand-orange)] pulse-orange"
                    : "bg-[var(--brand-line)]"
              }`}
            />
            <span
              className={`text-[12px] ${
                done
                  ? "text-[var(--brand-muted)] line-through decoration-[var(--brand-green)]/60"
                  : here
                    ? "text-white font-medium"
                    : "text-[var(--brand-muted)]/70"
              }`}
            >
              {STAGE_LABEL[s]}
            </span>
            {here && (
              <span className="ml-auto text-[10px] uppercase tracking-wider text-[var(--brand-orange)]">
                current
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
