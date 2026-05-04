"use client";

import { ResumePages } from "@/features/resume-editor/preview/resume-pages";
import type { ResumeDraft } from "@/lib/resume/schema";

type PreviewPaneProps = {
  draft: ResumeDraft;
};

export function PreviewPane({ draft }: PreviewPaneProps) {
  return (
    <ResumePages draft={draft} mode="screen" testId="resume-preview-pages" />
  );
}
