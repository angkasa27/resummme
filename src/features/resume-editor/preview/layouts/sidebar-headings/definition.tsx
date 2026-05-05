import type {
  PreviewDocumentBodyProps,
  PreviewDocumentLayoutDefinition,
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

function sidebarBody({
  context,
  summaryContent,
  sections,
  itemRenderers,
}: PreviewDocumentBodyProps) {
  return (
    <>
      {summaryContent ? sidebarSummarySection(context, summaryContent) : null}
      {sections.map((section) =>
        sidebarCollectionSection(
          context,
          section,
          renderSectionItems(section, itemRenderers),
        ),
      )}
    </>
  );
}

export const sidebarHeadingsLayout: PreviewDocumentLayoutDefinition = {
  id: "sidebar-headings",
  Body: sidebarBody,
  createSectionItemRenderers: (context) => createSidebarItemRenderers(context),
};
