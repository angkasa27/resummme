"use client";

import React, { cloneElement } from "react";
import type { ReactElement, ReactNode } from "react";
import {
  ChevronDownIcon,
  DownloadIcon,
  FileJsonIcon,
  PaletteIcon,
  PrinterIcon,
  SparklesIcon,
  TelescopeIcon,
  UploadIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useElementWidth } from "@/hooks/use-element-width";
import { useIsMobile } from "@/hooks/use-mobile";
import type { EditorPanelKey } from "@/features/resume-editor/domain/sections/section-metadata";
import type { PdfPresentation } from "@/features/resume-editor/domain/presentation/pdf-presentation";
import type { ResumeDraft } from "@/features/resume-editor/domain/schema";
import type { PreviewDocumentActions } from "@/features/resume-editor/preview/types";
import { InsightsTab } from "@/features/resume-editor/shared/insights/insights-tab";
import { StyleTab } from "@/features/resume-editor/shared/style-tab";

type PreviewToolbarProps = {
  draft: ResumeDraft;
  presentation: PdfPresentation;
  onChange: (nextPresentation: PdfPresentation) => void;
  onOpenSection?: (panel: EditorPanelKey) => void;
  documentActions: PreviewDocumentActions;
};

// Width thresholds (toolbar clientWidth, px) at which labels appear. The toolbar
// sits over a user-resizable pane, so we measure the toolbar itself rather than
// the viewport. Secondary controls (Style/Insights/JSON) shed their labels
// first; the two highlighted actions (Extract, Export PDF) keep theirs longest.
const ALL_LABELS_WIDTH = 640;
const PRIMARY_LABELS_WIDTH = 480;
const PREVIEW_LABEL_WIDTH = 360;

/**
 * Builds a single toolbar button. When `compact`, it renders a proper square
 * icon button (`size="icon-sm"`) with an aria-label; otherwise icon + label.
 * Returned as an element so it can be used directly or as a menu/popover
 * trigger via the base-ui `render` prop.
 */
function toolbarButton({
  compact,
  icon,
  label,
  trailing,
  variant = "outline",
  ...props
}: {
  compact: boolean;
  icon: ReactElement<{ "data-icon"?: string }>;
  label: string;
  trailing?: ReactNode;
} & React.ComponentProps<typeof Button>) {
  return (
    <Button
      type="button"
      variant={variant}
      size={compact ? "icon-sm" : "sm"}
      aria-label={label}
      {...props}
    >
      {compact ? icon : cloneElement(icon, { "data-icon": "inline-start" })}
      {compact ? null : label}
      {compact ? null : trailing}
    </Button>
  );
}

export function PreviewToolbar({
  draft,
  presentation,
  onChange,
  onOpenSection,
  documentActions,
}: PreviewToolbarProps) {
  const [ref, width] = useElementWidth<HTMLDivElement>();
  const isMobile = useIsMobile();

  // Until measured (width === 0), assume the widest layout to avoid a flash of
  // icon-only buttons on initial desktop render.
  const measured = width > 0;
  const showAllLabels = !measured || width >= ALL_LABELS_WIDTH;
  const showPrimaryLabels = !measured || width >= PRIMARY_LABELS_WIDTH;
  const showPreviewLabel = !measured || width >= PREVIEW_LABEL_WIDTH;

  const {
    onExtractCv,
    onImportJson,
    onExportJson,
    onExportPdf,
    isExportingPdf = false,
    isImportingPdf = false,
  } = documentActions;

  return (
    <div
      ref={ref}
      className="flex h-12 shrink-0 items-center gap-2 border-b bg-background px-4"
    >
      {/* Mobile: reach the section sidebar from the preview view. Desktop keeps
          the trigger in the form pane header instead. */}
      <SidebarTrigger className="-ml-1 lg:hidden" />
      {showPreviewLabel ? (
        <span className="text-xs font-medium text-muted-foreground">
          Preview
        </span>
      ) : null}

      <div className="ml-auto flex items-center gap-1.5">
        {/* Preview-specific controls */}
        <AdaptivePanel
          label="Style"
          icon={<PaletteIcon />}
          compact={!showAllLabels}
          isMobile={isMobile}
        >
          <StyleTab presentation={presentation} onChange={onChange} />
        </AdaptivePanel>

        <AdaptivePanel
          label="Insights"
          icon={<TelescopeIcon />}
          compact={!showAllLabels}
          isMobile={isMobile}
        >
          <InsightsTab draft={draft} onOpenSection={onOpenSection} />
        </AdaptivePanel>

        <DropdownMenu>
          <DropdownMenuTrigger
            render={toolbarButton({
              compact: !showAllLabels,
              icon: <FileJsonIcon />,
              label: "JSON",
              trailing: <ChevronDownIcon data-icon="inline-end" />,
            })}
          />
          <DropdownMenuContent align="end" sideOffset={8} className="w-48">
            <DropdownMenuItem onClick={onImportJson}>
              <UploadIcon />
              Import JSON
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onExportJson}>
              <DownloadIcon />
              Export JSON
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {toolbarButton({
          compact: !showPrimaryLabels,
          icon: <SparklesIcon />,
          label: "Extract from PDF",
          variant: "ai",
          disabled: isImportingPdf,
          onClick: onExtractCv,
        })}

        {toolbarButton({
          compact: !showPrimaryLabels,
          icon: <PrinterIcon />,
          label: isExportingPdf ? "Exporting..." : "Export PDF",
          variant: "default",
          disabled: isExportingPdf,
          onClick: onExportPdf,
        })}
      </div>
    </div>
  );
}

/** Style/Insights trigger that opens a popover on desktop, a sheet on mobile. */
function AdaptivePanel({
  label,
  icon,
  compact,
  isMobile,
  children,
}: {
  label: string;
  icon: ReactElement<{ "data-icon"?: string }>;
  compact: boolean;
  isMobile: boolean;
  children: ReactNode;
}) {
  const trigger = toolbarButton({ compact, icon, label });

  if (isMobile) {
    return (
      <Sheet>
        <SheetTrigger render={trigger} />
        <SheetContent
          side="bottom"
          className="flex max-h-[85dvh] flex-col p-0 pt-3"
        >
          <SheetHeader className="px-4 pb-2">
            <SheetTitle>{label}</SheetTitle>
          </SheetHeader>
          <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-4">
            {children}
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Popover>
      <PopoverTrigger render={trigger} />
      <PopoverContent align="end" className="w-80">
        {children}
      </PopoverContent>
    </Popover>
  );
}
