"use client";

import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  GripVerticalIcon,
  PlusIcon,
  Trash2Icon,
  ChevronDownIcon,
  ChevronRightIcon,
} from "lucide-react";

import { useState } from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  getOrderedSectionKeys,
  isCollectionSectionKey,
  sectionLabels,
  type ResumeSectionPanelKey,
} from "@/features/resume-editor/domain/sections/section-metadata";
import { SectionIcon } from "@/features/resume-editor/classic/sections/section-icons";
import type { ResumeEditorPanelKey } from "@/features/resume-editor/state/resume-editor-store";
import type { ResumeDraft } from "@/features/resume-editor/domain/schema";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type ResumeEditorSidebarProps = {
  draft: ResumeDraft;
  activeSection: ResumeEditorPanelKey;
  onRequestSectionChange: (sectionKey: ResumeEditorPanelKey) => void;
  onReorderSection: (
    sectionKey: ResumeSectionPanelKey,
    anchorKey: ResumeSectionPanelKey,
  ) => void;
  onSetSectionVisibility: (
    sectionKey: ResumeSectionPanelKey,
    visible: boolean,
  ) => void;
};

function getSectionItemCount(
  draft: ResumeDraft,
  sectionKey: ResumeSectionPanelKey,
) {
  if (sectionKey === "summary") return null;
  return draft.sections[sectionKey].items.length;
}

function SectionMenuIcon({
  sectionKey,
}: {
  sectionKey: ResumeEditorPanelKey | ResumeSectionPanelKey;
}) {
  return <SectionIcon sectionKey={sectionKey} />;
}

