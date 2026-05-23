import { cn } from "@/lib/utils";

import { renderHtml } from "../engine";

export function PreviewRichTextBlock({
  content,
  className,
}: {
  content: string;
  className?: string;
}) {
  return (
    <div
      className={cn("rich-text", className)}
      dangerouslySetInnerHTML={renderHtml(content)}
    />
  );
}
