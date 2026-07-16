import { createPhotoHeader } from "@/features/resume-editor/preview/layouts/_shared/create-photo-header";

import styles from "./styles.module.css";

export const SidebarHeader = createPhotoHeader({
  dataLayout: "sidebar",
  styles,
});
