import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { RichTextEditor } from "@/features/resume-editor/rich-text/rich-text-editor";

function selectEditorText() {
  const editor = screen.getByLabelText("Rich text editor");
  const paragraph = editor.querySelector("p");
  const textNode = paragraph?.firstChild;

  if (!textNode) {
    throw new Error("Expected editor text node");
  }

  const selection = window.getSelection();
  const range = document.createRange();
  range.selectNodeContents(textNode);
  selection?.removeAllRanges();
  selection?.addRange(range);
  fireEvent.focus(editor);
}

describe("rich text editor", () => {
  it("exposes only the approved formatting controls", () => {
    render(<RichTextEditor value="<p>Hello</p>" onChange={vi.fn()} />);

    expect(screen.getByRole("button", { name: "Bold" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Italic" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Underline" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Bullet list" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Ordered list" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Edit link" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Remove link" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /heading/i })).not.toBeInTheDocument();
  });

  it("opens an inline link editor instead of using a browser prompt", async () => {
    const user = userEvent.setup();

    render(<RichTextEditor value="<p>Hello</p>" onChange={vi.fn()} />);
    selectEditorText();

    await user.click(screen.getByRole("button", { name: "Edit link" }));

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByLabelText(/link url/i)).toBeInTheDocument();
  });

  it("applies a valid link from the inline editor", async () => {
    const user = userEvent.setup();

    render(<RichTextEditor value="<p>Hello</p>" onChange={vi.fn()} />);
    selectEditorText();

    await user.click(screen.getByRole("button", { name: "Edit link" }));
    await user.clear(screen.getByLabelText(/link url/i));
    await user.type(screen.getByLabelText(/link url/i), "https://example.com");
    await user.click(screen.getByRole("button", { name: /apply link/i }));

    await waitFor(() => {
      expect(
        screen
          .getByLabelText("Rich text editor")
          .querySelector('a[href="https://example.com"]')
      ).toBeInTheDocument();
    });
  });

  it("rejects an invalid link in the inline editor", async () => {
    const user = userEvent.setup();
    const handleContentChange = vi.fn();

    render(
      <RichTextEditor
        value="<p>Hello</p>"
        onChange={handleContentChange}
      />
    );
    selectEditorText();

    await user.click(screen.getByRole("button", { name: "Edit link" }));
    await user.clear(screen.getByLabelText(/link url/i));
    await user.type(screen.getByLabelText(/link url/i), "javascript:alert(1)");
    await user.click(screen.getByRole("button", { name: /apply link/i }));

    expect(screen.getByText(/enter a valid link/i)).toBeInTheDocument();
    expect(handleContentChange).not.toHaveBeenCalledWith(
      expect.stringContaining("javascript:alert(1)")
    );
  });

  it("removes an existing link without leaving the editor", async () => {
    const user = userEvent.setup();

    render(
      <RichTextEditor
        value='<p><a href="https://example.com">Hello</a></p>'
        onChange={vi.fn()}
      />
    );
    selectEditorText();

    await user.click(screen.getByRole("button", { name: "Remove link" }));

    await waitFor(() => {
      expect(
        screen.getByLabelText("Rich text editor").querySelector("a")
      ).not.toBeInTheDocument();
    });
  });
});
