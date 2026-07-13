import type { ReactNode } from "react";

import type {
  PreviewTemplateDefinition,
  TemplateComponentProps,
  TemplateHeaderProps,
  TemplateSectionItemMap,
  TemplateSlots,
} from "@/features/resume-editor/preview/template-types";

type SingleColumnConfig = {
  id: PreviewTemplateDefinition["id"];
  label: string;
  description: string;
  /** Each template MUST pass its own hashed CSS module (only `.template` is read). */
  styles: Readonly<Record<string, string>>;
  Header: (props: TemplateHeaderProps) => ReactNode;
  itemViews: TemplateSectionItemMap;
  hideSummaryHeading?: boolean;
  /**
   * Per-section override — the extension point for structural uniqueness.
   * Defaults to the plain `<div>{node}</div>` wrapper every single-column
   * template used before this factory existed.
   */
  renderSection?: (entry: TemplateSlots["sections"][number]) => ReactNode;
};

const defaultRenderSection = (
  entry: TemplateSlots["sections"][number],
): ReactNode => <div key={entry.key}>{entry.node}</div>;

/**
 * Opt-in factory for the single-column templates whose Component body is
 * otherwise byte-identical (header, then a `.layout-body` stack of summary +
 * sections). Each template keeps its OWN `styles` module, so the hashed
 * `.template` class stays per-template; emitted markup is unchanged.
 *
 * A template that needs a genuinely different layout does NOT use this — it
 * writes its own `Component` (as sidebar/split do). Templates that only need a
 * single section rendered differently pass `renderSection`.
 */
export function createSingleColumnTemplate(
  config: SingleColumnConfig,
): PreviewTemplateDefinition {
  const renderSection = config.renderSection ?? defaultRenderSection;

  function SingleColumnTemplate({ slots }: TemplateComponentProps) {
    return (
      <div className={config.styles.template}>
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
    Component: SingleColumnTemplate,
    Header: config.Header,
    itemViews: config.itemViews,
  };
}
