"use client";

import { MoreHorizontalIcon, Trash2Icon } from "lucide-react";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type RowOverflowMenuProps = {
  /** Announced as "<label> actions". */
  label: string;
  /** Kind-specific entries above the destructive one (e.g. Auto-sort). */
  children?: ReactNode;
  deleteLabel: string;
  onDelete: () => void;
  /** Set when a row must not be removable (e.g. the last item in a section). */
  deleteDisabled?: boolean;
};

/**
 * The trailing "⋯" menu carried by every editor row — sections and items alike.
 * Delete is always the last entry, below a separator, so it sits in exactly one
 * place regardless of row kind. Kind-specific actions go in `children` so they
 * never change the row's shape.
 */
export function RowOverflowMenu({
  label,
  children,
  deleteLabel,
  onDelete,
  deleteDisabled = false,
}: RowOverflowMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label={`${label} actions`}
            // The row itself is the click target; the menu must not open it.
            onClick={(event) => event.stopPropagation()}
            className="shrink-0 text-muted-foreground/60 hover:text-foreground"
          >
            <MoreHorizontalIcon />
          </Button>
        }
      />
      <DropdownMenuContent
        align="end"
        className="w-48"
        onClick={(event) => event.stopPropagation()}
      >
        {children}
        {children ? <DropdownMenuSeparator /> : null}
        <DropdownMenuItem
          variant="destructive"
          disabled={deleteDisabled}
          onClick={onDelete}
        >
          <Trash2Icon />
          {deleteLabel}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
