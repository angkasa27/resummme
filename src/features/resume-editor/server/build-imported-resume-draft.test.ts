import { describe, expect, it } from "vitest";

import { buildImportedResumeDraft } from "@/features/resume-editor/server/build-imported-resume-draft";

describe("buildImportedResumeDraft", () => {
  it("maps imported resume data into a valid draft", () => {
    const result = buildImportedResumeDraft({
      profile: {
        fullName: "Jane Doe",
        location: "Jakarta, Indonesia",
        phone: "+62 812 1234 5678",
        email: "jane@example.com",
        extraLinks: ["linkedin.com/in/janedoe", "https://github.com/janedoe"],
      },
      summary: ["Product-minded engineer.", "Built internal tooling."],
      workExperience: [
        {
          companyName: "Acme",
          position: "Frontend Engineer",
          location: "Remote",
          startDate: "May 2021",
          endDate: "present",
          highlights: ["Built a design system.", "Improved performance by 30%."],
        },
      ],
      skills: [
        {
          categoryName: "Frontend",
          skills: ["React", "TypeScript"],
        },
      ],
      projects: [],
      education: [],
      publications: [],
      certifications: [],
      awards: [],
      languages: [],
      references: [],
      organizationVolunteering: [],
    });

    expect(result.warnings).toEqual([]);
    expect(result.draft.profile.fullName).toBe("Jane Doe");
    expect(result.draft.profile.photo).toBe("");
    expect(result.draft.profile.extraLinks).toHaveLength(2);
    expect(result.draft.sections.summary.visible).toBe(true);
    expect(result.draft.sections.summary.content).toContain("<p>Product-minded engineer.</p>");
    expect(result.draft.sections.workExperience.visible).toBe(true);
    expect(result.draft.sections.workExperience.items[0].endDate).toBe("current");
    expect(result.draft.sections.workExperience.items[0].description).toContain("<li>Built a design system.</li>");
    expect(result.draft.sections.projects.visible).toBe(false);
    expect(result.draft.sections.projects.items).toHaveLength(1);
  });

  it("records warnings and blanks unsupported date formats", () => {
    const result = buildImportedResumeDraft({
      profile: {
        fullName: "Jane Doe",
        location: "",
        phone: "",
        email: "",
        extraLinks: [],
      },
      summary: [],
      workExperience: [
        {
          companyName: "Acme",
          position: "Engineer",
          location: "",
          startDate: "2021",
          endDate: "2022",
          highlights: [],
        },
      ],
      skills: [],
      projects: [],
      education: [],
      publications: [],
      certifications: [],
      awards: [],
      languages: [],
      references: [],
      organizationVolunteering: [],
    });

    expect(result.draft.sections.workExperience.items[0].startDate).toBe("");
    expect(result.draft.sections.workExperience.items[0].endDate).toBe("");
    expect(result.warnings).toEqual([
      "Work experience start date for Acme used an unsupported date format and was left blank.",
      "Work experience end date for Acme used an unsupported date format and was left blank.",
    ]);
  });
});
