"use client";

import { GalleryThumbnailsIcon, PaletteIcon } from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StyleTab } from "@/features/resume-editor/editor/panels/style-tab";
import { TemplateGallery } from "@/features/resume-editor/editor/panels/template-gallery";
import type { PdfPresentation } from "@/features/resume-editor/domain/presentation/pdf-presentation";
import type { ResumeDraft } from "@/features/resume-editor/domain/schema";
import { cn } from "@/lib/utils";

type DesignPanelProps = {
  presentation: PdfPresentation;
  draft: ResumeDraft;
  onPresentationChange: (next: PdfPresentation) => void;
  /** Extra scroll padding — mobile clears its floating bottom nav. */
  scrollPaddingClassName?: string;
};

/**
 * The Design surface: Template / Style over the shared control tabs.
 * Identical on the desktop sidebar and the mobile Design tab.
 */
export function DesignPanel({
  presentation,
  draft,
  onPresentationChange,
  scrollPaddingClassName,
}: DesignPanelProps) {
  const tabContentClassName = cn(
    "min-h-0 flex-1 overflow-y-auto p-4 @container/form",
    scrollPaddingClassName,
  );

  return (
    <Tabs defaultValue="template" className="flex h-full flex-col">
      <div className="shrink-0 px-4 pt-3">
        <TabsList className="w-full">
          <TabsTrigger value="template">
            <GalleryThumbnailsIcon />
            Template
          </TabsTrigger>
          <TabsTrigger value="style">
            <PaletteIcon />
            Style
          </TabsTrigger>
        </TabsList>
      </div>
      <TabsContent value="template" className={tabContentClassName}>
        <TemplateGallery
          draft={draft}
          presentation={presentation}
          onApply={onPresentationChange}
        />
      </TabsContent>
      <TabsContent value="style" className={tabContentClassName}>
        <StyleTab presentation={presentation} onChange={onPresentationChange} />
      </TabsContent>
    </Tabs>
  );
}
