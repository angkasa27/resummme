import type {
  PreviewTemplateDefinition,
  TemplateComponentProps,
} from "@/features/resume-editor/preview/template-types";

import { BoldTypeHeader } from "./header";
import { boldTypeItemViews } from "./items";
import styles from "./styles.module.css";

function BoldTypeTemplate({ slots }: TemplateComponentProps) {
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

export const boldTypeTemplate: PreviewTemplateDefinition = {
  id: "bold-type",
  label: "Bold Type",
  description:
    "Editorial layout with an oversized name, heavy rules, and highlight-marker section headings.",
  Component: BoldTypeTemplate,
  Header: BoldTypeHeader,
  itemViews: boldTypeItemViews,
};
