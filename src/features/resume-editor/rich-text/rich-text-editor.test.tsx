import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { RichTextEditor } from "@/features/resume-editor/rich-text/rich-text-editor";

describe("rich text editor", () => {
  it("exposes only the approved formatting controls", () => {
    render(<RichTextEditor value="<p>Hello</p>" onChange={vi.fn()} />);

    expect(screen.getByRole("button", { name: "Bold" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Italic" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Underline" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Bullet list" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Ordered list" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Link" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Unlink" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /heading/i })).not.toBeInTheDocument();
  });
});
