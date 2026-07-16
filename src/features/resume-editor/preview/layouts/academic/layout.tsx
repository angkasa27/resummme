import { createSingleColumnLayout } from "@/features/resume-editor/preview/layouts/_shared/create-single-column-layout";

import { AcademicHeader } from "./header";
import { academicItemViews } from "./items";
import styles from "./styles.module.css";

export const academicLayout = createSingleColumnLayout({
  id: "academic",
  label: "Academic",
  description:
    "Serif typography, small-caps section labels, italic role labels. Best for academic / research CVs.",
  styles,
  Header: AcademicHeader,
  itemViews: academicItemViews,
});
