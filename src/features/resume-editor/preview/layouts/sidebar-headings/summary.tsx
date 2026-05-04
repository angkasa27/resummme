import { PreviewRichTextBlock } from "@/features/resume-editor/preview/kit";
import type { PreviewRenderContext } from "@/features/resume-editor/preview/types";

export function sidebarSummarySection(
  context: PreviewRenderContext,
  content: string,
) {
  const { presentation } = context;

  return (
    <section className="grid gap-3 sm:grid-cols-[110px_1fr]">
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
        Summary
      </h2>
      <PreviewRichTextBlock
        content={content}
        className="[&_p]:m-0"
        style={{ overflowWrap: "anywhere", textAlign: "justify" }}
      />
    </section>
  );
}