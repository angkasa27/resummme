"use client";

import { ResumeDocument } from "@/features/resume-editor/preview/resume-document";
import type { ResumeDraft } from "@/lib/resume/schema";

type PreviewPaneProps = {
  draft: ResumeDraft;
};

export function PreviewPane({ draft }: PreviewPaneProps) {
  return (
    <div className="h-[calc(100vh-7.5rem)] overflow-y-auto rounded-[28px] border bg-muted/35 shadow-sm print:h-auto print:overflow-visible print:rounded-none print:border-none print:bg-transparent print:shadow-none">
      <div className="p-4 sm:p-6 lg:p-8">
        <ResumeDocument draft={draft} />
      </div>
    </div>
  );
}
