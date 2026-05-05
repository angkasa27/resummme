import { describe, expect, it } from "vitest";

import {
  createPreviewLayoutRegistry,
  getPreviewLayoutDefinition,
  previewLayoutDefinitions,
} from "@/features/resume-editor/preview/layout-registry";
import {
  createPreviewProfileLayoutRegistry,
  getPreviewProfileLayoutDefinition,
  previewProfileLayoutDefinitions,
} from "@/features/resume-editor/preview/profile-layout-registry";

describe("preview layout registry", () => {
  it("resolves the current built-in layouts", () => {
    const registry = createPreviewLayoutRegistry();

    expect(registry.get("sidebar-headings")?.id).toBe("sidebar-headings");
    expect(registry.get("classic-centered")?.id).toBe("classic-centered");
    expect(getPreviewLayoutDefinition("classic-centered").id).toBe(
      "classic-centered",
    );
  });

  it("allows an extra layout to be registered without editing the resolver", () => {
    const fakeLayout = {
      ...previewLayoutDefinitions[0],
      id: "magazine-grid" as never,
    };

    const registry = createPreviewLayoutRegistry([
      previewLayoutDefinitions[0],
      fakeLayout,
    ]);

    expect([...registry.values()]).toContain(fakeLayout);
  });

  it("resolves the built-in profile layouts independently from document layouts", () => {
    const registry = createPreviewProfileLayoutRegistry();

    expect(registry.get("sidebar-profile")?.id).toBe("sidebar-profile");
    expect(registry.get("centered-portrait-profile")?.id).toBe(
      "centered-portrait-profile",
    );
    expect(
      getPreviewProfileLayoutDefinition("centered-portrait-profile").id,
    ).toBe("centered-portrait-profile");
  });

  it("allows an extra profile layout to be registered without editing the resolver", () => {
    const fakeProfileLayout = {
      ...previewProfileLayoutDefinitions[0],
      id: "magazine-hero-profile" as never,
    };

    const registry = createPreviewProfileLayoutRegistry([
      previewProfileLayoutDefinitions[0],
      fakeProfileLayout,
    ]);

    expect([...registry.values()]).toContain(fakeProfileLayout);
  });
});
