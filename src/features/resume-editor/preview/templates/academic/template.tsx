import type {
  PreviewTemplateDefinition,
  TemplateComponentProps,
} from "@/features/resume-editor/preview/template-types";

import { AcademicHeader } from "./header";
import { academicItemViews } from "./items";
import styles from "./styles.module.css";

function AcademicTemplate({ slots }: TemplateComponentProps) {
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

export const academicTemplate: PreviewTemplateDefinition = {
  id: "academic",
  label: "Academic",
  description:
    "Serif typography, small-caps section labels, italic role labels. Best for academic / research CVs.",
  Component: AcademicTemplate,
  Header: AcademicHeader,
  itemViews: academicItemViews,
};
