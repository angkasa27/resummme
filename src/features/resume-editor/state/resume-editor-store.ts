import { createStore } from "zustand/vanilla";

import { collectionSectionConfigs } from "@/features/resume-editor/domain/sections/collection-section-config";
import {
  isCollectionSectionKey,
  type CollectionSectionKey,
} from "@/features/resume-editor/domain/sections/section-metadata";
import { sortResumeItems } from "@/features/resume-editor/domain/sections/sort-resume-items";
import {
  moveSectionToAnchor,
  reorderSections,
  setSectionVisibilityWithOrder,
} from "@/features/resume-editor/state/draft-utils";
import { normalizeCollectionItem } from "@/features/resume-editor/domain/sections/normalize-collection-item";
import type { DraftStorage } from "@/features/resume-editor/domain/draft/draft-storage";
import { LocalDraftStorage } from "@/features/resume-editor/domain/draft/local-draft-storage";
import type {
  PdfPresentation,
  Profile,
  ResumeDraft,
} from "@/features/resume-editor/domain/schema";

export type ResumeSectionKey = keyof ResumeDraft["sections"];
export type ResumeEditorPanelKey = "profile" | ResumeSectionKey;

type ResumeEditorStoreState = {
  draft: ResumeDraft;
  activeSection: ResumeEditorPanelKey;
  undoStack: ResumeDraft[];
  redoStack: ResumeDraft[];
  saveProfile: (profile: Profile) => void;
  savePdfPresentation: (pdfPresentation: PdfPresentation) => void;
  saveSection: <K extends ResumeSectionKey>(
    sectionKey: K,
    sectionValue: ResumeDraft["sections"][K],
  ) => void;
  reorderSection: (
    sectionKey: ResumeSectionKey,
    anchorKey: ResumeSectionKey,
  ) => void;
  setSectionVisibility: (
    sectionKey: ResumeSectionKey,
    visible: boolean,
  ) => void;
  /** Sorts a dated section's items newest-first. No-op for undated sections. */
  autoSortSection: (sectionKey: CollectionSectionKey) => void;
  requestSectionChange: (sectionKey: ResumeEditorPanelKey) => void;
  replaceDraft: (draft: ResumeDraft) => void;
  undo: () => void;
  redo: () => void;
};

function createNextDraft(
  currentDraft: ResumeDraft,
  updates: Partial<ResumeDraft>,
): ResumeDraft {
  return {
    ...currentDraft,
    ...updates,
    updatedAt: new Date().toISOString(),
  };
}

function normalizeSectionValue<K extends ResumeSectionKey>(
  sectionKey: K,
  sectionValue: ResumeDraft["sections"][K],
): ResumeDraft["sections"][K] {
  if (!isCollectionSectionKey(sectionKey)) {
    return sectionValue;
  }

  const config = collectionSectionConfigs[sectionKey];
  const collectionSectionValue =
    sectionValue as ResumeDraft["sections"][typeof sectionKey] & {
      items: Record<string, unknown>[];
    };

  return {
    ...collectionSectionValue,
    items: collectionSectionValue.items.map((item) =>
      normalizeCollectionItem(item, config.createItem()),
    ),
  } as ResumeDraft["sections"][K];
}

const MAX_HISTORY = 50;

// History keeps the previous draft by reference (no clone): drafts are never
// mutated in place — createNextDraft spreads a new object, the draft-utils
// mutators clone their input, and parseResumeDraft returns fresh objects.
function pushUndoStack(
  stack: ResumeDraft[],
  draft: ResumeDraft,
): ResumeDraft[] {
  const next = [...stack, draft];
  if (next.length > MAX_HISTORY) next.shift();
  return next;
}

export function createResumeEditorStore(config?: {
  storage?: DraftStorage;
  initialDraft?: ResumeDraft;
}) {
  const storage = config?.storage ?? new LocalDraftStorage();
  const initialDraft = config?.initialDraft ?? storage.load();

  return createStore<ResumeEditorStoreState>()((set, get) => {
    // Shared save path: persist the next draft, snapshot the previous one into
    // history, and clear the redo stack.
    const commit = (updater: (draft: ResumeDraft) => Partial<ResumeDraft>) => {
      const state = get();
      const nextDraft = storage.save(
        createNextDraft(state.draft, updater(state.draft)),
      );
      set({
        draft: nextDraft,
        undoStack: pushUndoStack(state.undoStack, state.draft),
        redoStack: [],
      });
    };

    return {
      draft: initialDraft,
      activeSection: "profile",
      undoStack: [],
      redoStack: [],
      saveProfile: (profile) => commit(() => ({ profile })),
      savePdfPresentation: (pdfPresentation) =>
        commit(() => ({ pdfPresentation })),
      saveSection: (sectionKey, sectionValue) =>
        commit((draft) => ({
          sections: reorderSections(
            draft.sections,
            sectionKey,
            normalizeSectionValue(sectionKey, sectionValue),
          ),
        })),
      reorderSection: (sectionKey, anchorKey) =>
        commit((draft) => ({
          sections: moveSectionToAnchor(draft.sections, sectionKey, anchorKey),
        })),
      setSectionVisibility: (sectionKey, visible) =>
        commit((draft) => ({
          sections: setSectionVisibilityWithOrder(
            draft.sections,
            sectionKey,
            visible,
          ),
        })),
      // Runs on the store rather than the item form because it fires from the
      // section list, where no form is mounted. Bonus: it lands on the undo
      // stack, which the old form-local version never did.
      autoSortSection: (sectionKey) =>
        commit((draft) => {
          const dateRange = collectionSectionConfigs[sectionKey].dateRange;
          if (!dateRange) return {};

          const sectionValue = draft.sections[sectionKey];
          const sorted = sortResumeItems(
            sectionValue.items as unknown as Record<string, unknown>[],
            dateRange.startName,
            dateRange.endName,
          );

          return {
            sections: {
              ...draft.sections,
              [sectionKey]: { ...sectionValue, items: sorted },
            } as ResumeDraft["sections"],
          };
        }),
      requestSectionChange: (sectionKey) => {
        set({
          activeSection: sectionKey,
        });
      },
      replaceDraft: (draft) => {
        const nextDraft = storage.save(draft);
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
        const nextDraft = storage.save(previousDraft);
        set({
          draft: nextDraft,
          undoStack: state.undoStack.slice(0, -1),
          redoStack: [...state.redoStack, state.draft],
        });
      },
      redo: () => {
        const state = get();
        const nextDraft = state.redoStack.at(-1);
        if (!nextDraft) return;
        const persistedDraft = storage.save(nextDraft);
        set({
          draft: persistedDraft,
          redoStack: state.redoStack.slice(0, -1),
          undoStack: [...state.undoStack, state.draft],
        });
      },
    };
  });
}
