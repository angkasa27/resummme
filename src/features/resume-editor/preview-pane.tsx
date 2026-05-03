"use client";

import { ResumeDocument } from "@/features/resume-editor/preview/resume-document";
import type { ResumeDraft } from "@/lib/resume/schema";

type PreviewPaneProps = {
  draft: ResumeDraft;
};

export function PreviewPane({ draft }: PreviewPaneProps) {
  return (
    <div className="h-full min-h-0 overflow-y-auto border-l bg-muted/35 print:h-auto print:overflow-visible print:rounded-none print:border-none print:bg-transparent print:shadow-none">
      <div className="p-4 sm:p-6 lg:p-8">
        <ResumeDocument draft={draft} />
      </div>
    </div>
  );
}
