import {
  sanitizeRichTextHtml,
} from "@/features/resume-editor/domain/rich-text/sanitize-rich-text";

export function renderHtml(content: string) {
  return { __html: sanitizeRichTextHtml(content) };
}

export function richTextHasContent(value: string) {
  if (!value) return false;
  return (
    value
      .replace(/<[^>]*>/g, " ")
      .replace(/&nbsp;/g, " ")
      .replace(/\s+/g, " ")
      .trim().length > 0
  );
}
