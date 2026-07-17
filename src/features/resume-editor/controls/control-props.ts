import type { PdfPresentation } from "@/features/resume-editor/domain/presentation/pdf-presentation";
import type { EditorPanelKey } from "@/features/resume-editor/domain/sections/section-metadata";
import type { ResumeDraft } from "@/features/resume-editor/domain/schema";

/**
 * The presentation + document-action contract every editor control surface is
 * handed. Both editor branches build this once and pass it down, so the design
 * panel, section list, and insights tab share one shape.
 */
export type EditorControlProps = {
  presentation: PdfPresentation;
  draft: ResumeDraft;
  onPresentationChange: (next: PdfPresentation) => void;
  onImportJson: () => void;
  onExtractCv: () => void;
  onExport: () => void;
  onExportPdf: () => void;
  onOpenSection?: (panel: EditorPanelKey) => void;
  isExportingPdf?: boolean;
  isImportingPdf?: boolean;
};
