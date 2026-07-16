import type {
  PreviewLayoutDefinition,
  LayoutComponentProps,
} from "@/features/resume-editor/preview/layout-types";

import { getSideRailColumn } from "../_shared/side-rail-sections";
import { SidebarHeader } from "./header";
import { sidebarItemViews } from "./items";
import styles from "./styles.module.css";

function SidebarLayout({ context, slots }: LayoutComponentProps) {
  const side: typeof slots.sections = [];
  const main: typeof slots.sections = [];
  for (const entry of slots.sections) {
    (getSideRailColumn(entry.key) === "side" ? side : main).push(entry);
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
  getColumn: getSideRailColumn,
};
