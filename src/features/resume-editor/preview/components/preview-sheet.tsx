"use client";

import { useRef } from "react";

import { usePreviewScale } from "@/features/resume-editor/preview/components/use-preview-scale";
import { ResumeDocument } from "@/features/resume-editor/preview/resume-document";
import type { ResumeDraft } from "@/features/resume-editor/domain/schema";

type PreviewSheetProps = {
  draft: ResumeDraft;
  presentation: ResumeDraft["pdfPresentation"];
};

export function PreviewSheet({ draft, presentation }: PreviewSheetProps) {
  const previewViewportRef = useRef<HTMLDivElement | null>(null);
  const previewSheetRef = useRef<HTMLDivElement | null>(null);
  const { previewScale, previewShellSize } = usePreviewScale({
    sheetRef: previewSheetRef,
    viewportRef: previewViewportRef,
    watchValues: [draft, presentation],
  });

  return (
    <div className="h-full min-h-0 w-full overflow-y-auto overflow-x-hidden">
      <div
        ref={previewViewportRef}
        className="w-full min-w-0 overflow-hidden px-4 py-6 sm:px-6 sm:py-8"
      >
        <div className="flex w-full min-w-0 justify-center overflow-hidden">
          <div
            data-testid="resume-preview-scale-shell"
            className="relative shrink-0 overflow-hidden"
            style={{
              width: previewShellSize.width || undefined,
              height: previewShellSize.height || undefined,
            }}
          >
            <div
              ref={previewSheetRef}
              className="absolute left-0 top-0"
              style={{
                transform:
                  previewScale < 1 ? `scale(${previewScale})` : undefined,
                transformOrigin: "top left",
              }}
            >
              <ResumeDocument
                draft={{
                  ...draft,
                  pdfPresentation: presentation,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
