import type { CSSProperties, ReactNode } from "react";

import { cn } from "@/lib/utils";

import styles from "../resume-document.module.css";
import type { PreviewRenderContext } from "../types";

export function PreviewDocumentRoot({
  context,
  className,
  children,
  editorMode,
}: {
  context: PreviewRenderContext;
  className?: string;
  children: ReactNode;
  editorMode?: "canvas" | "editor";
}) {
  const { presentation, mode } = context;
  const rootStyle = presentation.vars as CSSProperties;

  return (
    <article
      data-layout={presentation.layoutId}
      style={rootStyle}
      className={cn(
        styles.root,
        "resume-document",
        mode === "preview"
          ? "mx-0 w-[210mm] max-w-none bg-white px-9 py-10 ring-1 ring-border print:min-h-0 print:max-w-none print:bg-white print:ring-0"
          : "mx-0 w-[186mm] max-w-none bg-white px-0 py-0 ring-0",
        editorMode === "canvas" && "px-9 py-10",
        className,
      )}
    >
      {children}
    </article>
  );
}
