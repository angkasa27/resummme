"use client";

import { useRef, type PointerEvent as ReactPointerEvent, type RefObject } from "react";

import {
  clampSidebarWidth,
  SIDEBAR_WIDTH,
} from "@/features/resume-editor/editor/desktop/use-sidebar-width";
import { cn } from "@/lib/utils";

type SidebarResizeHandleProps = {
  /** The aside being resized. Written to directly during the drag. */
  targetRef: RefObject<HTMLElement | null>;
  width: number;
  onCommit: (next: number) => void;
  onReset: () => void;
};

const KEY_STEP = 16;
const KEY_STEP_LARGE = 64;

/**
 * Drag handle on the sidebar's right edge.
 *
 * React stays out of the drag loop: pointermove writes `style.width` straight
 * to the aside and only pointerup commits state. Re-rendering per move would
 * re-render every mounted form and TipTap instance in the sidebar. The field
 * grid still reflows live because it's driven by container queries, not by a
 * width prop.
 */
export function SidebarResizeHandle({
  targetRef,
  width,
  onCommit,
  onReset,
}: SidebarResizeHandleProps) {
  const dragRef = useRef<{ startX: number; startWidth: number } | null>(null);

  function handlePointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    if (event.button !== 0) return;
    event.preventDefault();
    dragRef.current = { startX: event.clientX, startWidth: width };
    event.currentTarget.setPointerCapture(event.pointerId);
    // Without these, dragging across the canvas selects the resume text and
    // the cursor flickers back to default over the paper.
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  }

  function handlePointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    const drag = dragRef.current;
    if (!drag || !targetRef.current) return;
    const next = clampSidebarWidth(
      drag.startWidth + (event.clientX - drag.startX),
    );
    targetRef.current.style.width = `${next}px`;
  }

  function endDrag(event: ReactPointerEvent<HTMLDivElement>) {
    const drag = dragRef.current;
    if (!drag) return;
    dragRef.current = null;
    event.currentTarget.releasePointerCapture(event.pointerId);
    document.body.style.cursor = "";
    document.body.style.userSelect = "";
    onCommit(clampSidebarWidth(drag.startWidth + (event.clientX - drag.startX)));
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    const step = event.shiftKey ? KEY_STEP_LARGE : KEY_STEP;
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      onCommit(width - step);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      onCommit(width + step);
    } else if (event.key === "Home") {
      event.preventDefault();
      onCommit(SIDEBAR_WIDTH.min);
    } else if (event.key === "End") {
      event.preventDefault();
      onCommit(SIDEBAR_WIDTH.max);
    }
  }

  return (
    <div
      role="separator"
      aria-orientation="vertical"
      aria-label="Resize sidebar"
      aria-valuenow={width}
      aria-valuemin={SIDEBAR_WIDTH.min}
      aria-valuemax={SIDEBAR_WIDTH.max}
      tabIndex={0}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onDoubleClick={onReset}
      onKeyDown={handleKeyDown}
      className={cn(
        // 8px hit area straddling the 1px border, so it never shifts layout.
        "absolute inset-y-0 -right-1 z-20 w-2 cursor-col-resize",
        "after:absolute after:inset-y-0 after:left-1/2 after:w-px after:-translate-x-1/2",
        "after:bg-transparent after:transition-colors hover:after:bg-primary",
        "focus-visible:after:bg-primary focus-visible:outline-none",
        "print:hidden",
      )}
    />
  );
}
