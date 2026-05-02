import { createStore } from "zustand/vanilla";

import { reorderSections } from "@/features/resume-editor/lib/draft-utils";
import { createDefaultResumeDraft } from "@/lib/resume/default-draft";
import type { Profile, ResumeDraft } from "@/lib/resume/schema";
import { saveResumeDraft } from "@/lib/resume/storage";

export type ResumeSectionKey = keyof ResumeDraft["sections"];
export type ResumeEditorPanelKey = "profile" | ResumeSectionKey;

export type ResumeEditorStoreState = {
  draft: ResumeDraft;
  activeSection: ResumeEditorPanelKey;
  dirtySections: ResumeEditorPanelKey[];
  pendingSection: ResumeEditorPanelKey | null;
  warningOpen: boolean;
  setSectionDirty: (sectionKey: ResumeEditorPanelKey, isDirty: boolean) => void;
  saveProfile: (profile: Profile) => void;
  saveSection: <K extends ResumeSectionKey>(
    sectionKey: K,
    sectionValue: ResumeDraft["sections"][K]
  ) => void;
  requestSectionChange: (sectionKey: ResumeEditorPanelKey) => void;
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
    activeSection: "summary",
    dirtySections: [],
    pendingSection: null,
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
    requestSectionChange: (sectionKey) => {
      const state = get();

      if (state.activeSection === sectionKey) {
        return;
      }

      if (state.dirtySections.includes(state.activeSection)) {
        set({
          pendingSection: sectionKey,
          warningOpen: true,
        });
        return;
      }

      set({
        activeSection: sectionKey,
        pendingSection: null,
        warningOpen: false,
      });
    },
    discardPendingSectionChanges: () => {
      const state = get();

      if (!state.pendingSection) {
        return;
      }

      set({
        activeSection: state.pendingSection,
        dirtySections: clearSectionKey(state.dirtySections, state.activeSection),
        pendingSection: null,
        warningOpen: false,
      });
    },
    cancelPendingSectionChange: () => {
      set({
        pendingSection: null,
        warningOpen: false,
      });
    },
    replaceDraft: (draft) => {
      saveResumeDraft(draft);
      set({
        draft,
        activeSection: "summary",
        dirtySections: [],
        pendingSection: null,
        warningOpen: false,
      });
    },
  }));
}
