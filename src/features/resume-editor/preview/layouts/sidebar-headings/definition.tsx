import type {
  PreviewDocumentBodyProps,
  PreviewDocumentCollectionSectionProps,
  PreviewDocumentLayoutDefinition,
  PreviewDocumentSummaryProps,
  PreviewRenderableSection,
  PreviewSectionItemRendererMap,
} from "@/features/resume-editor/preview/types";
import { sidebarSummarySection } from "./summary";
import { sidebarCollectionSection } from "./collection-section";
import { createSidebarItemRenderers } from "./item-renderers";

function renderSectionItems<K extends keyof PreviewSectionItemRendererMap>(
  section: PreviewRenderableSection<K>,
  itemRenderers: PreviewSectionItemRendererMap,
) {
  return section.items.map((item) => itemRenderers[section.key](item));
}

function sidebarSummary({ context, content }: PreviewDocumentSummaryProps) {
  return sidebarSummarySection(context, content);
}

function sidebarCollection({
  context,
  section,
  itemRenderers,
}: PreviewDocumentCollectionSectionProps) {
  return sidebarCollectionSection(
    context,
    section,
    renderSectionItems(section, itemRenderers),
    section.key,
  );
}

function sidebarBody({
  context,
  summaryContent,
  sections,
  itemRenderers,
}: PreviewDocumentBodyProps) {
  return (
    <>
      {summaryContent
        ? sidebarSummary({ context, content: summaryContent })
        : null}
      {sections.map((section) =>
        sidebarCollection({ context, section, itemRenderers }),
      )}
    </>
  );
}

export const sidebarHeadingsLayout: PreviewDocumentLayoutDefinition = {
  id: "sidebar-headings",
  Body: sidebarBody,
  Summary: sidebarSummary,
  CollectionSection: sidebarCollection,
  createSectionItemRenderers: (context) => createSidebarItemRenderers(context),
};
