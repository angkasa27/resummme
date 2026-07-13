import { createSingleColumnTemplate } from "@/features/resume-editor/preview/templates/_shared/create-single-column-template";

import { TimelineHeader } from "./header";
import { timelineItemViews } from "./items";
import styles from "./styles.module.css";

export const timelineTemplate = createSingleColumnTemplate({
  id: "timeline",
  label: "Timeline",
  description:
    "Single-column layout with a subtle accent bar beside each item, emphasizing dates and chronology.",
  hideSummaryHeading: true,
  styles,
  Header: TimelineHeader,
  itemViews: timelineItemViews,
});
