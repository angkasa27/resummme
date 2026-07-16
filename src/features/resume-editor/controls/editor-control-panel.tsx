"use client";

import {
  LayoutTemplateIcon,
  MinusIcon,
  PaletteIcon,
  PlusIcon,
  TelescopeIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EditorDocumentActions } from "@/features/resume-editor/controls/editor-document-actions";
import { InsightsTab } from "@/features/resume-editor/controls/insights/insights-tab";
import { StyleTab } from "@/features/resume-editor/controls/style-tab";
import { LayoutTab } from "@/features/resume-editor/controls/layout-tab";
import type { PdfPresentation } from "@/features/resume-editor/domain/presentation/pdf-presentation";
import type { EditorPanelKey } from "@/features/resume-editor/domain/sections/section-metadata";
import type { ResumeDraft } from "@/features/resume-editor/domain/schema";
import { useIsMobile } from "@/hooks/use-mobile";

const ZOOM_MIN = 0.5;
const ZOOM_MAX = 1.5;
const ZOOM_STEP = 0.1;
export const ZOOM_DEFAULT = 1;

type EditorControlPanelProps = {
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
  /** Zoom controls render only when both are provided (canvas uses them; the
   * classic editor auto-fits its preview, so it omits them). */
  zoom?: number;
  onZoomChange?: (next: number) => void;
  /**
   * Layout mode. `"panel"` (default, desktop): fixed height with each tab's
   * content scrolling internally. `"flow"` (mobile drawer): the whole panel
   * flows in the parent's scroll area and the tabs list sticks to the top.
   */
  layout?: "panel" | "flow";
};

function clampZoom(value: number) {
  return Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, value));
}

type ZoomControlsProps = {
  zoom: number;
  onZoomChange: (next: number) => void;
};

function ZoomControls({ zoom, onZoomChange }: ZoomControlsProps) {
  return (
    <>
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
    </>
  );
}

/**
 * Editor control panel shared by the canvas and classic editors: the
 * Layout/Style/Insights tabs plus document actions, and optional zoom.
 */
export function EditorControlPanel({
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
  layout = "panel",
}: EditorControlPanelProps) {
  const isMobile = useIsMobile();
  const isFlow = layout === "flow";
  const tabContentClassName = cn(
    "pt-1.5 pb-3 px-4",
    !isFlow && "min-h-0 overflow-y-auto",
  );

  return (
    <div
      className={cn("flex flex-col", isFlow ? "min-h-full" : "h-full min-h-0")}
    >
      {/* Document section (fixed top) */}
      <EditorDocumentActions
        className="shrink-0 px-4 py-4"
        onExtractCv={onExtractCv}
        onImportJson={onImportJson}
        onExport={onExport}
        onExportPdf={onExportPdf}
        isExportingPdf={isExportingPdf}
        isImportingPdf={isImportingPdf}
      />

      <Separator />

      {/* Tabs */}
      <Tabs
        defaultValue="layout"
        className={cn("flex flex-col", isFlow ? "flex-1" : "min-h-0 flex-1")}
      >
        <div
          className={cn(
            "px-4 pt-3",
            isFlow && "sticky top-[-1px] z-10 bg-popover pb-2",
          )}
        >
          <TabsList className="w-full shrink-0">
            <TabsTrigger value="layout">
              <LayoutTemplateIcon />
              Layout
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

        <TabsContent value="layout" className={tabContentClassName}>
          <LayoutTab
            presentation={presentation}
            draft={draft}
            onChange={onPresentationChange}
          />
        </TabsContent>
        <TabsContent value="style" className={tabContentClassName}>
          <StyleTab
            presentation={presentation}
            onChange={onPresentationChange}
          />
        </TabsContent>
        <TabsContent value="insights" className={tabContentClassName}>
          <InsightsTab draft={draft} onOpenSection={onOpenSection} />
        </TabsContent>
      </Tabs>

      {!isMobile && zoom !== undefined && onZoomChange !== undefined ? (
        <ZoomControls zoom={zoom} onZoomChange={onZoomChange} />
      ) : null}
    </div>
  );
}
