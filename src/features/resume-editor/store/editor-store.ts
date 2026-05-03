import { createStore } from "zustand/vanilla";

import {
  moveSection,
  reorderSectionToIndex,
  reorderSections,
  setSectionVisibilityWithOrder,
} from "@/features/resume-editor/lib/draft-utils";
import { createDefaultResumeDraft } from "@/lib/resume/default-draft";
import type { Profile, ResumeDraft } from "@/lib/resume/schema";
import { saveResumeDraft } from "@/lib/resume/storage";

export type ResumeSectionKey = keyof ResumeDraft["sections"];
export type ResumeEditorPanelKey = "profile" | ResumeSectionKey;
export type ResumeEditorViewMode = "list" | "form";

export type ResumeEditorStoreState = {
  draft: ResumeDraft;
  activeSection: ResumeEditorPanelKey;
  editorViewMode: ResumeEditorViewMode;
  saveProfile: (profile: Profile) => void;
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

export function createResumeEditorStore(initialDraft = createDefaultResumeDraft()) {
  return createStore<ResumeEditorStoreState>()((set, get) => ({
    draft: initialDraft,
    activeSection: "profile",
    editorViewMode: "list",
    saveProfile: (profile) => {
      const nextDraft = createNextDraft(get().draft, { profile });
      saveResumeDraft(nextDraft);
      set({ draft: nextDraft });
    },
    saveSection: (sectionKey, sectionValue) => {
      const nextDraft = createNextDraft(get().draft, {
        sections: reorderSections(get().draft.sections, sectionKey, sectionValue),
      });
      saveResumeDraft(nextDraft);
      set({ draft: nextDraft });
    },
    moveSection: (sectionKey, direction) => {
      const nextDraft = createNextDraft(get().draft, {
        sections: moveSection(get().draft.sections, sectionKey, direction),
      });
      saveResumeDraft(nextDraft);
      set({ draft: nextDraft });
    },
    reorderSection: (sectionKey, targetIndex) => {
      const nextDraft = createNextDraft(get().draft, {
        sections: reorderSectionToIndex(
          get().draft.sections,
          sectionKey,
          targetIndex
        ),
      });
      saveResumeDraft(nextDraft);
      set({ draft: nextDraft });
    },
    setSectionVisibility: (sectionKey, visible) => {
      const nextDraft = createNextDraft(get().draft, {
        sections: setSectionVisibilityWithOrder(
          get().draft.sections,
          sectionKey,
          visible
        ),
      });
      saveResumeDraft(nextDraft);
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
      saveResumeDraft(draft);
      set({
        draft,
        activeSection: "profile",
        editorViewMode: "list",
      });
    },
    replaceDraft: (draft) => {
      saveResumeDraft(draft);
      set({
        draft,
        activeSection: "profile",
        editorViewMode: "list",
      });
    },
  }));
}
