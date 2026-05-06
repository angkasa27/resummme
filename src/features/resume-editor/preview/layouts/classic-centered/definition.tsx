import type {
  PreviewDocumentBodyProps,
  PreviewDocumentCollectionSectionProps,
  PreviewDocumentLayoutDefinition,
  PreviewDocumentSummaryProps,
  PreviewRenderableSection,
  PreviewSectionItemRendererMap,
} from "@/features/resume-editor/preview/types";
import { classicSummarySection } from "./summary";
import { classicCollectionSection } from "./collection-section";
import { createClassicItemRenderers } from "./item-renderers";

function renderSectionItems<K extends keyof PreviewSectionItemRendererMap>(
  section: PreviewRenderableSection<K>,
  itemRenderers: PreviewSectionItemRendererMap,
) {
  return section.items.map((item) => itemRenderers[section.key](item));
}

function classicSummary({ context, content }: PreviewDocumentSummaryProps) {
  return classicSummarySection(context, content);
}

function classicCollection({
  context,
  section,
  itemRenderers,
}: PreviewDocumentCollectionSectionProps) {
  return classicCollectionSection(
    context,
    section,
    renderSectionItems(section, itemRenderers),
    section.key,
  );
}

function classicCenteredBody({
  context,
  summaryContent,
  sections,
  itemRenderers,
}: PreviewDocumentBodyProps) {
  return (
    <>
      {summaryContent
        ? classicSummary({ context, content: summaryContent })
        : null}
      {sections.map((section) =>
        classicCollection({ context, section, itemRenderers }),
      )}
    </>
  );
}

export const classicCenteredLayout: PreviewDocumentLayoutDefinition = {
  id: "classic-centered",
  Body: classicCenteredBody,
  Summary: classicSummary,
  CollectionSection: classicCollection,
  createSectionItemRenderers: (context) => createClassicItemRenderers(context),
};
