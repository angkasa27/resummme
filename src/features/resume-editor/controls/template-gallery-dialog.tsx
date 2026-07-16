"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TemplateGallery } from "@/features/resume-editor/controls/template-gallery";
import type { PdfPresentation } from "@/features/resume-editor/domain/presentation/pdf-presentation";
import type { ResumeDraft } from "@/features/resume-editor/domain/schema";

type TemplateGalleryDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  draft: ResumeDraft;
  presentation: PdfPresentation;
  onApply: (next: PdfPresentation) => void;
};

/**
 * Full-screen overlay for browsing curated templates. Stays open after an
 * apply so the user can compare presets against their live document; the
 * active card highlight tracks the current presentation.
 */
export function TemplateGalleryDialog({
  open,
  onOpenChange,
  draft,
  presentation,
  onApply,
}: TemplateGalleryDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex h-[85vh] max-h-[85vh] flex-col gap-4 overflow-hidden sm:max-w-4xl">
        <DialogHeader className="shrink-0">
          <DialogTitle>Templates</DialogTitle>
          <DialogDescription>
            A template applies a layout together with a matching style. You can
            fine-tune everything afterwards in the Layout and Style tabs.
          </DialogDescription>
        </DialogHeader>
        <div className="min-h-0 flex-1 overflow-y-auto pr-1">
          {open ? (
            <TemplateGallery
              draft={draft}
              presentation={presentation}
              onApply={onApply}
            />
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}
