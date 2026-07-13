import { createSingleColumnTemplate } from "@/features/resume-editor/preview/templates/_shared/create-single-column-template";

import { AcademicHeader } from "./header";
import { academicItemViews } from "./items";
import styles from "./styles.module.css";

export const academicTemplate = createSingleColumnTemplate({
  id: "academic",
  label: "Academic",
  description:
    "Serif typography, small-caps section labels, italic role labels. Best for academic / research CVs.",
  styles,
  Header: AcademicHeader,
  itemViews: academicItemViews,
});
