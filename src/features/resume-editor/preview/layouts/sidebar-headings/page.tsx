import type { PreviewLayoutDefinition } from "@/features/resume-editor/preview/types";

import { sidebarHeader } from "./header";
import { sidebarSummarySection } from "./summary";
import { sidebarCollectionSection } from "./collection-section";
import { createSidebarItemRenderers } from "./item-renderers";

export const sidebarHeadingsLayout: PreviewLayoutDefinition = {
  id: "sidebar-headings",
  Header: ({ context }) => sidebarHeader(context),
  SummarySection: ({ context, content }) => sidebarSummarySection(context, content),
  CollectionSection: ({ context, section, children }) =>
    sidebarCollectionSection(context, section, children),

  createSectionItemRenderers: (context) => createSidebarItemRenderers(context),
};
