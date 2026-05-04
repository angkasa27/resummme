import type { PreviewLayoutDefinition } from "@/features/resume-editor/preview/types";

import { classicHeader } from "./header";
import { classicSummarySection } from "./summary";
import { classicCollectionSection } from "./collection-section";
import { createClassicItemRenderers } from "./item-renderers";

export const classicCenteredLayout: PreviewLayoutDefinition = {
  id: "classic-centered",
  Header: ({ context }) => classicHeader(context),
  SummarySection: ({ context, content }) =>
    classicSummarySection(context, content),
  CollectionSection: ({ context, section, children }) =>
    classicCollectionSection(context, section, children),

  createSectionItemRenderers: (context) => createClassicItemRenderers(context),
};
