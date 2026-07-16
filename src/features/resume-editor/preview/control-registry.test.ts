import { describe, expect, it } from "vitest";

import { previewControlDefinitions } from "@/features/resume-editor/preview/control-registry";
import { previewLayoutDefinitions } from "@/features/resume-editor/preview/layout-registry";
import { createDefaultPdfPresentation } from "@/features/resume-editor/domain/presentation/pdf-presentation";

const photoShape = previewControlDefinitions.find((c) => c.id === "photo-shape")!;
const layoutControl = previewControlDefinitions.find(
  (c) => c.id === "layout",
)!;

describe("layout control", () => {
  it("derives its options from the layout registry (single source of truth)", () => {
    // Options must mirror the registry so adding/removing a layout needs no
    // second edit here — no separate pdfLayoutLabels enumeration.
    expect(layoutControl.options).toEqual(
      previewLayoutDefinitions.map((layout) => ({
        value: layout.id,
        label: layout.label,
      })),
    );
  });
});

describe("photo-shape control", () => {
  const base = createDefaultPdfPresentation();

  it("offers Default plus the three shapes", () => {
    expect(photoShape.options.map((o) => o.value)).toEqual([
      "default",
      "square",
      "rectangle",
      "circle",
    ]);
  });

  it("reports Default when photoShape is unset", () => {
    // Drives which toggle reads as active — unset must map back to "default".
    expect(photoShape.value({ ...base, photoShape: undefined })).toBe("default");
    expect(photoShape.value({ ...base, photoShape: "circle" })).toBe("circle");
  });

  it("selecting Default clears photoShape so the layout's own style applies", () => {
    const withShape = { ...base, photoShape: "circle" as const };
    expect(photoShape.update("default", withShape).photoShape).toBeUndefined();
    expect(photoShape.update("square", base).photoShape).toBe("square");
  });
});
