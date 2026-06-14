"use client";

import { Loader } from "lucide-react";
import { useEditorHeader } from "@/features/resume-editor/shared/use-editor-header";

export default function ResumeEditorCanvas() {
  useEditorHeader({
    saveStatus: "idle",
    canUndo: false,
    canRedo: false,
    onUndo: () => {},
    onRedo: () => {},
  });
  return (
    <div className="flex h-dvh items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-3 text-center">
        <Loader className="size-8 animate-spin" />
        <p className="text-sm font-semibold tracking-tight">Loading editor</p>
      </div>
    </div>
  );
}
