import { createSingleColumnLayout } from "@/features/resume-editor/preview/layouts/_shared/create-single-column-layout";

import { defaultItemViews } from "@/features/resume-editor/preview/layouts/_shared/default-item-views";

import { BannerHeader } from "./header";
import styles from "./styles.module.css";

export const bannerLayout = createSingleColumnLayout({
  id: "banner",
  label: "Banner",
  description:
    "Bold solid-color header band running edge to edge, with the name, contacts, and photo inside it.",
  // hideSummaryHeading: true,
  inset: "none",
  styles,
  Header: BannerHeader,
  itemViews: defaultItemViews,
});
