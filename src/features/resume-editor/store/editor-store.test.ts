import { describe, expect, it } from "vitest";

import { createDefaultResumeDraft } from "@/lib/resume/default-draft";
import { createResumeEditorStore } from "@/features/resume-editor/store/editor-store";

describe("resume editor store", () => {
  it("starts in section list mode", () => {
    const store = createResumeEditorStore(createDefaultResumeDraft());

    expect(store.getState().editorViewMode).toBe("list");
    expect(store.getState().activeSection).toBe("profile");
  });

  it("commits a saved section", () => {
    const store = createResumeEditorStore(createDefaultResumeDraft());

    store.getState().saveSection("summary", {
      visible: true,
      order: 0,
      content: "<p>Updated summary</p>",
    });

    expect(store.getState().draft.sections.summary.content).toBe(
      "<p>Updated summary</p>"
    );
  });

  it("opens form mode immediately when requesting a section", () => {
    const store = createResumeEditorStore(createDefaultResumeDraft());

    store.getState().requestSectionChange("projects");

    expect(store.getState().activeSection).toBe("projects");
    expect(store.getState().editorViewMode).toBe("form");
  });

  it("returns to the section list immediately", () => {
    const store = createResumeEditorStore(createDefaultResumeDraft());

    store.getState().requestSectionChange("projects");
    store.getState().returnToSectionList();

    expect(store.getState().editorViewMode).toBe("list");
  });

  it("replaces the draft", () => {
    const store = createResumeEditorStore(createDefaultResumeDraft());
    const nextDraft = createDefaultResumeDraft();
    nextDraft.profile.fullName = "Another Name";

    store.getState().requestSectionChange("summary");
    store.getState().replaceDraft(nextDraft);

    expect(store.getState().draft.profile.fullName).toBe("Another Name");
    expect(store.getState().activeSection).toBe("profile");
    expect(store.getState().editorViewMode).toBe("list");
  });

  it("saves profile changes", () => {
    const store = createResumeEditorStore(createDefaultResumeDraft());

    store.getState().saveProfile({
      ...store.getState().draft.profile,
      fullName: "Edited Profile Name",
    });

    expect(store.getState().draft.profile.fullName).toBe("Edited Profile Name");
  });

  it("moves section order immediately", () => {
    const store = createResumeEditorStore(createDefaultResumeDraft());

    store.getState().moveSection("projects", -1);

    expect(store.getState().draft.sections.projects.order).toBe(2);
    expect(store.getState().draft.sections.skills.order).toBe(3);
  });

  it("reorders a section to a target index immediately", () => {
    const store = createResumeEditorStore(createDefaultResumeDraft());

    store.getState().reorderSection("projects", 1);

    expect(store.getState().draft.sections.summary.order).toBe(0);
    expect(store.getState().draft.sections.projects.order).toBe(1);
    expect(store.getState().draft.sections.workExperience.order).toBe(2);
    expect(store.getState().draft.sections.skills.order).toBe(3);
  });

  it("hides a section by moving it to the available group order", () => {
    const store = createResumeEditorStore(createDefaultResumeDraft());

    store.getState().setSectionVisibility("projects", false);

    expect(store.getState().draft.sections.projects.visible).toBe(false);
    expect(store.getState().draft.sections.projects.order).toBeGreaterThan(
      store.getState().draft.sections.education.order
    );
  });

  it("shows an available section at the bottom of included sections", () => {
    const store = createResumeEditorStore(createDefaultResumeDraft());

    store.getState().setSectionVisibility("publications", true);

    expect(store.getState().draft.sections.publications.visible).toBe(true);
    expect(store.getState().draft.sections.publications.order).toBe(5);
    expect(store.getState().draft.sections.certifications.order).toBe(6);
  });

  it("imports draft", () => {
    const store = createResumeEditorStore(createDefaultResumeDraft());
    const importedDraft = createDefaultResumeDraft();
    importedDraft.profile.fullName = "Imported Name";

    store.getState().requestSectionChange("projects");
    store.getState().requestImportDraft(importedDraft);

    expect(store.getState().draft.profile.fullName).toBe("Imported Name");
    expect(store.getState().editorViewMode).toBe("list");
  });
});
