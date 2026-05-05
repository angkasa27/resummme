import type { CSSProperties } from "react";

import {
  sanitizeRichTextHref,
  shouldOpenHrefInNewTab,
} from "@/features/resume-editor/domain/rich-text/sanitize-rich-text";

export function PreviewLinkedTitle({
  title,
  link,
  style,
}: {
  title: string;
  link?: string;
  style: CSSProperties;
}) {
  const safeHref = link ? sanitizeRichTextHref(link) : null;

  if (!safeHref) {
    return <span>{title}</span>;
  }

  return (
    <a
      href={safeHref}
      target={shouldOpenHrefInNewTab(safeHref) ? "_blank" : undefined}
      rel={shouldOpenHrefInNewTab(safeHref) ? "noopener noreferrer" : undefined}
      style={{
        ...style,
        textDecoration: "underline",
        overflowWrap: "anywhere",
      }}
    >
      {title}
    </a>
  );
}