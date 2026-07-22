import { createSingleColumnLayout } from "@/features/resume-editor/preview/layouts/_shared/create-single-column-layout";

import { defaultItemViews } from "@/features/resume-editor/preview/layouts/_shared/default-item-views";

import { ModernCenteredHeader } from "./header";
import styles from "./styles.module.css";

export const modernCenteredLayout = createSingleColumnLayout({
  id: "modern-centered",
  label: "Modern",
  description:
    "Hairline accent rule under section headings; item headers stack vertically.",
  styles,
  Header: ModernCenteredHeader,
  itemViews: defaultItemViews,
});
