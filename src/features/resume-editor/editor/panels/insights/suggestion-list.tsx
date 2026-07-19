"use client";

import { useState } from "react";
import {
  AlertTriangleIcon,
  CheckCircle2Icon,
  ChevronDownIcon,
  CircleAlertIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Collapse } from "@/features/resume-editor/editor/shared/collapse";
import {
  ATS_CATEGORIES,
  ATS_CATEGORY_LABELS,
  type AtsCategory,
  type Suggestion,
} from "@/features/resume-editor/domain/insights/ats-score";
import type { EditorPanelKey } from "@/features/resume-editor/domain/sections/section-metadata";
import { cn } from "@/lib/utils";

type SuggestionListProps = {
  suggestions: Suggestion[];
  onFix?: (panel: EditorPanelKey) => void;
};

const SEVERITY_ICONS = {
  fail: CircleAlertIcon,
  warn: AlertTriangleIcon,
  ok: CheckCircle2Icon,
};

const SEVERITY_TONES = {
  fail: "text-red-600 dark:text-red-400",
  warn: "text-amber-600 dark:text-amber-400",
  ok: "text-emerald-600 dark:text-emerald-400",
};

export function SuggestionList({ suggestions, onFix }: SuggestionListProps) {
  if (suggestions.length === 0) {
    return null;
  }

  const grouped = ATS_CATEGORIES.map((category) => ({
    category,
    items: suggestions.filter((s) => s.category === category),
  })).filter((group) => group.items.length > 0);

  return (
    <div className="flex flex-col gap-2">
      {grouped.map(({ category, items }) => (
        <SuggestionGroup
          key={category}
          category={category}
          items={items}
          onFix={onFix}
        />
      ))}
    </div>
  );
}

function SuggestionGroup({
  category,
  items,
  onFix,
}: {
  category: AtsCategory;
  items: Suggestion[];
  onFix?: (panel: EditorPanelKey) => void;
}) {
  const [open, setOpen] = useState(true);
  const failCount = items.filter((i) => i.severity === "fail").length;
  const warnCount = items.filter((i) => i.severity === "warn").length;

  return (
    <section className="rounded-md border bg-background">
      <Button
        type="button"
        variant="ghost"
        onClick={() => setOpen((value) => !value)}
        className="h-auto w-full justify-between gap-2 px-4 py-2 text-left font-medium"
      >
        <span className="flex items-center gap-2">
          {ATS_CATEGORY_LABELS[category]}
          <span className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
            {failCount > 0 ? (
              <span className="text-red-600 dark:text-red-400">
                {failCount} fail
              </span>
            ) : null}
            {warnCount > 0 ? (
              <span className="text-amber-600 dark:text-amber-400">
                {warnCount} warn
              </span>
            ) : null}
          </span>
        </span>
        <ChevronDownIcon
          className={cn(
            "text-muted-foreground transition-transform",
            !open && "-rotate-90",
          )}
        />
      </Button>
      <Collapse open={open}>
        <ul className="flex flex-col gap-1 border-t bg-muted/20 p-2">
          {items.map((item) => {
            const Icon = SEVERITY_ICONS[item.severity];
            return (
              <li
                key={item.id}
                className="flex items-start gap-2 rounded-sm px-2 py-1.5 text-xs"
              >
                <Icon
                  className={cn(
                    "mt-0.5 size-3.5 shrink-0",
                    SEVERITY_TONES[item.severity],
                  )}
                />
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <span className="text-foreground">{item.message}</span>
                  {item.fix && onFix ? (
                    <Button
                      type="button"
                      size="xs"
                      className="w-fit"
                      onClick={() => onFix(item.fix!.panel)}
                    >
                      Fix
                    </Button>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ul>
      </Collapse>
    </section>
  );
}
