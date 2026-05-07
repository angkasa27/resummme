"use client";

import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";

type CanvasFormShellProps = {
  title: string;
  meta?: ReactNode;
  description?: string;
  headerActions?: ReactNode;
  onCancel: () => void;
  onClose: () => void;
  children: ReactNode;
};

/**
 * Inline-edit container for canvas section forms. When the parent provides a
 * bounded height (e.g. mobile bottom sheet), header and footer stay pinned and
 * the body scrolls. Inline on desktop the parent is unbounded, so it just
 * expands naturally.
 */
export function CanvasFormShell({
  title,
  meta,
  description,
  headerActions,
  onCancel,
  onClose,
  children,
}: CanvasFormShellProps) {
  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-x-3 gap-y-2 bg-popover pb-3">
        <div className="flex min-w-0 flex-col gap-0.5">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-sm font-semibold tracking-tight">{title}</h2>
            {meta}
          </div>
          {description ? (
            <p className="text-xs text-muted-foreground">{description}</p>
          ) : null}
        </div>
        {headerActions ? (
          <div className="flex shrink-0 flex-wrap items-center gap-1.5">
            {headerActions}
          </div>
        ) : null}
      </div>
      <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto py-1">
        {children}
      </div>
      <div className="flex shrink-0 flex-wrap items-center justify-end gap-1.5 border-t bg-popover pt-3">
        <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="button" size="sm" onClick={onClose}>
          Save
        </Button>
      </div>
    </div>
  );
}
