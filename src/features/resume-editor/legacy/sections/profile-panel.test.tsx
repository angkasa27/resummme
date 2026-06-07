import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { createDefaultResumeDraft } from "@/features/resume-editor/domain/draft/create-default-resume-draft";
import { ProfilePanel } from "@/features/resume-editor/legacy/sections/profile-panel";

describe("profile panel", () => {
  it("updates mounted inputs when the draft prop changes", () => {
    const initialDraft = createDefaultResumeDraft();
    const nextDraft = createDefaultResumeDraft();
    nextDraft.profile.fullName = "Stored Draft Name";

    const { rerender } = render(
      <ProfilePanel draft={initialDraft} onSave={vi.fn()} />,
    );

    expect(screen.getByLabelText(/full name/i)).toHaveValue(
      initialDraft.profile.fullName,
    );

    rerender(<ProfilePanel draft={nextDraft} onSave={vi.fn()} />);

    expect(screen.getByLabelText(/full name/i)).toHaveValue(
      "Stored Draft Name",
    );
  });

  it("autosaves profile changes after the debounce window", async () => {
    const user = userEvent.setup();
    const draft = createDefaultResumeDraft();
    const handleSave = vi.fn();

    render(<ProfilePanel draft={draft} onSave={handleSave} />);

    const fullNameInput = screen.getByLabelText(/full name/i);
    await user.clear(fullNameInput);
    await user.click(fullNameInput);
    await user.paste("Edited Profile Name");

    await waitFor(
      () =>
        expect(handleSave).toHaveBeenLastCalledWith(
          expect.objectContaining({
            fullName: "Edited Profile Name",
          }),
        ),
      { timeout: 1500 },
    );
  });

  it("does not show required errors for blank profile fields", async () => {
    const user = userEvent.setup();
    const draft = createDefaultResumeDraft();

    render(<ProfilePanel draft={draft} onSave={vi.fn()} />);

    const fullNameInput = screen.getByLabelText(/full name/i);
    await user.clear(fullNameInput);
    await user.tab();

    expect(
      screen.queryByText(/full name is required/i),
    ).not.toBeInTheDocument();
  });

  it("still shows format errors for malformed email addresses", async () => {
    const user = userEvent.setup();
    const draft = createDefaultResumeDraft();

    render(<ProfilePanel draft={draft} onSave={vi.fn()} />);

    const emailInput = screen.getByLabelText(/email address/i);
    await user.clear(emailInput);
    await user.type(emailInput, "not-an-email");
    await user.tab();

    expect(
      screen.getByText(/email address must be a valid email address/i),
    ).toBeInTheDocument();
  });
});
