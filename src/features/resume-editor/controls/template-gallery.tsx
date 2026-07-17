"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { FieldLegend, FieldSet } from "@/components/ui/field";
import { DocumentPreviewCard } from "@/features/resume-editor/controls/document-preview-card";
import {
  applyTemplatePreset,
  getActiveTemplatePresetId,
  getTemplatePresetsByLayout,
  type ResumeTemplatePreset,
} from "@/features/resume-editor/domain/presentation/template-presets";
import type { PdfPresentation } from "@/features/resume-editor/domain/presentation/pdf-presentation";
import { getLayout } from "@/features/resume-editor/preview/layout-registry";
import type { ResumeDraft } from "@/features/resume-editor/domain/schema";

type TemplateGalleryProps = {
  draft: ResumeDraft;
  presentation: PdfPresentation;
  onApply: (next: PdfPresentation) => void;
};

/**
 * Curated template picker: presets grouped by layout, each card a live scaled
 * preview of the user's own resume with the preset's layout + style applied.
 * Applying is one presentation commit (a single undo step).
 */
export function TemplateGallery({
  draft,
  presentation,
  onApply,
}: TemplateGalleryProps) {
  // Snapshot the draft on mount — same rationale as LayoutTab: the gallery
  // remounts when opened, and live previews shouldn't re-render per keystroke.
  const [snapshot] = useState(draft);
  const activePresetId = getActiveTemplatePresetId(presentation);
  const groups = useMemo(() => getTemplatePresetsByLayout(), []);

  // Stable handler so preset cards don't re-render on every apply.
  const presentationRef = useRef(presentation);
  useEffect(() => {
    presentationRef.current = presentation;
  }, [presentation]);
  const handleApply = useCallback(
    (preset: ResumeTemplatePreset) => {
      onApply(applyTemplatePreset(preset, presentationRef.current));
    },
    [onApply],
  );

  // Preset previews only depend on the paper setup, not the current style —
  // every other style field is overridden by the preset itself.
  const paperKey = presentation.paperSize;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const basePresentation = useMemo(() => presentation, [paperKey]);

  return (
    <div className="flex flex-col gap-6">
      {[...groups.entries()].map(([layoutId, presets]) => (
        <FieldSet key={layoutId}>
          <FieldLegend>{getLayout(layoutId).label}</FieldLegend>
          <div className="grid grid-cols-2 gap-4">
            {presets.map((preset) => (
              <TemplatePresetCard
                key={preset.id}
                draft={snapshot}
                basePresentation={basePresentation}
                preset={preset}
                selected={preset.id === activePresetId}
                onApply={handleApply}
              />
            ))}
          </div>
        </FieldSet>
      ))}
    </div>
  );
}

type TemplatePresetCardProps = {
  draft: ResumeDraft;
  basePresentation: PdfPresentation;
  preset: ResumeTemplatePreset;
  selected: boolean;
  onApply: (preset: ResumeTemplatePreset) => void;
};

function TemplatePresetCard({
  draft,
  basePresentation,
  preset,
  selected,
  onApply,
}: TemplatePresetCardProps) {
  const cardPresentation = useMemo(
    () => applyTemplatePreset(preset, basePresentation),
    [preset, basePresentation],
  );
  const handleSelect = useCallback(() => onApply(preset), [onApply, preset]);

  return (
    <DocumentPreviewCard
      draft={draft}
      presentation={cardPresentation}
      label={preset.label}
      ariaLabel={`Use ${preset.label} template`}
      selected={selected}
      onSelect={handleSelect}
    />
  );
}
