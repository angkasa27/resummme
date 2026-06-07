import { describe, expect, it } from "vitest";

import { createLocalId } from "@/features/resume-editor/domain/create-local-id";

describe("createLocalId", () => {
  it("prefixes the id", () => {
    const id = createLocalId("skill");
    expect(id).toMatch(/^skill-/);
  });

  it("generates unique ids across calls", () => {
    const a = createLocalId("test");
    const b = createLocalId("test");
    expect(a).not.toBe(b);
  });
});
