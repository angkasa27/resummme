import { describe, expect, it } from "vitest";

import { createDefaultResumeDraft } from "@/features/resume-editor/domain/draft/create-default-resume-draft";
import { parseResumeDraft, profileSchema } from "@/features/resume-editor/domain/schema";

describe("resume schema", () => {
  it("parses the default resume draft", () => {
    const draft = createDefaultResumeDraft();

    const parsed = parseResumeDraft(draft);

    expect(parsed.schemaVersion).toBe(2);
    expect(parsed.templateId).toBe("recruiter-first-clean");
    expect(parsed.pdfPresentation.layoutId).toBe("sidebar-headings");
    expect(parsed.pdfPresentation.profileLayoutId).toBe("sidebar-profile");
    expect(parsed.pdfPresentation.overrides.typeScale).toBe("standard");
    expect(parsed.profile.fullName).toBeTruthy();
  });

  it("fills default pdf presentation settings for older drafts", () => {
    const draft = createDefaultResumeDraft();
    const { pdfPresentation: omittedPdfPresentation, ...legacyDraft } = draft;
    void omittedPdfPresentation;

    const parsed = parseResumeDraft(legacyDraft);

    expect(parsed.pdfPresentation).toEqual(draft.pdfPresentation);
  });

  it("normalizes legacy numeric pdf presentation overrides to preset tokens", () => {
    const draft = createDefaultResumeDraft();

    const parsed = parseResumeDraft({
      ...draft,
      pdfPresentation: {
        themeId: "classic-serif",
        overrides: {
          fontSizePx: 14.8,
          lineHeight: 1.9,
          sectionSpacingPx: 34,
          itemSpacingPx: 27,
          accentTone: "emerald",
          accentStrength: "strong",
        },
      },
    });

    expect(parsed.pdfPresentation).toEqual({
      layoutId: "sidebar-headings",
      profileLayoutId: "sidebar-profile",
      overrides: {
        typeScale: "large",
        lineHeight: "relaxed",
        spacing: "airy",
        accentTone: "emerald",
        accentStrength: "strong",
      },
    });
  });

  it("fills a profile layout default for legacy drafts that only saved document layout", () => {
    const draft = createDefaultResumeDraft();

    const parsed = parseResumeDraft({
      ...draft,
      pdfPresentation: {
        layoutId: "classic-centered",
        overrides: draft.pdfPresentation.overrides,
      },
    });

    expect(parsed.pdfPresentation.profileLayoutId).toBe(
      "centered-portrait-profile",
    );
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

  it("allows blank profile fields in stored drafts", () => {
    const draft = createDefaultResumeDraft();

    expect(() =>
      profileSchema.parse({
        ...draft.profile,
        fullName: "",
        location: "",
        phone: "",
        email: "",
        photo: "",
        extraLinks: [
          {
            id: "link-1",
            url: "",
          },
        ],
      }),
    ).not.toThrow();
  });

  it("rejects malformed profile email addresses", () => {
    const draft = createDefaultResumeDraft();

    expect(() =>
      profileSchema.parse({
        ...draft.profile,
        email: "not-an-email",
      }),
    ).toThrow(/email/i);
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

  it("rejects malformed project links in stored drafts", () => {
    const draft = createDefaultResumeDraft();

    expect(() =>
      parseResumeDraft({
        ...draft,
        sections: {
          ...draft.sections,
          projects: {
            ...draft.sections.projects,
            items: [
              {
                ...draft.sections.projects.items[0],
                projectLink: "not-a-url",
              },
            ],
          },
        },
      }),
    ).toThrow(/project link/i);
  });

  it("rejects malformed month-year values in stored drafts", () => {
    const draft = createDefaultResumeDraft();

    expect(() =>
      parseResumeDraft({
        ...draft,
        sections: {
          ...draft.sections,
          workExperience: {
            ...draft.sections.workExperience,
            items: [
              {
                ...draft.sections.workExperience.items[0],
                startDate: "2024-01",
              },
            ],
          },
        },
      }),
    ).toThrow(/start date/i);
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
