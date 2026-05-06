"use client";

import { DownloadIcon, PrinterIcon, UploadIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { PreviewToolbarContent } from "@/features/resume-editor/preview/components/preview-toolbar-content";
import type { PdfPresentation } from "@/features/resume-editor/domain/presentation/pdf-presentation";

type CanvasControlPanelProps = {
  presentation: PdfPresentation;
  onPresentationChange: (next: PdfPresentation) => void;
  onImport: () => void;
  onExport: () => void;
  onExportPdf: () => void;
};

export function CanvasControlPanel({
  presentation,
  onPresentationChange,
  onImport,
  onExport,
  onExportPdf,
}: CanvasControlPanelProps) {
  return (
    <div className="flex h-full flex-col gap-5">
      <section className="flex flex-col gap-3">
        <PreviewToolbarContent
          presentation={presentation}
          onChange={onPresentationChange}
        />
      </section>

      <Separator />

      <section className="flex flex-col gap-2">
        <h3 className="text-sm font-semibold">Document</h3>
        <div className="grid grid-cols-2 gap-2">
          <Button type="button" size="sm" variant="outline" onClick={onImport}>
            <UploadIcon data-icon="inline-start" />
            Import
          </Button>
          <Button type="button" size="sm" variant="outline" onClick={onExport}>
            <DownloadIcon data-icon="inline-start" />
            Export
          </Button>
        </div>
        <Button type="button" size="sm" onClick={onExportPdf}>
          <PrinterIcon data-icon="inline-start" />
          Export PDF
        </Button>
      </section>
    </div>
  );
}
