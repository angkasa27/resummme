"use client";

import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";

type SectionEditBlockProps = {
  children: ReactNode;
  onCancel: () => void;
  onClose: () => void;
};

/**
 * Generic inline-edit wrapper. Hosts an existing editor panel
 * (which autosaves to the store on blur) and adds a Cancel/Save footer.
 *
 * Cancel is expected to revert by calling the appropriate store action
 * with the snapshot taken before edit started.
 */
export function SectionEditBlock({
  children,
  onCancel,
  onClose,
}: SectionEditBlockProps) {
  return (
    <div className="flex flex-col gap-3">
      {children}
      <div className="flex items-center justify-end gap-2 border-t pt-3">
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
