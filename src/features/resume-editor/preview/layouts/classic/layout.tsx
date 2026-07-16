import { createSingleColumnLayout } from "@/features/resume-editor/preview/layouts/_shared/create-single-column-layout";

import { ClassicHeader } from "./header";
import { classicItemViews } from "./items";
import styles from "./styles.module.css";

export const classicLayout = createSingleColumnLayout({
  id: "classic",
  label: "Classic",
  description: "Single-column resume with the photo and name aligned on top.",
  hideSummaryHeading: true,
  styles,
  Header: ClassicHeader,
  itemViews: classicItemViews,
});
