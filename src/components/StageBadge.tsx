import { Pill } from "./Card";
import { STAGE_LABEL, type DealStage } from "@/lib/types";

const stageTone: Record<DealStage, "neutral" | "ok" | "warn" | "info" | "brand"> = {
  inquiry_received: "info",
  stock_check: "brand",
  checklist: "info",
  ar_review: "warn",
  purchasing_review: "warn",
  sourcing: "warn",
  quote_drafted: "info",
  quote_sent: "info",
  awaiting_customer: "info",
  order_placed: "ok",
  shipped: "ok",
  delivered: "ok",
  invoiced: "ok",
  paid: "ok",
  closed_won: "ok",
  closed_lost: "neutral",
};

export function StageBadge({ stage }: { stage: DealStage }) {
  return <Pill tone={stageTone[stage]}>{STAGE_LABEL[stage]}</Pill>;
}
