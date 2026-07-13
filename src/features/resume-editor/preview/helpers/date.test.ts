import { describe, expect, it } from "vitest";

import {
  renderCurrentDateLabel,
  renderDateRange,
} from "@/features/resume-editor/preview/helpers/date";

describe("renderCurrentDateLabel", () => {
  it('returns "Current" for the "current" sentinel', () => {
    expect(renderCurrentDateLabel("current")).toBe("Current");
  });

  it("returns the value as-is for other strings", () => {
    expect(renderCurrentDateLabel("Jan 2024")).toBe("Jan 2024");
    expect(renderCurrentDateLabel("")).toBe("");
  });
});

describe("renderDateRange", () => {
  it("renders start - end", () => {
    expect(renderDateRange("Jan 2020", "Jun 2024")).toBe("Jan 2020 - Jun 2024");
  });

  it('replaces "current" with "Current"', () => {
    expect(renderDateRange("Jan 2024", "current")).toBe("Jan 2024 - Current");
  });

  it("returns only start (no dangling separator) when end is empty", () => {
    expect(renderDateRange("Jan 2024")).toBe("Jan 2024");
  });

  it("returns only end (no leading separator) when start is empty", () => {
    expect(renderDateRange(undefined, "Jun 2024")).toBe("Jun 2024");
  });

  it("returns fallback when neither date is present", () => {
    expect(renderDateRange()).toBe("");
    expect(renderDateRange(undefined, undefined, "N/A")).toBe("N/A");
  });
});
