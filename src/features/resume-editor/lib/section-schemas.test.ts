import { describe, expect, it } from "vitest";

import {
  collectionSectionFormSchemaMap,
  summaryFormSchema,
} from "@/features/resume-editor/lib/section-schemas";

describe("editor section schemas", () => {
  it("allows blank summary content while editing", () => {
    expect(() => summaryFormSchema.parse({ content: "" })).not.toThrow();
  });

  it("allows blank project fields while editing", () => {
    expect(() =>
      (
        collectionSectionFormSchemaMap.projects as {
          parse: (value: unknown) => unknown;
        }
      ).parse({
        items: [
          {
            id: "project-1",
            projectName: "",
            projectLink: "",
            startDate: "",
            endDate: "",
            description: "",
          },
        ],
      }),
    ).not.toThrow();
  });

  it("still rejects malformed project links while editing", () => {
    expect(() =>
      (
        collectionSectionFormSchemaMap.projects as {
          parse: (value: unknown) => unknown;
        }
      ).parse({
        items: [
          {
            id: "project-1",
            projectName: "",
            projectLink: "not-a-url",
            startDate: "",
            endDate: "",
            description: "",
          },
        ],
      }),
    ).toThrow(/project link/i);
  });
});
