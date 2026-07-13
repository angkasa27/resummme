import { createSingleColumnTemplate } from "@/features/resume-editor/preview/templates/_shared/create-single-column-template";

import { ClassicHeader } from "./header";
import { classicItemViews } from "./items";
import styles from "./styles.module.css";

export const classicTemplate = createSingleColumnTemplate({
  id: "classic",
  label: "Classic",
  description: "Single-column resume with the photo and name aligned on top.",
  hideSummaryHeading: true,
  styles,
  Header: ClassicHeader,
  itemViews: classicItemViews,
});
