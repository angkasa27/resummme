"use client";

import {
  ArrowDownIcon,
  ArrowUpIcon,
  PencilIcon,
  Trash2Icon,
} from "lucide-react";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";

type DesktopSectionShellProps = {
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

export function DesktopSectionShell({
  children,
  isEditing,
  onEdit,
  onMoveUp,
  onMoveDown,
  onDelete,
  canMoveUp,
  canMoveDown,
  ariaLabel,
}: DesktopSectionShellProps) {
  return (
    <div
      className="group/section relative"
      data-editing={isEditing || undefined}
      aria-label={ariaLabel}
    >
      <div className="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 rounded-md bg-muted/60 opacity-0 transition-opacity group-hover/section:opacity-100 group-focus-within/section:opacity-100 [@media(hover:none)]:opacity-100 border border-border w-[calc(100%+1.5rem)] h-[calc(100%+1.5rem)]" />
      {!isEditing ? (
        <ButtonGroup className="pointer-events-none absolute right-0 top-0 z-20 drop-shadow-sm opacity-0 transition-opacity group-hover/section:pointer-events-auto group-hover/section:opacity-100 group-focus-within/section:pointer-events-auto group-focus-within/section:opacity-100 [@media(hover:none)]:pointer-events-auto [@media(hover:none)]:opacity-100 [@media(hover:none)]:-translate-y-[calc(100%+0.375rem)] print:hidden bg-white rounded-md">
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
      <div className="relative z-10">{children}</div>
    </div>
  );
}
