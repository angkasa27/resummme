"use client";

import type { KeyboardEvent, ReactNode } from "react";

import type { EditorPanelKey } from "@/features/resume-editor/domain/sections/section-metadata";

/**
 * Makes a slot on the paper open its section in the editor sidebar.
 *
 * Deliberately has no resting chrome: the canvas is a preview of the printed
 * document, so editing affordances live in the sidebar, not on top of the
 * page. Hover and the active section paint a muted highlight instead.
 *
 * A `div` rather than a `button` because sections render real anchors (contact
 * links, linked titles) and a button may not contain them. Those anchors are
 * made inert here so a click can't both follow the link and open the section —
 * the canvas is for editing; links stay live in the exported PDF.
 */
export function PreviewSectionTarget({
  panel,
  label,
  isActive,
  onSelect,
  children,
}: {
  panel: EditorPanelKey;
  label: string;
  isActive: boolean;
  onSelect: (panel: EditorPanelKey) => void;
  children: ReactNode;
}) {
  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onSelect(panel);
    }
  }

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`Edit ${label}`}
      data-active={isActive || undefined}
      onClick={() => onSelect(panel)}
      onKeyDown={handleKeyDown}
      className="cursor-pointer outline-none [&_a]:pointer-events-none relative group/section"
    >
      <div className="relative z-10">{children}</div>
      <div className="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 rounded-md bg-muted/60 opacity-0 transition-opacity group-hover/section:opacity-100 group-focus-within/section:opacity-100 [@media(hover:none)]:opacity-100 group-data-active/section:opacity-100 border border-primary w-[calc(100%+1.5rem)] h-[calc(100%+1.5rem)] z-0" />
    </div>
  );
}
