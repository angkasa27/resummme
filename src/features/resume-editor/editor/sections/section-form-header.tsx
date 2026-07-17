"use client";

import { useState, type ReactNode } from "react";
import {
  ArrowDownNarrowWideIcon,
  ArrowLeftIcon,
  Trash2Icon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { ConfirmDeleteDialog } from "@/components/ui/confirm-delete-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { collectionSectionConfigs } from "@/features/resume-editor/domain/sections/collection-section-config";
import {
  isCollectionSectionKey,
  sectionLabels,
  type CollectionSectionKey,
  type ResumeSectionPanelKey,
} from "@/features/resume-editor/domain/sections/section-metadata";
import type { ResumeEditorPanelKey } from "@/features/resume-editor/state/resume-editor-store";

export function sectionLabelFor(key: ResumeEditorPanelKey) {
  return key === "profile"
    ? "Profile"
    : sectionLabels[key as ResumeSectionPanelKey];
}

/** Only sections whose items carry a date range can be sorted newest-first. */
function canAutoSort(key: ResumeEditorPanelKey) {
  if (key === "profile" || !isCollectionSectionKey(key as ResumeSectionPanelKey))
    return false;
  return collectionSectionConfigs[key as CollectionSectionKey].fields.some(
    (field) => field.kind === "dateRange",
  );
}

/**
 * A header action that sheds its label when the header gets tight — same idea as
 * the top bar's GitHub button, but driven by the *container* rather than the
 * viewport: the sidebar is resizable, so the viewport says nothing about how
 * much room this header actually has.
 */
function HeaderAction({
  label,
  icon,
  onClick,
  destructive = false,
}: {
  label: string;
  icon: ReactNode;
  onClick: () => void;
  destructive?: boolean;
}) {
  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            type="button"
            variant={destructive ? "destructive" : "outline"}
            size="sm"
            aria-label={label}
            onClick={onClick}
            className="shrink-0"
          >
            {icon}
            {/* Label appears only once the header can spare the width. */}
            <span className="hidden @sm/section-header:inline">{label}</span>
          </Button>
        }
      />
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}

type SectionFormHeaderProps = {
  sectionKey: ResumeEditorPanelKey;
  onBack: () => void;
  onAutoSortSection: (sectionKey: CollectionSectionKey) => void;
  onSetSectionVisibility: (
    sectionKey: ResumeSectionPanelKey,
    visible: boolean,
  ) => void;
};

/**
 * Contextual header for a drill-in section form: back arrow, section title, and
 * the section-level actions. Which actions apply is derived here so the desktop
 * sidebar and the mobile Edit tab can't disagree — Profile/Summary are pinned
 * (no remove), and only dated sections can sort.
 */
export function SectionFormHeader({
  sectionKey,
  onBack,
  onAutoSortSection,
  onSetSectionVisibility,
}: SectionFormHeaderProps) {
  const [isRemoveOpen, setIsRemoveOpen] = useState(false);
  const label = sectionLabelFor(sectionKey);
  const isRemovable =
    sectionKey !== "profile" &&
    isCollectionSectionKey(sectionKey as ResumeSectionPanelKey);

  return (
    <header className="@container/section-header flex h-12 shrink-0 items-center gap-2 border-b bg-background px-3">
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        aria-label="Back to sections"
        onClick={onBack}
        className="shrink-0"
      >
        <ArrowLeftIcon />
      </Button>
      <h2 className="min-w-0 flex-1 truncate text-sm font-semibold">{label}</h2>

      {canAutoSort(sectionKey) ? (
        <HeaderAction
          label="Sort"
          icon={<ArrowDownNarrowWideIcon />}
          onClick={() => onAutoSortSection(sectionKey as CollectionSectionKey)}
        />
      ) : null}
      {isRemovable ? (
        <HeaderAction
          label="Remove"
          icon={<Trash2Icon />}
          onClick={() => setIsRemoveOpen(true)}
          destructive
        />
      ) : null}

      <ConfirmDeleteDialog
        open={isRemoveOpen}
        onOpenChange={setIsRemoveOpen}
        onConfirm={() => {
          onSetSectionVisibility(sectionKey as ResumeSectionPanelKey, false);
          onBack();
        }}
        title={`Remove ${label} section?`}
        description="Its content is kept — you can add the section back at any time."
      />
    </header>
  );
}
