import { createPreviewRenderContext } from "@/features/resume-editor/preview/engine";
import { PreviewDocumentRoot } from "@/features/resume-editor/preview/kit/document-root";
import {
  getLayout,
  renderLayoutHeader,
  shouldHideSummaryHeading,
} from "@/features/resume-editor/preview/layout-registry";
import { LayoutSection } from "@/features/resume-editor/preview/layout-section";
import { SummaryView } from "@/features/resume-editor/preview/sections/summary";
import type {
  PreviewRendererProps,
} from "@/features/resume-editor/preview/types";
import type { LayoutSlots } from "@/features/resume-editor/preview/layout-types";

export function ResumeDocument({
  draft,
  className,
  mode = "preview",
}: PreviewRendererProps) {
  const context = createPreviewRenderContext(draft, mode);
  const layout = getLayout(context.presentation.layoutId);

  const hideSummaryHeading = shouldHideSummaryHeading(
    context.presentation.layoutId,
  );

  const slots: LayoutSlots = {
    header: renderLayoutHeader(context),
    summary: context.summaryContent ? (
      <SummaryView
        content={context.summaryContent}
        showHeading={!hideSummaryHeading}
      />
    ) : null,
    // `section.key` and `section` co-vary at runtime, but TS can't prove that
    // across the union element, so assert the entry type once here (the single
    // central place slots are built) rather than casting in every layout.
    sections: context.sections.map(
      (section) =>
        ({
          key: section.key,
          section,
          node: <LayoutSection layout={layout} section={section} />,
        }) as LayoutSlots["sections"][number],
    ),
  };

  return (
    <PreviewDocumentRoot context={context} className={className}>
      <layout.Component context={context} slots={slots} />
    </PreviewDocumentRoot>
  );
}
