"use client";

import { useEffect, useLayoutEffect, useRef, type ReactNode } from "react";

import type { SaveStatus } from "@/features/resume-editor/domain/draft/draft-storage";
import { useEditorHeaderStore } from "@/features/resume-editor/shared/editor-header-store";

type EditorHeaderControls = {
  saveStatus: SaveStatus;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  actions?: ReactNode;
  canvasHref?: string;
  classicHref?: string;
};

/**
 * Publishes an editor page's header controls to the shared store so the
 * persistent top bar (rendered once in `app/editor/layout.tsx`) can drive
 * undo/redo, the save indicator and the right-aligned actions.
 *
 * Keeping the bar in the layout — instead of inside each page — is what lets
 * the Canvas/Classic tab pill animate across navigation: the bar instance
 * survives the route change.
 */
export function useEditorHeader(controls: EditorHeaderControls) {
  const setControls = useEditorHeaderStore((s) => s.setControls);

  // Undo/redo identities change every render; keep them behind stable refs so
  // the stored handlers don't need re-publishing on each keystroke.
  const onUndoRef = useRef(controls.onUndo);
  const onRedoRef = useRef(controls.onRedo);
  useLayoutEffect(() => {
    onUndoRef.current = controls.onUndo;
    onRedoRef.current = controls.onRedo;
  });

  const { actions, canvasHref, classicHref } = controls;
  useEffect(() => {
    setControls({
      onUndo: () => onUndoRef.current(),
      onRedo: () => onRedoRef.current(),
      actions,
      canvasHref,
      classicHref,
    });
    return () =>
      setControls({ saveStatus: "idle", canUndo: false, canRedo: false });
  }, [setControls, actions, canvasHref, classicHref]);

  const { saveStatus, canUndo, canRedo } = controls;
  useEffect(() => {
    setControls({ saveStatus, canUndo, canRedo });
  }, [setControls, saveStatus, canUndo, canRedo]);
}
