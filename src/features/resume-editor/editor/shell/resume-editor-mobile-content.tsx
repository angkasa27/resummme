"use client";

import { useState } from "react";
import { EyeIcon, PenLineIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ActiveSectionEditor } from "@/features/resume-editor/editor/active-section-editor";
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
};

export function ResumeEditorMobileContent({
  activeSection,
  draft,
  onSavePdfPresentation,
  onSaveProfile,
  onSaveSection,
}: ResumeEditorMobileContentProps) {
  const [showPreview, setShowPreview] = useState(false);

  return (
    <div className="relative h-full lg:hidden">
      {showPreview ? (
        <div className="h-full overflow-hidden bg-muted">
          <PreviewPane
            draft={draft}
            onSavePdfPresentation={onSavePdfPresentation}
          />
        </div>
      ) : (
        <div className="h-full overflow-hidden">
          <ActiveSectionEditor
            draft={draft}
            activeSection={activeSection as never}
            onSaveProfile={onSaveProfile}
            onSaveSection={onSaveSection}
          />
        </div>
      )}

      <Button
        type="button"
        size="sm"
        variant={showPreview ? "default" : "outline"}
        className="fixed bottom-4 right-4 z-50 shadow-lg"
        onClick={() => setShowPreview((current) => !current)}
      >
        {showPreview ? (
          <>
            <PenLineIcon data-icon="inline-start" />
            Editor
          </>
        ) : (
          <>
            <EyeIcon data-icon="inline-start" />
            Preview
          </>
        )}
      </Button>
    </div>
  );
}
