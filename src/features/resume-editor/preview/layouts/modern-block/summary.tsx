import { PreviewRichTextBlock } from "@/features/resume-editor/preview/kit/rich-text-block";
import type { PreviewRenderContext } from "@/features/resume-editor/preview/types";

export function modernBlockSummarySection(
  context: PreviewRenderContext,
  content: string,
) {
  const { presentation } = context;

  return (
    <section className="flex flex-col gap-3">
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
        <span>Summary</span>
      </h2>
      <PreviewRichTextBlock
        content={content}
        className="[&_p]:m-0"
        style={{ overflowWrap: "anywhere", textAlign: "justify" }}
      />
    </section>
  );
}
