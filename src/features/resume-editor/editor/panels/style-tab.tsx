"use client";

import type { ReactNode } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Field,
  FieldContent,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { ColorControl } from "@/features/resume-editor/editor/panels/color-control";
import {
  pdfFontScaleIds,
  pdfFontScaleLabels,
  pdfLineHeightIds,
  pdfLineHeightLabels,
  pdfPaperSizes,
  pdfPaperSizeLabels,
  pdfPhotoShapeIds,
  pdfPhotoShapeLabels,
  pdfSpacingIds,
  pdfSpacingLabels,
  type PdfPhotoShapeId,
  type PdfPresentation,
} from "@/features/resume-editor/domain/presentation/pdf-presentation";
import {
  RESUME_FONTS,
  getFont,
  type ResumeFontId,
} from "@/features/resume-editor/domain/presentation/font-collection";

type StyleTabProps = {
  presentation: PdfPresentation;
  onChange: (next: PdfPresentation) => void;
};

type SpanProps = { span?: 1 | 2 };

type SelectOption = { value: string; label: string };

function SelectField({
  id,
  label,
  value,
  options,
  onChange,
  span,
}: {
  id: string;
  label: string;
  value: string;
  options: ReadonlyArray<SelectOption>;
  onChange: (value: string) => void;
} & SpanProps) {
  return (
    <Field className={span === 2 ? "col-span-full" : undefined}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <FieldContent>
        <Select
          value={value}
          onValueChange={(next) => {
            if (!next) return;
            onChange(next);
          }}
        >
          <SelectTrigger id={id} size="sm" aria-label={label} className="w-full">
            <SelectValue>
              {options.find((option) => option.value === value)?.label ??
                value}
            </SelectValue>
          </SelectTrigger>
          <SelectContent align="start">
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </FieldContent>
    </Field>
  );
}

type ToggleOption = {
  value: string;
  label: string;
  renderOption?: () => ReactNode;
  renderTooltip?: () => ReactNode;
};

function ToggleField({
  label,
  value,
  options,
  onChange,
  span,
}: {
  label: string;
  value: string;
  options: ReadonlyArray<ToggleOption>;
  onChange: (value: string) => void;
} & SpanProps) {
  return (
    <Field className={span === 2 ? "col-span-full" : undefined}>
      {/* No htmlFor: a toggle group has no single focusable target, so the
          group carries its own aria-label. */}
      <FieldLabel>{label}</FieldLabel>
      <FieldContent>
        <ToggleGroup
          multiple
          aria-label={label}
          value={[value]}
          variant="outline"
          size="sm"
          className={cn(
            "grid w-full",
            options.length === 4 ? "grid-cols-4" : "grid-cols-3",
          )}
          onValueChange={(nextValue) => {
            const next = nextValue.at(-1);
            if (!next) return;
            onChange(next);
          }}
        >
          {options.map((option) => (
            <ToggleFieldItem
              key={option.value}
              ariaLabel={`${label} ${option.label}`}
              option={option}
            />
          ))}
        </ToggleGroup>
      </FieldContent>
    </Field>
  );
}

function ToggleFieldItem({
  ariaLabel,
  option,
}: {
  ariaLabel: string;
  option: ToggleOption;
}) {
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <ToggleGroupItem
            value={option.value}
            aria-label={ariaLabel}
            className="h-8 w-full px-0"
          >
            {option.renderOption ? option.renderOption() : option.label}
          </ToggleGroupItem>
        }
      />
      <TooltipContent>
        {option.renderTooltip ? option.renderTooltip() : ariaLabel}
      </TooltipContent>
    </Tooltip>
  );
}

const sansOptions = RESUME_FONTS.filter((f) => f.category === "sans");
const serifOptions = RESUME_FONTS.filter((f) => f.category === "serif");

