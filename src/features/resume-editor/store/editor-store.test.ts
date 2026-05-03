import { describe, expect, it } from "vitest";

import { createResumeEditorStore } from "@/features/resume-editor/store/editor-store";
import { createDefaultResumeDraft } from "@/lib/resume/default-draft";

describe("resume editor store", () => {
  it("returns to the section list without clearing the active section", () => {
    const store = createResumeEditorStore(createDefaultResumeDraft());

    store.getState().requestSectionChange("projects");
    expect(store.getState().activeSection).toBe("projects");
    expect(store.getState().editorViewMode).toBe("form");

    store.getState().returnToSectionList();

    expect(store.getState().activeSection).toBe("projects");
    expect(store.getState().editorViewMode).toBe("list");
  });

  it("normalizes malformed collection items before saving", () => {
    const store = createResumeEditorStore(createDefaultResumeDraft());

    expect(() =>
      store.getState().saveSection("skills", {
        ...store.getState().draft.sections.skills,
        items: [
          ...store.getState().draft.sections.skills.items,
          {
            categoryName: "Backend",
          } as never,
        ],
      })
    ).not.toThrow();

    expect(store.getState().draft.sections.skills.items[1]).toEqual(
      expect.objectContaining({
        categoryName: "Backend",
        id: expect.any(String),
        skills: [],
      })
    );
  });
});
