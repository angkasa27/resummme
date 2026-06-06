import { cn } from "@/lib/utils";

import { renderHtml, richTextHasContent } from "../engine";

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
