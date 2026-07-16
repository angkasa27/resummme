import { createSingleColumnLayout } from "@/features/resume-editor/preview/layouts/_shared/create-single-column-layout";

import { TimelineHeader } from "./header";
import { timelineItemViews } from "./items";
import styles from "./styles.module.css";

export const timelineLayout = createSingleColumnLayout({
  id: "timeline",
  label: "Timeline",
  description:
    "Single-column layout with a subtle accent bar beside each item, emphasizing dates and chronology.",
  hideSummaryHeading: true,
  styles,
  Header: TimelineHeader,
  itemViews: timelineItemViews,
});
