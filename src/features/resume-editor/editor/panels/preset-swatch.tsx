"use client";

import { CheckIcon } from "lucide-react";

import { readableTextOn } from "@/features/resume-editor/domain/presentation/color-utils";
import {
  templateLabel,
  type ResumeTemplatePreset,
} from "@/features/resume-editor/domain/presentation/template-presets";
import {
  FOCUS_RING_CLASS,
  SELECTION_RING_CLASS,
} from "@/features/resume-editor/forms/fields/field-control";
import { cn } from "@/lib/utils";

/** The colour-swatch recipe from `color-control.tsx`, caption-sized.
 * A two-colour preset shows both, split on the diagonal. */
export function PresetSwatch({
  preset,
  active,
  onPreview,
  onApply,
}: {
  preset: ResumeTemplatePreset;
  active: boolean;
  onPreview: (on: boolean) => void;
  onApply: (preset: ResumeTemplatePreset) => void;
}) {
  const { accent, secondary } = preset.style;
  return (
    <button
      type="button"
      title={preset.label}
      aria-label={templateLabel(preset)}
      aria-pressed={active}
      onClick={() => onApply(preset)}
      onPointerEnter={() => onPreview(true)}
      onFocus={() => onPreview(true)}
      onBlur={() => onPreview(false)}
      className={cn(
        // 20px under a mouse; a thumb needs the 24px WCAG target.
        // bg-origin-border: sized to the padding box, the split gradient tiles under
        // the translucent border and rims the swatch in the opposite colour.
        "grid size-5 place-items-center rounded-sm border border-black/10 bg-origin-border transition-transform hover:scale-110 active:scale-105 pointer-coarse:size-6",
        FOCUS_RING_CLASS,
        SELECTION_RING_CLASS,
        "aria-pressed:ring-primary",
      )}
      // Longhands, not `background`: the shorthand resets background-origin and
      // would override bg-origin-border from the inline style.
      style={{
        backgroundColor: accent,
        backgroundImage: secondary
          ? `linear-gradient(135deg, ${accent} 50%, ${secondary} 50%)`
          : undefined,
        color: readableTextOn(accent),
      }}
    >
      {active ? <CheckIcon className="size-3" /> : null}
    </button>
  );
}
