import { createPreviewRenderContext } from "@/features/resume-editor/preview/engine";
import { PreviewDocumentRoot } from "@/features/resume-editor/preview/kit/document-root";
import {
  getTemplate,
  renderTemplateHeader,
} from "@/features/resume-editor/preview/template-registry";
import { TemplateSection } from "@/features/resume-editor/preview/template-section";
import { SummaryView } from "@/features/resume-editor/preview/sections/summary";
import type {
  PreviewRendererProps,
} from "@/features/resume-editor/preview/types";
import type { TemplateSlots } from "@/features/resume-editor/preview/template-types";

export function ResumeDocument({
  draft,
  className,
  mode = "preview",
}: PreviewRendererProps) {
  const context = createPreviewRenderContext(draft, mode);
  const template = getTemplate(context.presentation.templateId);

  const slots: TemplateSlots = {
    header: renderTemplateHeader(context),
    summary: context.summaryContent ? (
      <SummaryView content={context.summaryContent} />
    ) : null,
    sections: context.sections.map((section) => ({
      key: section.key,
      node: <TemplateSection template={template} section={section} />,
    })),
  };

  return (
    <PreviewDocumentRoot context={context} className={className}>
      <template.Component context={context} slots={slots} />
    </PreviewDocumentRoot>
  );
}
