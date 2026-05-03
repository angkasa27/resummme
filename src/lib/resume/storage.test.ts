import { beforeEach, describe, expect, it } from "vitest";

import { createDefaultResumeDraft } from "@/lib/resume/default-draft";
import {
  RESUME_STORAGE_KEY,
  exportResumeDraft,
  importResumeDraft,
  loadResumeDraft,
  saveResumeDraft,
} from "@/lib/resume/storage";

describe("resume storage", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("saves and loads a validated draft", () => {
    const draft = createDefaultResumeDraft();
    draft.profile.fullName = "Fulan bin Fulan";

    saveResumeDraft(draft);

    expect(window.localStorage.getItem(RESUME_STORAGE_KEY)).toContain(
      "Fulan bin Fulan",
    );

    const loaded = loadResumeDraft();

    expect(loaded.profile.fullName).toBe("Fulan bin Fulan");
  });

  it("returns the default draft when storage is empty", () => {
    const loaded = loadResumeDraft();

    expect(loaded.profile.fullName).toBe(
      createDefaultResumeDraft().profile.fullName,
    );
  });

  it("falls back to the default draft when storage is malformed", () => {
    window.localStorage.setItem(RESUME_STORAGE_KEY, "{");

    const loaded = loadResumeDraft();

    expect(loaded.templateId).toBe("recruiter-first-clean");
  });

  it("exports and re-imports a draft as the same contract", () => {
    const draft = createDefaultResumeDraft();

    const exported = exportResumeDraft(draft);
    const imported = importResumeDraft(exported);

    expect(imported).toEqual(draft);
  });

  it("rejects malformed imported drafts", () => {
    expect(() =>
      importResumeDraft(
        JSON.stringify({
          schemaVersion: 2,
          templateId: "recruiter-first-clean",
          profile: {},
        }),
      ),
    ).toThrow(/profile/i);
  });

  it("sanitizes imported rich text content", () => {
    const draft = createDefaultResumeDraft();
    draft.profile.summary =
      '<p onclick="alert(1)">Profile</p><script>alert(1)</script>';
    draft.sections.summary.content =
      '<p><a href="javascript:alert(1)" target="_blank">Summary</a></p>';
    draft.sections.projects.items[0].description =
      "<p><img src=x onerror=alert(1)>Project</p>";

    const imported = importResumeDraft(JSON.stringify(draft));

    expect(imported.profile.summary).toBe("<p>Profile</p>");
    expect(imported.sections.summary.content).toBe(
      '<p><a target="_blank" rel="noopener noreferrer">Summary</a></p>',
    );
    expect(imported.sections.projects.items[0].description).toBe(
      "<p>Project</p>",
    );
  });
});