function FontFamilyField({
  presentation,
  onChange,
  span,
}: {
  presentation: PdfPresentation;
  onChange: (next: PdfPresentation) => void;
} & SpanProps) {
  const selectedFont = getFont(presentation.fontFamilyId);

  return (
    <Field className={span === 2 ? "col-span-full" : undefined}>
      <FieldLabel htmlFor="font-family">Font family</FieldLabel>
      <FieldContent>
        <Select
          value={presentation.fontFamilyId}
          onValueChange={(id) =>
            onChange({ ...presentation, fontFamilyId: id as ResumeFontId })
          }
        >
          <SelectTrigger
            id="font-family"
            size="sm"
            aria-label="Font family"
            className="w-full"
          >
            <SelectValue>
              <span style={{ fontFamily: selectedFont.stack }}>
                {selectedFont.name}
              </span>
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Sans-serif</SelectLabel>
              {sansOptions.map((font) => (
                <SelectItem key={font.id} value={font.id}>
                  <span style={{ fontFamily: font.stack }}>{font.name}</span>
                </SelectItem>
              ))}
            </SelectGroup>
            <SelectGroup>
              <SelectLabel>Serif</SelectLabel>
              {serifOptions.map((font) => (
                <SelectItem key={font.id} value={font.id}>
                  <span style={{ fontFamily: font.stack }}>{font.name}</span>
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </FieldContent>
    </Field>
  );
}

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

/** Sentinel option value for "use the layout's own photo shape". */
const PHOTO_SHAPE_DEFAULT = "default";

function photoShapeGlyph(shape: PdfPhotoShapeId | typeof PHOTO_SHAPE_DEFAULT) {
  const base = "border-[1.5px] border-current";
  const className =
    shape === "circle"
      ? `size-4 rounded-full ${base}`
      : shape === "rectangle"
        ? `h-4 w-3 rounded-[2px] ${base}`
        : shape === "default"
          ? // Dashed = "follow the layout's default".
            `size-4 rounded-[3px] border-dashed ${base}`
          : `size-4 rounded-[2px] ${base}`;
  return <span aria-hidden="true" className={className} />;
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

const paperSizeOptions = pdfPaperSizes.map((value) => ({
  value,
  label: pdfPaperSizeLabels[value],
}));

const fontScaleOptions = pdfFontScaleIds.map((value) => ({
  value,
  label: pdfFontScaleLabels[value],
}));

const lineHeightOptions = pdfLineHeightIds.map((value) => ({
  value,
  label: pdfLineHeightLabels[value],
  renderOption: () =>
    value === "tight"
      ? spacingGlyph({ gap: 2 })
      : value === "relaxed"
        ? spacingGlyph({ gap: 6 })
        : spacingGlyph({ gap: 4 }),
}));

const spacingOptions = pdfSpacingIds.map((value) => ({
  value,
  label: pdfSpacingLabels[value],
  renderOption: () =>
    value === "compact"
      ? listSpacingGlyph({ gap: 2 })
      : value === "airy"
        ? listSpacingGlyph({ gap: 4 })
        : listSpacingGlyph({ gap: 3 }),
}));

const photoShapeOptions = [
  {
    value: PHOTO_SHAPE_DEFAULT,
    label: "Default",
    renderOption: () => photoShapeGlyph(PHOTO_SHAPE_DEFAULT),
  },
  ...pdfPhotoShapeIds.map((value) => ({
    value,
    label: pdfPhotoShapeLabels[value],
    renderOption: () => photoShapeGlyph(value),
  })),
];

export function StyleTab({ presentation, onChange }: StyleTabProps) {
  return (
    <div className="@container/fields">
      <FieldGroup layout="grid">
        <SelectField
          span={2}
          id="paper-size"
          label="Paper size"
          value={presentation.paperSize}
          options={paperSizeOptions}
          onChange={(value) =>
            onChange({
              ...presentation,
              paperSize: value as PdfPresentation["paperSize"],
            })
          }
        />
        <FontFamilyField presentation={presentation} onChange={onChange} />
        <SelectField
          id="font-scale"
          label="Font size"
          value={presentation.fontScale}
          options={fontScaleOptions}
          onChange={(value) =>
            onChange({
              ...presentation,
              fontScale: value as PdfPresentation["fontScale"],
            })
          }
        />
        <ToggleField
          label="Line height"
          value={presentation.lineHeight}
          options={lineHeightOptions}
          onChange={(value) =>
            onChange({
              ...presentation,
              lineHeight: value as PdfPresentation["lineHeight"],
            })
          }
        />
        <ToggleField
          label="Spacing"
          value={presentation.spacing}
          options={spacingOptions}
          onChange={(value) =>
            onChange({
              ...presentation,
              spacing: value as PdfPresentation["spacing"],
            })
          }
        />
        <ToggleField
          span={2}
          label="Photo shape"
          // "default" → unset photoShape so each layout keeps its own photo style.
          value={presentation.photoShape ?? PHOTO_SHAPE_DEFAULT}
          options={photoShapeOptions}
          onChange={(value) =>
            onChange({
              ...presentation,
              photoShape:
                value === PHOTO_SHAPE_DEFAULT
                  ? undefined
                  : (value as PdfPresentation["photoShape"]),
            })
          }
        />
        <ColorControl
          span={2}
          label="Accent"
          value={presentation.accent}
          onChange={(accent) => onChange({ ...presentation, accent })}
        />
        <ColorControl
          span={2}
          label="Secondary"
          value={presentation.secondary ?? presentation.accent}
          onChange={(secondary) => onChange({ ...presentation, secondary })}
          allowAuto={{
            active: presentation.secondary === undefined,
            onSelect: () => onChange({ ...presentation, secondary: undefined }),
          }}
        />
      </FieldGroup>
    </div>
  );
}
