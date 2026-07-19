"use client";

import { EditorTopBar } from "@/features/resume-editor/editor/top-bar/editor-top-bar";
import { useEditorHeaderStore } from "@/features/resume-editor/editor/top-bar/editor-header-store";

export default function EditorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const controls = useEditorHeaderStore();

  return (
    <div className="flex h-dvh flex-col">
      <EditorTopBar
        saveStatus={controls.saveStatus}
        canUndo={controls.canUndo}
        canRedo={controls.canRedo}
        onUndo={controls.onUndo}
        onRedo={controls.onRedo}
        onExportPdf={controls.onExportPdf}
        isExportingPdf={controls.isExportingPdf}
      />
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        {children}
      </div>
    </div>
  );
}
