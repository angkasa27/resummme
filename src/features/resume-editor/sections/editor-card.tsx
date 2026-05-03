import type { ReactNode } from "react";
import { ArrowLeftIcon, SaveIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

type EditorCardProps = {
  title: string;
  onBack: () => void;
  onSave: () => void;
  meta?: ReactNode;
  children: ReactNode;
};

export function EditorCard({
  title,
  onBack,
  onSave,
  meta,
  children,
}: EditorCardProps) {
  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden">
      <div className="sticky top-0 z-10 flex items-center gap-2 border-b bg-card px-3 py-3 sm:px-4">
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
          <h2 className="min-w-0 truncate text-base font-semibold leading-none">
            {title}
          </h2>
          {meta}
        </div>

        <div className="ml-auto flex items-center gap-2">
          <Button
            type="button"
            size="sm"
            onClick={onSave}
          >
            <SaveIcon data-icon="inline-start" />
            Save section
          </Button>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-3 py-4 sm:px-4">
        {children}
      </div>
    </div>
  );
}
