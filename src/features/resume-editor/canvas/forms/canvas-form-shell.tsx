"use client";

import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";

type CanvasFormShellProps = {
  title: string;
  meta?: ReactNode;
  description?: string;
  onCancel: () => void;
  onClose: () => void;
  children: ReactNode;
};

/**
 * Inline-edit container for canvas section forms. Lighter than EditorCard:
 * no surrounding card, soft section header with Cancel/Save inline.
 */
export function CanvasFormShell({
  title,
  meta,
  description,
  onCancel,
  onClose,
  children,
}: CanvasFormShellProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold tracking-tight">{title}</h2>
            {meta}
          </div>
          {description ? (
            <p className="text-xs text-muted-foreground">{description}</p>
          ) : null}
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="button" size="sm" onClick={onClose}>
            Save
          </Button>
        </div>
      </div>
      {children}
    </div>
  );
}
