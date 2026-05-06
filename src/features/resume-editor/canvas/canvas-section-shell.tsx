"use client";

import {
  ArrowDownIcon,
  ArrowUpIcon,
  PencilIcon,
  Trash2Icon,
} from "lucide-react";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ButtonGroup } from "@/components/ui/button-group";

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
        <ButtonGroup className="pointer-events-none absolute right-2 top-2 z-20 drop-shadow-sm opacity-0 transition-opacity group-hover/section:pointer-events-auto group-hover/section:opacity-100 group-focus-within/section:pointer-events-auto group-focus-within/section:opacity-100 [@media(hover:none)]:pointer-events-auto [@media(hover:none)]:opacity-100 print:hidden bg-white rounded-md">
          {onEdit ? (
            <Button
              type="button"
              variant="outline"
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
              variant="outline"
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
              variant="outline"
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
              variant="destructive"
              size="icon-sm"
              aria-label={`Hide ${ariaLabel}`}
              onClick={onDelete}
              className="border border-border! border-l-0"
            >
              <Trash2Icon className="text-destructive" />
            </Button>
          ) : null}
        </ButtonGroup>
      ) : null}

      <div className="px-3 py-2">{children}</div>
    </div>
  );
}
