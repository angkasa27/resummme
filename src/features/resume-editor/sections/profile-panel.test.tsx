import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { createDefaultResumeDraft } from "@/lib/resume/default-draft";
import { ProfilePanel } from "@/features/resume-editor/sections/profile-panel";

describe("profile panel", () => {
  it("updates mounted inputs when the draft prop changes", () => {
    const initialDraft = createDefaultResumeDraft();
    const nextDraft = createDefaultResumeDraft();
    nextDraft.profile.fullName = "Stored Draft Name";

    const { rerender } = render(
      <ProfilePanel
        draft={initialDraft}
        onBack={vi.fn()}
        onSave={vi.fn()}
      />
    );

    expect(screen.getByLabelText(/full name/i)).toHaveValue(
      initialDraft.profile.fullName
    );

    rerender(
      <ProfilePanel
        draft={nextDraft}
        onBack={vi.fn()}
        onSave={vi.fn()}
      />
    );

    expect(screen.getByLabelText(/full name/i)).toHaveValue("Stored Draft Name");
  });

  it("autosaves profile changes after the debounce window", async () => {
    const user = userEvent.setup();
    const draft = createDefaultResumeDraft();
    const handleSave = vi.fn();

    render(
      <ProfilePanel
        draft={draft}
        onBack={vi.fn()}
        onSave={handleSave}
      />
    );

    const fullNameInput = screen.getByLabelText(/full name/i);
    await user.clear(fullNameInput);
    await user.type(fullNameInput, "Edited Profile Name");

    await waitFor(
      () =>
        expect(handleSave).toHaveBeenLastCalledWith(
        expect.objectContaining({
          fullName: "Edited Profile Name",
        })
      ),
      { timeout: 1500 }
    );
  });

  it("renders rich text summary as user-facing content instead of raw HTML", () => {
    const draft = createDefaultResumeDraft();
    draft.profile.summary =
      "<p>Software engineer with experience building frontend-heavy web applications and internal tools for product teams.</p>";

    render(
      <ProfilePanel
        draft={draft}
        onBack={vi.fn()}
        onSave={vi.fn()}
      />
    );

    expect(screen.queryByDisplayValue(/<p>Software engineer/)).not.toBeInTheDocument();
    expect(
      screen.getByText((content) =>
        content.includes(
          "Software engineer with experience building frontend-heavy web applications and internal tools for product teams.",
        ),
      )
    ).toBeInTheDocument();
  });

  it("does not show required errors for blank profile fields", async () => {
    const user = userEvent.setup();
    const draft = createDefaultResumeDraft();

    render(
      <ProfilePanel
        draft={draft}
        onBack={vi.fn()}
        onSave={vi.fn()}
      />
    );

    const fullNameInput = screen.getByLabelText(/full name/i);
    await user.clear(fullNameInput);
    await user.tab();

    expect(screen.queryByText(/full name is required/i)).not.toBeInTheDocument();
  });

  it("still shows format errors for malformed email addresses", async () => {
    const user = userEvent.setup();
    const draft = createDefaultResumeDraft();

    render(
      <ProfilePanel
        draft={draft}
        onBack={vi.fn()}
        onSave={vi.fn()}
      />
    );

    const emailInput = screen.getByLabelText(/email address/i);
    await user.clear(emailInput);
    await user.type(emailInput, "not-an-email");
    await user.tab();

    expect(
      screen.getByText(/email address must be a valid email address/i)
    ).toBeInTheDocument();
  });
});
