import { PreviewContactLine } from "@/features/resume-editor/preview/kit/contact-line";
import type {
  PreviewLayoutDefinition,
  LayoutComponentProps,
} from "@/features/resume-editor/preview/layout-types";

import { getSideRailColumn } from "../_shared/side-rail-sections";
import { SplitHeader } from "./header";
import { splitItemViews } from "./items";
import styles from "./styles.module.css";

function SplitLayout({ context, slots }: LayoutComponentProps) {
  const side: typeof slots.sections = [];
  const main: typeof slots.sections = [];
  for (const entry of slots.sections) {
    (getSideRailColumn(entry.key) === "side" ? side : main).push(entry);
  }
  const { photo, fullName } = context.draft.profile;

  return (
    <div className={styles.layout}>
      <div className="layout-side">
        {photo ? (
          <div className="side-photo" data-slot="photo-frame">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={photo} alt={fullName} />
          </div>
        ) : null}
        {/* Stacked: the rail is 0.36fr, so an inline run of emails and URLs
            has nowhere to wrap and used to break mid-word. */}
        <PreviewContactLine
          context={context}
          presentation={{ variant: "stacked", icons: true }}
        />
        {side.map(({ key, node }) => (
          <div key={key}>{node}</div>
        ))}
      </div>
      <div className="layout-main">
        {slots.header}
        {slots.summary}
        {main.map(({ key, node }) => (
          <div key={key}>{node}</div>
        ))}
      </div>
    </div>
  );
}

export const splitLayout: PreviewLayoutDefinition = {
  id: "split",
  label: "Split",
  description:
    "Full-height colored rail with photo, contacts, and skills beside a clean main column.",
  Component: SplitLayout,
  Header: SplitHeader,
  itemViews: splitItemViews,
  getColumn: getSideRailColumn,
};
