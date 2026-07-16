import type { CollectionSectionKey } from "@/features/resume-editor/domain/sections/section-metadata";
import type {
  LayoutColumn,
  PreviewLayoutDefinition,
  LayoutComponentProps,
} from "@/features/resume-editor/preview/layout-types";

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

function SidebarLayout({ context, slots }: LayoutComponentProps) {
  const side: typeof slots.sections = [];
  const main: typeof slots.sections = [];
  for (const entry of slots.sections) {
    (getColumn(entry.key) === "side" ? side : main).push(entry);
  }
  const { photo, fullName } = context.draft.profile;

  return (
    <div className={styles.layout}>
      {slots.header}
      <div className="layout-body">
        <div className="layout-side">
          {photo ? (
            <div className="side-photo" data-slot="photo-frame">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photo} alt={fullName} />
            </div>
          ) : null}
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

export const sidebarLayout: PreviewLayoutDefinition = {
  id: "sidebar",
  label: "Sidebar",
  description:
    "Two-column resume with skills, languages, certifications, and references in a side rail.",
  Component: SidebarLayout,
  Header: SidebarHeader,
  itemViews: sidebarItemViews,
  getColumn,
};
