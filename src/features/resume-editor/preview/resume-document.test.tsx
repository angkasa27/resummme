import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ResumeDocument } from "@/features/resume-editor/preview/resume-document";
import { createDefaultResumeDraft } from "@/lib/resume/default-draft";

describe("resume document", () => {
  it("renders profile extra links as safe anchors", () => {
    const draft = createDefaultResumeDraft();

    render(<ResumeDocument draft={draft} />);

    const header = screen.getByTestId("resume-preview-full-name").closest("header");

    expect(header).not.toBeNull();

    const links = within(header as HTMLElement).getAllByRole("link");

    expect(links.length).toBeGreaterThan(0);
    expect(links[0]).toHaveAttribute("href", draft.profile.extraLinks[0].url);
    expect(links[0]).toHaveAttribute("target", "_blank");
    expect(links[0]).toHaveAttribute("rel", "noopener noreferrer");
  });
});
