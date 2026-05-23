"use client";

import { DownloadIcon, MinusIcon, PlusIcon, SparklesIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InsightsTab } from "@/features/resume-editor/canvas/controls/insights-tab";
import { StyleTab } from "@/features/resume-editor/canvas/controls/style-tab";
import type { PdfPresentation } from "@/features/resume-editor/domain/presentation/pdf-presentation";
import { ButtonGroup } from "@/components/ui/button-group";

export const ZOOM_MIN = 0.5;
export const ZOOM_MAX = 1.5;
export const ZOOM_STEP = 0.1;
export const ZOOM_DEFAULT = 1;

type CanvasControlPanelProps = {
  presentation: PdfPresentation;
  onPresentationChange: (next: PdfPresentation) => void;
  onImportJson: () => void;
  onExtractCv: () => void;
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
  onExtractCv,
  onExport,
  onExportPdf,
  isExportingPdf = false,
  isImportingPdf = false,
  zoom,
  onZoomChange,
}: CanvasControlPanelProps) {
  function clampZoom(value: number) {
    return Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, value));
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      {/* Document section (fixed top) */}
      <section className="flex shrink-0 flex-col gap-2 px-4 py-4">
        <Button
          type="button"
          size="lg"
          className="w-full justify-center font-medium"
          disabled={isImportingPdf}
          onClick={onExtractCv}
        >
          <SparklesIcon data-icon="inline-start" />
          Extract CV from PDF
        </Button>
        <ButtonGroup className="w-full">
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={onImportJson}
            className="flex-1"
          >
            Import JSON
          </Button>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={onExport}
            className="flex-1"
          >
            Export JSON
          </Button>
        </ButtonGroup>
        <Button
          type="button"
          size="sm"
          variant="outline"
          disabled={isExportingPdf}
          onClick={onExportPdf}
        >
          <DownloadIcon data-icon="inline-start" />
          {isExportingPdf ? "Generating PDF…" : "Download PDF"}
        </Button>
      </section>

      <Separator />

      {/* Tabs */}
      <Tabs defaultValue="style" className="px-4 py-3 flex-1">
        <TabsList className="w-full ">
          <TabsTrigger value="style">Style</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="style" className="flex flex-col gap-4 pb-2">
          <StyleTab
            presentation={presentation}
            onChange={onPresentationChange}
          />
        </TabsContent>
        <TabsContent value="insights" className="pb-2">
          <InsightsTab />
        </TabsContent>
      </Tabs>

      <Separator />

      {/* Zoom (fixed bottom) */}
      <section className="flex shrink-0 items-center gap-1 px-4 py-3">
        <Button
          type="button"
          variant="outline"
          size="icon-sm"
          aria-label="Zoom out"
          disabled={zoom <= ZOOM_MIN + 1e-6}
          onClick={() => onZoomChange(clampZoom(zoom - ZOOM_STEP))}
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
          onClick={() => onZoomChange(clampZoom(zoom + ZOOM_STEP))}
        >
          <PlusIcon />
        </Button>
      </section>
    </div>
  );
}
