import type {
  PreviewTemplateDefinition,
  TemplateComponentProps,
} from "@/features/resume-editor/preview/template-types";

import { InsetHeader } from "./header";
import { insetItemViews } from "./items";
import styles from "./styles.module.css";

function InsetTemplate({ slots }: TemplateComponentProps) {
  return (
    <div className={styles.template}>
      {slots.header}
      <div className="layout-body">
        {slots.summary}
        {slots.sections.map(({ key, node, section }) => {
          if (key === "skills" && section) {
            const allSkills = section.items
              .flatMap((item) => {
                const s = item as { skills?: string[] };
                return s.skills ?? [];
              })
              .filter(Boolean)
              .join("  ·  ");
            if (!allSkills) return <div key={key}>{node}</div>;
            return (
              <section className="section" data-section="skills" key={key}>
                <h2 className="section-heading">{section.heading}</h2>
                <div className={styles.skillsLine}>{allSkills}</div>
              </section>
            );
          }
          return <div key={key}>{node}</div>;
        })}
      </div>
    </div>
  );
}

export const insetTemplate: PreviewTemplateDefinition = {
  id: "inset",
  label: "Inset",
  description:
    "Compact inline layout with two-row item headers and merged inline skills.",
  Component: InsetTemplate,
  Header: InsetHeader,
  itemViews: insetItemViews,
};
