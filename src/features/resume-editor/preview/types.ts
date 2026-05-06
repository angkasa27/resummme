import type {
  CollectionSectionKey,
} from "@/features/resume-editor/domain/sections/section-metadata";
import type {
  PdfPresentation,
  PdfLayoutId,
  PdfProfileLayoutId,
  ResolvedPdfPresentation,
} from "@/features/resume-editor/domain/presentation/pdf-presentation";
import type { ResumeDraft } from "@/features/resume-editor/domain/schema";
import type { ReactNode } from "react";

export type PreviewMode = "preview" | "pdf";

export type PreviewContactItem =
  | { kind: "text"; value: string }
  | { kind: "link"; value: string };

export type PreviewSectionItemMap = {
  [K in CollectionSectionKey]: ResumeDraft["sections"][K]["items"][number];
};

export type PreviewRenderableSection<K extends CollectionSectionKey = CollectionSectionKey> = {
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

export type PreviewHeaderProps = {
  context: PreviewRenderContext;
};

export type PreviewSummarySectionProps = {
  context: PreviewRenderContext;
  content: string;
};

export type PreviewCollectionSectionProps = {
  context: PreviewRenderContext;
  section: AnyPreviewRenderableSection;
  children: ReactNode;
};

export type PreviewSectionItemRenderer<K extends CollectionSectionKey = CollectionSectionKey> = (
  item: PreviewSectionItemMap[K],
) => ReactNode;

export type PreviewSectionItemRendererMap = {
  [K in CollectionSectionKey]: PreviewSectionItemRenderer<K>;
};

export type PreviewDocumentBodyProps = {
  context: PreviewRenderContext;
  summaryContent: string | null;
  sections: AnyPreviewRenderableSection[];
  itemRenderers: PreviewSectionItemRendererMap;
};

export type PreviewDocumentSummaryProps = {
  context: PreviewRenderContext;
  content: string;
};

export type PreviewDocumentCollectionSectionProps = {
  context: PreviewRenderContext;
  section: AnyPreviewRenderableSection;
  itemRenderers: PreviewSectionItemRendererMap;
};

export type PreviewDocumentLayoutDefinition = {
  id: PdfLayoutId;
  Body: (props: PreviewDocumentBodyProps) => ReactNode;
  Summary: (props: PreviewDocumentSummaryProps) => ReactNode;
  CollectionSection: (props: PreviewDocumentCollectionSectionProps) => ReactNode;
  createSectionItemRenderers: (
    context: PreviewRenderContext,
  ) => PreviewSectionItemRendererMap;
};

export type PreviewProfileLayoutDefinition = {
  id: PdfProfileLayoutId;
  Header: (props: PreviewHeaderProps) => ReactNode;
};

export type PreviewControlKind = "select" | "toggle-group";

export type PreviewControlOption = {
  value: string;
  label: string;
  renderOption?: () => ReactNode;
  renderTooltip?: () => ReactNode;
};

export type PreviewControlDefinition = {
  id: string;
  kind: PreviewControlKind;
  label: string;
  value: (presentation: PdfPresentation) => string;
  update: (
    nextValue: string,
    presentation: PdfPresentation,
  ) => PdfPresentation;
  options: ReadonlyArray<PreviewControlOption>;
};

export type PreviewToolbarContentProps = {
  presentation: PdfPresentation;
  onChange: (nextPresentation: PdfPresentation) => void;
  definitions?: ReadonlyArray<PreviewControlDefinition>;
};

export type PreviewPaneProps = {
  draft: ResumeDraft;
  onSavePdfPresentation: (pdfPresentation: PdfPresentation) => void;
};

export type PreviewRendererProps = {
  draft: ResumeDraft;
  mode?: PreviewMode;
  className?: string;
};
