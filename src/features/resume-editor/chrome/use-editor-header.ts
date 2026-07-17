"use client";

import { useEffect, useLayoutEffect, useRef, type ReactNode } from "react";

import type { SaveStatus } from "@/features/resume-editor/domain/draft/draft-storage";
import {
  useEditorHeaderStore,
  type EditorDocumentMenuControls,
} from "@/features/resume-editor/chrome/editor-header-store";

type EditorHeaderControls = {
  saveStatus: SaveStatus;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  actions?: ReactNode;
  /** Handlers behind the top bar's File menu. Omit to hide it. */
  documentMenu?: EditorDocumentMenuControls;
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
  const documentMenuRef = useRef(controls.documentMenu);
  useLayoutEffect(() => {
    onUndoRef.current = controls.onUndo;
    onRedoRef.current = controls.onRedo;
    documentMenuRef.current = controls.documentMenu;
  });

  const { actions } = controls;
  // The menu's handlers are read through the ref, so only its *flags* belong in
  // the dependency list — publishing the object itself would re-fire on every
  // render and re-render the layout for nothing.
  const hasDocumentMenu = Boolean(controls.documentMenu);
  const isExportingPdf = controls.documentMenu?.isExportingPdf ?? false;
  const isImportingPdf = controls.documentMenu?.isImportingPdf ?? false;

  useEffect(() => {
    setControls({
      onUndo: () => onUndoRef.current(),
      onRedo: () => onRedoRef.current(),
      actions,
      documentMenu: hasDocumentMenu
        ? {
            onExtractCv: () => documentMenuRef.current?.onExtractCv(),
            onImportJson: () => documentMenuRef.current?.onImportJson(),
            onExportJson: () => documentMenuRef.current?.onExportJson(),
            onExportPdf: () => documentMenuRef.current?.onExportPdf(),
            isExportingPdf,
            isImportingPdf,
          }
        : null,
    });
    return () =>
      setControls({
        saveStatus: "idle",
        canUndo: false,
        canRedo: false,
        documentMenu: null,
      });
  }, [setControls, actions, hasDocumentMenu, isExportingPdf, isImportingPdf]);

  const { saveStatus, canUndo, canRedo } = controls;
  useEffect(() => {
    setControls({ saveStatus, canUndo, canRedo });
  }, [setControls, saveStatus, canUndo, canRedo]);
}
