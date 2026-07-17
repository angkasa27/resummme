import { create } from "zustand";

import type { SaveStatus } from "@/features/resume-editor/domain/draft/draft-storage";

type EditorHeaderState = {
  saveStatus: SaveStatus;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  /** The top bar's primary output action. */
  onExportPdf: () => void;
  isExportingPdf: boolean;
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
  onExportPdf: noop,
  isExportingPdf: false,
  setControls: (patch) => set(patch),
}));
