import type {
  PreviewTemplateDefinition,
  TemplateComponentProps,
} from "@/features/resume-editor/preview/template-types";

import { MinimalHeader } from "./header";
import { minimalItemViews } from "./items";
import styles from "./styles.module.css";

function MinimalTemplate({ slots }: TemplateComponentProps) {
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

export const minimalTemplate: PreviewTemplateDefinition = {
  id: "minimal",
  label: "Minimal",
  description: "Clean single-column layout with no borders or decorative elements. Just content.",
  Component: MinimalTemplate,
  Header: MinimalHeader,
  itemViews: minimalItemViews,
};
