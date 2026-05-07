import type { ReactNode } from "react";

import type {
  PreviewRenderContext,
  PreviewRenderableSection,
} from "@/features/resume-editor/preview/types";

export function modernBlockCollectionSection(
  context: PreviewRenderContext,
  section: PreviewRenderableSection,
  children: ReactNode,
  key: string,
) {
  const { presentation } = context;

  return (
    <section className="flex flex-col gap-3" key={key}>
      <h2
        data-testid="resume-preview-section-heading"
        className="flex items-center gap-2"
        style={{
          fontFamily: presentation.headingFontFamily,
          fontSize: `${presentation.sectionLabelFontSizePx}px`,
          fontWeight: presentation.sectionLabelWeight,
          letterSpacing: `${presentation.sectionLabelLetterSpacingEm}em`,
          textTransform: presentation.sectionLabelTransform,
          color: presentation.accentColor,
        }}
      >
        <span
          aria-hidden="true"
          style={{
            display: "inline-block",
            width: "10px",
            height: "10px",
            backgroundColor: presentation.accentColor,
            borderRadius: "1px",
          }}
        />
        <span>{section.heading}</span>
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
