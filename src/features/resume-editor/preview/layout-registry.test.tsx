import { describe, expect, it } from "vitest";

import {
  createPreviewLayoutRegistry,
  getPreviewLayoutDefinition,
  previewLayoutDefinitions,
} from "@/features/resume-editor/preview/layout-registry";

describe("preview layout registry", () => {
  it("resolves the current built-in layouts", () => {
    const registry = createPreviewLayoutRegistry();

    expect(registry.get("sidebar-headings")?.id).toBe("sidebar-headings");
    expect(registry.get("classic-centered")?.id).toBe("classic-centered");
    expect(getPreviewLayoutDefinition("classic-centered").id).toBe(
      "classic-centered"
    );
  });

  it("allows an extra layout to be registered without editing the resolver", () => {
    const fakeLayout = {
      ...previewLayoutDefinitions[0],
      id: "magazine-grid",
    };

    const registry = createPreviewLayoutRegistry([
      previewLayoutDefinitions[0],
      fakeLayout,
    ]);

    expect(registry.get("magazine-grid")).toBe(fakeLayout);
  });
});
