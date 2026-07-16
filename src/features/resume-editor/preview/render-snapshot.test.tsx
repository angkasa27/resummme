import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { pdfLayoutIds } from "@/features/resume-editor/domain/presentation/pdf-presentation";
import { createDefaultResumeDraft } from "@/features/resume-editor/domain/draft/create-default-resume-draft";
import type { ResumeDraft } from "@/features/resume-editor/domain/schema";
import { ResumeDocument } from "@/features/resume-editor/preview/resume-document";

// Characterization / byte-identity guard. The layout-factory refactor
// (Phases B–C) must not change a single layout's emitted markup — this test
// substitutes for the declined screenshot byte-diff. If a layout legitimately
// changes, update the snapshot deliberately and review the diff.
//
// A fixed draft with EVERY section visible (default hides publications/awards)
// so every itemView is exercised for every layout.
function buildFixtureDraft(layoutId: ResumeDraft["pdfPresentation"]["layoutId"]): ResumeDraft {
  const draft = createDefaultResumeDraft();
  draft.updatedAt = "2026-01-01T00:00:00.000Z"; // deterministic, not rendered
  draft.sections.publications.visible = true;
  draft.sections.awards.visible = true;
  draft.pdfPresentation = { ...draft.pdfPresentation, layoutId };
  return draft;
}

describe("resume document render snapshots", () => {
  for (const layoutId of pdfLayoutIds) {
    it(`renders the ${layoutId} layout identically`, () => {
      const html = renderToStaticMarkup(
        <ResumeDocument draft={buildFixtureDraft(layoutId)} mode="preview" />,
      );
      expect(html).toMatchSnapshot();
    });
  }
});
