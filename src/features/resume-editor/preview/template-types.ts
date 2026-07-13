import type { ReactNode } from "react";

import type { CollectionSectionKey } from "@/features/resume-editor/domain/sections/section-metadata";
import type { PdfTemplateId } from "@/features/resume-editor/domain/presentation/pdf-presentation";
import type { SectionItem } from "@/features/resume-editor/preview/sections/types";
import type { AnyPreviewRenderableSection, PreviewRenderContext } from "@/features/resume-editor/preview/types";

export type LayoutColumn = "main" | "side";

export type TemplateSectionItemMap = {
  [K in CollectionSectionKey]: (props: {
    item: SectionItem<K>;
  }) => ReactNode;
};

export type TemplateSlots = {
  header: ReactNode;
  summary: ReactNode | null;
  sections: Array<{
    key: CollectionSectionKey;
    node: ReactNode;
    section?: AnyPreviewRenderableSection;
  }>;
};

export type TemplateComponentProps = {
  context: PreviewRenderContext;
  slots: TemplateSlots;
};

export type TemplateHeaderProps = {
  context: PreviewRenderContext;
};

export type PreviewTemplateDefinition = {
  id: PdfTemplateId;
  label: string;
  description: string;
  /**
   * True when the template renders its own Summary heading, so the shared
   * SummaryView must suppress its <h2>. Single source of truth for
   * `shouldHideSummaryHeading` — no separate hardcoded id list.
   */
  hideSummaryHeading?: boolean;
  Component: (props: TemplateComponentProps) => ReactNode;
  Header: (props: TemplateHeaderProps) => ReactNode;
  itemViews: TemplateSectionItemMap;
  getColumn?: (sectionKey: CollectionSectionKey) => LayoutColumn;
};
