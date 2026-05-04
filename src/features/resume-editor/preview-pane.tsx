"use client";

import { useEffect, useState, type ComponentType, type ReactNode } from "react";
import {
  BetweenHorizontalStartIcon,
  BetweenVerticalStartIcon,
  LayoutTemplateIcon,
  ListIcon,
  SquareStackIcon,
  TypeIcon,
} from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ResumeDocument } from "@/features/resume-editor/preview/resume-document";
import {
  normalizePdfPresentation,
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
} from "@/lib/resume/pdf-presentation";
import type { ResumeDraft } from "@/lib/resume/schema";

type PreviewPaneProps = {
  draft: ResumeDraft;
  onSavePdfPresentation: (
    pdfPresentation: ResumeDraft["pdfPresentation"],
  ) => void;
};

type ToolbarSelectProps = {
  ariaLabel: string;
  icon: ComponentType<{ className?: string }>;
  value: string;
  options: ReadonlyArray<string>;
  labels: Record<string, string>;
  onValueChange: (value: string | null) => void;
};

function ToolbarSelect({
  ariaLabel,
  icon: Icon,
  value,
  options,
  labels,
  onValueChange,
}: ToolbarSelectProps) {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger size="sm" aria-label={ariaLabel} title={ariaLabel}>
        <Icon className="size-3.5 text-muted-foreground" />
        <SelectValue>{labels[value] ?? value}</SelectValue>
      </SelectTrigger>
      <SelectContent align="start">
        {options.map((option) => (
          <SelectItem key={option} value={option}>
            {labels[option] ?? option}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

type ToolbarToggleGroupProps = {
  ariaLabel: string;
  value: string;
  options: ReadonlyArray<string>;
  labels: Record<string, string>;
  onValueChange: (value: string) => void;
  renderOption?: (option: string) => ReactNode;
  renderTooltip?: (option: string) => ReactNode;
  itemClassName?: string;
};

function ToolbarToggleGroup({
  ariaLabel,
  value,
  options,
  labels,
  onValueChange,
  renderOption,
  renderTooltip,
}: ToolbarToggleGroupProps) {
  return (
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
        <Tooltip key={option}>
          <TooltipTrigger
            render={
              <ToggleGroupItem
                value={option}
                aria-label={`${ariaLabel} ${labels[option] ?? option}`}
              >
                {renderOption
                  ? renderOption(option)
                  : (labels[option] ?? option)}
              </ToggleGroupItem>
            }
          />
          <TooltipContent>
            {renderTooltip
              ? renderTooltip(option)
              : `${ariaLabel}: ${labels[option] ?? option}`}
          </TooltipContent>
        </Tooltip>
      ))}
    </ToggleGroup>
  );
}

function SpacingGlyph({
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

function ListSpacingGlyph({ gapClassName }: { gapClassName: string }) {
  return (
    <span aria-hidden="true" className={`flex flex-col ${gapClassName}`}>
      {[0, 1, 2].map((index) => (
        <span key={index} className="flex items-center gap-1">
          <span className="size-1 rounded-full bg-current" />
          <span className="h-0.5 w-3.5 rounded-full bg-current" />
        </span>
      ))}
    </span>
  );
}

function StrengthGlyph({
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

export function PreviewPane({
  draft,
  onSavePdfPresentation,
}: PreviewPaneProps) {
  const [presentation, setPresentation] = useState(() =>
    normalizePdfPresentation(draft.pdfPresentation),
  );

  useEffect(() => {
    setPresentation(normalizePdfPresentation(draft.pdfPresentation));
  }, [draft.pdfPresentation]);

  function updatePresentation(
    updates: Partial<ResumeDraft["pdfPresentation"]["overrides"]> & {
      layoutId?: ResumeDraft["pdfPresentation"]["layoutId"];
    },
  ) {
    const { layoutId, ...overrideUpdates } = updates;
    const nextPresentation = {
      layoutId: layoutId ?? presentation.layoutId,
      overrides: {
        ...presentation.overrides,
        ...overrideUpdates,
      },
    };

    setPresentation(nextPresentation);
    onSavePdfPresentation(nextPresentation);
  }

  return (
    <div className="h-full min-h-0 overflow-y-auto overflow-x-hidden">
      <div className="sticky top-0 z-10 border-b bg-background/95 px-3 py-3 backdrop-blur supports-backdrop-filter:bg-background/80 sm:px-4">
        <div
          role="toolbar"
          aria-label="PDF style"
          className="flex flex-wrap items-center gap-2"
        >
          <ToolbarSelect
            ariaLabel="Layout"
            icon={LayoutTemplateIcon}
            value={presentation.layoutId}
            options={pdfLayoutIds}
            labels={pdfLayoutLabels}
            onValueChange={(value) => {
              if (!value) return;
              updatePresentation({
                layoutId: value as ResumeDraft["pdfPresentation"]["layoutId"],
              });
            }}
          />
          <ToolbarSelect
            ariaLabel="Type scale"
            icon={TypeIcon}
            value={presentation.overrides.typeScale}
            options={pdfTypeScaleIds}
            labels={pdfTypeScaleLabels}
            onValueChange={(value) => {
              if (!value) return;
              updatePresentation({
                typeScale:
                  value as ResumeDraft["pdfPresentation"]["overrides"]["typeScale"],
              });
            }}
          />
          <ToolbarToggleGroup
            ariaLabel="Line height"
            value={presentation.overrides.lineHeight}
            options={pdfLineHeightIds}
            labels={pdfLineHeightLabels}
            onValueChange={(value) =>
              updatePresentation({
                lineHeight:
                  value as ResumeDraft["pdfPresentation"]["overrides"]["lineHeight"],
              })
            }
            itemClassName="px-2"
            renderOption={(option) => {
              if (option === "tight") {
                return <SpacingGlyph gapClassName="gap-0.5" />;
              }

              if (option === "relaxed") {
                return <SpacingGlyph gapClassName="gap-1.5" />;
              }

              return <SpacingGlyph gapClassName="gap-1" />;
            }}
          />
          <ToolbarToggleGroup
            ariaLabel="Section spacing"
            value={presentation.overrides.sectionSpacing}
            options={pdfSpacingIds}
            labels={pdfSpacingLabels}
            onValueChange={(value) =>
              updatePresentation({
                sectionSpacing:
                  value as ResumeDraft["pdfPresentation"]["overrides"]["sectionSpacing"],
              })
            }
            itemClassName="px-2"
            renderOption={(option) => {
              if (option === "compact") {
                return (
                  <SpacingGlyph
                    gapClassName="gap-0.5"
                    topClassName="w-4"
                    bottomClassName="w-5"
                  />
                );
              }

              if (option === "airy") {
                return (
                  <SpacingGlyph
                    gapClassName="gap-2"
                    topClassName="w-4"
                    bottomClassName="w-5"
                  />
                );
              }

              return (
                <SpacingGlyph
                  gapClassName="gap-1"
                  topClassName="w-4"
                  bottomClassName="w-5"
                />
              );
            }}
            renderTooltip={(option) => (
              <span className="inline-flex items-center gap-1.5">
                <BetweenVerticalStartIcon className="size-3" />
                Section spacing:{" "}
                {pdfSpacingLabels[option as keyof typeof pdfSpacingLabels]}
              </span>
            )}
          />
          <ToolbarToggleGroup
            ariaLabel="Item spacing"
            value={presentation.overrides.itemSpacing}
            options={pdfSpacingIds}
            labels={pdfSpacingLabels}
            onValueChange={(value) =>
              updatePresentation({
                itemSpacing:
                  value as ResumeDraft["pdfPresentation"]["overrides"]["itemSpacing"],
              })
            }
            itemClassName="px-2"
            renderOption={(option) => {
              if (option === "compact") {
                return <ListSpacingGlyph gapClassName="gap-0.5" />;
              }

              if (option === "airy") {
                return <ListSpacingGlyph gapClassName="gap-1.5" />;
              }

              return <ListSpacingGlyph gapClassName="gap-1" />;
            }}
            renderTooltip={(option) => (
              <span className="inline-flex items-center gap-1.5">
                <ListIcon className="size-3" />
                Item spacing:{" "}
                {pdfSpacingLabels[option as keyof typeof pdfSpacingLabels]}
              </span>
            )}
          />
          <ToolbarToggleGroup
            ariaLabel="Accent tone"
            value={presentation.overrides.accentTone}
            options={pdfAccentTones}
            labels={pdfAccentToneLabels}
            onValueChange={(value) =>
              updatePresentation({
                accentTone:
                  value as ResumeDraft["pdfPresentation"]["overrides"]["accentTone"],
              })
            }
            itemClassName="px-2"
            renderOption={(option) => (
              <span
                aria-hidden="true"
                className="size-3 rounded-full border border-black/10"
                style={{
                  backgroundColor:
                    option === "slate"
                      ? "#475569"
                      : option === "blue"
                        ? "#2563eb"
                        : option === "emerald"
                          ? "#059669"
                          : option === "rose"
                            ? "#e11d48"
                            : "#d97706",
                }}
              />
            )}
            renderTooltip={(option) => (
              <span className="inline-flex items-center gap-1.5">
                <SquareStackIcon className="size-3" />
                Accent tone:{" "}
                {
                  pdfAccentToneLabels[
                    option as keyof typeof pdfAccentToneLabels
                  ]
                }
              </span>
            )}
          />
          <ToolbarToggleGroup
            ariaLabel="Accent strength"
            value={presentation.overrides.accentStrength}
            options={pdfAccentStrengths}
            labels={pdfAccentStrengthLabels}
            onValueChange={(value) =>
              updatePresentation({
                accentStrength:
                  value as ResumeDraft["pdfPresentation"]["overrides"]["accentStrength"],
              })
            }
            itemClassName="px-2"
            renderOption={(option) => {
              if (option === "soft") {
                return (
                  <StrengthGlyph
                    widthClassName="w-1"
                    opacityClassName="opacity-55"
                  />
                );
              }

              if (option === "strong") {
                return (
                  <StrengthGlyph
                    widthClassName="w-1.5"
                    opacityClassName="opacity-100"
                  />
                );
              }

              return (
                <StrengthGlyph
                  widthClassName="w-1.25"
                  opacityClassName="opacity-75"
                />
              );
            }}
            renderTooltip={(option) => (
              <span className="inline-flex items-center gap-1.5">
                <BetweenHorizontalStartIcon className="size-3" />
                Accent strength:{" "}
                {
                  pdfAccentStrengthLabels[
                    option as keyof typeof pdfAccentStrengthLabels
                  ]
                }
              </span>
            )}
          />
        </div>
      </div>

      <div className="flex justify-center px-3 py-4 sm:px-4 sm:py-6">
        <ResumeDocument
          draft={{
            ...draft,
            pdfPresentation: presentation,
          }}
        />
      </div>
    </div>
  );
}
