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
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ColorControl } from "@/features/resume-editor/shared/color-control";
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

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="mb-1.5 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
      {children}
    </span>
  );
}

function SelectField({
  control,
  presentation,
  onChange,
  className,
}: {
  control: PreviewControlDefinition;
  presentation: PdfPresentation;
  onChange: (next: PdfPresentation) => void;
  className?: string;
}) {
  return (
    <div className={className}>
      <FieldLabel>{control.label}</FieldLabel>
      <Select
        value={control.value(presentation)}
        onValueChange={(value) => {
          if (!value) return;
          onChange(control.update(value, presentation));
        }}
      >
        <SelectTrigger size="sm" aria-label={control.label} className="w-full">
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
    </div>
  );
}

function ToggleField({
  control,
  presentation,
  onChange,
  className,
}: {
  control: PreviewControlDefinition;
  presentation: PdfPresentation;
  onChange: (next: PdfPresentation) => void;
  className?: string;
}) {
  const value = control.value(presentation);
  return (
    <div className={className}>
      <FieldLabel>{control.label}</FieldLabel>
      <ToggleGroup
        multiple
        aria-label={control.label}
        value={[value]}
        variant="outline"
        size="sm"
        className="grid w-full grid-cols-3"
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
    </div>
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
}: {
  presentation: PdfPresentation;
  onChange: (next: PdfPresentation) => void;
}) {
  const selectedFont = getFont(presentation.fontFamilyId);

  return (
    <div>
      <FieldLabel>Font family</FieldLabel>
      <Select
        value={presentation.fontFamilyId}
        onValueChange={(id) =>
          onChange({ ...presentation, fontFamilyId: id as ResumeFontId })
        }
      >
        <SelectTrigger size="sm" aria-label="Font family" className="w-full">
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
    </div>
  );
}

export function StyleTab({ presentation, onChange }: StyleTabProps) {
  const fontScale = getControl("font-scale");
  const paperSize = getControl("paper-size");
  const pageMargin = getControl("page-margin");
  const lineHeight = getControl("line-height");
  const spacing = getControl("spacing");

  return (
    <div className="grid grid-cols-2 gap-x-3 gap-y-3">
      <SelectField
        control={paperSize}
        presentation={presentation}
        onChange={onChange}
      />
      <SelectField
        control={pageMargin}
        presentation={presentation}
        onChange={onChange}
      />

      <FontFamilyField presentation={presentation} onChange={onChange} />
      <SelectField
        control={fontScale}
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

      <div className="col-span-2 pt-1">
        <ColorControl
          label="Accent"
          value={presentation.accent}
          onChange={(accent) => onChange({ ...presentation, accent })}
        />
      </div>

      <div className="col-span-2 pt-1">
        <ColorControl
          label="Secondary"
          value={presentation.secondary ?? presentation.accent}
          onChange={(secondary) => onChange({ ...presentation, secondary })}
          allowAuto={{
            active: presentation.secondary === undefined,
            onSelect: () => onChange({ ...presentation, secondary: undefined }),
          }}
        />
      </div>
    </div>
  );
}
