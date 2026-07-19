import type { CollectionSectionKey } from "@/features/resume-editor/domain/sections/section-metadata";
import type { PreviewSectionItemMap } from "@/features/resume-editor/preview/types";

export type SectionItem<K extends CollectionSectionKey> =
  PreviewSectionItemMap[K];

export type SectionDescriptor<K extends CollectionSectionKey> = {
  key: K;
  defaultHeading: string;
  hasContent: (item: SectionItem<K>) => boolean;
};
