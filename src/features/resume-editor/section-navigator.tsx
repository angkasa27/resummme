"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  EyeIcon,
  EyeOffIcon,
  MoreHorizontalIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  getOrderedSectionKeys,
  sectionLabels,
  type ResumeSectionPanelKey,
} from "@/features/resume-editor/config/section-metadata";
import type { ResumeEditorPanelKey } from "@/features/resume-editor/store/editor-store";
import type { ResumeDraft } from "@/lib/resume/schema";
import { cn } from "@/lib/utils";

type SectionNavigatorProps = {
  draft: ResumeDraft;
  onRequestSectionChange: (sectionKey: ResumeEditorPanelKey) => void;
  onMoveSection: (sectionKey: ResumeSectionPanelKey, direction: -1 | 1) => void;
  onSetSectionVisibility: (
    sectionKey: ResumeSectionPanelKey,
    visible: boolean,
  ) => void;
};

export function SectionNavigator({
  draft,
  onRequestSectionChange,
  onMoveSection,
  onSetSectionVisibility,
}: SectionNavigatorProps) {
  const [optionalOpen, setOptionalOpen] = useState(false);
  const orderedSectionKeys = getOrderedSectionKeys(draft.sections);
  const visibleSectionKeys = orderedSectionKeys.filter(
    (sectionKey) => draft.sections[sectionKey].visible,
  );
  const hiddenSectionKeys = orderedSectionKeys.filter(
    (sectionKey) => !draft.sections[sectionKey].visible,
  );

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="border-b px-4 py-3">
        <h2 className="text-sm font-semibold">Sections</h2>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Pick a section to edit. Save when you want the preview to update.
        </p>
      </div>

      <nav className="min-h-0 flex-1 overflow-y-auto p-2" aria-label="Resume sections">
        <ul className="flex flex-col gap-1">
          <li>
            <SectionRowShell>
              <button
                type="button"
                data-section-row="profile"
                className={sectionButtonClassName}
                onClick={() => onRequestSectionChange("profile")}
              >
                <SectionRowText label="Profile" meta="Name, contact, links" />
              </button>
              <span className="px-2 text-xs text-muted-foreground">Fixed</span>
            </SectionRowShell>
          </li>

          {visibleSectionKeys.map((sectionKey) => {
            const orderIndex = orderedSectionKeys.indexOf(sectionKey);
            return (
              <SectionRow
                key={sectionKey}
                draft={draft}
                sectionKey={sectionKey}
                index={orderIndex}
                orderedSectionKeys={orderedSectionKeys}
                onRequestSectionChange={onRequestSectionChange}
                onMoveSection={onMoveSection}
                onSetSectionVisibility={onSetSectionVisibility}
              />
            );
          })}
        </ul>

        {hiddenSectionKeys.length > 0 ? (
          <section className="mt-3 border-t pt-3" aria-label="Optional sections">
            <button
              type="button"
              className="flex w-full items-center justify-between rounded-md px-2 py-2 text-left text-sm font-medium hover:bg-muted/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/20"
              aria-expanded={optionalOpen}
              onClick={() => setOptionalOpen((open) => !open)}
            >
              <span>Add optional section</span>
              <span className="text-xs font-normal text-muted-foreground">
                {hiddenSectionKeys.length}
              </span>
            </button>

            {optionalOpen ? (
              <ul className="mt-1 flex flex-col gap-1">
                {hiddenSectionKeys.map((sectionKey) => {
                  const orderIndex = orderedSectionKeys.indexOf(sectionKey);
                  return (
                    <SectionRow
                      key={sectionKey}
                      draft={draft}
                      sectionKey={sectionKey}
                      index={orderIndex}
                      orderedSectionKeys={orderedSectionKeys}
                      onRequestSectionChange={onRequestSectionChange}
                      onMoveSection={onMoveSection}
                      onSetSectionVisibility={onSetSectionVisibility}
                    />
                  );
                })}
              </ul>
            ) : null}
          </section>
        ) : null}
      </nav>
    </div>
  );
}

type SectionRowProps = {
  draft: ResumeDraft;
  sectionKey: ResumeSectionPanelKey;
  index: number;
  orderedSectionKeys: ResumeSectionPanelKey[];
  onRequestSectionChange: (sectionKey: ResumeEditorPanelKey) => void;
  onMoveSection: (sectionKey: ResumeSectionPanelKey, direction: -1 | 1) => void;
  onSetSectionVisibility: (
    sectionKey: ResumeSectionPanelKey,
    visible: boolean,
  ) => void;
};

const sectionButtonClassName =
  "flex min-w-0 flex-1 items-center justify-between rounded-md px-2 py-2 text-left transition-colors hover:bg-muted/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/20";

function SectionRowShell({ children }: { children: ReactNode }) {
  return (
    <div className="group flex min-w-0 items-center gap-1 rounded-md border border-transparent">
      {children}
    </div>
  );
}

function SectionRowText({ label, meta }: { label: string; meta: string }) {
  return (
    <span className="min-w-0">
      <span className="block truncate text-sm font-medium">{label}</span>
      <span className="block truncate text-xs text-muted-foreground">{meta}</span>
    </span>
  );
}

function getSectionMeta(draft: ResumeDraft, sectionKey: ResumeSectionPanelKey) {
  if (sectionKey === "summary") {
    return "Opening statement";
  }

  const section = draft.sections[sectionKey];
  const count = section.items.length;
  return `${count} ${count === 1 ? "entry" : "entries"}`;
}

function SectionRow({
  draft,
  sectionKey,
  index,
  orderedSectionKeys,
  onRequestSectionChange,
  onMoveSection,
  onSetSectionVisibility,
}: SectionRowProps) {
  const section = draft.sections[sectionKey];
  const label = sectionLabels[sectionKey];
  const isFirst = index === 0;
  const isLast = index === orderedSectionKeys.length - 1;

  return (
    <li>
      <SectionRowShell>
        <button
          type="button"
          data-section-row={sectionKey}
          className={cn(
            sectionButtonClassName,
            !section.visible && "text-muted-foreground",
          )}
          onClick={() =>
            section.visible
              ? onRequestSectionChange(sectionKey)
              : onSetSectionVisibility(sectionKey, true)
          }
        >
          <SectionRowText
            label={label}
            meta={section.visible ? getSectionMeta(draft, sectionKey) : "Hidden"}
          />
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label={`Open ${label} actions`}
                title={`Open ${label} actions`}
              />
            }
          >
            <MoreHorizontalIcon />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" sideOffset={6} className="w-48">
            <DropdownMenuGroup>
              <DropdownMenuItem
                disabled={isFirst || !section.visible}
                onClick={() => onMoveSection(sectionKey, -1)}
              >
                <ArrowUpIcon />
                Move {label} up
              </DropdownMenuItem>
              <DropdownMenuItem
                disabled={isLast || !section.visible}
                onClick={() => onMoveSection(sectionKey, 1)}
              >
                <ArrowDownIcon />
                Move {label} down
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant={section.visible ? "destructive" : "default"}
              onClick={() => onSetSectionVisibility(sectionKey, !section.visible)}
            >
              {section.visible ? <EyeOffIcon /> : <EyeIcon />}
              {section.visible ? "Hide" : "Show"} {label}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SectionRowShell>
    </li>
  );
}
