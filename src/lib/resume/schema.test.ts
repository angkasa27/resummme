import { describe, expect, it } from "vitest";

import { createDefaultResumeDraft } from "@/lib/resume/default-draft";
import { parseResumeDraft } from "@/lib/resume/schema";

describe("resume schema", () => {
  it("parses the default resume draft", () => {
    const draft = createDefaultResumeDraft();

    const parsed = parseResumeDraft(draft);

    expect(parsed.schemaVersion).toBe(1);
    expect(parsed.templateId).toBe("recruiter-first-clean");
    expect(parsed.profile.fullName).toBeTruthy();
  });

  it("rejects unsupported schema versions", () => {
    const draft = createDefaultResumeDraft();

    expect(() =>
      parseResumeDraft({
        ...draft,
        schemaVersion: 99,
      })
    ).toThrow(/schemaVersion/i);
  });

  it("rejects malformed profile links", () => {
    const draft = createDefaultResumeDraft();

    expect(() =>
      parseResumeDraft({
        ...draft,
        profile: {
          ...draft.profile,
          extraLinks: [
            {
              id: "link-1",
              label: "Portfolio",
              url: "not-a-url",
            },
          ],
        },
      })
    ).toThrow(/url/i);
  });

  it("keeps default visible sections focused on the core resume flow", () => {
    const draft = createDefaultResumeDraft();

    expect(draft.sections.summary.visible).toBe(true);
    expect(draft.sections.workExperience.visible).toBe(true);
    expect(draft.sections.skills.visible).toBe(true);
    expect(draft.sections.projects.visible).toBe(true);
    expect(draft.sections.education.visible).toBe(true);
    expect(draft.sections.publications.visible).toBe(false);
    expect(draft.sections.references.visible).toBe(false);
  });
});
