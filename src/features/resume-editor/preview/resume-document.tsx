import { createPreviewRenderContext } from "@/features/resume-editor/preview/engine";
import { PreviewDocumentRoot } from "@/features/resume-editor/preview/kit";
import { getPreviewLayoutDefinition } from "@/features/resume-editor/preview/layout-registry";
import type {
  PreviewRendererProps,
  PreviewRenderableSection,
  PreviewSectionItemRendererMap,
} from "@/features/resume-editor/preview/types";
import { cn } from "@/lib/utils";

function renderSectionItems<K extends keyof PreviewSectionItemRendererMap>(
  section: PreviewRenderableSection<K>,
  itemRenderers: PreviewSectionItemRendererMap,
) {
  return section.items.map((item) => itemRenderers[section.key](item));
}

export function ResumeDocument({
  draft,
  className,
  mode = "preview",
}: PreviewRendererProps) {
  const context = createPreviewRenderContext(draft, mode);
  const layout = getPreviewLayoutDefinition(context.presentation.layoutId);
  const itemRenderers = layout.createSectionItemRenderers(context);

  return (
    <PreviewDocumentRoot context={context} className={cn(className)}>
      <layout.Header context={context} />
      {context.summaryContent ? (
        <layout.SummarySection
          context={context}
          content={context.summaryContent}
        />
      ) : null}
      {context.sections.map((section) => (
        <layout.CollectionSection
          key={section.key}
          context={context}
          section={section}
        >
          {renderSectionItems(section, itemRenderers)}
        </layout.CollectionSection>
      ))}
    </PreviewDocumentRoot>
  );
}
