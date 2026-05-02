import type { ReactNode } from "react";
import { ArrowLeftIcon, SaveIcon, SquareXIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type EditorCardProps = {
  title: string;
  isDirty: boolean;
  onBack: () => void;
  onCancel: () => void;
  onSave: () => void;
  meta?: ReactNode;
  headerActions?: ReactNode;
  children: ReactNode;
};

export function EditorCard({
  title,
  isDirty,
  onBack,
  onCancel,
  onSave,
  meta,
  headerActions,
  children,
}: EditorCardProps) {
  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex flex-wrap items-center gap-3 border-b px-4 py-3 sm:px-5">
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label="Back to section list"
          title="Back to section list"
          onClick={onBack}
        >
          <ArrowLeftIcon />
        </Button>

        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-2">
          <h2 className="min-w-0 truncate text-base font-semibold">{title}</h2>
          {meta}
          {isDirty ? <Badge>Unsaved</Badge> : null}
        </div>

        <div className="flex w-full flex-wrap items-center justify-end gap-2 sm:ml-auto sm:w-auto">
          {headerActions}
          <Button type="button" variant="outline" size="sm" onClick={onCancel}>
            <SquareXIcon data-icon="inline-start" />
            Cancel
          </Button>
          <Button type="button" size="sm" onClick={onSave}>
            <SaveIcon data-icon="inline-start" />
            Save Section
          </Button>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-5">{children}</div>
    </div>
  );
}
