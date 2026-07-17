import type { ReactNode } from "react";
import { create } from "zustand";

import type { SaveStatus } from "@/features/resume-editor/domain/draft/draft-storage";

/** Document-level actions driving the top bar's File menu. */
export type EditorDocumentMenuControls = {
  onExtractCv: () => void;
  onImportJson: () => void;
  onExportJson: () => void;
  onExportPdf: () => void;
  isExportingPdf: boolean;
  isImportingPdf: boolean;
};

type EditorHeaderState = {
  saveStatus: SaveStatus;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  /** Right-aligned slot; the SaaS fork overrides this. */
  actions: ReactNode;
  /** `null` hides the File menu (no editor mounted). */
  documentMenu: EditorDocumentMenuControls | null;
};

type EditorHeaderStore = EditorHeaderState & {
  setControls: (patch: Partial<EditorHeaderState>) => void;
};

const noop = () => {};

export const useEditorHeaderStore = create<EditorHeaderStore>((set) => ({
  saveStatus: "idle",
  canUndo: false,
  canRedo: false,
  onUndo: noop,
  onRedo: noop,
  actions: undefined,
  documentMenu: null,
  setControls: (patch) => set(patch),
}));
