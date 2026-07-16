import type { ReactNode } from "react";

import type { CollectionSectionKey } from "@/features/resume-editor/domain/sections/section-metadata";
import type { PdfLayoutId } from "@/features/resume-editor/domain/presentation/pdf-presentation";
import type { SectionItem } from "@/features/resume-editor/preview/sections/types";
import type {
  PreviewRenderableSection,
  PreviewRenderContext,
} from "@/features/resume-editor/preview/types";

export type LayoutColumn = "main" | "side";

export type LayoutSectionItemMap = {
  [K in CollectionSectionKey]: (props: {
    item: SectionItem<K>;
  }) => ReactNode;
};

/**
 * One section handed to a layout's Component. Distributed over
 * `CollectionSectionKey` so `entry.key === "skills"` narrows `entry.section`
 * to `PreviewRenderableSection<"skills">` — a layout that restructures a
 * section's content reads `entry.section.items` type-safely, with no cast.
 * `node` is the section pre-rendered by the shared `LayoutSection` (the
 * default placement); `section` is the structured data behind it.
 *
 * `section` is optional because the canvas edit surface renders a slot for
 * every section, including empty ones that have no renderable data — a
 * restructuring layout must guard `entry.section` before reading it.
 */
export type LayoutSectionEntry = {
  [K in CollectionSectionKey]: {
    key: K;
    node: ReactNode;
    section?: PreviewRenderableSection<K>;
  };
}[CollectionSectionKey];

export type LayoutSlots = {
  header: ReactNode;
  summary: ReactNode | null;
  sections: LayoutSectionEntry[];
};

export type LayoutComponentProps = {
  context: PreviewRenderContext;
  slots: LayoutSlots;
};

export type LayoutHeaderProps = {
  context: PreviewRenderContext;
};

export type PreviewLayoutDefinition = {
  id: PdfLayoutId;
  label: string;
  description: string;
  /**
   * True when the layout renders its own Summary heading, so the shared
   * SummaryView must suppress its <h2>. Single source of truth for
   * `shouldHideSummaryHeading` — no separate hardcoded id list.
   *
   * The rule: hide the heading only where the summary sits flush under the
   * header and reads as a lede paragraph (classic, banner, timeline). Show it
   * everywhere the headings themselves carry the structure — a uniformly
   * labelled layout (minimal), an academic CV where labelled sections are the
   * convention, or one whose gutter/rail labels would leave a bare paragraph
   * orphaned. A shown heading is also the safer default for ATS parsers, which
   * key on section headings.
   */
  hideSummaryHeading?: boolean;
  Component: (props: LayoutComponentProps) => ReactNode;
  Header: (props: LayoutHeaderProps) => ReactNode;
  itemViews: LayoutSectionItemMap;
  getColumn?: (sectionKey: CollectionSectionKey) => LayoutColumn;
};
