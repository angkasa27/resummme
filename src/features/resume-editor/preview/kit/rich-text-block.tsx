import { cn } from "@/lib/utils";

import { renderHtml, richTextHasContent } from "../rich-text-utils";

export function PreviewRichTextBlock({
  content,
  className,
}: {
  content: string;
  className?: string;
}) {
  if (!richTextHasContent(content)) return null;

  return (
    <div
      className={cn("rich-text", className)}
      dangerouslySetInnerHTML={renderHtml(content)}
    />
  );
}
