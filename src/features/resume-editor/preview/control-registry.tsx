import {
  BetweenHorizontalStartIcon,
  BetweenVerticalStartIcon,
  LayoutTemplateIcon,
  SquareStackIcon,
  TypeIcon,
} from "lucide-react";

import {
  pdfAccentStrengthLabels,
  pdfAccentStrengths,
  pdfAccentToneLabels,
  pdfAccentTones,
  pdfLayoutIds,
  pdfLayoutLabels,
  pdfLineHeightIds,
  pdfLineHeightLabels,
  pdfSpacingIds,
  pdfSpacingLabels,
  pdfTypeScaleIds,
  pdfTypeScaleLabels,
  type PdfPresentation,
} from "@/lib/resume/pdf-presentation";
import type { PreviewControlDefinition } from "@/features/resume-editor/preview/types";

function spacingGlyph({
  gapClassName,
  topClassName = "w-4",
  bottomClassName = "w-4",
}: {
  gapClassName: string;
  topClassName?: string;
  bottomClassName?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={`flex flex-col items-center ${gapClassName}`}
    >
      <span className={`h-0.5 rounded-full bg-current ${topClassName}`} />
      <span className={`h-0.5 rounded-full bg-current ${bottomClassName}`} />
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

function updateOverrides(
  presentation: PdfPresentation,
  nextOverrides: Partial<PdfPresentation["overrides"]>,
): PdfPresentation {
  return {
    ...presentation,
    overrides: {
      ...presentation.overrides,
      ...nextOverrides,
    },
  };
}

export const previewControlDefinitions = [
  {
    id: "layout",
    kind: "select",
    label: "Layout",
    value: (presentation) => presentation.layoutId,
    update: (nextValue, presentation) => ({
      ...presentation,
      layoutId: nextValue as PdfPresentation["layoutId"],
    }),
    options: pdfLayoutIds.map((value) => ({
      value,
      label: pdfLayoutLabels[value],
    })),
  },
  {
    id: "type-scale",
    kind: "select",
    label: "Type scale",
    value: (presentation) => presentation.overrides.typeScale,
    update: (nextValue, presentation) =>
      updateOverrides(presentation, {
        typeScale: nextValue as PdfPresentation["overrides"]["typeScale"],
      }),
    options: pdfTypeScaleIds.map((value) => ({
      value,
      label: pdfTypeScaleLabels[value],
    })),
  },
  {
    id: "line-height",
    kind: "toggle-group",
    label: "Line height",
    value: (presentation) => presentation.overrides.lineHeight,
    update: (nextValue, presentation) =>
      updateOverrides(presentation, {
        lineHeight: nextValue as PdfPresentation["overrides"]["lineHeight"],
      }),
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
    value: (presentation) => presentation.overrides.spacing,
    update: (nextValue, presentation) =>
      updateOverrides(presentation, {
        spacing: nextValue as PdfPresentation["overrides"]["spacing"],
      }),
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
    value: (presentation) => presentation.overrides.accentTone,
    update: (nextValue, presentation) =>
      updateOverrides(presentation, {
        accentTone: nextValue as PdfPresentation["overrides"]["accentTone"],
      }),
    options: pdfAccentTones.map((value) => ({
      value,
      label: pdfAccentToneLabels[value],
      renderOption: () => (
        <span
          aria-hidden="true"
          className="size-3 rounded-full border border-black/10"
          style={{
            backgroundColor:
              value === "slate"
                ? "#475569"
                : value === "blue"
                  ? "#2563eb"
                  : value === "emerald"
                    ? "#059669"
                    : value === "rose"
                      ? "#e11d48"
                      : "#d97706",
          }}
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
    value: (presentation) => presentation.overrides.accentStrength,
    update: (nextValue, presentation) =>
      updateOverrides(presentation, {
        accentStrength:
          nextValue as PdfPresentation["overrides"]["accentStrength"],
      }),
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
  "type-scale": TypeIcon,
};
