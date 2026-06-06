import type {
  PreviewTemplateDefinition,
  TemplateComponentProps,
} from "@/features/resume-editor/preview/template-types";

import { DividedHeader } from "./header";
import { dividedItemViews } from "./items";
import styles from "./styles.module.css";

function DividedTemplate({ slots }: TemplateComponentProps) {
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

export const dividedTemplate: PreviewTemplateDefinition = {
  id: "divided",
  label: "Divided",
  description:
    "Single-column with full-width horizontal rules separating sections. Clean report-like structure.",
  Component: DividedTemplate,
  Header: DividedHeader,
  itemViews: dividedItemViews,
};
