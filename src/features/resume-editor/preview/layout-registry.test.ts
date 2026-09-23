import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

import { createDefaultResumeDraft } from "@/features/resume-editor/domain/draft/create-default-resume-draft";
import { computeAtsScore } from "@/features/resume-editor/domain/insights/ats-score";
import {
  pdfLayoutIds,
  type PdfLayoutId,
} from "@/features/resume-editor/domain/presentation/pdf-presentation";
import {
  resumeTemplatePresets,
  templateCategories,
} from "@/features/resume-editor/domain/presentation/template-presets";
import {
  getLayout,
  previewLayoutDefinitions,
  shouldHideSummaryHeading,
} from "@/features/resume-editor/preview/layout-registry";

/** The layouts that print a sidebar; every other layout is single-column. */
const twoColumnLayouts = [
  "split",
  "duet",
  "ledger",
  "dossier",
  "compass",
  "duotone",
] as const;

describe("preview layout registry", () => {
  // The registry and the domain's id list are separate declarations. A layout
  // added to one and not the other type-checks, then silently renders classic.
  it("covers exactly the domain's layout ids, in gallery order", () => {
    expect(previewLayoutDefinitions.map((layout) => layout.id)).toEqual([
      ...pdfLayoutIds,
    ]);
  });

  it("resolves every layout by its own id", () => {
    for (const id of pdfLayoutIds) {
      expect(getLayout(id).id).toBe(id);
    }
  });

  it("falls back to classic when an unknown layout id is requested", () => {
    expect(getLayout("missing" as never).id).toBe("classic");
  });

  it("partitions sections into side and main columns in the sidebar and split layouts", () => {
    for (const id of twoColumnLayouts) {
      const layout = getLayout(id);
      expect(layout.getColumn?.("skills")).toBe("side");
      expect(layout.getColumn?.("languages")).toBe("side");
      expect(layout.getColumn?.("certifications")).toBe("side");
      expect(layout.getColumn?.("references")).toBe("side");
      expect(layout.getColumn?.("workExperience")).toBe("main");
      expect(layout.getColumn?.("education")).toBe("main");
    }
  });

  it("gives no column partitioning to every other layout", () => {
    for (const id of pdfLayoutIds) {
      if (twoColumnLayouts.includes(id as (typeof twoColumnLayouts)[number])) continue;
      expect(getLayout(id).getColumn, `${id} should be single-column`).toBeUndefined();
    }
  });

  // A few layouts render the summary themselves (classic, split, atlas,
  // editorial), caption the box it sits in (rirekisho's 志望動機), or label it
  // from the rail with the headline (monolith); suppressing the shared <h2>
  // anywhere else loses the title. Asserted through the accessor every caller
  // uses, and over every layout, so a new one can't slip past.
  it("hides the summary heading only where the layout re-titles it", () => {
    const hiding = pdfLayoutIds.filter((id) => shouldHideSummaryHeading(id));
    expect([...hiding].sort()).toEqual([
      "atlas",
      "classic",
      "duotone",
      "editorial",
      "monolith",
      "rirekisho",
      "split",
    ]);
  });
});

function layoutVerdict(id: PdfLayoutId) {
  const draft = createDefaultResumeDraft();
  draft.pdfPresentation.layoutId = id;
  const severity = computeAtsScore(draft).suggestions.find(
    (s) => s.id === "parse/layout",
  )?.severity;
  return severity === "ok" ? "pass" : severity;
}

// The ATS verdict, the gallery chip and the README are three hand-kept claims
// about one page; these keep them from drifting apart as layouts change.
describe("layout ATS verdict", () => {
  it("fails every layout that partitions sections into a side column", () => {
    for (const id of pdfLayoutIds) {
      if (getLayout(id).getColumn) {
        expect(layoutVerdict(id), id).toBe("fail");
      }
    }
  });

  it("passes every layout the gallery files under the ATS chip", () => {
    for (const preset of resumeTemplatePresets) {
      if (templateCategories(preset).includes("ats")) {
        expect(layoutVerdict(preset.layoutId), preset.id).toBe("pass");
      }
    }
  });

  it("states the same verdict in each layout's README", () => {
    for (const id of pdfLayoutIds) {
      const readme = readFileSync(
        join(process.cwd(), "src/features/resume-editor/preview/layouts", id, "README.md"),
        "utf8",
      );
      const stated = readme.match(/^## ATS\s+Rated `(pass|warn|fail)`/m)?.[1];
      expect(stated, `${id}/README.md ## ATS`).toBe(layoutVerdict(id));
    }
  });
});
