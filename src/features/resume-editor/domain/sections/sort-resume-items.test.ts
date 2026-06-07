import { describe, expect, it } from "vitest";

import { sortResumeItems } from "@/features/resume-editor/domain/sections/sort-resume-items";

type TestItem = Record<string, unknown> & {
  startDate?: string;
  endDate?: string;
  name: string;
};

function item(name: string, startDate?: string, endDate?: string): TestItem {
  return { name, startDate, endDate };
}

describe("sortResumeItems", () => {
  it("sorts by end date descending", () => {
    const items = [
      item("A", "Jan 2020", "Jun 2022"),
      item("B", "Jan 2020", "Jun 2024"),
      item("C", "Jan 2020", "Jan 2023"),
    ];

    const sorted = sortResumeItems(items);

    expect(sorted.map((i) => i.name)).toEqual(["B", "C", "A"]);
  });

  it("places current items first", () => {
    const items = [
      item("Past", "Jan 2020", "Jun 2022"),
      item("Current", "Jan 2024", "current"),
    ];

    const sorted = sortResumeItems(items);

    expect(sorted.map((i) => i.name)).toEqual(["Current", "Past"]);
  });

  it("sorts current items by start date descending", () => {
    const items = [
      item("Older", "Jan 2023", "current"),
      item("Newer", "Jun 2024", "current"),
    ];

    const sorted = sortResumeItems(items);

    expect(sorted.map((i) => i.name)).toEqual(["Newer", "Older"]);
  });

  it("sorts by start date descending when end dates are equal", () => {
    const items = [
      item("A", "Jan 2023", "Jun 2024"),
      item("B", "Jan 2024", "Jun 2024"),
    ];

    const sorted = sortResumeItems(items);

    expect(sorted.map((i) => i.name)).toEqual(["B", "A"]);
  });

  it("handles items with no dates at the end", () => {
    const items = [
      item("A", "Jan 2020", "Jun 2022"),
      item("B"),
    ];

    const sorted = sortResumeItems(items);

    expect(sorted.map((i) => i.name)).toEqual(["A", "B"]);
  });

  it("supports custom field names", () => {
    const items = [
      { name: "A", from: "Jan 2021", until: "Jun 2022" },
      { name: "B", from: "Jan 2021", until: "Jun 2024" },
    ];

    const sorted = sortResumeItems(items, "from", "until");

    expect(sorted.map((i) => i.name)).toEqual(["B", "A"]);
  });

  it("does not mutate the original array", () => {
    const items = [
      item("A", "Jan 2020", "Jun 2022"),
      item("B", "Jan 2020", "Jun 2024"),
    ];

    sortResumeItems(items);

    expect(items[0].name).toBe("A");
  });
});
