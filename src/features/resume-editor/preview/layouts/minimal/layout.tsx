import { createSingleColumnLayout } from "@/features/resume-editor/preview/layouts/_shared/create-single-column-layout";

import { defaultItemViews } from "@/features/resume-editor/preview/layouts/_shared/default-item-views";

import { MinimalHeader } from "./header";
import styles from "./styles.module.css";

export const minimalLayout = createSingleColumnLayout({
  id: "minimal",
  label: "Minimal",
  description:
    "Clean single-column layout with no borders or decorative elements. Just content.",
  styles,
  Header: MinimalHeader,
  itemViews: defaultItemViews,
});
