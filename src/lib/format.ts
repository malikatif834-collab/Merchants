export const money = (n: number, opts: { compact?: boolean } = {}) => {
  if (opts.compact && Math.abs(n) >= 1000) {
    return "$" + (n / 1000).toFixed(n >= 10000 ? 0 : 1) + "K";
  }
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    maximumFractionDigits: 0,
  }).format(n);
};

export const pct = (n: number, digits = 1) =>
  (n * 100).toFixed(digits) + "%";

export const num = (n: number) =>
  new Intl.NumberFormat("en-CA").format(n);

export function relativeTime(iso: string): string {
  const then = new Date(iso).getTime();
  const now = Date.now();
  const diffMin = Math.round((now - then) / 60000);

  if (diffMin < 1) return "just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  const hrs = Math.round(diffMin / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.round(hrs / 24);
  if (days < 14) return `${days}d ago`;
  return new Date(iso).toLocaleDateString("en-CA");
}

export function hoursAgo(iso: string): number {
  return Math.max(0, (Date.now() - new Date(iso).getTime()) / 3_600_000);
}

export function ageLabel(hours: number): string {
  if (hours < 1) return "< 1h";
  if (hours < 48) return Math.round(hours) + "h";
  return Math.round(hours / 24) + "d";
}
