import type { ReactNode } from "react";

import type {
  PreviewRenderContext,
  PreviewRenderableSection,
} from "@/features/resume-editor/preview/types";

export function sidebarCollectionSection(
  context: PreviewRenderContext,
  section: PreviewRenderableSection,
  children: ReactNode,
  key: string,
) {
  const { presentation } = context;

  return (
    <section className="grid gap-3 sm:grid-cols-[110px_1fr]" key={key}>
      <h2
        className="text-muted-foreground"
        data-testid="resume-preview-section-heading"
        style={{
          fontFamily: presentation.headingFontFamily,
          fontSize: `${presentation.sectionLabelFontSizePx}px`,
          fontWeight: presentation.sectionLabelWeight,
          letterSpacing: `${presentation.sectionLabelLetterSpacingEm}em`,
          textTransform: presentation.sectionLabelTransform,
          color: presentation.accentColor,
        }}
      >
        {section.heading}
      </h2>
      <div
        data-section-items={section.key}
        className="flex flex-col"
        style={{ gap: `${presentation.itemGapPx}px` }}
      >
        {children}
      </div>
    </section>
  );
}
