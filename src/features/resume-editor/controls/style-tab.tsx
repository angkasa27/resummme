"use client";

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
import { ColorControl } from "@/features/resume-editor/controls/color-control";
import { previewControlDefinitions } from "@/features/resume-editor/preview/control-registry";
import type {
  PreviewControlDefinition,
  PreviewControlOption,
} from "@/features/resume-editor/preview/types";
import {
  RESUME_FONTS,
  getFont,
  type ResumeFontId,
} from "@/features/resume-editor/domain/presentation/font-collection";
import type { PdfPresentation } from "@/features/resume-editor/domain/presentation/pdf-presentation";

type StyleTabProps = {
  presentation: PdfPresentation;
  onChange: (next: PdfPresentation) => void;
};

function getControl(id: string): PreviewControlDefinition {
  const def = previewControlDefinitions.find((d) => d.id === id);
  if (!def) throw new Error(`Missing control "${id}"`);
  return def;
}

/** Columns a control takes in the tab's field grid. Mirrors FloatingField. */
type SpanProps = { span?: 1 | 2 };

function spanClass(span: 1 | 2 = 1) {
  return span === 2 ? "col-span-full" : undefined;
}

function SelectField({
  control,
  presentation,
  onChange,
  span,
}: {
  control: PreviewControlDefinition;
  presentation: PdfPresentation;
  onChange: (next: PdfPresentation) => void;
} & SpanProps) {
  return (
    <Field className={spanClass(span)}>
      <FieldLabel htmlFor={control.id}>{control.label}</FieldLabel>
      <FieldContent>
        <Select
          value={control.value(presentation)}
          onValueChange={(value) => {
            if (!value) return;
            onChange(control.update(value, presentation));
          }}
        >
          <SelectTrigger
            id={control.id}
            size="sm"
            aria-label={control.label}
            className="w-full"
          >
            <SelectValue>
              {control.options.find(
                (option) => option.value === control.value(presentation),
              )?.label ?? control.value(presentation)}
            </SelectValue>
          </SelectTrigger>
          <SelectContent align="start">
            {control.options.map((option) => (
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

function ToggleField({
  control,
  presentation,
  onChange,
  span,
}: {
  control: PreviewControlDefinition;
  presentation: PdfPresentation;
  onChange: (next: PdfPresentation) => void;
} & SpanProps) {
  const value = control.value(presentation);
  return (
    <Field className={spanClass(span)}>
      {/* No htmlFor: a toggle group has no single focusable target, so the
          group carries its own aria-label. */}
      <FieldLabel>{control.label}</FieldLabel>
      <FieldContent>
        <ToggleGroup
          multiple
          aria-label={control.label}
          value={[value]}
          variant="outline"
          size="sm"
          className={cn(
            "grid w-full",
            control.options.length === 4 ? "grid-cols-4" : "grid-cols-3",
          )}
          onValueChange={(nextValue) => {
            const next = nextValue.at(-1);
            if (!next) return;
            onChange(control.update(next, presentation));
          }}
        >
          {control.options.map((option) => (
            <ToggleFieldItem
              key={option.value}
              ariaLabel={`${control.label} ${option.label}`}
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
  option: PreviewControlOption;
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
    <Field className={spanClass(span)}>
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

export function StyleTab({ presentation, onChange }: StyleTabProps) {
  const fontScale = getControl("font-scale");
  const paperSize = getControl("paper-size");
  const lineHeight = getControl("line-height");
  const spacing = getControl("spacing");
  const photoShape = getControl("photo-shape");

  return (
    <FieldGroup layout="grid" className="@container/fields">
      <SelectField
        control={paperSize}
        presentation={presentation}
        onChange={onChange}
      />
      <SelectField
        control={fontScale}
        presentation={presentation}
        onChange={onChange}
      />
      <FontFamilyField
        span={2}
        presentation={presentation}
        onChange={onChange}
      />
      <ToggleField
        control={lineHeight}
        presentation={presentation}
        onChange={onChange}
      />
      <ToggleField
        control={spacing}
        presentation={presentation}
        onChange={onChange}
      />
      <ToggleField
        span={2}
        control={photoShape}
        presentation={presentation}
        onChange={onChange}
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
  );
}
