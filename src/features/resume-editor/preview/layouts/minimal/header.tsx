import { createPhotoHeader } from "@/features/resume-editor/preview/layouts/_shared/create-photo-header";

import styles from "./styles.module.css";

export const MinimalHeader = createPhotoHeader({
  dataLayout: "minimal",
  styles,
  // No icons: this layout is unadorned text by definition. Links still shorten.
  contact: { variant: "inline", icons: false },
});
