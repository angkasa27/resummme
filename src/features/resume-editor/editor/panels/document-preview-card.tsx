"use client";

import { memo, useCallback, useMemo } from "react";
import { CheckIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  FOCUS_RING_CLASS,
  SELECTION_RING_CLASS,
} from "@/features/resume-editor/forms/fields/field-control";
import { useElementWidth } from "@/hooks/use-element-width";
import { useInViewOnce } from "@/hooks/use-in-view-once";
import { ResumeDocument } from "@/features/resume-editor/preview/resume-document";
import {
  getPaperWidthPx,
  paperDimensions,
  type PdfPresentation,
} from "@/features/resume-editor/domain/presentation/pdf-presentation";
import type { ResumeDraft } from "@/features/resume-editor/domain/schema";

type DocumentPreviewCardProps = {
  draft: ResumeDraft;
  /** The full presentation this card previews (layout + style already applied). */
  presentation: PdfPresentation;
  ariaLabel: string;
  selected: boolean;
  onSelect: () => void;
};

/** A selectable card rendering a scaled-down preview of the user's resume under a
 * presentation. The Template gallery's card; its name sits in the caption below. */
export const DocumentPreviewCard = memo(function DocumentPreviewCard({
  draft,
  presentation,
  ariaLabel,
  selected,
  onSelect,
}: DocumentPreviewCardProps) {
  const [widthRef, width] = useElementWidth<HTMLButtonElement>();
  const [inViewRef, seen] = useInViewOnce<HTMLButtonElement>();
  const ref = useCallback(
    (node: HTMLButtonElement | null) => {
      widthRef.current = node;
      inViewRef.current = node;
    },
    [widthRef, inViewRef],
  );
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
        // content-visibility keeps scrolling cheap once every card has mounted;
        // aspectRatio below sizes the card, so no contain-intrinsic-size needed.
        "relative w-full overflow-hidden rounded-md bg-white transition [content-visibility:auto]",
        "hover:border-ring",
        FOCUS_RING_CLASS,
        "group border border-border",
        SELECTION_RING_CLASS,
        "aria-pressed:ring-primary",
      )}
      style={{ aspectRatio: `${paper.widthMm} / ${paper.heightMm}` }}
    >
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute top-0 left-0 origin-top-left text-left transition-opacity duration-300",
          scale > 0 && seen ? "opacity-100" : "opacity-0",
        )}
        style={{ width: paperWidthPx, transform: `scale(${scale})` }}
      >
        {scale > 0 && seen ? (
          <ResumeDocument draft={cardDraft} mode="preview" />
        ) : null}
      </div>
      <div
        aria-hidden
        className={cn(
          "absolute top-2 right-2 grid size-5 place-items-center rounded-full bg-primary text-primary-foreground opacity-0 transition-opacity",
          "group-aria-pressed:opacity-100",
        )}
      >
        <CheckIcon className="size-3" />
      </div>
    </button>
  );
});
