import type { ReactNode } from "react";

import type { CollectionSectionKey } from "@/features/resume-editor/domain/sections/section-metadata";
import type { PdfTemplateId } from "@/features/resume-editor/domain/presentation/pdf-presentation";
import type { SectionItem } from "@/features/resume-editor/preview/sections/types";
import type {
  PreviewRenderableSection,
  PreviewRenderContext,
} from "@/features/resume-editor/preview/types";

export type LayoutColumn = "main" | "side";

export type TemplateSectionItemMap = {
  [K in CollectionSectionKey]: (props: {
    item: SectionItem<K>;
  }) => ReactNode;
};

/**
 * One section handed to a template's Component. Distributed over
 * `CollectionSectionKey` so `entry.key === "skills"` narrows `entry.section`
 * to `PreviewRenderableSection<"skills">` — a template that restructures a
 * section's content reads `entry.section.items` type-safely, with no cast.
 * `node` is the section pre-rendered by the shared `TemplateSection` (the
 * default placement); `section` is the structured data behind it.
 *
 * `section` is optional because the canvas edit surface renders a slot for
 * every section, including empty ones that have no renderable data — a
 * restructuring template must guard `entry.section` before reading it.
 */
export type TemplateSectionEntry = {
  [K in CollectionSectionKey]: {
    key: K;
    node: ReactNode;
    section?: PreviewRenderableSection<K>;
  };
}[CollectionSectionKey];

export type TemplateSlots = {
  header: ReactNode;
  summary: ReactNode | null;
  sections: TemplateSectionEntry[];
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
