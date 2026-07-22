import { createSingleColumnLayout } from "@/features/resume-editor/preview/layouts/_shared/create-single-column-layout";

import { defaultItemViews } from "@/features/resume-editor/preview/layouts/_shared/default-item-views";

import { BoldTypeHeader } from "./header";
import styles from "./styles.module.css";

export const boldTypeLayout = createSingleColumnLayout({
  id: "bold-type",
  label: "Bold Type",
  description:
    "Editorial layout with an oversized name, heavy rules, and highlight-marker section headings.",
  styles,
  hideSummaryHeading: true,
  Header: BoldTypeHeader,
  itemViews: defaultItemViews,
});
