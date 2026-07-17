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
  // Full-bleed: the root spans the whole paper with no padding in BOTH modes
  // (preview and pdf render identically). Layouts own their content insets via
  // the shared `page-inset` utilities / --resume-page-margin.
  const rootStyle: CSSProperties = {
    width: "var(--resume-paper-width)",
    padding: "0",
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
          ? "mx-0 max-w-none bg-white shadow-xl ring-1 ring-border print:min-h-0 print:max-w-none print:bg-white print:shadow-none print:ring-0"
          : "mx-0 max-w-none bg-white ring-0",
        className,
      )}
    >
      {children}
    </article>
  );
}
