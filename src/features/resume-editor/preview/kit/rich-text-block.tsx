import type { CSSProperties } from "react";

import { renderHtml } from "../engine";

export function PreviewRichTextBlock({
  content,
  className,
  style,
  testId,
}: {
  content: string;
  className?: string;
  style?: CSSProperties;
  testId?: string;
}) {
  return (
    <div
      data-classic-description={testId}
      className={className}
      style={style}
      dangerouslySetInnerHTML={renderHtml(content)}
    />
  );
}