import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

import type { PreviewRenderContext } from "../types";

export function PreviewDocumentRoot({
  context,
  className,
  children,
}: {
  context: PreviewRenderContext;
  className?: string;
  children: ReactNode;
}) {
  const { presentation, mode } = context;

  return (
    <article
      style={{
        fontFamily: presentation.bodyFontFamily,
        fontSize: `${presentation.bodyFontSizePx}px`,
        lineHeight: String(presentation.bodyLineHeight),
        color: presentation.bodyTextColor,
        gap: `${presentation.articleGapPx}px`,
      }}
      className={cn(
        mode === "preview"
          ? "resume-document mx-0 flex min-h-[297mm] w-[210mm] max-w-none flex-col bg-white px-9 py-10 ring-1 ring-border print:min-h-0 print:max-w-none print:bg-white print:ring-0"
          : "resume-document mx-0 flex min-h-0 w-[186mm] max-w-none flex-col bg-white px-0 py-0 ring-0",
        className,
      )}
    >
      {children}
    </article>
  );
}
