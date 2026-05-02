import { createStore } from "zustand/vanilla";

import {
  moveSection,
  reorderSections,
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
  dirtySections: ResumeEditorPanelKey[];
  pendingSection: ResumeEditorPanelKey | null;
  pendingViewMode: ResumeEditorViewMode | null;
  warningOpen: boolean;
  setSectionDirty: (sectionKey: ResumeEditorPanelKey, isDirty: boolean) => void;
  saveProfile: (profile: Profile) => void;
  saveSection: <K extends ResumeSectionKey>(
    sectionKey: K,
    sectionValue: ResumeDraft["sections"][K]
  ) => void;
  moveSection: (sectionKey: ResumeSectionKey, direction: -1 | 1) => void;
  setSectionVisibility: (sectionKey: ResumeSectionKey, visible: boolean) => void;
  requestSectionChange: (sectionKey: ResumeEditorPanelKey) => void;
  returnToSectionList: () => void;
  discardPendingSectionChanges: () => void;
  cancelPendingSectionChange: () => void;
  replaceDraft: (draft: ResumeDraft) => void;
};

function ensureUniqueSectionKeys(sectionKeys: ResumeEditorPanelKey[]) {
  return [...new Set(sectionKeys)];
}

function clearSectionKey(
  sectionKeys: ResumeEditorPanelKey[],
  sectionKey: ResumeEditorPanelKey
) {
  return sectionKeys.filter((key) => key !== sectionKey);
}

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
    dirtySections: [],
    pendingSection: null,
    pendingViewMode: null,
    warningOpen: false,
    setSectionDirty: (sectionKey, isDirty) => {
      const alreadyDirty = get().dirtySections.includes(sectionKey);

      if (alreadyDirty === isDirty) {
        return;
      }

      set((state) => ({
        dirtySections: isDirty
          ? ensureUniqueSectionKeys([...state.dirtySections, sectionKey])
          : clearSectionKey(state.dirtySections, sectionKey),
      }));
    },
    saveProfile: (profile) => {
      const nextDraft = createNextDraft(get().draft, { profile });

      saveResumeDraft(nextDraft);

      set((state) => ({
        draft: nextDraft,
        dirtySections: clearSectionKey(state.dirtySections, "profile"),
      }));
    },
    saveSection: (sectionKey, sectionValue) => {
      const nextDraft = createNextDraft(get().draft, {
        sections: reorderSections(get().draft.sections, sectionKey, sectionValue),
      });

      saveResumeDraft(nextDraft);

      set((state) => ({
        draft: nextDraft,
        dirtySections: clearSectionKey(state.dirtySections, sectionKey),
      }));
    },
    moveSection: (sectionKey, direction) => {
      const nextDraft = createNextDraft(get().draft, {
        sections: moveSection(get().draft.sections, sectionKey, direction),
      });

      saveResumeDraft(nextDraft);

      set({
        draft: nextDraft,
      });
    },
    setSectionVisibility: (sectionKey, visible) => {
      const nextDraft = createNextDraft(get().draft, {
        sections: {
          ...get().draft.sections,
          [sectionKey]: {
            ...get().draft.sections[sectionKey],
            visible,
          },
        },
      });

      saveResumeDraft(nextDraft);

      set({
        draft: nextDraft,
      });
    },
    requestSectionChange: (sectionKey) => {
      const state = get();

      if (state.activeSection === sectionKey && state.editorViewMode === "form") {
        return;
      }

      if (state.dirtySections.includes(state.activeSection)) {
        set({
          pendingSection: sectionKey,
          pendingViewMode: "form",
          warningOpen: true,
        });
        return;
      }

      set({
        activeSection: sectionKey,
        editorViewMode: "form",
        pendingSection: null,
        pendingViewMode: null,
        warningOpen: false,
      });
    },
    returnToSectionList: () => {
      const state = get();

      if (state.editorViewMode === "list") {
        return;
      }

      if (state.dirtySections.includes(state.activeSection)) {
        set({
          pendingSection: null,
          pendingViewMode: "list",
          warningOpen: true,
        });
        return;
      }

      set({
        editorViewMode: "list",
        pendingSection: null,
        pendingViewMode: null,
        warningOpen: false,
      });
    },
    discardPendingSectionChanges: () => {
      const state = get();

      if (!state.pendingSection && !state.pendingViewMode) {
        return;
      }

      if (state.pendingViewMode === "list") {
        set({
          editorViewMode: "list",
          dirtySections: clearSectionKey(state.dirtySections, state.activeSection),
          pendingSection: null,
          pendingViewMode: null,
          warningOpen: false,
        });
        return;
      }

      if (!state.pendingSection) {
        return;
      }

      set({
        activeSection: state.pendingSection,
        editorViewMode: "form",
        dirtySections: clearSectionKey(state.dirtySections, state.activeSection),
        pendingSection: null,
        pendingViewMode: null,
        warningOpen: false,
      });
    },
    cancelPendingSectionChange: () => {
      set({
        pendingSection: null,
        pendingViewMode: null,
        warningOpen: false,
      });
    },
    replaceDraft: (draft) => {
      saveResumeDraft(draft);
      set({
        draft,
        activeSection: "profile",
        editorViewMode: "list",
        dirtySections: [],
        pendingSection: null,
        pendingViewMode: null,
        warningOpen: false,
      });
    },
  }));
}
