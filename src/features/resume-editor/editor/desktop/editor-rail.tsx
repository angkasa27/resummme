"use client";

import type { ReactNode, Ref } from "react";
import { SwatchBookIcon } from "lucide-react";

import { SquarePenIcon as AnimatedSquarePen } from "@/components/ui/square-pen";
import { TelescopeIcon as AnimatedTelescope } from "@/components/ui/telescope";
import type { AnimatedIconHandle } from "@/components/ui/animated-icon";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  NAV_ICON_SIZE as ICON_SIZE,
  NavIcon,
  PopIcon,
} from "@/features/resume-editor/ui/nav-icon";
import { cn } from "@/lib/utils";

export type RailKey = "edit" | "design" | "insights";

type RailItem = {
  key: RailKey;
  label: string;
  render: (ref: Ref<AnimatedIconHandle>) => ReactNode;
};

// Mirrors the mobile bottom nav's icon choices so both surfaces read as one
// family; Preview has no rail entry because the desktop canvas is always shown.
const ITEMS: RailItem[] = [
  {
    key: "edit",
    label: "Edit",
    render: (ref) => <AnimatedSquarePen ref={ref} size={ICON_SIZE} />,
  },
  {
    key: "design",
    label: "Design",
    render: (ref) => <PopIcon ref={ref} icon={SwatchBookIcon} />,
  },
  {
    key: "insights",
    label: "Insights",
    render: (ref) => <AnimatedTelescope ref={ref} size={ICON_SIZE} />,
  },
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
      {ITEMS.map(({ key, label, render }) => {
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
                    "focus-visible:ring-2 focus-visible:ring-ring",
                    isActive
                      ? "bg-accent text-foreground"
                      : "text-muted-foreground hover:bg-accent/60 hover:text-foreground",
                  )}
                >
                  <NavIcon active={isActive} render={render} />
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
