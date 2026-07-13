import { describe, expect, it } from "vitest";

import { previewControlDefinitions } from "@/features/resume-editor/preview/control-registry";
import { previewTemplateDefinitions } from "@/features/resume-editor/preview/template-registry";
import { createDefaultPdfPresentation } from "@/features/resume-editor/domain/presentation/pdf-presentation";

const photoShape = previewControlDefinitions.find((c) => c.id === "photo-shape")!;
const templateControl = previewControlDefinitions.find(
  (c) => c.id === "template",
)!;

describe("template control", () => {
  it("derives its options from the template registry (single source of truth)", () => {
    // Options must mirror the registry so adding/removing a template needs no
    // second edit here — no separate pdfTemplateLabels enumeration.
    expect(templateControl.options).toEqual(
      previewTemplateDefinitions.map((template) => ({
        value: template.id,
        label: template.label,
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

  it("selecting Default clears photoShape so the template's own style applies", () => {
    const withShape = { ...base, photoShape: "circle" as const };
    expect(photoShape.update("default", withShape).photoShape).toBeUndefined();
    expect(photoShape.update("square", base).photoShape).toBe("square");
  });
});
