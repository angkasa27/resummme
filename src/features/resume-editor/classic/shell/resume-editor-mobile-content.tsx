"use client";

import { useState } from "react";
import type { ComponentProps } from "react";
import { closestCenter, DndContext } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  ArrowLeftIcon,
  ChevronRightIcon,
  EyeIcon,
  SquarePenIcon,
  SwatchBookIcon,
  TelescopeIcon,
  type LucideIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SectionBody } from "@/features/resume-editor/classic/sections/section-body";
import { AddSectionMenu } from "@/features/resume-editor/shared/add-section-menu";
import { SectionRow } from "@/features/resume-editor/shared/section-row";
import {
  SortableSectionRow,
  useSectionReorder,
} from "@/features/resume-editor/shared/sortable-section-row";
import { EditorControlPanel } from "@/features/resume-editor/shared/editor-control-panel";
import { EditorDocumentActions } from "@/features/resume-editor/shared/editor-document-actions";
import { PreviewSheet } from "@/features/resume-editor/preview/components/preview-sheet";
import { TemplateTab } from "@/features/resume-editor/shared/template-tab";
import { StyleTab } from "@/features/resume-editor/shared/style-tab";
import { InsightsTab } from "@/features/resume-editor/shared/insights/insights-tab";
import {
  isCollectionSectionKey,
  partitionCollectionKeys,
  sectionLabels,
  type EditorPanelKey,
  type ResumeSectionPanelKey,
} from "@/features/resume-editor/domain/sections/section-metadata";
import type {
  ResumeEditorPanelKey,
  ResumeSectionKey,
} from "@/features/resume-editor/state/resume-editor-store";
import type { ResumeDraft } from "@/features/resume-editor/domain/schema";
import { cn } from "@/lib/utils";

type SectionProps = {
  draft: ResumeDraft;
  activeSection: ResumeEditorPanelKey;
  onSelectSection: (sectionKey: ResumeEditorPanelKey) => void;
  onSaveProfile: (profile: ResumeDraft["profile"]) => void;
  onSaveSection: <K extends ResumeSectionKey>(
    sectionKey: K,
    sectionValue: ResumeDraft["sections"][K],
  ) => void;
  onReorderSection: (
    sectionKey: ResumeSectionPanelKey,
    anchorKey: ResumeSectionPanelKey,
  ) => void;
  onSetSectionVisibility: (
    sectionKey: ResumeSectionPanelKey,
    visible: boolean,
  ) => void;
};

type ResumeEditorMobileContentProps = {
  sectionProps: SectionProps;
  controlPanelProps: ComponentProps<typeof EditorControlPanel>;
  draft: ResumeDraft;
  presentation: ResumeDraft["pdfPresentation"];
};

type Tab = "edit" | "preview" | "design" | "insights";

const TABS: { key: Tab; label: string; icon: LucideIcon }[] = [
  { key: "edit", label: "Edit", icon: SquarePenIcon },
  { key: "preview", label: "Preview", icon: EyeIcon },
  { key: "design", label: "Design", icon: SwatchBookIcon },
  { key: "insights", label: "Insights", icon: TelescopeIcon },
];

function sectionLabelFor(key: ResumeEditorPanelKey) {
  return key === "profile"
    ? "Profile"
    : sectionLabels[key as ResumeSectionPanelKey];
}

