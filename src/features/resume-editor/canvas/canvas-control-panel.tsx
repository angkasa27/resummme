"use client";

import {
  DownloadIcon,
  LayoutTemplateIcon,
  MinusIcon,
  PaletteIcon,
  PlusIcon,
  SparklesIcon,
  TelescopeIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InsightsTab } from "@/features/resume-editor/shared/insights/insights-tab";
import { StyleTab } from "@/features/resume-editor/shared/style-tab";
import { TemplateTab } from "@/features/resume-editor/shared/template-tab";
import type { PdfPresentation } from "@/features/resume-editor/domain/presentation/pdf-presentation";
import type { EditorPanelKey } from "@/features/resume-editor/domain/sections/section-metadata";
import type { ResumeDraft } from "@/features/resume-editor/domain/schema";
import { ButtonGroup } from "@/components/ui/button-group";

export const ZOOM_MIN = 0.5;
export const ZOOM_MAX = 1.5;
export const ZOOM_STEP = 0.1;
export const ZOOM_DEFAULT = 1;

type CanvasControlPanelProps = {
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
  zoom: number;
  onZoomChange: (next: number) => void;
};

export function CanvasControlPanel({
  presentation,
  draft,
  onPresentationChange,
  onImportJson,
  onExtractCv,
  onExport,
  onExportPdf,
  onOpenSection,
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
          variant="ai"
          size="lg"
          className="w-full justify-center font-medium"
          disabled={isImportingPdf}
          onClick={onExtractCv}
        >
          <SparklesIcon data-icon="inline-start" />
          Extract from PDF
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
      <Tabs defaultValue="template" className="min-h-0 flex-1">
        <div className="px-4 pt-3">
          <TabsList className="w-full shrink-0">
            <TabsTrigger value="template">
              <LayoutTemplateIcon />
              Template
            </TabsTrigger>
            <TabsTrigger value="style">
              <PaletteIcon />
              Style
            </TabsTrigger>
            <TabsTrigger value="insights">
              <TelescopeIcon /> Insights
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent
          value="template"
          className="min-h-0 overflow-y-auto pt-1.5 pb-3 px-4"
        >
          <TemplateTab
            presentation={presentation}
            draft={draft}
            onChange={onPresentationChange}
          />
        </TabsContent>
        <TabsContent
          value="style"
          className="min-h-0 overflow-y-auto pt-1.5 pb-3 px-4"
        >
          <StyleTab
            presentation={presentation}
            onChange={onPresentationChange}
          />
        </TabsContent>
        <TabsContent
          value="insights"
          className="min-h-0 overflow-y-auto pt-1.5 pb-3 px-4"
        >
          <InsightsTab draft={draft} onOpenSection={onOpenSection} />
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
