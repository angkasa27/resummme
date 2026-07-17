"use client";

import { ArrowLeftIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  sectionLabels,
  type ResumeSectionPanelKey,
} from "@/features/resume-editor/domain/sections/section-metadata";
import type { ResumeEditorPanelKey } from "@/features/resume-editor/state/resume-editor-store";

export function sectionLabelFor(key: ResumeEditorPanelKey) {
  return key === "profile"
    ? "Profile"
    : sectionLabels[key as ResumeSectionPanelKey];
}

/**
 * Contextual header for a drill-in section form — back arrow + section title.
 * Only rendered inside a form; the list roots rely on the surrounding chrome.
 */
export function SectionFormHeader({
  sectionKey,
  onBack,
}: {
  sectionKey: ResumeEditorPanelKey;
  onBack: () => void;
}) {
  return (
    <header className="flex h-12 shrink-0 items-center gap-2 border-b bg-background px-3">
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        aria-label="Back to sections"
        onClick={onBack}
      >
        <ArrowLeftIcon />
      </Button>
      <h2 className="min-w-0 flex-1 truncate text-sm font-semibold">
        {sectionLabelFor(sectionKey)}
      </h2>
    </header>
  );
}
