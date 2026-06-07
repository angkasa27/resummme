import {
  LayoutTemplateIcon,
  TypeIcon,
} from "lucide-react";

import {
  pdfFontScaleIds,
  pdfFontScaleLabels,
  pdfLineHeightIds,
  pdfLineHeightLabels,
  pdfPageMargins,
  pdfPageMarginLabels,
  pdfPaperSizes,
  pdfPaperSizeLabels,
  pdfSpacingIds,
  pdfSpacingLabels,
  pdfTemplateIds,
  pdfTemplateLabels,
  type PdfPresentation,
} from "@/features/resume-editor/domain/presentation/pdf-presentation";
import type { PreviewControlDefinition } from "@/features/resume-editor/preview/types";

function spacingGlyph({ gap }: { gap: number }) {
  return (
    <span
      aria-hidden="true"
      className="flex flex-col items-center"
      style={{ gap: `${gap}px` }}
    >
      <span className="h-0.5 w-4 rounded-full bg-current" />
      <span className="h-0.5 w-4 rounded-full bg-current" />
    </span>
  );
}

function listSpacingGlyph({ gap }: { gap: number }) {
  const rowKeys = ["first", "second", "third"] as const;
  return (
    <span
      aria-hidden="true"
      className="flex flex-col"
      style={{ gap: `${gap}px` }}
    >
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
    id: "paper-size",
    kind: "select",
    label: "Paper size",
    value: (presentation) => presentation.paperSize,
    update: (nextValue, presentation) =>
      set(presentation, "paperSize", nextValue as PdfPresentation["paperSize"]),
    options: pdfPaperSizes.map((value) => ({
      value,
      label: pdfPaperSizeLabels[value],
    })),
  },
  {
    id: "page-margin",
    kind: "select",
    label: "Page margin",
    value: (presentation) => presentation.pageMargin,
    update: (nextValue, presentation) =>
      set(
        presentation,
        "pageMargin",
        nextValue as PdfPresentation["pageMargin"],
      ),
    options: pdfPageMargins.map((value) => ({
      value,
      label: pdfPageMarginLabels[value],
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
          ? spacingGlyph({ gap: 2 })
          : value === "relaxed"
            ? spacingGlyph({ gap: 6 })
            : spacingGlyph({ gap: 4 }),
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
          ? listSpacingGlyph({ gap: 2 })
          : value === "airy"
            ? listSpacingGlyph({ gap: 4 })
            : listSpacingGlyph({ gap: 3 }),
    })),
  },
] as const satisfies ReadonlyArray<PreviewControlDefinition>;

export const previewControlLabelIcons = {
  template: LayoutTemplateIcon,
  "font-scale": TypeIcon,
};
