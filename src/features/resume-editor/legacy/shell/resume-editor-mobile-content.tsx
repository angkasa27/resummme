"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { EyeIcon, PenLineIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { EditorPanelKey } from "@/features/resume-editor/domain/sections/section-metadata";
import { ActiveSectionEditor } from "@/features/resume-editor/legacy/sections/active-section-editor";
import { PreviewPane } from "@/features/resume-editor/preview/components/preview-pane";
import type { ResumeDraft } from "@/features/resume-editor/domain/schema";

type ResumeEditorMobileContentProps = {
  activeSection: string;
  draft: ResumeDraft;
  onSavePdfPresentation: (
    pdfPresentation: ResumeDraft["pdfPresentation"],
  ) => void;
  onSaveProfile: (profile: ResumeDraft["profile"]) => void;
  onSaveSection: <K extends keyof ResumeDraft["sections"]>(
    sectionKey: K,
    sectionValue: ResumeDraft["sections"][K],
  ) => void;
  onOpenSection?: (panel: EditorPanelKey) => void;
  /** Leading slot for the form pane header (sidebar trigger). */
  leading?: ReactNode;
  /** Right-aligned actions for the preview toolbar (import/export). */
  previewActions?: ReactNode;
};

export function ResumeEditorMobileContent({
  activeSection,
  draft,
  onSavePdfPresentation,
  onSaveProfile,
  onSaveSection,
  onOpenSection,
  leading,
  previewActions,
}: ResumeEditorMobileContentProps) {
  const [showPreview, setShowPreview] = useState(false);

  return (
    <div className="relative h-full lg:hidden">
      {showPreview ? (
        <div className="h-full overflow-hidden bg-muted">
          <PreviewPane
            draft={draft}
            onSavePdfPresentation={onSavePdfPresentation}
            onOpenSection={onOpenSection}
            actions={previewActions}
          />
        </div>
      ) : (
        <div className="h-full overflow-hidden">
          <ActiveSectionEditor
            draft={draft}
            activeSection={activeSection as never}
            onSaveProfile={onSaveProfile}
            onSaveSection={onSaveSection}
            leading={leading}
          />
        </div>
      )}

      <Button
        type="button"
        size="icon-lg"
        variant={showPreview ? "default" : "outline"}
        className="fixed bottom-4 right-4 z-50 shadow-2xl!"
        onClick={() => setShowPreview((current) => !current)}
      >
        {showPreview ? (
          <>
            <PenLineIcon data-icon="inline-start" />
          </>
        ) : (
          <>
            <EyeIcon data-icon="inline-start" />
          </>
        )}
      </Button>
    </div>
  );
}
