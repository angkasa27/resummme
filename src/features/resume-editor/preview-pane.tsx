"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { ResumeDocument } from "@/features/resume-editor/preview/resume-document";
import type { ResumeDraft } from "@/lib/resume/schema";

type PreviewPaneProps = {
  draft: ResumeDraft;
};

export function PreviewPane({ draft }: PreviewPaneProps) {
  return (
    <ScrollArea className="h-[calc(100vh-12rem)] rounded-xl border bg-muted/20">
      <div className="p-6">
        <ResumeDocument draft={draft} />
      </div>
    </ScrollArea>
  );
}