export function ResumeEditorSidebar({
  draft,
  activeSection,
  onRequestSectionChange,
  onReorderSection,
  onSetSectionVisibility,
}: ResumeEditorSidebarProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );
  const { setOpenMobile } = useSidebar();

  const orderedSectionKeys = getOrderedSectionKeys(draft.sections);
  // Summary is pinned at the top — always visible, never reordered or hidden —
  // mirroring the canvas, where it sits outside the collection sections. Only
  // collection sections are sortable / hideable here.
  const sortableSectionKeys = orderedSectionKeys.filter(
    (sectionKey) =>
      isCollectionSectionKey(sectionKey) && draft.sections[sectionKey].visible,
  );
  const hiddenSectionKeys = orderedSectionKeys.filter(
    (sectionKey) =>
      isCollectionSectionKey(sectionKey) && !draft.sections[sectionKey].visible,
  );

  const [availableOpen, setAvailableOpen] = useState(true);

  function handleDragEnd(event: DragEndEvent) {
    const activeKey = event.active.id as ResumeSectionPanelKey;
    const overKey = event.over?.id as ResumeSectionPanelKey | undefined;

    if (!overKey || activeKey === overKey) return;

    onReorderSection(activeKey, overKey);
  }

  function handleSectionClick(sectionKey: ResumeEditorPanelKey) {
    onRequestSectionChange(sectionKey);
    setOpenMobile(false);
  }

  return (
    <Sidebar
      collapsible="offcanvas"
      // Offset the fixed sidebar container so it sits below the shared top bar
      // (--header-height, set on the classic shell wrapper) instead of overlaying it.
      className="border-r top-(--header-height)! h-[calc(100dvh-var(--header-height))]!"
    >
      <SidebarContent>
        {/* Profile — always first, not sortable */}
        <div className="flex h-12 shrink-0 items-center border-b px-2">
          <SidebarMenu className="w-full">
            <SidebarMenuItem>
              <SidebarMenuButton
                isActive={activeSection === "profile"}
                onClick={() => handleSectionClick("profile")}
              >
                <SectionMenuIcon sectionKey="profile" />
                <span>Profile</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </div>
        {/* Summary — always first, always visible, not sortable */}
        <SidebarGroup className="px-2 pt-2 pb-0">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={activeSection === "summary"}
                  onClick={() => handleSectionClick("summary")}
                >
                  <SectionMenuIcon sectionKey="summary" />
                  <span className="flex-1 truncate">
                    {sectionLabels.summary}
                  </span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Collection sections — sortable */}
        <SidebarGroup className="px-2 pt-1 pb-2">
          <SidebarGroupContent>
            <DndContext
              id="sidebar-section-dnd"
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={sortableSectionKeys}
                strategy={verticalListSortingStrategy}
              >
                <SidebarMenu>
                  {sortableSectionKeys.map((sectionKey) => (
                    <SortableSectionItem
                      key={sectionKey}
                      draft={draft}
                      sectionKey={sectionKey}
                      isActive={activeSection === sectionKey}
                      onClick={() => handleSectionClick(sectionKey)}
                      onHide={() => onSetSectionVisibility(sectionKey, false)}
                    />
                  ))}
                </SidebarMenu>
              </SortableContext>
            </DndContext>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Hidden sections — add them back */}
        {hiddenSectionKeys.length > 0 && (
          <>
            <SidebarSeparator className="mx-0!" />
            <Collapsible open={availableOpen} onOpenChange={setAvailableOpen}>
              <SidebarGroup className="px-2 py-2">
                <CollapsibleTrigger
                  nativeButton={false}
                  render={
                    <SidebarGroupLabel className="cursor-pointer px-2 text-xs font-medium text-muted-foreground hover:text-foreground">
                      {availableOpen ? (
                        <ChevronDownIcon className="size-3" />
                      ) : (
                        <ChevronRightIcon className="size-3" />
                      )}
                      Add sections
                    </SidebarGroupLabel>
                  }
                />
                <CollapsibleContent>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {hiddenSectionKeys.map((sectionKey) => (
                        <SidebarMenuItem key={sectionKey}>
                          <SidebarMenuButton
                            className="text-muted-foreground hover:text-foreground"
                            onClick={() =>
                              onSetSectionVisibility(sectionKey, true)
                            }
                          >
                            <PlusIcon className="size-4" />
                            <SectionMenuIcon sectionKey={sectionKey} />
                            <span>{sectionLabels[sectionKey]}</span>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </CollapsibleContent>
              </SidebarGroup>
            </Collapsible>
          </>
        )}
      </SidebarContent>
    </Sidebar>
  );
}

function SortableSectionItem({
  draft,
  sectionKey,
  isActive,
  onClick,
  onHide,
}: {
  draft: ResumeDraft;
  sectionKey: ResumeSectionPanelKey;
  isActive: boolean;
  onClick: () => void;
  onHide: () => void;
}) {
  const {
    attributes,
    isDragging,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: sectionKey });

  const label = sectionLabels[sectionKey];
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  const itemCount = getSectionItemCount(draft, sectionKey);
  const {
    role: _sortableRole,
    tabIndex: _sortableTabIndex,
    ...sortableAttributes
  } = attributes;
  void _sortableRole;
  void _sortableTabIndex;

  return (
    <SidebarMenuItem
      ref={setNodeRef}
      style={style}
      className="group/section relative"
    >
      <SidebarMenuButton
        isActive={isActive}
        onClick={onClick}
        className={cn(isDragging && "relative z-50 opacity-80 shadow-lg")}
        render={
          <div className="cursor-pointer">
            <button
              type="button"
              aria-label={`Drag ${label}`}
              className="flex shrink-0 cursor-grab touch-none items-center text-muted-foreground/40 transition-colors hover:text-foreground active:cursor-grabbing"
              {...sortableAttributes}
              {...listeners}
              onClick={(e) => e.stopPropagation()}
            >
              <GripVerticalIcon className="size-3.5" />
            </button>
            <SectionMenuIcon sectionKey={sectionKey} />
            <span className="flex-1 truncate">{label}</span>
            {itemCount != null && (
              <span className="text-xs tabular-nums text-muted-foreground group-hover/section:hidden">
                {itemCount}
              </span>
            )}
          </div>
        }
      ></SidebarMenuButton>

      {/* Remove button — replaces the count on hover */}
      <Button
        type="button"
        size="icon-xs"
        variant="destructive"
        className="absolute right-1.5 top-1/2 hidden -translate-y-1/2 group-hover/section:flex"
        onClick={(e) => {
          e.stopPropagation();
          onHide();
        }}
        title={`Remove ${label}`}
      >
        <Trash2Icon className="size-3.5" />
        <span className="sr-only">Remove {label}</span>
      </Button>
    </SidebarMenuItem>
  );
}
