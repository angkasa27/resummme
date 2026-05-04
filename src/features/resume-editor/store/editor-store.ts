import { createStore } from "zustand/vanilla";

import { collectionSectionConfigs } from "@/features/resume-editor/config/collection-section-config";
import { isCollectionSectionKey } from "@/features/resume-editor/config/section-metadata";
import {
  moveSection,
  reorderSectionToIndex,
  reorderSections,
  setSectionVisibilityWithOrder,
} from "@/features/resume-editor/lib/draft-utils";
import { normalizeCollectionItem } from "@/features/resume-editor/lib/normalize-collection-item";
import { createDefaultResumeDraft } from "@/lib/resume/default-draft";
import type { PdfPresentation, Profile, ResumeDraft } from "@/lib/resume/schema";
import { saveResumeDraft } from "@/lib/resume/storage";

export type ResumeSectionKey = keyof ResumeDraft["sections"];
export type ResumeEditorPanelKey = "profile" | ResumeSectionKey;
export type ResumeEditorViewMode = "list" | "form";

export type ResumeEditorStoreState = {
  draft: ResumeDraft;
  activeSection: ResumeEditorPanelKey;
  editorViewMode: ResumeEditorViewMode;
  saveProfile: (profile: Profile) => void;
  savePdfPresentation: (pdfPresentation: PdfPresentation) => void;
  saveSection: <K extends ResumeSectionKey>(
    sectionKey: K,
    sectionValue: ResumeDraft["sections"][K]
  ) => void;
  moveSection: (sectionKey: ResumeSectionKey, direction: -1 | 1) => void;
  reorderSection: (sectionKey: ResumeSectionKey, targetIndex: number) => void;
  setSectionVisibility: (sectionKey: ResumeSectionKey, visible: boolean) => void;
  requestSectionChange: (sectionKey: ResumeEditorPanelKey) => void;
  returnToSectionList: () => void;
  requestImportDraft: (draft: ResumeDraft) => void;
  replaceDraft: (draft: ResumeDraft) => void;
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

export function createResumeEditorStore(initialDraft = createDefaultResumeDraft()) {
  return createStore<ResumeEditorStoreState>()((set, get) => ({
    draft: initialDraft,
    activeSection: "profile",
    editorViewMode: "list",
    saveProfile: (profile) => {
      const nextDraft = saveResumeDraft(createNextDraft(get().draft, { profile }));
      set({ draft: nextDraft });
    },
    savePdfPresentation: (pdfPresentation) => {
      const nextDraft = saveResumeDraft(
        createNextDraft(get().draft, { pdfPresentation })
      );
      set({ draft: nextDraft });
    },
    saveSection: (sectionKey, sectionValue) => {
      const normalizedSectionValue = normalizeSectionValue(sectionKey, sectionValue);
      const nextDraft = saveResumeDraft(
        createNextDraft(get().draft, {
          sections: reorderSections(
            get().draft.sections,
            sectionKey,
            normalizedSectionValue
          ),
        })
      );
      set({ draft: nextDraft });
    },
    moveSection: (sectionKey, direction) => {
      const nextDraft = saveResumeDraft(
        createNextDraft(get().draft, {
          sections: moveSection(get().draft.sections, sectionKey, direction),
        })
      );
      set({ draft: nextDraft });
    },
    reorderSection: (sectionKey, targetIndex) => {
      const nextDraft = saveResumeDraft(
        createNextDraft(get().draft, {
          sections: reorderSectionToIndex(
            get().draft.sections,
            sectionKey,
            targetIndex
          ),
        })
      );
      set({ draft: nextDraft });
    },
    setSectionVisibility: (sectionKey, visible) => {
      const nextDraft = saveResumeDraft(
        createNextDraft(get().draft, {
          sections: setSectionVisibilityWithOrder(
            get().draft.sections,
            sectionKey,
            visible
          ),
        })
      );
      set({ draft: nextDraft });
    },
    requestSectionChange: (sectionKey) => {
      set({
        activeSection: sectionKey,
        editorViewMode: "form",
      });
    },
    returnToSectionList: () => {
      set({
        editorViewMode: "list",
      });
    },
    requestImportDraft: (draft) => {
      const nextDraft = saveResumeDraft(draft);
      set({
        draft: nextDraft,
        activeSection: "profile",
        editorViewMode: "list",
      });
    },
    replaceDraft: (draft) => {
      const nextDraft = saveResumeDraft(draft);
      set({
        draft: nextDraft,
        activeSection: "profile",
        editorViewMode: "list",
      });
    },
  }));
}
