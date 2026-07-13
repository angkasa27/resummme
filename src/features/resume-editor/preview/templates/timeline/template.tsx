import type {
  PreviewTemplateDefinition,
  TemplateComponentProps,
} from "@/features/resume-editor/preview/template-types";

import { TimelineHeader } from "./header";
import { timelineItemViews } from "./items";
import styles from "./styles.module.css";

function TimelineTemplate({ slots }: TemplateComponentProps) {
  return (
    <div className={styles.template}>
      {slots.header}
      <div className="layout-body">
        {slots.summary}
        {slots.sections.map(({ key, node }) => (
          <div key={key}>{node}</div>
        ))}
      </div>
    </div>
  );
}

export const timelineTemplate: PreviewTemplateDefinition = {
  id: "timeline",
  label: "Timeline",
  description:
    "Single-column layout with a subtle accent bar beside each item, emphasizing dates and chronology.",
  hideSummaryHeading: true,
  Component: TimelineTemplate,
  Header: TimelineHeader,
  itemViews: timelineItemViews,
};
