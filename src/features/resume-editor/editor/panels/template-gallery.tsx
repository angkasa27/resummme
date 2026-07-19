"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { DocumentPreviewCard } from "@/features/resume-editor/editor/panels/document-preview-card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  applyTemplatePreset,
  applyTemplatePresetLayoutOnly,
  getActiveTemplatePresetId,
  resumeTemplatePresets,
  type ResumeTemplatePreset,
} from "@/features/resume-editor/domain/presentation/template-presets";
import type { PdfPresentation } from "@/features/resume-editor/domain/presentation/pdf-presentation";
import type { ResumeDraft } from "@/features/resume-editor/domain/schema";

function layoutLabel(preset: ResumeTemplatePreset): string {
  return preset.layoutId
    .split("-")
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");
}

function templateLabel(preset: ResumeTemplatePreset): string {
  return `${layoutLabel(preset)} ${preset.label}`;
}

type TemplateGalleryProps = {
  draft: ResumeDraft;
  presentation: PdfPresentation;
  onApply: (next: PdfPresentation) => void;
};

/**
 * Curated template picker: a flat grid of presets, each card a live scaled
 * preview of the user's own resume with the preset's layout + style applied.
 * Applying is one presentation commit (a single undo step) — unless the user
 * has hand-tweaked their style, in which case a dialog offers to keep it.
 */
export function TemplateGallery({
  draft,
  presentation,
  onApply,
}: TemplateGalleryProps) {
  // Snapshot the draft on mount: the gallery remounts when opened, and live
  // previews shouldn't re-render per keystroke.
  const [snapshot] = useState(draft);
  const activePresetId = getActiveTemplatePresetId(presentation);
  const [pending, setPending] = useState<ResumeTemplatePreset | null>(null);

  // Stable handler so preset cards don't re-render on every apply.
  const presentationRef = useRef(presentation);
  useEffect(() => {
    presentationRef.current = presentation;
  }, [presentation]);
  const handleSelect = useCallback(
    (preset: ResumeTemplatePreset) => {
      const current = presentationRef.current;
      if (getActiveTemplatePresetId(current) === null) {
        // User has custom style on top of a template — confirm before
        // overwriting it.
        setPending(preset);
      } else {
        onApply(applyTemplatePreset(preset, current));
      }
    },
    [onApply],
  );

  // Preset previews only depend on the paper setup, not the current style —
  // every other style field is overridden by the preset itself.
  const paperKey = presentation.paperSize;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const basePresentation = useMemo(() => presentation, [paperKey]);

  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        {resumeTemplatePresets.map((preset) => (
          <TemplatePresetCard
            key={preset.id}
            draft={snapshot}
            basePresentation={basePresentation}
            preset={preset}
            selected={preset.id === activePresetId}
            onApply={handleSelect}
          />
        ))}
      </div>
      <Dialog
        open={pending !== null}
        onOpenChange={(open) => {
          if (!open) setPending(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Apply &quot;{pending ? templateLabel(pending) : ""}&quot;
              template?
            </DialogTitle>
            <DialogDescription>
              This template has its own colors and fonts that will replace your
              current custom style.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose
              render={<Button variant="ghost" size="sm" />}
              className="mr-auto"
            >
              Cancel
            </DialogClose>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (!pending) return;
                onApply(
                  applyTemplatePresetLayoutOnly(
                    pending,
                    presentationRef.current,
                  ),
                );
                setPending(null);
              }}
            >
              Layout only
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={() => {
                if (!pending) return;
                onApply(applyTemplatePreset(pending, presentationRef.current));
                setPending(null);
              }}
            >
              Replace style
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
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

  const label = templateLabel(preset);

  return (
    <DocumentPreviewCard
      draft={draft}
      presentation={cardPresentation}
      label={label}
      ariaLabel={`Use ${label} template`}
      selected={selected}
      onSelect={handleSelect}
    />
  );
}
