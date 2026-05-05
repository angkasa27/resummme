import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { MonthYearPicker } from "@/features/resume-editor/editor/sections/month-year-picker";

describe("month year picker", () => {
  it("disables end-date months that are the same as or before the start date", async () => {
    const user = userEvent.setup();

    render(
      <MonthYearPicker
        id="end-date"
        value="Feb 2024"
        minValueExclusive="Jan 2024"
        onChange={vi.fn()}
      />
    );

    await user.click(screen.getByRole("button", { name: /feb 2024/i }));

    expect(screen.getByRole("button", { name: "Jan" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Feb" })).not.toBeDisabled();
  });

  it("disables the previous-year button when that year contains no valid end months", async () => {
    const user = userEvent.setup();

    render(
      <MonthYearPicker
        id="end-date"
        value="Feb 2024"
        minValueExclusive="Jan 2024"
        onChange={vi.fn()}
      />
    );

    await user.click(screen.getByRole("button", { name: /feb 2024/i }));

    expect(screen.getByRole("button", { name: /show 2023/i })).toBeDisabled();
  });
});
