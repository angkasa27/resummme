import {
  BetweenVerticalStartIcon,
  LayoutTemplateIcon,
  TypeIcon,
} from "lucide-react";

import {
  pdfFontScaleIds,
  pdfFontScaleLabels,
  pdfLineHeightIds,
  pdfLineHeightLabels,
  pdfSpacingIds,
  pdfSpacingLabels,
  pdfTemplateIds,
  pdfTemplateLabels,
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

function set<K extends keyof PdfPresentation>(
  presentation: PdfPresentation,
  key: K,
  value: PdfPresentation[K],
): PdfPresentation {
  return { ...presentation, [key]: value };
}

export const previewControlDefinitions = [
  {
    id: "template",
    kind: "select",
    label: "Template",
    value: (presentation) => presentation.templateId,
    update: (nextValue, presentation) =>
      set(
        presentation,
        "templateId",
        nextValue as PdfPresentation["templateId"],
      ),
    options: pdfTemplateIds.map((value) => ({
      value,
      label: pdfTemplateLabels[value],
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
          ? listSpacingGlyph({ gapClassName: "gap-0.2" })
          : value === "airy"
            ? listSpacingGlyph({ gapClassName: "gap-1" })
            : listSpacingGlyph({ gapClassName: "gap-0.5" }),
      renderTooltip: () => (
        <span className="inline-flex items-center gap-1.5">
          <BetweenVerticalStartIcon className="size-3" />
          Spacing: {pdfSpacingLabels[value]}
        </span>
      ),
    })),
  },
] as const satisfies ReadonlyArray<PreviewControlDefinition>;

export const previewControlLabelIcons = {
  template: LayoutTemplateIcon,
  "font-scale": TypeIcon,
};
