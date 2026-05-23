import { PreviewRichTextBlock } from "@/features/resume-editor/preview/kit/rich-text-block";

export function SummaryView({ content }: { content: string }) {
  return (
    <section className="section" data-section="summary">
      <h2 className="section-heading" data-testid="resume-preview-section-heading">
        Summary
      </h2>
      <PreviewRichTextBlock content={content} />
    </section>
  );
}
