"use client";

import { MinusIcon, PlusIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  clampZoom,
  ZOOM_DEFAULT,
  ZOOM_MAX,
  ZOOM_MIN,
  ZOOM_STEP,
} from "@/features/resume-editor/editor/desktop/zoom";

type ZoomPillProps = {
  zoom: number;
  onZoomChange: (next: number) => void;
};

/**
 * Floating zoom control over the canvas. Detached and centered above the bottom
 * edge, echoing the mobile bottom nav's pill.
 */
export function ZoomPill({ zoom, onZoomChange }: ZoomPillProps) {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex justify-center pb-4 print:hidden">
      <div className="pointer-events-auto flex items-center gap-1 rounded-full border bg-background/80 p-1 shadow-lg backdrop-blur">
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="rounded-full"
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
          className="w-14 rounded-full tabular-nums"
          aria-label={`Reset zoom to ${ZOOM_DEFAULT * 100}%`}
          onClick={() => onZoomChange(ZOOM_DEFAULT)}
        >
          {Math.round(zoom * 100)}%
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          className="rounded-full"
          aria-label="Zoom in"
          disabled={zoom >= ZOOM_MAX - 1e-6}
          onClick={() => onZoomChange(clampZoom(zoom + ZOOM_STEP))}
        >
          <PlusIcon />
        </Button>
      </div>
    </div>
  );
}
