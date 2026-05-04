import { PreviewRichTextBlock } from "@/features/resume-editor/preview/kit";
import type { PreviewRenderContext } from "@/features/resume-editor/preview/types";

export function classicSummarySection(
  context: PreviewRenderContext,
  content: string,
) {
  const { presentation } = context;

  return (
    <section className="space-y-3">
      {presentation.layout.summaryLabelVisible ? (
        <h2
          className="border-b pb-1"
          style={{
            fontFamily: presentation.headingFontFamily,
            fontSize: `${presentation.sectionLabelFontSizePx}px`,
            fontWeight: presentation.sectionLabelWeight,
            letterSpacing: `${presentation.sectionLabelLetterSpacingEm}em`,
            textTransform: presentation.sectionLabelTransform,
            color: presentation.accentColor,
            borderColor: presentation.accentColor,
          }}
        >
          Summary
        </h2>
      ) : null}
      <PreviewRichTextBlock
        content={content}
        className="[&_p]:m-0"
        style={{ overflowWrap: "anywhere", textAlign: "justify" }}
      />
    </section>
  );
}