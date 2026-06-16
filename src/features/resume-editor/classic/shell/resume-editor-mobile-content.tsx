"use client";

import { useState } from "react";
import type { ComponentProps } from "react";
import { closestCenter, DndContext } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  ArrowLeftIcon,
  ChevronRightIcon,
  LayoutTemplateIcon,
  PaletteIcon,
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
import {
  MobileBottomNav,
  type EditorTab,
} from "@/features/resume-editor/classic/shell/mobile-bottom-nav";
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
import { motionTokens } from "@/lib/motion-tokens";

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

function sectionLabelFor(key: ResumeEditorPanelKey) {
  return key === "profile"
    ? "Profile"
    : sectionLabels[key as ResumeSectionPanelKey];
}

// Direction-aware "filmstrip" slide: both panels translate the full width in
// lockstep (no overlay/parallax), like a native push or a presentation deck.
// `dir` > 0 = forward (new in from the right), < 0 = back (new in from the left).
const slideVariants = {
  enter: (dir: number) => ({ x: dir >= 0 ? "100%" : "-100%" }),
  center: { x: "0%" },
  exit: (dir: number) => ({ x: dir >= 0 ? "-100%" : "100%" }),
};

const fadeVariants = {
  enter: { opacity: 0 },
  center: { opacity: 1 },
  exit: { opacity: 0 },
};

// Tween (not spring) so the two filmstrip panels stay perfectly in sync; tokens
// keep the timing consistent with the rest of the app.
const slideTransition = {
  duration: motionTokens.duration.normal,
  ease: motionTokens.easing.smooth,
};
const reducedTransition = { duration: motionTokens.duration.fast };

const TAB_ORDER: EditorTab[] = ["edit", "preview", "design", "insights"];

export function ResumeEditorMobileContent({
  sectionProps,
  controlPanelProps,
  draft,
  presentation,
}: ResumeEditorMobileContentProps) {
  const [tab, setTab] = useState<EditorTab>("edit");
  const [openSection, setOpenSection] = useState<ResumeEditorPanelKey | null>(
    null,
  );
  // +1 = navigating into a form / forward tab, -1 = back / previous tab.
  const [navDir, setNavDir] = useState(1);
  const [tabDir, setTabDir] = useState(1);
  const reduceMotion = useReducedMotion();

  function changeTab(next: EditorTab) {
    setTabDir(TAB_ORDER.indexOf(next) >= TAB_ORDER.indexOf(tab) ? 1 : -1);
    setTab(next);
    if (next !== "edit") setOpenSection(null);
  }

  const {
    onSelectSection,
    onSaveProfile,
    onSaveSection,
    onSetSectionVisibility,
  } = sectionProps;
  const onOpenSection = controlPanelProps.onOpenSection;

  function openForm(key: ResumeEditorPanelKey) {
    setNavDir(1);
    onSelectSection(key);
    setOpenSection(key);
  }

  function backToList() {
    setNavDir(-1);
    setOpenSection(null);
  }

  function handleInsightsOpen(panel: EditorPanelKey) {
    setNavDir(1);
    onOpenSection?.(panel);
    setTab("edit");
    setOpenSection(panel);
  }

  const editingForm = tab === "edit" && openSection !== null;
  const sectionVariants = reduceMotion ? fadeVariants : slideVariants;

  return (
    <div className="relative flex h-full flex-col lg:hidden">
      {/* Contextual top bar — only inside a sub-form. Tab roots rely on the
          global top bar + bottom nav, so no redundant title here. */}
      {editingForm && openSection ? (
        <header className="flex h-12 shrink-0 items-center gap-2 border-b bg-background px-3">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="Back to sections"
            onClick={backToList}
          >
            <ArrowLeftIcon />
          </Button>
          <h2 className="min-w-0 flex-1 truncate text-sm font-semibold">
            {sectionLabelFor(openSection)}
          </h2>
        </header>
      ) : null}

      {/* Tab content — slides horizontally between tabs (direction by order). */}
      <div className="relative min-h-0 flex-1 overflow-hidden">
        <AnimatePresence initial={false} custom={tabDir}>
          <motion.div
            key={tab}
            className="absolute inset-0 transform-gpu bg-background"
            custom={tabDir}
            variants={reduceMotion ? fadeVariants : slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={reduceMotion ? reducedTransition : slideTransition}
          >
            {tab === "edit" ? (
              <div className="relative h-full overflow-hidden">
                <AnimatePresence initial={false} custom={navDir}>
                  {editingForm && openSection ? (
                    <motion.div
                      key={openSection}
                      className="absolute inset-0 transform-gpu overflow-y-auto bg-background p-4 pb-24 @container/form"
                      custom={navDir}
                      variants={sectionVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={
                        reduceMotion ? reducedTransition : slideTransition
                      }
                    >
                      <SectionBody
                        draft={draft}
                        activeSection={openSection}
                        onSaveProfile={onSaveProfile}
                        onSaveSection={onSaveSection}
                        onRemoveSection={
                          isCollectionSectionKey(
                            openSection as ResumeSectionPanelKey,
                          )
                            ? () => {
                                onSetSectionVisibility(
                                  openSection as ResumeSectionPanelKey,
                                  false,
                                );
                                backToList();
                              }
                            : undefined
                        }
                        idPrefix="mobile"
                      />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="list"
                      className="absolute inset-0 transform-gpu bg-background"
                      custom={navDir}
                      variants={sectionVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={
                        reduceMotion ? reducedTransition : slideTransition
                      }
                    >
                      <MobileSectionList
                        draft={draft}
                        activeSection={sectionProps.activeSection}
                        onReorderSection={sectionProps.onReorderSection}
                        onSetSectionVisibility={onSetSectionVisibility}
                        controlPanelProps={controlPanelProps}
                        onOpen={openForm}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
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
                    <TabsTrigger value="template">
                      <LayoutTemplateIcon />
                      Template
                    </TabsTrigger>
                    <TabsTrigger value="style">
                      <PaletteIcon />
                      Style
                    </TabsTrigger>
                  </TabsList>
                </div>
                <TabsContent
                  value="template"
                  className="min-h-0 flex-1 overflow-y-auto p-4 pb-24 @container/form"
                >
                  <TemplateTab
                    presentation={presentation}
                    draft={draft}
                    onChange={controlPanelProps.onPresentationChange}
                  />
                </TabsContent>
                <TabsContent
                  value="style"
                  className="min-h-0 flex-1 overflow-y-auto p-4 pb-24 @container/form"
                >
                  <StyleTab
                    presentation={presentation}
                    onChange={controlPanelProps.onPresentationChange}
                  />
                </TabsContent>
              </Tabs>
            ) : null}

            {tab === "insights" ? (
              <div className="h-full overflow-y-auto p-4 pb-24">
                <InsightsTab draft={draft} onOpenSection={handleInsightsOpen} />
              </div>
            ) : null}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Floating pill bottom navigation */}
      <MobileBottomNav value={tab} onChange={changeTab} />
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
    <div className="h-full overflow-y-auto pb-24">
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
