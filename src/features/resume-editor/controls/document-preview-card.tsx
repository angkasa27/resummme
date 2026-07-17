"use client";

import { memo, useMemo } from "react";

import { cn } from "@/lib/utils";
import { useElementWidth } from "@/hooks/use-element-width";
import { ResumeDocument } from "@/features/resume-editor/preview/resume-document";
import {
  getPaperWidthPx,
  paperDimensions,
  type PdfPresentation,
} from "@/features/resume-editor/domain/presentation/pdf-presentation";
import type { ResumeDraft } from "@/features/resume-editor/domain/schema";

export type DocumentPreviewCardProps = {
  draft: ResumeDraft;
  /** The full presentation this card previews (layout + style already applied). */
  presentation: PdfPresentation;
  label: string;
  ariaLabel: string;
  selected: boolean;
  onSelect: () => void;
};

/**
 * A selectable card rendering a live, scaled-down preview of the user's own
 * resume under a given presentation. Shared by the Layout tab (per-layout
 * variants) and the Template gallery (per-preset variants).
 */
export const DocumentPreviewCard = memo(function DocumentPreviewCard({
  draft,
  presentation,
  label,
  ariaLabel,
  selected,
  onSelect,
}: DocumentPreviewCardProps) {
  const [ref, width] = useElementWidth<HTMLButtonElement>();
  const paper = paperDimensions[presentation.paperSize];
  const paperWidthPx = getPaperWidthPx(presentation.paperSize);
  const scale = width > 0 ? width / paperWidthPx : 0;

  const cardDraft = useMemo<ResumeDraft>(
    () => ({ ...draft, pdfPresentation: presentation }),
    [draft, presentation],
  );

  return (
    <button
      ref={ref}
      type="button"
      aria-label={ariaLabel}
      aria-pressed={selected}
      onClick={onSelect}
      className={cn(
        "relative w-full overflow-hidden rounded-md bg-white transition",
        "hover:border-ring focus-visible:outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 group",
        selected
          ? "border border-ring ring-2 ring-ring"
          : "border border-border",
      )}
      style={{ aspectRatio: `${paper.widthMm} / ${paper.heightMm}` }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute left-0 top-0 origin-top-left text-left"
        style={{ width: paperWidthPx, transform: `scale(${scale})` }}
      >
        {scale > 0 ? <ResumeDocument draft={cardDraft} mode="preview" /> : null}
      </div>
      <div
        className={cn(
          "absolute inset-x-0 bottom-0 flex items-end justify-center bg-linear-to-t from-black/65 via-black/20 to-transparent px-3 pt-10 pb-3 opacity-0 transition-opacity duration-300",
          selected ? "opacity-100" : "group-hover:opacity-100",
        )}
      >
        <span className="text-sm font-semibold text-white">{label}</span>
      </div>
    </button>
  );
});
