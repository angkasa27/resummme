import {
  BetweenHorizontalStartIcon,
  BetweenVerticalStartIcon,
  LayoutTemplateIcon,
  SquareStackIcon,
  TypeIcon,
} from "lucide-react";

import {
  accentSwatchPreview,
  pdfAccentStrengthLabels,
  pdfAccentStrengths,
  pdfAccentToneLabels,
  pdfAccentTones,
  pdfFontScaleIds,
  pdfFontScaleLabels,
  pdfLayoutIds,
  pdfLayoutLabels,
  pdfLineHeightIds,
  pdfLineHeightLabels,
  pdfSpacingIds,
  pdfSpacingLabels,
  type PdfPresentation,
} from "@/features/resume-editor/domain/presentation/pdf-presentation";
import type { PreviewControlDefinition } from "@/features/resume-editor/preview/types";

function spacingGlyph({ gapClassName }: { gapClassName: string }) {
  return (
    <span
      aria-hidden="true"
      className={`flex flex-col items-center ${gapClassName}`}
    >
      <span className="h-0.5 w-4 rounded-full bg-current" />
      <span className="h-0.5 w-4 rounded-full bg-current" />
    </span>
  );
}

function listSpacingGlyph({ gapClassName }: { gapClassName: string }) {
  const rowKeys = ["first", "second", "third"] as const;
  return (
    <span aria-hidden="true" className={`flex flex-col ${gapClassName}`}>
      {rowKeys.map((rowKey) => (
        <span key={rowKey} className="flex items-center gap-1">
          <span className="size-1 rounded-full bg-current" />
          <span className="h-0.5 w-3.5 rounded-full bg-current" />
        </span>
      ))}
    </span>
  );
}

function strengthGlyph({
  widthClassName,
  opacityClassName,
}: {
  widthClassName: string;
  opacityClassName: string;
}) {
  return (
    <span aria-hidden="true" className="flex items-end gap-0.5">
      <span
        className={`h-2 rounded-full bg-current ${widthClassName} ${opacityClassName}`}
      />
      <span
        className={`h-3 rounded-full bg-current ${widthClassName} ${opacityClassName}`}
      />
      <span
        className={`h-4 rounded-full bg-current ${widthClassName} ${opacityClassName}`}
      />
    </span>
  );
}

function set<K extends keyof PdfPresentation>(
  presentation: PdfPresentation,
  key: K,
  value: PdfPresentation[K],
): PdfPresentation {
  return { ...presentation, [key]: value };
}

export const previewControlDefinitions = [
  {
    id: "layout",
    kind: "select",
    label: "Layout",
    value: (presentation) => presentation.layoutId,
    update: (nextValue, presentation) =>
      set(presentation, "layoutId", nextValue as PdfPresentation["layoutId"]),
    options: pdfLayoutIds.map((value) => ({
      value,
      label: pdfLayoutLabels[value],
    })),
  },
  {
    id: "font-scale",
    kind: "select",
    label: "Font size",
    value: (presentation) => presentation.fontScale,
    update: (nextValue, presentation) =>
      set(presentation, "fontScale", nextValue as PdfPresentation["fontScale"]),
    options: pdfFontScaleIds.map((value) => ({
      value,
      label: pdfFontScaleLabels[value],
    })),
  },
  {
    id: "line-height",
    kind: "toggle-group",
    label: "Line height",
    value: (presentation) => presentation.lineHeight,
    update: (nextValue, presentation) =>
      set(
        presentation,
        "lineHeight",
        nextValue as PdfPresentation["lineHeight"],
      ),
    options: pdfLineHeightIds.map((value) => ({
      value,
      label: pdfLineHeightLabels[value],
      renderOption: () =>
        value === "tight"
          ? spacingGlyph({ gapClassName: "gap-0.5" })
          : value === "relaxed"
            ? spacingGlyph({ gapClassName: "gap-1.5" })
            : spacingGlyph({ gapClassName: "gap-1" }),
    })),
  },
  {
    id: "spacing",
    kind: "toggle-group",
    label: "Spacing",
    value: (presentation) => presentation.spacing,
    update: (nextValue, presentation) =>
      set(presentation, "spacing", nextValue as PdfPresentation["spacing"]),
    options: pdfSpacingIds.map((value) => ({
      value,
      label: pdfSpacingLabels[value],
      renderOption: () =>
        value === "compact"
          ? listSpacingGlyph({ gapClassName: "gap-0.5" })
          : value === "airy"
            ? listSpacingGlyph({ gapClassName: "gap-1.5" })
            : listSpacingGlyph({ gapClassName: "gap-1" }),
      renderTooltip: () => (
        <span className="inline-flex items-center gap-1.5">
          <BetweenVerticalStartIcon className="size-3" />
          Spacing: {pdfSpacingLabels[value]}
        </span>
      ),
    })),
  },
  {
    id: "accent-tone",
    kind: "toggle-group",
    label: "Accent tone",
    value: (presentation) => presentation.accentTone,
    update: (nextValue, presentation) =>
      set(
        presentation,
        "accentTone",
        nextValue as PdfPresentation["accentTone"],
      ),
    options: pdfAccentTones.map((value) => ({
      value,
      label: pdfAccentToneLabels[value],
      renderOption: () => (
        <span
          aria-hidden="true"
          className="size-3 rounded-full border border-black/10"
          style={{ backgroundColor: accentSwatchPreview[value] }}
        />
      ),
      renderTooltip: () => (
        <span className="inline-flex items-center gap-1.5">
          <SquareStackIcon className="size-3" />
          Accent tone: {pdfAccentToneLabels[value]}
        </span>
      ),
    })),
  },
  {
    id: "accent-strength",
    kind: "toggle-group",
    label: "Accent strength",
    value: (presentation) => presentation.accentStrength,
    update: (nextValue, presentation) =>
      set(
        presentation,
        "accentStrength",
        nextValue as PdfPresentation["accentStrength"],
      ),
    options: pdfAccentStrengths.map((value) => ({
      value,
      label: pdfAccentStrengthLabels[value],
      renderOption: () =>
        value === "soft"
          ? strengthGlyph({
              widthClassName: "w-1",
              opacityClassName: "opacity-55",
            })
          : value === "strong"
            ? strengthGlyph({
                widthClassName: "w-1.5",
                opacityClassName: "opacity-100",
              })
            : strengthGlyph({
                widthClassName: "w-1.25",
                opacityClassName: "opacity-75",
              }),
      renderTooltip: () => (
        <span className="inline-flex items-center gap-1.5">
          <BetweenHorizontalStartIcon className="size-3" />
          Accent strength: {pdfAccentStrengthLabels[value]}
        </span>
      ),
    })),
  },
] as const satisfies ReadonlyArray<PreviewControlDefinition>;

export const previewControlLabelIcons = {
  layout: LayoutTemplateIcon,
  "font-scale": TypeIcon,
};
