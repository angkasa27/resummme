import type {
  PreviewTemplateDefinition,
  TemplateComponentProps,
} from "@/features/resume-editor/preview/template-types";

import { ModernCenteredHeader } from "./header";
import { modernCenteredItemViews } from "./items";
import styles from "./styles.module.css";

function ModernCenteredTemplate({ slots }: TemplateComponentProps) {
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

export const modernCenteredTemplate: PreviewTemplateDefinition = {
  id: "modern-centered",
  label: "Modern",
  description:
    "Hairline accent rule under section headings; item headers stack vertically.",
  Component: ModernCenteredTemplate,
  Header: ModernCenteredHeader,
  itemViews: modernCenteredItemViews,
};
