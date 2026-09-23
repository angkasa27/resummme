"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { DocumentPreviewCard } from "@/features/resume-editor/editor/panels/document-preview-card";
import { PresetSwatch } from "@/features/resume-editor/editor/panels/preset-swatch";
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
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  applyTemplatePreset,
  applyTemplatePresetLayoutOnly,
  getActiveTemplatePresetId,
  layoutLabel,
  resumeTemplateLayouts,
  templateCategories,
  templateLabel,
  type ResumeTemplatePreset,
  type TemplateCategoryId,
} from "@/features/resume-editor/domain/presentation/template-presets";
import type {
  PdfLayoutId,
  PdfPresentation,
} from "@/features/resume-editor/domain/presentation/pdf-presentation";
import type { ResumeDraft } from "@/features/resume-editor/domain/schema";
import { cn } from "@/lib/utils";

type FilterValue = TemplateCategoryId | "all";

const FILTERS: ReadonlyArray<{ value: FilterValue; label: string }> = [
  { value: "all", label: "All" },
  { value: "ats", label: "ATS" },
  { value: "professional", label: "Professional" },
  { value: "creative", label: "Creative" },
];

type TemplateGalleryProps = {
  draft: ResumeDraft;
  presentation: PdfPresentation;
  onApply: (next: PdfPresentation) => void;
  scrollPaddingClassName?: string;
};

/** Applying a preset is one presentation commit — unless the style was hand-tweaked,
 * in which case a dialog offers to keep it. */
export function TemplateGallery({
  draft,
  presentation,
  onApply,
  scrollPaddingClassName,
}: TemplateGalleryProps) {
  // Snapshot the draft on mount: the gallery remounts when opened, and live
  // previews shouldn't re-render per keystroke.
  const [snapshot] = useState(draft);
  const activePresetId = getActiveTemplatePresetId(presentation);
  const [pending, setPending] = useState<ResumeTemplatePreset | null>(null);
  const [filter, setFilter] = useState<FilterValue>("all");

  // One card per layout, its presets as swatches. Sorted by layout name, so a
  // chip only removes cards, never reshuffles the ones that stay.
  const visibleLayouts = useMemo(
    () =>
      resumeTemplateLayouts
        .filter(
          ({ presets }) =>
            filter === "all" || templateCategories(presets[0]).includes(filter),
        ),
    [filter],
  );

  // Stable handler so preset cards don't re-render on every apply.
  const presentationRef = useRef(presentation);
  useEffect(() => {
    presentationRef.current = presentation;
  }, [presentation]);
  const handleSelect = useCallback(
    (preset: ResumeTemplatePreset) => {
      const current = presentationRef.current;
      if (getActiveTemplatePresetId(current) === null) {
        // Hand-tweaked style on a template — confirm before overwriting.
        setPending(preset);
      } else {
        onApply(applyTemplatePreset(preset, current));
      }
    },
    [onApply],
  );

  // Preset previews depend only on the paper setup; the preset overrides style.
  const paperKey = presentation.paperSize;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const basePresentation = useMemo(() => presentation, [paperKey]);

  return (
    <>
      {/* Filter row sits outside the scroll box, so it holds without sticky. */}
      <div className="flex h-full flex-col">
        <div className="shrink-0 px-3 pt-3 pb-2">
          {/* spacing detaches the group into chips — a joined 4-up segment reads as a second tab bar. */}
          <ToggleGroup
            multiple
            spacing={2}
            aria-label="Filter templates"
            value={[filter]}
            variant="outline"
            size="sm"
            className="flex flex-wrap"
            onValueChange={(next) => {
              const value = next.at(-1);
              if (value) setFilter(value as FilterValue);
            }}
          >
            {FILTERS.map((option) => (
              <ToggleGroupItem
                key={option.value}
                value={option.value}
                // Active reads as the rail's nav item, not the toggle's muted fill.
                className="rounded-full aria-pressed:border-primary/20 aria-pressed:bg-primary/10 aria-pressed:text-primary px-4 h-7 text-xs"
              >
                {option.label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        </div>
        <div
          className={cn(
            "min-h-0 flex-1 overflow-y-auto p-3 pt-2",
            scrollPaddingClassName,
          )}
        >
          <div className="grid grid-cols-2 gap-4">
            {visibleLayouts.map(({ layoutId, presets }) => (
              <TemplateLayoutCard
                key={layoutId}
                draft={snapshot}
                basePresentation={basePresentation}
                layoutId={layoutId}
                presets={presets}
                current={layoutId === presentation.layoutId}
                activePresetId={activePresetId}
                onApply={handleSelect}
              />
            ))}
          </div>
        </div>
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
                onApply(applyTemplatePresetLayoutOnly(pending, presentation));
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
                onApply(applyTemplatePreset(pending, presentation));
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

type TemplateLayoutCardProps = {
  draft: ResumeDraft;
  basePresentation: PdfPresentation;
  layoutId: PdfLayoutId;
  presets: ReadonlyArray<ResumeTemplatePreset>;
  /** The draft is on this layout, whether or not its style still matches a preset. */
  current: boolean;
  activePresetId: string | null;
  onApply: (preset: ResumeTemplatePreset) => void;
};

function TemplateLayoutCard({
  draft,
  basePresentation,
  layoutId,
  presets,
  current,
  activePresetId,
  onApply,
}: TemplateLayoutCardProps) {
  const [hovered, setHovered] = useState<number | null>(null);
  const activeIndex = presets.findIndex((preset) => preset.id === activePresetId);
  const restingIndex = Math.max(activeIndex, 0);
  // Hovering a swatch previews it on the card; the card itself applies the resting preset.
  const shown = presets[hovered ?? restingIndex];

  const cardPresentation = useMemo(
    () => applyTemplatePreset(shown, basePresentation),
    [shown, basePresentation],
  );
  const handleSelect = useCallback(
    () => onApply(presets[restingIndex]),
    [onApply, presets, restingIndex],
  );

  const name = layoutLabel(layoutId);

  return (
    <div className="flex min-w-0 flex-col gap-2">
      <DocumentPreviewCard
        draft={draft}
        presentation={cardPresentation}
        ariaLabel={`Use ${name} template`}
        selected={current}
        onSelect={handleSelect}
      />
      <div className="flex items-center justify-between gap-2">
        <span className="min-w-0 truncate text-sm font-medium">{name}</span>
        <div
          role="group"
          aria-label={`${name} styles`}
          className="flex shrink-0 items-center gap-1.5"
          onPointerLeave={() => setHovered(null)}
        >
          {presets.map((preset, index) => (
            <PresetSwatch
              key={preset.id}
              preset={preset}
              active={index === activeIndex}
              onPreview={(on) => setHovered(on ? index : null)}
              onApply={onApply}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
