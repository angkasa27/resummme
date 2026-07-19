"use client";

import {
  SquarePenIcon,
  SwatchBookIcon,
  TelescopeIcon,
  type LucideIcon,
} from "lucide-react";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { FOCUS_RING_CLASS } from "@/features/resume-editor/forms/fields/field-control";

export type RailKey = "edit" | "design" | "insights";

type RailItem = {
  key: RailKey;
  label: string;
  icon: LucideIcon;
};

// Mirrors the mobile bottom nav's icon choices so both surfaces read as one
// family; Preview has no rail entry because the desktop canvas is always shown.
const ITEMS: RailItem[] = [
  { key: "edit", label: "Edit", icon: SquarePenIcon },
  { key: "design", label: "Design", icon: SwatchBookIcon },
  { key: "insights", label: "Insights", icon: TelescopeIcon },
];

type EditorRailProps = {
  value: RailKey;
  /** True when the sidebar is hidden — no item reads as active. */
  collapsed: boolean;
  /** Selects a panel; selecting the open one toggles the sidebar shut. */
  onSelect: (key: RailKey) => void;
};

/**
 * The compact icon rail: picks which panel the sidebar shows. Clicking the
 * active icon collapses the sidebar, giving the canvas the full width.
 */
export function EditorRail({ value, collapsed, onSelect }: EditorRailProps) {
  return (
    <nav
      aria-label="Editor panels"
      className="flex w-14 shrink-0 flex-col items-center gap-1 border-r bg-background py-3 print:hidden"
    >
      {ITEMS.map(({ key, label, icon: Icon }) => {
        const isSelected = value === key;
        const isActive = isSelected && !collapsed;
        return (
          <Tooltip key={key}>
            <TooltipTrigger
              render={
                <button
                  type="button"
                  aria-label={label}
                  aria-pressed={isActive}
                  onClick={() => onSelect(key)}
                  className={cn(
                    "flex size-10 cursor-pointer flex-col items-center justify-center rounded-md outline-none transition-colors",
                    FOCUS_RING_CLASS,
                    "text-muted-foreground aria-[pressed=false]:hover:bg-muted aria-[pressed=false]:hover:text-foreground",
                    "aria-pressed:bg-primary/10 aria-pressed:text-primary",
                  )}
                >
                  <Icon className="size-5" />
                </button>
              }
            />
            <TooltipContent side="right">{label}</TooltipContent>
          </Tooltip>
        );
      })}
    </nav>
  );
}
