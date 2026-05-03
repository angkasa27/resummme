import { describe, expect, it } from "vitest";

import { createDefaultResumeDraft } from "@/lib/resume/default-draft";
import { parseResumeDraft, profileSchema } from "@/lib/resume/schema";

describe("resume schema", () => {
  it("parses the default resume draft", () => {
    const draft = createDefaultResumeDraft();

    const parsed = parseResumeDraft(draft);

    expect(parsed.schemaVersion).toBe(2);
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
      profileSchema.parse({
        ...draft.profile,
        extraLinks: [
          {
            id: "link-1",
            url: "not-a-url",
          },
        ],
      })
    ).toThrow(/url/i);
  });

  it("rejects legacy profile link objects that still include labels", () => {
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
              url: "https://asaa.dev",
            },
          ],
        },
      })
    ).toThrow();
  });

  it("allows blank summary content in stored drafts", () => {
    const draft = createDefaultResumeDraft();

    expect(() =>
      parseResumeDraft({
        ...draft,
        sections: {
          ...draft.sections,
          summary: {
            ...draft.sections.summary,
            content: "",
          },
        },
      })
    ).not.toThrow();
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

  it("seeds every collection section with one empty item", () => {
    const draft = createDefaultResumeDraft();

    expect(draft.sections.workExperience.items).toHaveLength(1);
    expect(draft.sections.skills.items).toHaveLength(1);
    expect(draft.sections.projects.items).toHaveLength(1);
    expect(draft.sections.education.items).toHaveLength(1);
    expect(draft.sections.publications.items).toHaveLength(1);
    expect(draft.sections.certifications.items).toHaveLength(1);
    expect(draft.sections.awards.items).toHaveLength(1);
    expect(draft.sections.languages.items).toHaveLength(1);
    expect(draft.sections.references.items).toHaveLength(1);
    expect(draft.sections.organizationVolunteering.items).toHaveLength(1);
  });
});
