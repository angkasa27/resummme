"use client";

import {
  DownloadIcon,
  MinusIcon,
  PlusIcon,
  PrinterIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { PreviewToolbarContent } from "@/features/resume-editor/preview/components/preview-toolbar-content";
import type { PdfPresentation } from "@/features/resume-editor/domain/presentation/pdf-presentation";
import { ImportMenu } from "@/features/resume-editor/editor/import-menu";

export const ZOOM_MIN = 0.5;
export const ZOOM_MAX = 1.5;
export const ZOOM_STEP = 0.1;
export const ZOOM_DEFAULT = 1;

type CanvasControlPanelProps = {
  presentation: PdfPresentation;
  onPresentationChange: (next: PdfPresentation) => void;
  onImportJson: () => void;
  onImportPdf: () => void;
  onExport: () => void;
  onExportPdf: () => void;
  isExportingPdf?: boolean;
  isImportingPdf?: boolean;
  zoom: number;
  onZoomChange: (next: number) => void;
};

export function CanvasControlPanel({
  presentation,
  onPresentationChange,
  onImportJson,
  onImportPdf,
  onExport,
  onExportPdf,
  isExportingPdf = false,
  isImportingPdf = false,
  zoom,
  onZoomChange,
}: CanvasControlPanelProps) {
  function clamp(value: number) {
    return Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, value));
  }

  return (
    <div className="flex h-full flex-col gap-5">
      <section className="hidden lg:flex flex-col gap-2">
        <h3 className="text-sm font-semibold">Zoom</h3>
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            aria-label="Zoom out"
            disabled={zoom <= ZOOM_MIN + 1e-6}
            onClick={() => onZoomChange(clamp(zoom - ZOOM_STEP))}
          >
            <MinusIcon />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="flex-1 tabular-nums"
            aria-label={`Reset zoom to ${ZOOM_DEFAULT * 100}%`}
            onClick={() => onZoomChange(ZOOM_DEFAULT)}
          >
            {Math.round(zoom * 100)}%
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            aria-label="Zoom in"
            disabled={zoom >= ZOOM_MAX - 1e-6}
            onClick={() => onZoomChange(clamp(zoom + ZOOM_STEP))}
          >
            <PlusIcon />
          </Button>
        </div>
      </section>

      <Separator className="hidden lg:block" />

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
          <ImportMenu
            onImportJson={onImportJson}
            onImportPdf={onImportPdf}
            disabled={isImportingPdf}
          />
          <Button type="button" size="sm" variant="outline" onClick={onExport}>
            <DownloadIcon data-icon="inline-start" />
            Export
          </Button>
        </div>
        <Button
          type="button"
          size="sm"
          disabled={isExportingPdf}
          onClick={onExportPdf}
        >
          <PrinterIcon data-icon="inline-start" />
          {isExportingPdf ? "Exporting..." : "Export PDF"}
        </Button>
      </section>
    </div>
  );
}
