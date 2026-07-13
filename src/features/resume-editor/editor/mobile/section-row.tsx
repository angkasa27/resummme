"use client";

import type { KeyboardEvent, ReactNode } from "react";

import { SectionIcon } from "@/features/resume-editor/ui/section-icons";
import type {
  CollectionSectionKey,
  EditorPanelKey,
} from "@/features/resume-editor/domain/sections/section-metadata";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

type SectionRowProps = {
  sectionKey: EditorPanelKey | CollectionSectionKey;
  label: string;
  active?: boolean;
  /** Toggles/opens the section. The whole row (icon, title, chevron) is the
   * target; nested controls (drag, delete) must stop propagation. */
  onClick: () => void;
  /** Drag-handle slot, rendered before the icon (collection rows only). */
  leading?: ReactNode;
  /** Glanceable item count, shown muted right after the label (collection rows). */
  count?: number;
  /** Trailing cluster — typically just the disclosure/nav chevron. */
  trailing?: ReactNode;
  className?: string;
};

/**
 * A fully-clickable section row shared by the desktop accordion (toggle) and
 * the mobile list (navigate). The entire row is the hit target — including the
 * chevron — so disclosure feels obvious; the drag handle and delete button
 * stop propagation.
 */
export function SectionRow({
  sectionKey,
  label,
  active = false,
  onClick,
  leading,
  count,
  trailing,
  className,
}: SectionRowProps) {
  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onClick();
    }
  }

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      className={cn(
        "group/row flex cursor-pointer select-none items-center gap-2 rounded-md py-2 pr-1.5 pl-2 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring",
        active ? "bg-accent" : "hover:bg-accent/60 bg-background",
        className,
      )}
    >
      {leading ? (
        <span className="flex w-4 shrink-0 items-center justify-center">
          {leading}
        </span>
      ) : null}
      <span
        className={cn(
          "flex shrink-0 [&_svg]:size-4",
          active ? "text-foreground" : "text-muted-foreground",
        )}
      >
        <SectionIcon sectionKey={sectionKey} />
      </span>
      <span
        className={cn("min-w-0 truncate text-sm", active && "font-semibold")}
      >
        {label}
      </span>
      {count !== undefined ? (
        <Badge variant="outline" className="shrink-0 text-xs! bg-background">
          {count} item{count === 1 ? "" : "s"}
        </Badge>
      ) : null}
      <span className="flex-1" />
      {trailing ? (
        <div className="flex shrink-0 items-center gap-1">{trailing}</div>
      ) : null}
    </div>
  );
}
