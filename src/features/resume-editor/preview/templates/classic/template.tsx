import type {
  PreviewTemplateDefinition,
  TemplateComponentProps,
} from "@/features/resume-editor/preview/template-types";

import { ClassicHeader } from "./header";
import { classicItemViews } from "./items";
import styles from "./styles.module.css";

function ClassicTemplate({ slots }: TemplateComponentProps) {
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

export const classicTemplate: PreviewTemplateDefinition = {
  id: "classic",
  label: "Classic",
  description: "Single-column resume with the photo and name aligned on top.",
  Component: ClassicTemplate,
  Header: ClassicHeader,
  itemViews: classicItemViews,
};