export function ResumeEditorMobileContent({
  sectionProps,
  controlPanelProps,
  draft,
  presentation,
}: ResumeEditorMobileContentProps) {
  const [tab, setTab] = useState<Tab>("edit");
  const [openSection, setOpenSection] = useState<ResumeEditorPanelKey | null>(
    null,
  );

  const { onSelectSection, onSaveProfile, onSaveSection, onSetSectionVisibility } =
    sectionProps;
  const onOpenSection = controlPanelProps.onOpenSection;

  function openForm(key: ResumeEditorPanelKey) {
    onSelectSection(key);
    setOpenSection(key);
  }

  function handleInsightsOpen(panel: EditorPanelKey) {
    onOpenSection?.(panel);
    setTab("edit");
    setOpenSection(panel);
  }

  const editingForm = tab === "edit" && openSection !== null;

  return (
    <div className="flex h-full flex-col lg:hidden">
      {/* Contextual top bar — only inside a sub-form. Tab roots rely on the
          global top bar + bottom nav, so no redundant title here. */}
      {editingForm && openSection ? (
        <header className="flex h-12 shrink-0 items-center gap-2 border-b bg-background px-3">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="Back to sections"
            onClick={() => setOpenSection(null)}
          >
            <ArrowLeftIcon />
          </Button>
          <h2 className="min-w-0 flex-1 truncate text-sm font-semibold">
            {sectionLabelFor(openSection)}
          </h2>
        </header>
      ) : null}

      {/* Tab content */}
      <div className="min-h-0 flex-1 overflow-hidden">
        {tab === "edit" ? (
          editingForm && openSection ? (
            <div className="h-full overflow-y-auto p-4 @container/form">
              <SectionBody
                draft={draft}
                activeSection={openSection}
                onSaveProfile={onSaveProfile}
                onSaveSection={onSaveSection}
                onRemoveSection={
                  isCollectionSectionKey(openSection as ResumeSectionPanelKey)
                    ? () => {
                        onSetSectionVisibility(
                          openSection as ResumeSectionPanelKey,
                          false,
                        );
                        setOpenSection(null);
                      }
                    : undefined
                }
                idPrefix="mobile"
              />
            </div>
          ) : (
            <MobileSectionList
              draft={draft}
              activeSection={sectionProps.activeSection}
              onReorderSection={sectionProps.onReorderSection}
              onSetSectionVisibility={onSetSectionVisibility}
              controlPanelProps={controlPanelProps}
              onOpen={openForm}
            />
          )
        ) : null}

        {tab === "preview" ? (
          <div className="h-full overflow-hidden bg-muted">
            <PreviewSheet draft={draft} presentation={presentation} />
          </div>
        ) : null}

        {tab === "design" ? (
          <Tabs defaultValue="template" className="flex h-full flex-col">
            <div className="shrink-0 px-4 pt-3">
              <TabsList className="w-full">
                <TabsTrigger value="template">Template</TabsTrigger>
                <TabsTrigger value="style">Style</TabsTrigger>
              </TabsList>
            </div>
            <TabsContent
              value="template"
              className="min-h-0 flex-1 overflow-y-auto p-4 @container/form"
            >
              <TemplateTab
                presentation={presentation}
                draft={draft}
                onChange={controlPanelProps.onPresentationChange}
              />
            </TabsContent>
            <TabsContent
              value="style"
              className="min-h-0 flex-1 overflow-y-auto p-4 @container/form"
            >
              <StyleTab
                presentation={presentation}
                onChange={controlPanelProps.onPresentationChange}
              />
            </TabsContent>
          </Tabs>
        ) : null}

        {tab === "insights" ? (
          <div className="h-full overflow-y-auto p-4">
            <InsightsTab draft={draft} onOpenSection={handleInsightsOpen} />
          </div>
        ) : null}
      </div>

      {/* Bottom navigation */}
      <nav className="grid shrink-0 grid-cols-4 border-t bg-background">
        {TABS.map(({ key, label, icon: Icon }) => {
          const active = tab === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => {
                setTab(key);
                if (key !== "edit") setOpenSection(null);
              }}
              className={cn(
                "flex flex-col items-center gap-0.5 py-2 text-[11px] font-medium transition-colors",
                active ? "text-foreground" : "text-muted-foreground",
              )}
            >
              <Icon className={cn("size-5", active && "text-primary")} />
              {label}
            </button>
          );
        })}
      </nav>
    </div>
  );
}

type MobileSectionListProps = {
  draft: ResumeDraft;
  activeSection: ResumeEditorPanelKey;
  onReorderSection: SectionProps["onReorderSection"];
  onSetSectionVisibility: SectionProps["onSetSectionVisibility"];
  controlPanelProps: ComponentProps<typeof EditorControlPanel>;
  onOpen: (key: ResumeEditorPanelKey) => void;
};

function MobileSectionList({
  draft,
  activeSection,
  onReorderSection,
  onSetSectionVisibility,
  controlPanelProps,
  onOpen,
}: MobileSectionListProps) {
  const { sensors, onDragEnd } = useSectionReorder(onReorderSection);
  const { sortableKeys, hiddenKeys } = partitionCollectionKeys(draft.sections);

  const navChevron = (
    <ChevronRightIcon className="size-4 text-muted-foreground/60" />
  );

  return (
    <div className="h-full overflow-y-auto">
      {/* Document actions — mirrors the desktop right panel's top block. */}
      <div className="px-4 pt-4">
        <EditorDocumentActions
          onExtractCv={controlPanelProps.onExtractCv}
          onImportJson={controlPanelProps.onImportJson}
          onExport={controlPanelProps.onExport}
          onExportPdf={controlPanelProps.onExportPdf}
          isExportingPdf={controlPanelProps.isExportingPdf}
          isImportingPdf={controlPanelProps.isImportingPdf}
        />
      </div>

      <Separator className="my-3" />

      <div className="px-2 pb-3">
        {/* Pinned — not reorderable, not removable */}
        <div className="flex flex-col gap-0.5">
          <SectionRow
            sectionKey="profile"
            label="Profile"
            active={activeSection === "profile"}
            onClick={() => onOpen("profile")}
            trailing={navChevron}
          />
          <SectionRow
            sectionKey="summary"
            label={sectionLabels.summary}
            active={activeSection === "summary"}
            onClick={() => onOpen("summary")}
            trailing={navChevron}
          />
        </div>

        <Separator className="my-2" />

        {/* Collection sections — drag-sortable */}
        <div className="flex flex-col gap-0.5">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={onDragEnd}
          >
            <SortableContext
              items={sortableKeys}
              strategy={verticalListSortingStrategy}
            >
              {sortableKeys.map((key) => (
                <SortableSectionRow
                  key={key}
                  sectionKey={key}
                  label={sectionLabels[key]}
                  count={draft.sections[key].items.length}
                  active={activeSection === key}
                  onClick={() => onOpen(key)}
                  trailing={navChevron}
                />
              ))}
            </SortableContext>
          </DndContext>

          <AddSectionMenu
            hiddenKeys={hiddenKeys}
            onAdd={(key) => onSetSectionVisibility(key, true)}
            triggerVariant="ghost"
          />
        </div>
      </div>
    </div>
  );
}
