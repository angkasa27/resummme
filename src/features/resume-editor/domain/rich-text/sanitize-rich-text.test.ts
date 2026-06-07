import { describe, expect, it } from "vitest";

import {
  sanitizeRichTextHref,
  sanitizeRichTextHtml,
  shouldOpenHrefInNewTab,
} from "@/features/resume-editor/domain/rich-text/sanitize-rich-text";

describe("sanitizeRichTextHref", () => {
  it("allows https URLs", () => {
    expect(sanitizeRichTextHref("https://example.com")).toBe(
      "https://example.com",
    );
  });

  it("allows http URLs", () => {
    expect(sanitizeRichTextHref("http://example.com")).toBe(
      "http://example.com",
    );
  });

  it("allows mailto: links", () => {
    expect(sanitizeRichTextHref("mailto:test@example.com")).toBe(
      "mailto:test@example.com",
    );
  });

  it("allows tel: links", () => {
    expect(sanitizeRichTextHref("tel:+628123456789")).toBe(
      "tel:+628123456789",
    );
  });

  it("allows relative URLs", () => {
    expect(sanitizeRichTextHref("/page")).toBe("/page");
    expect(sanitizeRichTextHref("#section")).toBe("#section");
  });

  it("blocks javascript: URLs", () => {
    expect(sanitizeRichTextHref("javascript:alert(1)")).toBeNull();
  });

  it("blocks ftp: URLs", () => {
    expect(sanitizeRichTextHref("ftp://files.example.com")).toBeNull();
  });

  it("blocks data: URLs", () => {
    expect(sanitizeRichTextHref("data:text/html,<script>alert(1)</script>")).toBeNull();
  });

  it("returns null for null/undefined", () => {
    expect(sanitizeRichTextHref(null)).toBeNull();
    expect(sanitizeRichTextHref(undefined)).toBeNull();
  });
});

describe("shouldOpenHrefInNewTab", () => {
  it("returns true for http/https URLs", () => {
    expect(shouldOpenHrefInNewTab("https://example.com")).toBe(true);
    expect(shouldOpenHrefInNewTab("http://example.com")).toBe(true);
  });

  it("returns false for other protocols", () => {
    expect(shouldOpenHrefInNewTab("mailto:test@test.com")).toBe(false);
    expect(shouldOpenHrefInNewTab("tel:+123")).toBe(false);
    expect(shouldOpenHrefInNewTab("/relative")).toBe(false);
  });
});

describe("sanitizeRichTextHtml", () => {
  it("removes script tags and their content", () => {
    expect(
      sanitizeRichTextHtml("<p>Hello</p><script>alert(1)</script><p>World</p>"),
    ).toBe("<p>Hello</p><p>World</p>");
  });

  it("removes style tags and their content", () => {
    expect(
      sanitizeRichTextHtml("<p>Text</p><style>body{color:red}</style>"),
    ).toBe("<p>Text</p>");
  });

  it("removes iframe, object, embed, template, svg, math tags", () => {
    expect(
      sanitizeRichTextHtml(
        "<p>A</p><iframe src='x'></iframe><p>B</p><embed src='y'>",
      ),
    ).toBe("<p>A</p><p>B</p>");
  });

  it("removes HTML comments", () => {
    expect(
      sanitizeRichTextHtml("<p>Hello</p><!-- comment --><p>World</p>"),
    ).toBe("<p>Hello</p><p>World</p>");
  });

  it("strips unknown tags but keeps content", () => {
    expect(
      sanitizeRichTextHtml("<p>Hello</p><custom>nope</custom><p>World</p>"),
    ).toBe("<p>Hello</p>nope<p>World</p>");
  });

  it("sanitizes href on anchor tags", () => {
    const result = sanitizeRichTextHtml(
      '<a href="javascript:alert(1)">Click</a>',
    );
    expect(result).not.toContain("href");
    expect(result).toBe("<a>Click</a>");
  });

  it("preserves target=_blank with rel attribute", () => {
    const result = sanitizeRichTextHtml(
      '<a href="https://example.com" target="_blank">Link</a>',
    );
    expect(result).toContain('href="https://example.com"');
    expect(result).toContain('target="_blank"');
    expect(result).toContain('rel="noopener noreferrer"');
  });

  it("allows only p, ul, ol, li, strong, em, u, a, br tags", () => {
    const result = sanitizeRichTextHtml(
      "<p><strong>Bold</strong><em>Italic</em><u>Underline</u></p>",
    );
    expect(result).toBe(
      "<p><strong>Bold</strong><em>Italic</em><u>Underline</u></p>",
    );
  });

  it("normalizes br tags", () => {
    expect(sanitizeRichTextHtml("<br>")).toBe("<br>");
    expect(sanitizeRichTextHtml("<br/>")).toBe("<br>");
  });

  it("removes empty <p> tags", () => {
    expect(sanitizeRichTextHtml("<p></p><p>A</p><p><br></p>")).toBe("<p>A</p>");
  });
});
