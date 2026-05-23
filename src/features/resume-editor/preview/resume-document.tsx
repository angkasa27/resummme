import { createPreviewRenderContext } from "@/features/resume-editor/preview/engine";
import { PreviewDocumentRoot } from "@/features/resume-editor/preview/kit/document-root";
import {
  getPreviewLayoutDefinition,
  renderLayoutHeader,
} from "@/features/resume-editor/preview/layout-registry";
import { renderSection } from "@/features/resume-editor/preview/sections";
import { SummaryView } from "@/features/resume-editor/preview/sections/summary";
import type {
  LayoutSlots,
  PreviewRendererProps,
} from "@/features/resume-editor/preview/types";

export function ResumeDocument({
  draft,
  className,
  mode = "preview",
}: PreviewRendererProps) {
  const context = createPreviewRenderContext(draft, mode);
  const layout = getPreviewLayoutDefinition(context.presentation.layoutId);

  const slots: LayoutSlots = {
    header: renderLayoutHeader(context),
    summary: context.summaryContent ? (
      <SummaryView content={context.summaryContent} />
    ) : null,
    sections: context.sections.map((section) => ({
      key: section.key,
      node: renderSection(section),
    })),
  };

  return (
    <PreviewDocumentRoot context={context} className={className}>
      <layout.Component context={context} slots={slots} />
    </PreviewDocumentRoot>
  );
}
