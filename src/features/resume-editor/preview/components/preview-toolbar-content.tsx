"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  previewControlDefinitions,
  previewControlLabelIcons,
} from "@/features/resume-editor/preview/control-registry";
import type {
  PreviewControlDefinition,
  PreviewToolbarContentProps,
} from "@/features/resume-editor/preview/types";
import { ColorControl } from "../../canvas/controls/color-control";

type ToolbarSelectProps = {
  ariaLabel: string;
  controlId: string;
  onValueChange: (value: string | null) => void;
  options: ReadonlyArray<PreviewControlDefinition["options"][number]>;
  value: string;
};

function ToolbarSelect({
  ariaLabel,
  controlId,
  onValueChange,
  options,
  value,
}: ToolbarSelectProps) {
  const Icon =
    previewControlLabelIcons[
      controlId as keyof typeof previewControlLabelIcons
    ];

  return (
    <div className="flex flex-col gap-1.5">
      <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
        {Icon ? <Icon className="size-3.5" /> : null}
        {ariaLabel}
      </label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger size="sm" aria-label={ariaLabel}>
          <SelectValue>
            {options.find((option) => option.value === value)?.label ?? value}
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
    </div>
  );
}

type ToolbarToggleGroupProps = {
  ariaLabel: string;
  onValueChange: (value: string) => void;
  options: ReadonlyArray<PreviewControlDefinition["options"][number]>;
  value: string;
};

function ToolbarToggleGroup({
  ariaLabel,
  onValueChange,
  options,
  value,
}: ToolbarToggleGroupProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs font-medium text-muted-foreground">
        {ariaLabel}
      </span>
      <ToggleGroup
        multiple
        aria-label={ariaLabel}
        value={[value]}
        variant="outline"
        size="sm"
        onValueChange={(nextValue) => {
          const nextSelection = nextValue.at(-1);
          if (!nextSelection) {
            return;
          }

          onValueChange(nextSelection);
        }}
      >
        {options.map((option) => (
          <Tooltip key={option.value}>
            <TooltipTrigger
              render={
                <ToggleGroupItem
                  value={option.value}
                  aria-label={`${ariaLabel} ${option.label}`}
                >
                  {option.renderOption ? option.renderOption() : option.label}
                </ToggleGroupItem>
              }
            />
            <TooltipContent>
              {option.renderTooltip
                ? option.renderTooltip()
                : `${ariaLabel}: ${option.label}`}
            </TooltipContent>
          </Tooltip>
        ))}
      </ToggleGroup>
    </div>
  );
}

export function PreviewToolbarContent({
  presentation,
  onChange,
  showHeading = true,
}: PreviewToolbarContentProps & { showHeading?: boolean }) {
  const definitions = previewControlDefinitions;

  const selects = definitions.filter(
    (definition) => definition.kind === "select",
  );
  const toggles = definitions.filter(
    (definition) => definition.kind === "toggle-group",
  );

  return (
    <div className="flex flex-col gap-4">
      {showHeading ? (
        <h3 className="text-sm font-semibold">Style Settings</h3>
      ) : null}

      <div className="flex flex-col gap-3">
        {selects.map((definition) => (
          <ToolbarSelect
            key={definition.id}
            ariaLabel={definition.label}
            controlId={definition.id}
            value={definition.value(presentation)}
            options={definition.options}
            onValueChange={(value) => {
              if (!value) return;
              onChange(definition.update(value, presentation));
            }}
          />
        ))}
      </div>

      {selects.length > 0 && toggles.length > 0 ? <Separator /> : null}

      <div className="flex flex-col gap-3">
        {toggles.map((definition) => (
          <ToolbarToggleGroup
            key={definition.id}
            ariaLabel={definition.label}
            value={definition.value(presentation)}
            options={definition.options}
            onValueChange={(value) =>
              onChange(definition.update(value, presentation))
            }
          />
        ))}
      </div>
      <Separator />
      <ColorControl
        value={presentation.accent}
        onChange={(accent) => onChange({ ...presentation, accent })}
      />
    </div>
  );
}
