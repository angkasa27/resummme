"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import {
  fadeVariants,
  reducedTransition,
  slideTransition,
  slideVariants,
} from "@/features/resume-editor/editor/sections/drill-in-motion";
import { SectionBody } from "@/features/resume-editor/editor/sections/section-body";
import { SectionList } from "@/features/resume-editor/editor/sections/section-list";
import type { ResumeSectionPanelKey } from "@/features/resume-editor/domain/sections/section-metadata";
import type {
  ResumeEditorPanelKey,
  ResumeSectionKey,
} from "@/features/resume-editor/state/resume-editor-store";
import type { ResumeDraft } from "@/features/resume-editor/domain/schema";
import { cn } from "@/lib/utils";

type SectionEditPanelProps = {
  draft: ResumeDraft;
  /** The section whose form is open; `null` shows the list. */
  openSection: ResumeEditorPanelKey | null;
  /** The highlighted row, or `null` when nothing is open. */
  activeSection: ResumeEditorPanelKey | null;
  /** +1 = drilling into a form, -1 = returning to the list. */
  direction: number;
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
  onOpen: (key: ResumeEditorPanelKey) => void;
  /** Document-level actions shown above the section list. */
  onExtractCv: () => void;
  onImportJson: () => void;
  onExportJson: () => void;
  isImportingPdf?: boolean;
  /** Disambiguates input ids between the two surfaces. */
  idPrefix: string;
  /** Extra scroll padding — mobile clears its floating bottom nav. */
  scrollPaddingClassName?: string;
};

/**
 * The Edit surface: a horizontal drill-in between the section list and the
 * active section's auto-saving form. Shared by the desktop sidebar and the
 * mobile Edit tab; each supplies its own back header and scroll padding.
 */
export function SectionEditPanel({
  draft,
  openSection,
  activeSection,
  direction,
  onSaveProfile,
  onSaveSection,
  onReorderSection,
  onSetSectionVisibility,
  onOpen,
  onExtractCv,
  onImportJson,
  onExportJson,
  isImportingPdf,
  idPrefix,
  scrollPaddingClassName,
}: SectionEditPanelProps) {
  const reduceMotion = useReducedMotion();
  const variants = reduceMotion ? fadeVariants : slideVariants;

  return (
    <div className="relative h-full overflow-hidden">
      <AnimatePresence initial={false} custom={direction}>
        {openSection ? (
          <motion.div
            key={openSection}
            className={cn(
              "absolute inset-0 transform-gpu overflow-y-auto bg-background p-4 @container/form",
              scrollPaddingClassName,
            )}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={reduceMotion ? reducedTransition : slideTransition}
          >
            <SectionBody
              draft={draft}
              activeSection={openSection}
              onSaveProfile={onSaveProfile}
              onSaveSection={onSaveSection}
              idPrefix={idPrefix}
            />
          </motion.div>
        ) : (
          <motion.div
            key="list"
            className="absolute inset-0 transform-gpu bg-background"
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={reduceMotion ? reducedTransition : slideTransition}
          >
            <SectionList
              draft={draft}
              activeSection={activeSection}
              onReorderSection={onReorderSection}
              onSetSectionVisibility={onSetSectionVisibility}
              onOpen={onOpen}
              onExtractCv={onExtractCv}
              onImportJson={onImportJson}
              onExportJson={onExportJson}
              isImportingPdf={isImportingPdf}
              className={scrollPaddingClassName}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
