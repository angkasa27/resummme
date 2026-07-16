import { describe, expect, it } from "vitest";

import { formatContactLink } from "@/features/resume-editor/preview/kit/format-contact-link";

describe("formatContactLink", () => {
  it("strips protocol, www, and a trailing slash", () => {
    expect(formatContactLink("https://www.linkedin.com/in/grantwalker/")).toBe(
      "linkedin.com/in/grantwalker",
    );
  });

  it("keeps the path, which is what identifies the profile", () => {
    expect(formatContactLink("https://github.com/psullivan")).toBe(
      "github.com/psullivan",
    );
  });

  it("leaves an already-bare host alone", () => {
    expect(formatContactLink("grantwalker.design")).toBe("grantwalker.design");
  });

  it("falls back to the input rather than rendering an empty label", () => {
    expect(formatContactLink("https://")).toBe("https://");
  });

  it("keeps the brand legible, which is why no brand icon is needed", () => {
    expect(formatContactLink("https://www.linkedin.com/in/x")).toContain(
      "linkedin.com",
    );
  });
});
