"use client";

import { Loader } from "lucide-react";

import { ResumeEditorDesktop } from "./desktop/resume-editor-desktop";
import { ResumeEditorMobile } from "./mobile/resume-editor-mobile";
import type { ResumeDraft } from "@/features/resume-editor/domain/schema";
import type { DraftStorage } from "@/features/resume-editor/domain/draft/draft-storage";
import { useClientReady } from "@/hooks/use-client-ready";
import { useIsMobile } from "@/hooks/use-mobile";

type ResumeEditorProps = {
  initialDraft?: ResumeDraft;
  /** Persistence module ("batteries"). Defaults to local storage. */
  storage?: DraftStorage;
};

/**
 * Responsive entry point for the editor: desktop (>=768px) gets the
 * drag-and-drop canvas editor, mobile (<768px) gets the guided-forms classic
 * editor.
 */
export function ResumeEditor(props: ResumeEditorProps) {
  const ready = useClientReady();
  const isMobile = useIsMobile();

  if (!ready) {
    return (
      <div className="flex h-dvh items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3 text-center">
          <Loader className="size-8 animate-spin" />
          <p className="text-sm font-semibold tracking-tight">
            Loading editor
          </p>
        </div>
      </div>
    );
  }

  return isMobile ? (
    <ResumeEditorMobile {...props} />
  ) : (
    <ResumeEditorDesktop {...props} />
  );
}
