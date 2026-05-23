import type { ReactNode } from "react";

import type { CollectionSectionKey } from "@/features/resume-editor/domain/sections/section-metadata";
import type { PdfTemplateId } from "@/features/resume-editor/domain/presentation/pdf-presentation";
import type { SectionItem } from "@/features/resume-editor/preview/sections/types";
import type { PreviewRenderContext } from "@/features/resume-editor/preview/types";

export type LayoutColumn = "main" | "side";

export type TemplateSectionItemMap = {
  [K in CollectionSectionKey]: (props: {
    item: SectionItem<K>;
  }) => ReactNode;
};

export type TemplateSlots = {
  header: ReactNode;
  summary: ReactNode | null;
  sections: Array<{ key: CollectionSectionKey; node: ReactNode }>;
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
  Component: (props: TemplateComponentProps) => ReactNode;
  Header: (props: TemplateHeaderProps) => ReactNode;
  itemViews: TemplateSectionItemMap;
  getColumn?: (sectionKey: CollectionSectionKey) => LayoutColumn;
};
