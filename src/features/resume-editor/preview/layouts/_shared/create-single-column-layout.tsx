import type { ReactNode } from "react";

import type {
  PreviewLayoutDefinition,
  LayoutComponentProps,
  LayoutHeaderProps,
  LayoutSectionItemMap,
  LayoutSlots,
} from "@/features/resume-editor/preview/layout-types";

type SingleColumnConfig = {
  id: PreviewLayoutDefinition["id"];
  label: string;
  description: string;
  /** Each layout MUST pass its own hashed CSS module (only `.layout` is read). */
  styles: Readonly<Record<string, string>>;
  Header: (props: LayoutHeaderProps) => ReactNode;
  itemViews: LayoutSectionItemMap;
  hideSummaryHeading?: boolean;
  /**
   * Per-section override — the extension point for structural uniqueness.
   * Defaults to the plain `<div>{node}</div>` wrapper every single-column
   * layout used before this factory existed.
   */
  renderSection?: (entry: LayoutSlots["sections"][number]) => ReactNode;
};

const defaultRenderSection = (
  entry: LayoutSlots["sections"][number],
): ReactNode => <div key={entry.key}>{entry.node}</div>;

/**
 * Opt-in factory for the single-column layouts whose Component body is
 * otherwise byte-identical (header, then a `.layout-body` stack of summary +
 * sections). Each layout keeps its OWN `styles` module, so the hashed
 * `.layout` class stays per-layout; emitted markup is unchanged.
 *
 * A layout that needs a genuinely different layout does NOT use this — it
 * writes its own `Component` (as sidebar/split do). Layouts that only need a
 * single section rendered differently pass `renderSection`.
 */
export function createSingleColumnLayout(
  config: SingleColumnConfig,
): PreviewLayoutDefinition {
  const renderSection = config.renderSection ?? defaultRenderSection;

  function SingleColumnLayout({ slots }: LayoutComponentProps) {
    return (
      <div className={config.styles.layout}>
        {slots.header}
        <div className="layout-body">
          {slots.summary}
          {slots.sections.map(renderSection)}
        </div>
      </div>
    );
  }

  return {
    id: config.id,
    label: config.label,
    description: config.description,
    hideSummaryHeading: config.hideSummaryHeading,
    Component: SingleColumnLayout,
    Header: config.Header,
    itemViews: config.itemViews,
  };
}
