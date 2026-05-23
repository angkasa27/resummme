import type { CollectionSectionKey } from "@/features/resume-editor/domain/sections/section-metadata";
import type {
  LayoutColumn,
  PreviewTemplateDefinition,
  TemplateComponentProps,
} from "@/features/resume-editor/preview/template-types";

import { SidebarHeader } from "./header";
import { sidebarItemViews } from "./items";
import styles from "./styles.module.css";

const SIDE_SECTIONS = new Set<CollectionSectionKey>([
  "skills",
  "languages",
  "certifications",
  "references",
]);

function getColumn(sectionKey: CollectionSectionKey): LayoutColumn {
  return SIDE_SECTIONS.has(sectionKey) ? "side" : "main";
}

function SidebarTemplate({ slots }: TemplateComponentProps) {
  const side: typeof slots.sections = [];
  const main: typeof slots.sections = [];
  for (const entry of slots.sections) {
    (getColumn(entry.key) === "side" ? side : main).push(entry);
  }

  return (
    <div className={styles.template}>
      {slots.header}
      <div className="layout-body">
        <div className="layout-side">
          {side.map(({ key, node }) => (
            <div key={key}>{node}</div>
          ))}
        </div>
        <div className="layout-main">
          {slots.summary}
          {main.map(({ key, node }) => (
            <div key={key}>{node}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

export const sidebarTemplate: PreviewTemplateDefinition = {
  id: "sidebar",
  label: "Sidebar",
  description:
    "Two-column resume with skills, languages, certifications, and references in a side rail.",
  Component: SidebarTemplate,
  Header: SidebarHeader,
  itemViews: sidebarItemViews,
  getColumn,
};
