import { cn } from "@/lib/utils";

type ScoreRingProps = {
  score: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
};

function ringTone(score: number) {
  if (score >= 80)
    return {
      stroke: "stroke-emerald-500",
      text: "text-emerald-600 dark:text-emerald-400",
      label: "Strong",
    };
  if (score >= 60)
    return {
      stroke: "stroke-amber-500",
      text: "text-amber-600 dark:text-amber-400",
      label: "Decent",
    };
  return {
    stroke: "stroke-red-500",
    text: "text-red-600 dark:text-red-400",
    label: "Needs work",
  };
}

export function ScoreRing({
  score,
  size = 112,
  strokeWidth = 10,
  label,
}: ScoreRingProps) {
  const tone = ringTone(score);
  const clamped = Math.max(0, Math.min(100, Math.round(score)));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - clamped / 100);

  return (
    <div className="flex flex-col items-center gap-1">
      <div
        className="relative"
        style={{ width: size, height: size }}
        role="img"
        aria-label={`ATS score ${clamped} out of 100, ${tone.label}.`}
      >
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="-rotate-90"
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            className="stroke-muted"
            strokeWidth={strokeWidth}
            fill="none"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            className={cn(
              "transition-[stroke-dashoffset,stroke] duration-300 ease-out",
              tone.stroke,
            )}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            fill="none"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={cn("text-2xl font-semibold tabular-nums", tone.text)}>
            {clamped}
          </span>
          <span className="text-xs text-muted-foreground">
            {label ?? "ATS score"}
          </span>
        </div>
      </div>
      <span
        className={cn(
          "rounded-full px-2 py-0.5 text-xs font-medium",
          score >= 80
            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
            : score >= 60
              ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
              : "bg-red-500/10 text-red-600 dark:text-red-400",
        )}
      >
        {tone.label}
      </span>
    </div>
  );
}
