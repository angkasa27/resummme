"use client";

import { useMemo } from "react";

import { normalizePdfPresentation } from "@/features/resume-editor/domain/presentation/pdf-presentation";
import { PreviewSheet } from "@/features/resume-editor/preview/components/preview-sheet";
import { PreviewToolbar } from "@/features/resume-editor/preview/components/preview-toolbar";
import type { PreviewPaneProps } from "@/features/resume-editor/preview/types";

export function PreviewPane({
  draft,
  onSavePdfPresentation,
}: PreviewPaneProps) {
  const presentation = useMemo(
    () => normalizePdfPresentation(draft.pdfPresentation),
    [draft.pdfPresentation],
  );

  return (
    <div className="h-full w-full">
      <PreviewToolbar
        presentation={presentation}
        onChange={onSavePdfPresentation}
      />
      <PreviewSheet draft={draft} presentation={presentation} />
    </div>
  );
}
