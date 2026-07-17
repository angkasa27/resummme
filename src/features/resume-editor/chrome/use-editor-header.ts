"use client";

import { useEffect, useLayoutEffect, useRef, type ReactNode } from "react";

import type { SaveStatus } from "@/features/resume-editor/domain/draft/draft-storage";
import { useEditorHeaderStore } from "@/features/resume-editor/chrome/editor-header-store";

type EditorHeaderControls = {
  saveStatus: SaveStatus;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  actions?: ReactNode;
  /** The top bar's Download PDF action. */
  onExportPdf: () => void;
  isExportingPdf: boolean;
};

/**
 * Publishes an editor page's header controls to the shared store so the
 * persistent top bar (rendered once in `app/editor/layout.tsx`) can drive
 * undo/redo, the save indicator, the File menu and the right-aligned actions.
 *
 * Keeping the bar in the layout — instead of inside each page — is what lets
 * the Canvas/Classic tab pill animate across navigation: the bar instance
 * survives the route change.
 */
export function useEditorHeader(controls: EditorHeaderControls) {
  const setControls = useEditorHeaderStore((s) => s.setControls);

  // Handler identities change every render; keep them behind stable refs so the
  // stored controls don't need re-publishing on each keystroke.
  const onUndoRef = useRef(controls.onUndo);
  const onRedoRef = useRef(controls.onRedo);
  const onExportPdfRef = useRef(controls.onExportPdf);
  useLayoutEffect(() => {
    onUndoRef.current = controls.onUndo;
    onRedoRef.current = controls.onRedo;
    onExportPdfRef.current = controls.onExportPdf;
  });

  const { actions } = controls;
  // Handlers are read through refs, so only the export *flag* belongs in the
  // dependency list — re-publishing on every render would re-render the layout
  // for nothing.
  const isExportingPdf = controls.isExportingPdf;

  useEffect(() => {
    setControls({
      onUndo: () => onUndoRef.current(),
      onRedo: () => onRedoRef.current(),
      onExportPdf: () => onExportPdfRef.current(),
      isExportingPdf,
      actions,
    });
    return () =>
      setControls({
        saveStatus: "idle",
        canUndo: false,
        canRedo: false,
        isExportingPdf: false,
      });
  }, [setControls, actions, isExportingPdf]);

  const { saveStatus, canUndo, canRedo } = controls;
  useEffect(() => {
    setControls({ saveStatus, canUndo, canRedo });
  }, [setControls, saveStatus, canUndo, canRedo]);
}
