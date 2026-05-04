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
  SidebarHeader,
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
  sectionLabels,
  type ResumeSectionPanelKey,
} from "@/features/resume-editor/config/section-metadata";
import { SectionIcon } from "@/features/resume-editor/sections/section-icons";
import type { ResumeEditorPanelKey } from "@/features/resume-editor/store/editor-store";
import type { ResumeDraft } from "@/lib/resume/schema";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type AppSidebarProps = {
  draft: ResumeDraft;
  activeSection: ResumeEditorPanelKey;
  onRequestSectionChange: (sectionKey: ResumeEditorPanelKey) => void;
  onReorderSection: (
    sectionKey: ResumeSectionPanelKey,
    targetIndex: number,
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

export function AppSidebar({
  draft,
  activeSection,
  onRequestSectionChange,
  onReorderSection,
  onSetSectionVisibility,
}: AppSidebarProps) {
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
  const visibleSectionKeys = orderedSectionKeys.filter(
    (sectionKey) => draft.sections[sectionKey].visible,
  );
  const hiddenSectionKeys = orderedSectionKeys.filter(
    (sectionKey) => !draft.sections[sectionKey].visible,
  );

  const [availableOpen, setAvailableOpen] = useState(true);

  function handleDragEnd(event: DragEndEvent) {
    const activeKey = event.active.id as ResumeSectionPanelKey;
    const overKey = event.over?.id as ResumeSectionPanelKey | undefined;

    if (!overKey || activeKey === overKey) return;

    const targetIndex = orderedSectionKeys.indexOf(overKey);
    if (targetIndex >= 0) {
      onReorderSection(activeKey, targetIndex);
    }
  }

  function handleSectionClick(sectionKey: ResumeEditorPanelKey) {
    onRequestSectionChange(sectionKey);
    setOpenMobile(false);
  }

  return (
    <Sidebar collapsible="offcanvas" className="border-r">
      <SidebarHeader className="h-12 flex-row shrink-0 items-center border-b px-4 m-0">
        <span className="text-sm font-semibold tracking-tight">
          Resume Editor
        </span>
      </SidebarHeader>
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
        {/* Visible sections — sortable */}
        <SidebarGroup className="px-2 py-2">
          <SidebarGroupContent>
            <DndContext
              id="sidebar-section-dnd"
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext
                items={visibleSectionKeys}
                strategy={verticalListSortingStrategy}
              >
                <SidebarMenu>
                  {visibleSectionKeys.map((sectionKey) => (
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
            <SidebarSeparator className="mx-2" />
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
