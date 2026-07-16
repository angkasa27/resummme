import type { CSSProperties, ReactNode } from "react";

import { cn } from "@/lib/utils";

import styles from "../resume-document.module.css";
import type { PreviewRenderContext } from "../types";

export function PreviewDocumentRoot({
  context,
  className,
  children,
}: {
  context: PreviewRenderContext;
  className?: string;
  children: ReactNode;
  style?: CSSProperties;
}) {
  const { presentation, mode } = context;
  const rootStyle: CSSProperties =
    mode === "pdf"
      ? {
          width: "var(--resume-print-content-width)",
          padding: "0",
        }
      : {
          width: "var(--resume-paper-width)",
          padding: "var(--resume-page-margin)",
        };

  return (
    <article
      data-layout={presentation.layoutId}
      style={{
        ...(presentation.vars as CSSProperties),
        ...rootStyle,
      }}
      className={cn(
        styles.root,
        "resume-document",
        mode === "preview"
          ? "mx-0 max-w-none bg-white ring-1 ring-border print:min-h-0 print:max-w-none print:bg-white print:ring-0"
          : "mx-0 max-w-none bg-white ring-0",
        className,
      )}
    >
      {children}
    </article>
  );
}
