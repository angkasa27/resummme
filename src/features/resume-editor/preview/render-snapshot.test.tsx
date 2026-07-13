import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { pdfTemplateIds } from "@/features/resume-editor/domain/presentation/pdf-presentation";
import { createDefaultResumeDraft } from "@/features/resume-editor/domain/draft/create-default-resume-draft";
import type { ResumeDraft } from "@/features/resume-editor/domain/schema";
import { ResumeDocument } from "@/features/resume-editor/preview/resume-document";

// Characterization / byte-identity guard. The template-factory refactor
// (Phases B–C) must not change a single template's emitted markup — this test
// substitutes for the declined screenshot byte-diff. If a template legitimately
// changes, update the snapshot deliberately and review the diff.
//
// A fixed draft with EVERY section visible (default hides publications/awards)
// so every itemView is exercised for every template.
function buildFixtureDraft(templateId: ResumeDraft["pdfPresentation"]["templateId"]): ResumeDraft {
  const draft = createDefaultResumeDraft();
  draft.updatedAt = "2026-01-01T00:00:00.000Z"; // deterministic, not rendered
  draft.sections.publications.visible = true;
  draft.sections.awards.visible = true;
  draft.pdfPresentation = { ...draft.pdfPresentation, templateId };
  return draft;
}

describe("resume document render snapshots", () => {
  for (const templateId of pdfTemplateIds) {
    it(`renders the ${templateId} template identically`, () => {
      const html = renderToStaticMarkup(
        <ResumeDocument draft={buildFixtureDraft(templateId)} mode="preview" />,
      );
      expect(html).toMatchSnapshot();
    });
  }
});
