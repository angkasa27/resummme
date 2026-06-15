"use client";

import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";

import { cn } from "@/lib/utils";
import { useElementWidth } from "@/hooks/use-element-width";
import { previewControlDefinitions } from "@/features/resume-editor/preview/control-registry";
import { ResumeDocument } from "@/features/resume-editor/preview/resume-document";
import type { PreviewControlDefinition } from "@/features/resume-editor/preview/types";
import {
  getPaperWidthPx,
  paperDimensions,
  type PdfPresentation,
  type PdfTemplateId,
} from "@/features/resume-editor/domain/presentation/pdf-presentation";
import type { ResumeDraft } from "@/features/resume-editor/domain/schema";

const templateControl: PreviewControlDefinition = (() => {
  const def = previewControlDefinitions.find((d) => d.id === "template");
  if (!def) throw new Error('Missing control "template"');
  return def;
})();

type TemplateTabProps = {
  presentation: PdfPresentation;
  draft: ResumeDraft;
  onChange: (next: PdfPresentation) => void;
};

/**
 * Visual template picker: a grid of cards, each a live, scaled-down preview of
 * the user's own resume rendered in that template. Replaces the plain template
 * dropdown that used to live in the Style tab.
 */
export function TemplateTab({
  presentation,
  draft,
  onChange,
}: TemplateTabProps) {
  // Snapshot the draft when the picker opens so editing elsewhere doesn't
  // re-render every live preview on each keystroke. The panel remounts on open
  // (inactive Tabs panels / closed popovers don't mount), so this stays fresh.
  const [snapshot] = useState(draft);
  const activeTemplateId = templateControl.value(presentation);

  // Keep the selection handler stable so memoized cards don't re-render when a
  // new selection produces a fresh `presentation` object on every click.
  const presentationRef = useRef(presentation);
  useEffect(() => {
    presentationRef.current = presentation;
  }, [presentation]);
  const handleSelect = useCallback(
    (id: string) => {
      onChange(templateControl.update(id, presentationRef.current));
    },
    [onChange],
  );

  // A presentation reference that only changes when a *style* field changes —
  // not when `templateId` changes. Each card forces its own templateId, so this
  // lets a template click re-render only the two cards whose `selected` flips.
  const styleKey = JSON.stringify({
    accent: presentation.accent,
    secondary: presentation.secondary,
    fontFamilyId: presentation.fontFamilyId,
    fontScale: presentation.fontScale,
    spacing: presentation.spacing,
    lineHeight: presentation.lineHeight,
    paperSize: presentation.paperSize,
    pageMargin: presentation.pageMargin,
  });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const previewPresentation = useMemo(() => presentation, [styleKey]);

  return (
    <div className="grid grid-cols-2 gap-3">
      {templateControl.options.map((option) => (
        <TemplatePreviewCard
          key={option.value}
          draft={snapshot}
          presentation={previewPresentation}
          templateId={option.value}
          label={option.label}
          selected={option.value === activeTemplateId}
          onSelect={handleSelect}
        />
      ))}
    </div>
  );
}

type TemplatePreviewCardProps = {
  draft: ResumeDraft;
  presentation: PdfPresentation;
  templateId: string;
  label: string;
  selected: boolean;
  onSelect: (id: string) => void;
};

const TemplatePreviewCard = memo(function TemplatePreviewCard({
  draft,
  presentation,
  templateId,
  label,
  selected,
  onSelect,
}: TemplatePreviewCardProps) {
  const [ref, width] = useElementWidth<HTMLButtonElement>();
  const paper = paperDimensions[presentation.paperSize];
  const paperWidthPx = getPaperWidthPx(presentation.paperSize);
  const scale = width > 0 ? width / paperWidthPx : 0;

  const cardDraft = useMemo<ResumeDraft>(
    () => ({
      ...draft,
      pdfPresentation: {
        ...presentation,
        templateId: templateId as PdfTemplateId,
      },
    }),
    [draft, presentation, templateId],
  );

  return (
    <button
      ref={ref}
      type="button"
      aria-label={`Use ${label} template`}
      aria-pressed={selected}
      onClick={() => onSelect(templateId)}
      className={cn(
        "relative w-full overflow-hidden rounded-md bg-white transition",
        "hover:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring group",
        selected
          ? "border border-ring ring-2 ring-ring"
          : "border border-border",
      )}
      style={{ aspectRatio: `${paper.widthMm} / ${paper.heightMm}` }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute left-0 top-0 origin-top-left"
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
