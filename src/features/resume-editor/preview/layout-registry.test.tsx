import { describe, expect, it } from "vitest";

import {
  getPreviewLayoutDefinition,
  previewLayoutDefinitions,
  renderLayoutHeader,
} from "@/features/resume-editor/preview/layout-registry";
import { createPreviewRenderContext } from "@/features/resume-editor/preview/engine";
import { createDefaultResumeDraft } from "@/features/resume-editor/domain/draft/create-default-resume-draft";

describe("preview layout registry", () => {
  it("exposes the built-in layouts", () => {
    const ids = previewLayoutDefinitions.map((layout) => layout.id);
    expect(ids).toEqual(["single-column", "two-column"]);
  });

  it("resolves layouts by id", () => {
    expect(getPreviewLayoutDefinition("single-column").id).toBe("single-column");
    expect(getPreviewLayoutDefinition("two-column").id).toBe("two-column");
  });

  it("falls back to single-column when an unknown layout id is requested", () => {
    expect(
      getPreviewLayoutDefinition("missing" as never).id,
    ).toBe("single-column");
  });

  it("renders the matching header element for each layout", () => {
    const draft = createDefaultResumeDraft();
    draft.pdfPresentation.layoutId = "single-column";
    const singleContext = createPreviewRenderContext(draft, "preview");
    const single = renderLayoutHeader(singleContext);
    expect((single as { props: { context: unknown } }).props.context).toBe(
      singleContext,
    );

    draft.pdfPresentation.layoutId = "two-column";
    const twoContext = createPreviewRenderContext(draft, "preview");
    const two = renderLayoutHeader(twoContext);
    expect((two as { props: { context: unknown } }).props.context).toBe(
      twoContext,
    );
  });

  it("partitions sections into side and main columns in two-column layout", () => {
    const twoColumn = getPreviewLayoutDefinition("two-column");
    expect(twoColumn.getColumn?.("skills")).toBe("side");
    expect(twoColumn.getColumn?.("languages")).toBe("side");
    expect(twoColumn.getColumn?.("workExperience")).toBe("main");
    expect(twoColumn.getColumn?.("education")).toBe("main");
  });
});
