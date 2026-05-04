import { describe, expect, it } from "vitest";

import { createResumeEditorStore } from "@/features/resume-editor/store/editor-store";
import { createDefaultResumeDraft } from "@/lib/resume/default-draft";

describe("resume editor store", () => {
  it("switches the active section when requesting a section change", () => {
    const store = createResumeEditorStore(createDefaultResumeDraft());

    store.getState().requestSectionChange("projects");
    expect(store.getState().activeSection).toBe("projects");

    store.getState().requestSectionChange("skills");
    expect(store.getState().activeSection).toBe("skills");
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
