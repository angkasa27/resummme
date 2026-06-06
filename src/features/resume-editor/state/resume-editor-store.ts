import { createStore } from "zustand/vanilla";

import { collectionSectionConfigs } from "@/features/resume-editor/editor/sections/config/collection-section-config";
import { isCollectionSectionKey } from "@/features/resume-editor/domain/sections/section-metadata";
import {
  reorderSectionToIndex,
  reorderSections,
  setSectionVisibilityWithOrder,
} from "@/features/resume-editor/state/draft-utils";
import { normalizeCollectionItem } from "@/features/resume-editor/domain/sections/normalize-collection-item";
import { createDefaultResumeDraft } from "@/features/resume-editor/domain/draft/create-default-resume-draft";
import type { PdfPresentation, Profile, ResumeDraft } from "@/features/resume-editor/domain/schema";
import { saveResumeDraft } from "@/features/resume-editor/domain/draft/resume-draft-storage";

export type ResumeSectionKey = keyof ResumeDraft["sections"];
export type ResumeEditorPanelKey = "profile" | ResumeSectionKey;

export type ResumeEditorStoreState = {
  draft: ResumeDraft;
  activeSection: ResumeEditorPanelKey;
  undoStack: ResumeDraft[];
  redoStack: ResumeDraft[];
  saveProfile: (profile: Profile) => void;
  savePdfPresentation: (pdfPresentation: PdfPresentation) => void;
  saveSection: <K extends ResumeSectionKey>(
    sectionKey: K,
    sectionValue: ResumeDraft["sections"][K]
  ) => void;
  reorderSection: (sectionKey: ResumeSectionKey, targetIndex: number) => void;
  setSectionVisibility: (sectionKey: ResumeSectionKey, visible: boolean) => void;
  requestSectionChange: (sectionKey: ResumeEditorPanelKey) => void;
  replaceDraft: (draft: ResumeDraft) => void;
  undo: () => void;
  redo: () => void;
};

function createNextDraft(
  currentDraft: ResumeDraft,
  updates: Partial<ResumeDraft>
): ResumeDraft {
  return {
    ...currentDraft,
    ...updates,
    updatedAt: new Date().toISOString(),
  };
}

function normalizeSectionValue<K extends ResumeSectionKey>(
  sectionKey: K,
  sectionValue: ResumeDraft["sections"][K]
): ResumeDraft["sections"][K] {
  if (!isCollectionSectionKey(sectionKey)) {
    return sectionValue;
  }

  const config = collectionSectionConfigs[sectionKey];
  const collectionSectionValue = sectionValue as ResumeDraft["sections"][typeof sectionKey] & {
    items: Record<string, unknown>[];
  };

  return {
    ...collectionSectionValue,
    items: collectionSectionValue.items.map((item) =>
      normalizeCollectionItem(item, config.createItem())
    ),
  } as ResumeDraft["sections"][K];
}

const MAX_HISTORY = 50;

function pushUndoStack(
  stack: ResumeDraft[],
  draft: ResumeDraft
): ResumeDraft[] {
  const next = [...stack, structuredClone(draft)];
  if (next.length > MAX_HISTORY) next.shift();
  return next;
}

export function createResumeEditorStore(initialDraft = createDefaultResumeDraft()) {
  return createStore<ResumeEditorStoreState>()((set, get) => ({
    draft: initialDraft,
    activeSection: "profile",
    undoStack: [],
    redoStack: [],
    saveProfile: (profile) => {
      const state = get();
      const nextDraft = saveResumeDraft(createNextDraft(state.draft, { profile }));
      set({
        draft: nextDraft,
        undoStack: pushUndoStack(state.undoStack, state.draft),
        redoStack: [],
      });
    },
    savePdfPresentation: (pdfPresentation) => {
      const state = get();
      const nextDraft = saveResumeDraft(
        createNextDraft(state.draft, { pdfPresentation })
      );
      set({
        draft: nextDraft,
        undoStack: pushUndoStack(state.undoStack, state.draft),
        redoStack: [],
      });
    },
    saveSection: (sectionKey, sectionValue) => {
      const state = get();
      const normalizedSectionValue = normalizeSectionValue(sectionKey, sectionValue);
      const nextDraft = saveResumeDraft(
        createNextDraft(state.draft, {
          sections: reorderSections(
            state.draft.sections,
            sectionKey,
            normalizedSectionValue
          ),
        })
      );
      set({
        draft: nextDraft,
        undoStack: pushUndoStack(state.undoStack, state.draft),
        redoStack: [],
      });
    },
    reorderSection: (sectionKey, targetIndex) => {
      const state = get();
      const nextDraft = saveResumeDraft(
        createNextDraft(state.draft, {
          sections: reorderSectionToIndex(
            state.draft.sections,
            sectionKey,
            targetIndex
          ),
        })
      );
      set({
        draft: nextDraft,
        undoStack: pushUndoStack(state.undoStack, state.draft),
        redoStack: [],
      });
    },
    setSectionVisibility: (sectionKey, visible) => {
      const state = get();
      const nextDraft = saveResumeDraft(
        createNextDraft(state.draft, {
          sections: setSectionVisibilityWithOrder(
            state.draft.sections,
            sectionKey,
            visible
          ),
        })
      );
      set({
        draft: nextDraft,
        undoStack: pushUndoStack(state.undoStack, state.draft),
        redoStack: [],
      });
    },
    requestSectionChange: (sectionKey) => {
      set({
        activeSection: sectionKey,
      });
    },
    replaceDraft: (draft) => {
      const nextDraft = saveResumeDraft(draft);
      set({
        draft: nextDraft,
        activeSection: "profile",
        undoStack: [],
        redoStack: [],
      });
    },
    undo: () => {
      const state = get();
      const previousDraft = state.undoStack.at(-1);
      if (!previousDraft) return;
      const nextDraft = saveResumeDraft(previousDraft);
      set({
        draft: nextDraft,
        undoStack: state.undoStack.slice(0, -1),
        redoStack: [...state.redoStack, structuredClone(state.draft)],
      });
    },
    redo: () => {
      const state = get();
      const nextDraft = state.redoStack.at(-1);
      if (!nextDraft) return;
      const persistedDraft = saveResumeDraft(nextDraft);
      set({
        draft: persistedDraft,
        redoStack: state.redoStack.slice(0, -1),
        undoStack: [...state.undoStack, structuredClone(state.draft)],
      });
    },
  }));
}
