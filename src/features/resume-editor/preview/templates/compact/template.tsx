import type {
  PreviewTemplateDefinition,
  TemplateComponentProps,
} from "@/features/resume-editor/preview/template-types";

import { CompactHeader } from "./header";
import { compactItemViews } from "./items";
import styles from "./styles.module.css";

function CompactTemplate({ slots }: TemplateComponentProps) {
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

export const compactTemplate: PreviewTemplateDefinition = {
  id: "compact",
  label: "Compact",
  description:
    "Dense single-column layout with inline meta and tighter spacing. Good for one-page resumes.",
  Component: CompactTemplate,
  Header: CompactHeader,
  itemViews: compactItemViews,
};
