import { createSingleColumnLayout } from "@/features/resume-editor/preview/layouts/_shared/create-single-column-layout";

import { TintedHeader } from "./header";
import { tintedItemViews } from "./items";
import styles from "./styles.module.css";

export const tintedLayout = createSingleColumnLayout({
  id: "tinted",
  label: "Tinted",
  description:
    "Soft color-tinted header block, chip-style section headings, and skill tags as pills.",
  styles,
  Header: TintedHeader,
  itemViews: tintedItemViews,
});
