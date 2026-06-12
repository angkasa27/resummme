import type {
  PreviewTemplateDefinition,
  TemplateComponentProps,
} from "@/features/resume-editor/preview/template-types";

import { TintedHeader } from "./header";
import { tintedItemViews } from "./items";
import styles from "./styles.module.css";

function TintedTemplate({ slots }: TemplateComponentProps) {
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

export const tintedTemplate: PreviewTemplateDefinition = {
  id: "tinted",
  label: "Tinted",
  description:
    "Soft color-tinted header block, chip-style section headings, and skill tags as pills.",
  Component: TintedTemplate,
  Header: TintedHeader,
  itemViews: tintedItemViews,
};
