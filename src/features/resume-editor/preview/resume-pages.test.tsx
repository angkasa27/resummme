import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { createDefaultResumeDraft } from "@/lib/resume/default-draft";
import {
  buildResumeBlocks,
  ResumePages,
} from "@/features/resume-editor/preview/resume-pages";

describe("resume pages block builder", () => {
  it("splits long rich text items into multiple blocks", () => {
    const draft = createDefaultResumeDraft();
    draft.sections.workExperience.items = [
      {
        id: "work-1",
        companyName: "Example Co",
        position: "Frontend Developer",
        location: "Jakarta",
        startDate: "Jan 2024",
        endDate: "current",
        description:
          "<ul><li>First bullet</li><li>Second bullet</li><li>Third bullet</li></ul>",
      },
    ];

    const blocks = buildResumeBlocks(draft);
    const workBlocks = blocks.filter((block) => block.key.startsWith("workExperience-work-1"));

    expect(workBlocks.length).toBeGreaterThan(1);
  });

  it("keeps paginated rich text inside the resume-document styling scope", () => {
    const draft = createDefaultResumeDraft();
    draft.sections.workExperience.items = [
      {
        id: "work-1",
        companyName: "Example Co",
        position: "Frontend Developer",
        location: "Jakarta",
        startDate: "Jan 2024",
        endDate: "current",
        description:
          "<ul><li>First bullet</li><li>Second bullet</li></ul><ol><li>First step</li></ol>",
      },
    ];

    render(<ResumePages draft={draft} mode="screen" testId="resume-pages" />);

    const lists = screen.getAllByRole("list");

    expect(lists.length).toBeGreaterThan(0);
    expect(lists.every((list) => list.closest(".resume-document") !== null)).toBe(true);
  });

  it("renders each print page frame at exactly A4 height", () => {
    const draft = createDefaultResumeDraft();

    render(<ResumePages draft={draft} mode="print" testId="resume-pages" />);

    const pageFrame = document.querySelector(".resume-page-frame");

    expect(pageFrame).not.toBeNull();
    expect(pageFrame).toHaveStyle({ height: "297mm" });
  });
});
