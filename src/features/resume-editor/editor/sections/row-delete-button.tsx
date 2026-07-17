"use client";

import { Trash2Icon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type RowDeleteButtonProps = {
  /** Announced as "Remove <label>". */
  label: string;
  onDelete: () => void;
  /** Set when a row must not be removable (e.g. the last item in a section). */
  disabled?: boolean;
};

/**
 * The trailing delete on an editor row. One direct button rather than a menu:
 * delete is the only row-level action, and burying a single action behind "⋯"
 * costs a click for nothing. Section-level actions (auto-sort, remove) live in
 * the form header instead, so the row's shape stays identical at both levels.
 *
 * Still routed through a confirm dialog by the caller — this only requests it.
 */
export function RowDeleteButton({
  label,
  onDelete,
  disabled = false,
}: RowDeleteButtonProps) {
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label={`Remove ${label}`}
            disabled={disabled}
            // The row itself is the click target; deleting must not open it.
            onClick={(event) => {
              event.stopPropagation();
              onDelete();
            }}
            className="shrink-0 text-muted-foreground/60 hover:bg-destructive/10 hover:text-destructive"
          >
            <Trash2Icon />
          </Button>
        }
      />
      <TooltipContent>Remove {label}</TooltipContent>
    </Tooltip>
  );
}
