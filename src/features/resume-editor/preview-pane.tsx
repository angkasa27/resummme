"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { SettingsIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
import { ResumeDocument } from "@/features/resume-editor/preview/resume-document";
import { normalizePdfPresentation } from "@/lib/resume/pdf-presentation";
import type { ResumeDraft } from "@/lib/resume/schema";
import type {
  PreviewControlDefinition,
  PreviewPaneProps,
  PreviewToolbarContentProps,
} from "@/features/resume-editor/preview/types";

type ToolbarSelectProps = {
  controlId: string;
  ariaLabel: string;
  value: string;
  options: ReadonlyArray<PreviewControlDefinition["options"][number]>;
  onValueChange: (value: string | null) => void;
};

function ToolbarSelect({
  controlId,
  ariaLabel,
  value,
  options,
  onValueChange,
}: ToolbarSelectProps) {
  const Icon =
    previewControlLabelIcons[controlId as keyof typeof previewControlLabelIcons];

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
  value: string;
  options: ReadonlyArray<PreviewControlDefinition["options"][number]>;
  onValueChange: (value: string) => void;
};

function ToolbarToggleGroup({
  ariaLabel,
  value,
  options,
  onValueChange,
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
          if (!nextSelection) return;
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
              {option.renderTooltip ? option.renderTooltip() : `${ariaLabel}: ${option.label}`}
            </TooltipContent>
          </Tooltip>
        ))}
      </ToggleGroup>
    </div>
  );
}

function PreviewToolbarContent({
  presentation,
  onChange,
  definitions = previewControlDefinitions,
}: PreviewToolbarContentProps) {
  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-sm font-semibold">Style Settings</h3>

      <div className="flex flex-col gap-3">
        {definitions
          .filter((definition) => definition.kind === "select")
          .map((definition) => (
            <ToolbarSelect
              key={definition.id}
              controlId={definition.id}
              ariaLabel={definition.label}
              value={definition.value(presentation)}
              options={definition.options}
              onValueChange={(value) => {
                if (!value) return;
                onChange(definition.update(value, presentation));
              }}
            />
          ))}
      </div>

      <Separator />

      <div className="flex flex-col gap-3">
        {definitions
          .filter(
            (definition) =>
              definition.kind === "toggle-group" &&
              !definition.id.startsWith("accent-"),
          )
          .map((definition) => (
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

      <div className="flex flex-col gap-3">
        {definitions
          .filter(
            (definition) =>
              definition.kind === "toggle-group" &&
              definition.id.startsWith("accent-"),
          )
          .map((definition) => (
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
    </div>
  );
}

function PreviewToolbar({
  presentation,
  onChange,
}: {
  presentation: ResumeDraft["pdfPresentation"];
  onChange: (nextPresentation: ResumeDraft["pdfPresentation"]) => void;
}) {
  return (
    <div className="flex h-12 shrink-0 items-center justify-between gap-2 border-b bg-background px-4">
      <span className="text-xs font-medium text-muted-foreground">
        Preview
      </span>
      <Popover>
        <PopoverTrigger
          render={
            <Button type="button" variant="outline" size="sm">
              <SettingsIcon data-icon="inline-start" />
              Style Settings
            </Button>
          }
        />
        <PopoverContent align="end" className="w-80">
          <PreviewToolbarContent
            presentation={presentation}
            onChange={onChange}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}

type PreviewSheetProps = {
  draft: ResumeDraft;
  presentation: ResumeDraft["pdfPresentation"];
};

function PreviewSheet({ draft, presentation }: PreviewSheetProps) {
  const previewViewportRef = useRef<HTMLDivElement | null>(null);
  const previewSheetRef = useRef<HTMLDivElement | null>(null);
  const [previewScale, setPreviewScale] = useState(1);
  const [previewShellSize, setPreviewShellSize] = useState({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    const updatePreviewScale = () => {
      const viewport = previewViewportRef.current;
      const sheet = previewSheetRef.current;

      if (!viewport || !sheet) {
        return;
      }

      const computedStyles = window.getComputedStyle(viewport);
      const horizontalPadding =
        Number.parseFloat(computedStyles.paddingLeft || "0") +
        Number.parseFloat(computedStyles.paddingRight || "0");
      const viewportWidth = Math.max(
        0,
        viewport.clientWidth - horizontalPadding,
      );
      const sheetWidth = sheet.offsetWidth;
      const sheetHeight = sheet.offsetHeight;

      if (!viewportWidth || !sheetWidth || !sheetHeight) {
        return;
      }

      const nextScale = Math.min(1, viewportWidth / sheetWidth);

      setPreviewScale(nextScale);
      setPreviewShellSize({
        width: sheetWidth * nextScale,
        height: sheetHeight * nextScale,
      });
    };

    updatePreviewScale();

    if (typeof ResizeObserver !== "undefined") {
      const resizeObserver = new ResizeObserver(updatePreviewScale);

      if (previewViewportRef.current) {
        resizeObserver.observe(previewViewportRef.current);
      }

      if (previewSheetRef.current) {
        resizeObserver.observe(previewSheetRef.current);
      }

      return () => {
        resizeObserver.disconnect();
      };
    }

    window.addEventListener("resize", updatePreviewScale);
    return () => {
      window.removeEventListener("resize", updatePreviewScale);
    };
  }, [draft, presentation]);

  return (
    <div className="h-full min-h-0 w-full overflow-y-auto overflow-x-hidden">
      <div
        ref={previewViewportRef}
        className="w-full min-w-0 overflow-hidden px-4 py-6 sm:px-6 sm:py-8"
      >
        <div className="flex w-full min-w-0 justify-center overflow-hidden">
          <div
            data-testid="resume-preview-scale-shell"
            className="relative shrink-0 overflow-hidden"
            style={{
              width: previewShellSize.width || undefined,
              height: previewShellSize.height || undefined,
            }}
          >
            <div
              ref={previewSheetRef}
              className="absolute left-0 top-0"
              style={{
                transform:
                  previewScale < 1 ? `scale(${previewScale})` : undefined,
                transformOrigin: "top left",
              }}
            >
              <ResumeDocument
                draft={{
                  ...draft,
                  pdfPresentation: presentation,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function PreviewPane({
  draft,
  onSavePdfPresentation,
}: PreviewPaneProps) {
  const presentation = useMemo(
    () => normalizePdfPresentation(draft.pdfPresentation),
    [draft.pdfPresentation],
  );

  return (
    <div className="h-full w-full">
      <PreviewToolbar
        presentation={presentation}
        onChange={onSavePdfPresentation}
      />
      <PreviewSheet draft={draft} presentation={presentation} />
    </div>
  );
}

export { PreviewToolbarContent };
