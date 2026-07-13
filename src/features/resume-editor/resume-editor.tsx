"use client";

import { Loader } from "lucide-react";
import type { ReactNode } from "react";

import { ResumeEditorCanvas } from "@/features/resume-editor/canvas/resume-editor-canvas";
import { ResumeEditorShell } from "@/features/resume-editor/classic/shell/resume-editor-shell";
import type { ResumeDraft } from "@/features/resume-editor/domain/schema";
import type { DraftStorage } from "@/features/resume-editor/domain/draft/draft-storage";
import { useClientReady } from "@/hooks/use-client-ready";
import { useIsMobile } from "@/hooks/use-mobile";

type ResumeEditorProps = {
  initialDraft?: ResumeDraft;
  /** Persistence module ("batteries"). Defaults to local storage. */
  storage?: DraftStorage;
  /** Right-aligned header slot. Defaults to the GitHub link. */
  headerActions?: ReactNode;
};

/**
 * Responsive entry point for the editor: desktop (>=768px) gets the
 * drag-and-drop canvas editor, mobile (<768px) gets the guided-forms classic
 * editor. This is the single seam the SaaS host and the `/editor` route
 * render through — both editors still accept the same props so the
 * injection contract (storage/headerActions) is unchanged.
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
    <ResumeEditorShell {...props} />
  ) : (
    <ResumeEditorCanvas {...props} />
  );
}
