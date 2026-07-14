"use client";

import { ConfirmDeleteDialog } from "@/components/ui/confirm-delete-dialog";

type CollectionItemDeleteDialogProps = {
  pendingDeleteIndex: number | null;
  onOpenChange: (index: null) => void;
  onRemove: (index: number) => void;
  itemTitle: string;
};

/** Shared "remove this item?" confirmation used by both the desktop and
 *  mobile collection-section editors. */
export function CollectionItemDeleteDialog({
  pendingDeleteIndex,
  onOpenChange,
  onRemove,
  itemTitle,
}: CollectionItemDeleteDialogProps) {
  return (
    <ConfirmDeleteDialog
      open={pendingDeleteIndex !== null}
      onOpenChange={(open) => {
        if (!open) onOpenChange(null);
      }}
      onConfirm={() => {
        if (pendingDeleteIndex !== null) onRemove(pendingDeleteIndex);
      }}
      title={`Remove ${itemTitle.toLowerCase()}?`}
      description="This item will be permanently removed from the section."
    />
  );
}
