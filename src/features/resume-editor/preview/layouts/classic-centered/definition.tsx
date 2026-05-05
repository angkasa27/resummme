import type {
  PreviewDocumentBodyProps,
  PreviewDocumentLayoutDefinition,
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

function classicCenteredBody({
  context,
  summaryContent,
  sections,
  itemRenderers,
}: PreviewDocumentBodyProps) {
  return (
    <>
      {summaryContent ? classicSummarySection(context, summaryContent) : null}
      {sections.map((section, idx) =>
        classicCollectionSection(
          context,
          section,
          renderSectionItems(section, itemRenderers),
          `${idx}`,
        ),
      )}
    </>
  );
}

export const classicCenteredLayout: PreviewDocumentLayoutDefinition = {
  id: "classic-centered",
  Body: classicCenteredBody,
  createSectionItemRenderers: (context) => createClassicItemRenderers(context),
};
