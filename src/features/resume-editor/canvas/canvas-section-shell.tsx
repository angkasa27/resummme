"use client";

import { ArrowDownIcon, ArrowUpIcon, PencilIcon, Trash2Icon } from "lucide-react";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type CanvasSectionShellProps = {
  children: ReactNode;
  isEditing: boolean;
  onEdit?: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onDelete?: () => void;
  canMoveUp?: boolean;
  canMoveDown?: boolean;
  ariaLabel: string;
};

export function CanvasSectionShell({
  children,
  isEditing,
  onEdit,
  onMoveUp,
  onMoveDown,
  onDelete,
  canMoveUp,
  canMoveDown,
  ariaLabel,
}: CanvasSectionShellProps) {
  return (
    <div
      className={cn(
        "group/section relative rounded-md transition-colors",
        !isEditing && "hover:bg-muted/40 hover:ring-1 hover:ring-border",
        isEditing && "ring-2 ring-primary/40",
      )}
      data-editing={isEditing || undefined}
      aria-label={ariaLabel}
    >
      {!isEditing ? (
        <div className="pointer-events-none absolute right-2 top-2 z-10 flex items-center gap-1 rounded-md border bg-background/95 p-1 opacity-0 shadow-sm backdrop-blur transition-opacity group-hover/section:pointer-events-auto group-hover/section:opacity-100 print:hidden">
          {onEdit ? (
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label={`Edit ${ariaLabel}`}
              onClick={onEdit}
            >
              <PencilIcon />
            </Button>
          ) : null}
          {onMoveUp ? (
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label={`Move ${ariaLabel} up`}
              disabled={!canMoveUp}
              onClick={onMoveUp}
            >
              <ArrowUpIcon />
            </Button>
          ) : null}
          {onMoveDown ? (
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label={`Move ${ariaLabel} down`}
              disabled={!canMoveDown}
              onClick={onMoveDown}
            >
              <ArrowDownIcon />
            </Button>
          ) : null}
          {onDelete ? (
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label={`Hide ${ariaLabel}`}
              onClick={onDelete}
            >
              <Trash2Icon className="text-destructive" />
            </Button>
          ) : null}
        </div>
      ) : null}

      <div className="px-3 py-2">{children}</div>
    </div>
  );
}
