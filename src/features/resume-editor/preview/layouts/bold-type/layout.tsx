import { createSingleColumnLayout } from "@/features/resume-editor/preview/layouts/_shared/create-single-column-layout";

import { BoldTypeHeader } from "./header";
import { boldTypeItemViews } from "./items";
import styles from "./styles.module.css";

export const boldTypeLayout = createSingleColumnLayout({
  id: "bold-type",
  label: "Bold Type",
  description:
    "Editorial layout with an oversized name, heavy rules, and highlight-marker section headings.",
  styles,
  Header: BoldTypeHeader,
  itemViews: boldTypeItemViews,
});
