import { render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { SectionNavigator } from "@/features/resume-editor/section-navigator";
import { createDefaultResumeDraft } from "@/lib/resume/default-draft";

describe("section navigator", () => {
  it("shows current section controls without legacy move buttons", () => {
    const draft = createDefaultResumeDraft();

    render(
      <SectionNavigator
        draft={draft}
        activeSection="summary"
        onRequestSectionChange={vi.fn()}
        onMoveSection={vi.fn()}
        onReorderSection={vi.fn()}
        onSetSectionVisibility={vi.fn()}
      />
    );

    expect(
      screen.queryByRole("button", { name: /open summary actions/i })
    ).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: /drag summary/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /edit summary/i })).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /move summary down/i })
    ).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: /hide summary/i })).toBeInTheDocument();
  });

  it("shows included and available sections with explicit show controls", () => {
    const draft = createDefaultResumeDraft();

    render(
      <SectionNavigator
        draft={draft}
        activeSection="profile"
        onRequestSectionChange={vi.fn()}
        onMoveSection={vi.fn()}
        onReorderSection={vi.fn()}
        onSetSectionVisibility={vi.fn()}
      />
    );

    expect(screen.queryByText(/build order/i)).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /add optional section/i })
    ).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /included/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /available/i })).toBeInTheDocument();

    const availableSections = screen
      .getByRole("heading", { name: /available/i })
      .closest("section");

    expect(availableSections).not.toBeNull();
    expect(
      within(availableSections as HTMLElement).getByText("Publications")
    ).toBeInTheDocument();
    expect(
      within(availableSections as HTMLElement).getByRole("button", {
        name: /show publications/i,
      })
    ).toBeInTheDocument();
  });
});
