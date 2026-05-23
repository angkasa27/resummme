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
  label: "Modern Centered",
  description:
    "Centered name with a hairline accent rule. Section headings are underlined; item headers stack vertically.",
  Component: ModernCenteredTemplate,
  Header: ModernCenteredHeader,
  itemViews: modernCenteredItemViews,
};
