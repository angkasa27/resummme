"use client";

import {
  useEffect,
  useRef,
  useState,
  type ComponentType,
  type ReactNode,
} from "react";
import {
  BetweenHorizontalStartIcon,
  BetweenVerticalStartIcon,
  LayoutTemplateIcon,
  ListIcon,
  SettingsIcon,
  SquareStackIcon,
  TypeIcon,
} from "lucide-react";

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
    <div className="flex flex-col gap-1.5">
      <label className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
        <Icon className="size-3.5" />
        {ariaLabel}
      </label>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger size="sm" aria-label={ariaLabel}>
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
    </div>
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
    </div>
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
  const previewViewportRef = useRef<HTMLDivElement | null>(null);
  const previewSheetRef = useRef<HTMLDivElement | null>(null);
  const [presentation, setPresentation] = useState(() =>
    normalizePdfPresentation(draft.pdfPresentation),
  );
  const [previewScale, setPreviewScale] = useState(1);
  const [previewShellSize, setPreviewShellSize] = useState({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    setPresentation(normalizePdfPresentation(draft.pdfPresentation));
  }, [draft.pdfPresentation]);

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
      const resizeObserver = new ResizeObserver(() => {
        updatePreviewScale();
      });

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
    <div className="h-full w-full">
      {/* Compact toolbar with settings in popover */}
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
            <div className="flex flex-col gap-4">
              <h3 className="text-sm font-semibold">Style Settings</h3>

              {/* Layout & Typography */}
              <div className="flex flex-col gap-3">
                <ToolbarSelect
                  ariaLabel="Layout"
                  icon={LayoutTemplateIcon}
                  value={presentation.layoutId}
                  options={pdfLayoutIds}
                  labels={pdfLayoutLabels}
                  onValueChange={(value) => {
                    if (!value) return;
                    updatePresentation({
                      layoutId:
                        value as ResumeDraft["pdfPresentation"]["layoutId"],
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
              </div>

              <Separator />

              {/* Spacing */}
              <div className="flex flex-col gap-3">
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
                  renderOption={(option) => {
                    if (option === "tight")
                      return <SpacingGlyph gapClassName="gap-0.5" />;
                    if (option === "relaxed")
                      return <SpacingGlyph gapClassName="gap-1.5" />;
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
                  renderOption={(option) => {
                    if (option === "compact")
                      return (
                        <SpacingGlyph
                          gapClassName="gap-0.5"
                          topClassName="w-4"
                          bottomClassName="w-5"
                        />
                      );
                    if (option === "airy")
                      return (
                        <SpacingGlyph
                          gapClassName="gap-2"
                          topClassName="w-4"
                          bottomClassName="w-5"
                        />
                      );
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
                      {
                        pdfSpacingLabels[
                          option as keyof typeof pdfSpacingLabels
                        ]
                      }
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
                  renderOption={(option) => {
                    if (option === "compact")
                      return <ListSpacingGlyph gapClassName="gap-0.5" />;
                    if (option === "airy")
                      return <ListSpacingGlyph gapClassName="gap-1.5" />;
                    return <ListSpacingGlyph gapClassName="gap-1" />;
                  }}
                  renderTooltip={(option) => (
                    <span className="inline-flex items-center gap-1.5">
                      <ListIcon className="size-3" />
                      Item spacing:{" "}
                      {
                        pdfSpacingLabels[
                          option as keyof typeof pdfSpacingLabels
                        ]
                      }
                    </span>
                  )}
                />
              </div>

              <Separator />

              {/* Accent */}
              <div className="flex flex-col gap-3">
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
                  renderOption={(option) => {
                    if (option === "soft")
                      return (
                        <StrengthGlyph
                          widthClassName="w-1"
                          opacityClassName="opacity-55"
                        />
                      );
                    if (option === "strong")
                      return (
                        <StrengthGlyph
                          widthClassName="w-1.5"
                          opacityClassName="opacity-100"
                        />
                      );
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
          </PopoverContent>
        </Popover>
      </div>

      <div className="h-full min-h-0 w-full overflow-y-auto overflow-x-hidden">
        {/* Resume document with paper styling */}
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
    </div>
  );
}
