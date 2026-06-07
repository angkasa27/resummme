import { describe, expect, it } from "vitest";

import { createDefaultResumeDraft } from "@/features/resume-editor/domain/draft/create-default-resume-draft";
import {
  extractAllBullets,
  extractBullets,
  extractResumeText,
  stripRichText,
} from "@/features/resume-editor/domain/insights/extract-text";

describe("stripRichText", () => {
  it("strips HTML tags", () => {
    expect(stripRichText("<p>Hello</p>")).toBe("Hello");
  });

  it("decodes HTML entities", () => {
    expect(stripRichText("&amp; &lt; &gt; &quot; &#39;")).toBe("& < > \" '");
  });

  it("collapses whitespace", () => {
    expect(stripRichText("  a   b  ")).toBe("a b");
  });

  it("returns empty string for null/empty", () => {
    expect(stripRichText("")).toBe("");
  });
});

describe("extractBullets", () => {
  it("splits on li tags", () => {
    const html = "<ul><li>First</li><li>Second</li></ul>";
    expect(extractBullets(html)).toEqual(["First", "Second"]);
  });

  it("splits on p tags", () => {
    const html = "<p>First</p><p>Second</p>";
    expect(extractBullets(html)).toEqual(["First", "Second"]);
  });

  it("returns empty array for empty input", () => {
    expect(extractBullets("")).toEqual([]);
  });

  it("drops empty chunks", () => {
    const html = "<li></li><li>Only</li>";
    expect(extractBullets(html)).toEqual(["Only"]);
  });
});

describe("extractResumeText", () => {
  it("flattens profile fields into text", () => {
    const draft = createDefaultResumeDraft();
    draft.profile.fullName = "Jane Doe";
    draft.profile.location = "Jakarta";
    draft.profile.email = "jane@test.com";
    draft.sections.summary.visible = true;
    draft.sections.summary.content = "<p>Experienced engineer</p>";

    const text = extractResumeText(draft);

    expect(text).toContain("Jane Doe");
    expect(text).toContain("Jakarta");
    expect(text).toContain("jane@test.com");
    expect(text).toContain("Experienced engineer");
  });

  it("skips hidden summary sections", () => {
    const draft = createDefaultResumeDraft();
    draft.sections.summary.visible = false;
    draft.sections.summary.content = "<p>Hidden</p>";

    const text = extractResumeText(draft);

    expect(text).not.toContain("Hidden");
  });

  it("extracts work experience text", () => {
    const draft = createDefaultResumeDraft();

    const text = extractResumeText(draft);

    expect(text).toContain("Lead Frontend Engineer");
    expect(text).toContain("Nusantara Commerce");
  });
});

describe("extractAllBullets", () => {
  it("gathers bullets from work experience, projects, education, and volunteering", () => {
    const draft = createDefaultResumeDraft();

    const bullets = extractAllBullets(draft);

    expect(bullets.length).toBeGreaterThan(0);
    expect(bullets.some((b) => b.includes("migration"))).toBe(true);
    expect(bullets.some((b) => b.includes("analytics"))).toBe(true);
  });
});
