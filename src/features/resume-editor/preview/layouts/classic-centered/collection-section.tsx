import { type ReactNode } from "react";

import type {
  PreviewRenderContext,
  PreviewRenderableSection,
} from "@/features/resume-editor/preview/types";

export function classicCollectionSection(
  context: PreviewRenderContext,
  section: PreviewRenderableSection,
  children: ReactNode,
  key: string,
) {
  const { presentation } = context;

  return (
    <section key={key}>
      <div
        className="border-b"
        style={{
          borderColor: presentation.accentColor,
          marginBottom: `${presentation.itemGapPx}px`,
        }}
      >
        <h2
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
      </div>
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
