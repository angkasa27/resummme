"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { previewControlDefinitions } from "@/features/resume-editor/preview/control-registry";
import { DocumentPreviewCard } from "@/features/resume-editor/controls/document-preview-card";
import type { PreviewControlDefinition } from "@/features/resume-editor/preview/types";
import type {
  PdfPresentation,
  PdfLayoutId,
} from "@/features/resume-editor/domain/presentation/pdf-presentation";
import type { ResumeDraft } from "@/features/resume-editor/domain/schema";

const layoutControl: PreviewControlDefinition = (() => {
  const def = previewControlDefinitions.find((d) => d.id === "layout");
  if (!def) throw new Error('Missing control "layout"');
  return def;
})();

type LayoutTabProps = {
  presentation: PdfPresentation;
  draft: ResumeDraft;
  onChange: (next: PdfPresentation) => void;
};

/**
 * Visual layout picker: a grid of cards, each a live, scaled-down preview of
 * the user's own resume rendered in that layout. Replaces the plain layout
 * dropdown that used to live in the Style tab.
 */
export function LayoutTab({
  presentation,
  draft,
  onChange,
}: LayoutTabProps) {
  // Snapshot the draft when the picker opens so editing elsewhere doesn't
  // re-render every live preview on each keystroke. The panel remounts on open
  // (inactive Tabs panels / closed popovers don't mount), so this stays fresh.
  const [snapshot] = useState(draft);
  const activeLayoutId = layoutControl.value(presentation);

  // Keep the selection handler stable so memoized cards don't re-render when a
  // new selection produces a fresh `presentation` object on every click.
  const presentationRef = useRef(presentation);
  useEffect(() => {
    presentationRef.current = presentation;
  }, [presentation]);
  const handleSelect = useCallback(
    (id: string) => {
      onChange(layoutControl.update(id, presentationRef.current));
    },
    [onChange],
  );

  // A presentation reference that only changes when a *style* field changes —
  // not when `layoutId` changes. Each card forces its own layoutId, so this
  // lets a layout click re-render only the two cards whose `selected` flips.
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
      {layoutControl.options.map((option) => (
        <LayoutPreviewCard
          key={option.value}
          draft={snapshot}
          presentation={previewPresentation}
          layoutId={option.value}
          label={option.label}
          selected={option.value === activeLayoutId}
          onSelect={handleSelect}
        />
      ))}
    </div>
  );
}

type LayoutPreviewCardProps = {
  draft: ResumeDraft;
  presentation: PdfPresentation;
  layoutId: string;
  label: string;
  selected: boolean;
  onSelect: (id: string) => void;
};

function LayoutPreviewCard({
  draft,
  presentation,
  layoutId,
  label,
  selected,
  onSelect,
}: LayoutPreviewCardProps) {
  const cardPresentation = useMemo<PdfPresentation>(
    () => ({ ...presentation, layoutId: layoutId as PdfLayoutId }),
    [presentation, layoutId],
  );
  const handleSelect = useCallback(
    () => onSelect(layoutId),
    [onSelect, layoutId],
  );

  return (
    <DocumentPreviewCard
      draft={draft}
      presentation={cardPresentation}
      label={label}
      ariaLabel={`Use ${label} layout`}
      selected={selected}
      onSelect={handleSelect}
    />
  );
}
