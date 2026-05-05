"use client";

import { SettingsIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { PreviewToolbarContent } from "@/features/resume-editor/preview/components/preview-toolbar-content";
import type { ResumeDraft } from "@/features/resume-editor/domain/schema";

type PreviewToolbarProps = {
  onChange: (nextPresentation: ResumeDraft["pdfPresentation"]) => void;
  presentation: ResumeDraft["pdfPresentation"];
};

export function PreviewToolbar({
  onChange,
  presentation,
}: PreviewToolbarProps) {
  return (
    <div className="flex h-12 shrink-0 items-center justify-between gap-2 border-b bg-background px-4">
      <span className="text-xs font-medium text-muted-foreground">
        Preview
      </span>
      <Popover>
        <PopoverTrigger
          render={
            <Button type="button" variant="outline" size="sm">
              <SettingsIcon data-icon="inline-start" />
              Style Settings
            </Button>
          }
        />
        <PopoverContent align="end" className="w-80">
          <PreviewToolbarContent
            presentation={presentation}
            onChange={onChange}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
