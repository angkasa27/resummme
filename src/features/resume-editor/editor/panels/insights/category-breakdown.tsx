import {
  ATS_CATEGORIES,
  ATS_CATEGORY_LABELS,
  type AtsCategory,
  type CategoryScore,
} from "@/features/resume-editor/domain/insights/ats-score";
import { cn } from "@/lib/utils";

type CategoryBreakdownProps = {
  breakdown: Record<AtsCategory, CategoryScore | null>;
};

function barTone(pct: number) {
  if (pct >= 80) return "bg-emerald-500";
  if (pct >= 60) return "bg-amber-500";
  return "bg-red-500";
}

export function CategoryBreakdown({ breakdown }: CategoryBreakdownProps) {
  const entries = ATS_CATEGORIES.filter(
    (key) => breakdown[key] !== null,
  ) as AtsCategory[];

  return (
    <ul className="flex flex-col gap-2">
      {entries.map((key) => {
        const cat = breakdown[key];
        if (!cat) return null;
        const pct = Math.round(cat.pct);
        return (
          <li key={key} className="flex flex-col gap-1">
            <div className="flex items-baseline justify-between text-xs">
              <span className="font-medium text-foreground">
                {ATS_CATEGORY_LABELS[key]}
              </span>
              <span className="tabular-nums text-muted-foreground">
                {pct}
                <span className="text-xs">/100</span>
                <span className="ml-1 text-xs">
                  · {cat.weight}%
                </span>
              </span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
              <div
                className={cn(
                  "h-full rounded-full transition-[width] duration-300",
                  barTone(pct),
                )}
                style={{ width: `${pct}%` }}
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
}
