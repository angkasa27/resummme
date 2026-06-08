"use client";

import { PaletteIcon, TelescopeIcon } from "lucide-react";
import React from "react";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
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
import { useIsMobile } from "@/hooks/use-mobile";
import type { EditorPanelKey } from "@/features/resume-editor/domain/sections/section-metadata";
import type { ResumeDraft } from "@/features/resume-editor/domain/schema";
import { InsightsTab } from "@/features/resume-editor/shared/insights/insights-tab";
import { StyleTab } from "@/features/resume-editor/shared/style-tab";
import type { PdfPresentation } from "@/features/resume-editor/domain/presentation/pdf-presentation";

type PreviewToolbarProps = {
  draft: ResumeDraft;
  presentation: PdfPresentation;
  onChange: (nextPresentation: PdfPresentation) => void;
  onOpenSection?: (panel: EditorPanelKey) => void;
  /** Right-aligned actions (e.g. import/export). */
  actions?: ReactNode;
};

function AdaptivePanel({
  label,
  icon,
  children,
}: {
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  const isMobile = useIsMobile();

  const trigger = (
    <Button type="button" variant="outline" size="sm">
      {icon}
      {label}
    </Button>
  );

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

export function PreviewToolbar({
  draft,
  onChange,
  presentation,
  onOpenSection,
  actions,
}: PreviewToolbarProps) {
  return (
    <div className="flex h-12 shrink-0 items-center gap-2 border-b bg-background px-4">
      {/* Mobile: reach the section sidebar from the preview view. Desktop keeps
          the trigger in the form pane header instead. */}
      <SidebarTrigger className="-ml-1 lg:hidden" />
      <span className="text-xs font-medium text-muted-foreground">Preview</span>
      <div className="ml-auto flex items-center gap-1.5">
        <AdaptivePanel
          label="Style"
          icon={<PaletteIcon data-icon="inline-start" />}
        >
          <StyleTab presentation={presentation} onChange={onChange} />
        </AdaptivePanel>

        <AdaptivePanel
          label="Insights"
          icon={<TelescopeIcon data-icon="inline-start" />}
        >
          <InsightsTab draft={draft} onOpenSection={onOpenSection} />
        </AdaptivePanel>

        {actions}
      </div>
    </div>
  );
}
