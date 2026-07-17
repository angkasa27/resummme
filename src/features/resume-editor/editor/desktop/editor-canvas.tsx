"use client";

import type { CSSProperties, ReactNode } from "react";

import { ZoomPill } from "@/features/resume-editor/editor/desktop/zoom-pill";

// Dot grid marking the workspace behind the paper. Uses the same
// `color-mix(in oklab, var(--foreground) …)` recipe as the landing backdrops so
// it tracks the theme rather than hardcoding a tint. No radial mask here — the
// landing fades its grid out to blend into copy; a workspace should read as one
// uniform surface edge to edge.
const dotGridStyle: CSSProperties = {
  backgroundImage:
    "radial-gradient(circle, color-mix(in oklab, var(--foreground) 14%, transparent) 1px, transparent 1px)",
  backgroundSize: "20px 20px",
};

type EditorCanvasProps = {
  zoom: number;
  onZoomChange: (next: number) => void;
  children: ReactNode;
};

/**
 * The document workspace: a dot-grid surface holding the paper preview, with a
 * floating zoom pill. Panning is plain overflow scroll.
 */
export function EditorCanvas({ zoom, onZoomChange, children }: EditorCanvasProps) {
  return (
    <main className="relative min-h-0 min-w-0 flex-1 bg-muted/40 print:bg-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 print:hidden"
        style={dotGridStyle}
      />

      {/* Scroll + pan surface. `zoom` (not `transform`) so the scroll area
          measures the scaled paper rather than a visually-scaled ghost.
          `min-w-fit` is load-bearing: a plain `justify-center` row that
          overflows spills equally past BOTH edges, and the start-side spill is
          unreachable because scrollWidth ignores it — zooming in would clip the
          paper's left edge for good. Sizing the row to its content instead
          keeps centering while leaving the overflow scrollable. */}
      <div className="absolute inset-0 overflow-auto">
        <div className="flex min-h-full w-full min-w-fit justify-center px-8 py-10">
          <div style={{ zoom }} className="origin-top print:zoom-[1]">
            {children}
          </div>
        </div>
      </div>

      <ZoomPill zoom={zoom} onZoomChange={onZoomChange} />
    </main>
  );
}
