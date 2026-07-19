import type { CollectionSectionKey } from "@/features/resume-editor/domain/sections/section-metadata";
import type { ResolvedPdfPresentation } from "@/features/resume-editor/domain/presentation/pdf-presentation";
import type { ResumeDraft } from "@/features/resume-editor/domain/schema";

export type PreviewMode = "preview" | "pdf";

/**
 * Each contact carries its own kind rather than being identified by position.
 * Empty fields are dropped before render, so an index-based guess mislabels
 * every item after the gap — and the icon for a kind has to come from the item
 * itself, not from where it happens to land.
 */
export type PreviewContactItem =
  | { kind: "location"; value: string }
  | { kind: "phone"; value: string }
  | { kind: "email"; value: string }
  | { kind: "link"; value: string };

export type PreviewSectionItemMap = {
  [K in CollectionSectionKey]: ResumeDraft["sections"][K]["items"][number];
};

export type PreviewRenderableSection<
  K extends CollectionSectionKey = CollectionSectionKey,
> = {
  key: K;
  label: string;
  heading: string;
  items: PreviewSectionItemMap[K][];
};

export type AnyPreviewRenderableSection = {
  [K in CollectionSectionKey]: PreviewRenderableSection<K>;
}[CollectionSectionKey];

export type PreviewRenderContext = {
  draft: ResumeDraft;
  mode: PreviewMode;
  presentation: ResolvedPdfPresentation;
  contactItems: PreviewContactItem[];
  summaryContent: string | null;
  sections: AnyPreviewRenderableSection[];
};

/** Document-level actions rendered on the right of the preview toolbar. */
export type PreviewDocumentActions = {
  /** Open the AI "Extract from PDF" flow. */
  onExtractCv: () => void;
  onImportJson: () => void;
  onExportJson: () => void;
  onExportPdf: () => void;
  isExportingPdf?: boolean;
  isImportingPdf?: boolean;
};

export type PreviewRendererProps = {
  draft: ResumeDraft;
  mode?: PreviewMode;
  className?: string;
};
