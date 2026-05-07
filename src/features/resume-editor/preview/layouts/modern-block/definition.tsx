import type {
  PreviewDocumentBodyProps,
  PreviewDocumentCollectionSectionProps,
  PreviewDocumentLayoutDefinition,
  PreviewDocumentSummaryProps,
  PreviewRenderableSection,
  PreviewSectionItemRendererMap,
} from "@/features/resume-editor/preview/types";
import { createSidebarItemRenderers } from "@/features/resume-editor/preview/layouts/sidebar-headings/item-renderers";
import { modernBlockSummarySection } from "./summary";
import { modernBlockCollectionSection } from "./collection-section";

function renderSectionItems<K extends keyof PreviewSectionItemRendererMap>(
  section: PreviewRenderableSection<K>,
  itemRenderers: PreviewSectionItemRendererMap,
) {
  return section.items.map((item) => itemRenderers[section.key](item));
}

function modernBlockSummary({ context, content }: PreviewDocumentSummaryProps) {
  return modernBlockSummarySection(context, content);
}

function modernBlockCollection({
  context,
  section,
  itemRenderers,
}: PreviewDocumentCollectionSectionProps) {
  return modernBlockCollectionSection(
    context,
    section,
    renderSectionItems(section, itemRenderers),
    section.key,
  );
}

function modernBlockBody({
  context,
  summaryContent,
  sections,
  itemRenderers,
}: PreviewDocumentBodyProps) {
  return (
    <>
      {summaryContent
        ? modernBlockSummary({ context, content: summaryContent })
        : null}
      {sections.map((section) =>
        modernBlockCollection({ context, section, itemRenderers }),
      )}
    </>
  );
}

export const modernBlockLayout: PreviewDocumentLayoutDefinition = {
  id: "modern-block",
  Body: modernBlockBody,
  Summary: modernBlockSummary,
  CollectionSection: modernBlockCollection,
  createSectionItemRenderers: (context) => createSidebarItemRenderers(context),
};
