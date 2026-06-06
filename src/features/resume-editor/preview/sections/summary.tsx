import { PreviewRichTextBlock } from "@/features/resume-editor/preview/kit/rich-text-block";

export function SummaryView({
  content,
  showHeading = true,
}: {
  content: string;
  showHeading?: boolean;
}) {
  return (
    <section className="section" data-section="summary">
      {showHeading ? (
        <h2 className="section-heading" data-testid="resume-preview-section-heading">
          Summary
        </h2>
      ) : null}
      <PreviewRichTextBlock content={content} />
    </section>
  );
}
