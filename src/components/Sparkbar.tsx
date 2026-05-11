export function Sparkbar({
  values,
  height = 36,
  color = "var(--brand-orange)",
}: {
  values: number[];
  height?: number;
  color?: string;
}) {
  const max = Math.max(...values, 1);
  return (
    <div className="flex items-end gap-1" style={{ height }}>
      {values.map((v, i) => (
        <div
          key={i}
          className="w-2 rounded-t-sm"
          style={{
            height: `${(v / max) * 100}%`,
            background: color,
            opacity: 0.4 + (i / values.length) * 0.6,
          }}
        />
      ))}
    </div>
  );
}
