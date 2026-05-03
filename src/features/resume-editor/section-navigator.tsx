"use client";

import type { ReactNode } from "react";
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
  // ArrowDownIcon,
  // ArrowUpIcon,
  // EyeIcon,
  EyeOffIcon,
  GripVerticalIcon,
  PencilIcon,
  PinIcon,
  PlusIcon,
  Trash2Icon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
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
  activeSection: ResumeEditorPanelKey;
  onRequestSectionChange: (sectionKey: ResumeEditorPanelKey) => void;
  onMoveSection: (sectionKey: ResumeSectionPanelKey, direction: -1 | 1) => void;
  onReorderSection: (
    sectionKey: ResumeSectionPanelKey,
    targetIndex: number,
  ) => void;
  onSetSectionVisibility: (
    sectionKey: ResumeSectionPanelKey,
    visible: boolean,
  ) => void;
};

export function SectionNavigator({
  draft,
  activeSection,
  onRequestSectionChange,
  onMoveSection,
  onReorderSection,
  onSetSectionVisibility,
}: SectionNavigatorProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 6,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );
  const orderedSectionKeys = getOrderedSectionKeys(draft.sections);
  const visibleSectionKeys = orderedSectionKeys.filter(
    (sectionKey) => draft.sections[sectionKey].visible,
  );
  const hiddenSectionKeys = orderedSectionKeys.filter(
    (sectionKey) => !draft.sections[sectionKey].visible,
  );

  function handleDragEnd(event: DragEndEvent) {
    const activeKey = event.active.id as ResumeSectionPanelKey;
    const overKey = event.over?.id as ResumeSectionPanelKey | undefined;

    if (!overKey || activeKey === overKey) {
      return;
    }

    const targetIndex = orderedSectionKeys.indexOf(overKey);

    if (targetIndex >= 0) {
      onReorderSection(activeKey, targetIndex);
    }
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="border-b px-4 py-3">
        <h2 className="text-sm font-semibold">Outline</h2>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Edit content, reorder included sections, or show hidden sections.
        </p>
      </div>

      <nav
        className="min-h-0 flex-1 overflow-y-auto p-2"
        aria-label="Resume sections"
      >
        <section aria-labelledby="included-sections-heading">
          <SectionGroupHeader
            id="included-sections-heading"
            title="Included"
            count={visibleSectionKeys.length + 1}
          />
          <ul className="mt-2 flex flex-col gap-1.5">
            <li>
              <SectionRowShell
                active={activeSection === "profile"}
                sectionRowKey="profile"
              >
                <StaticControlSlot>
                  <PinIcon className="size-4" />
                </StaticControlSlot>
                <SectionRowText label="Profile" meta="Name, contact, links" />
                <Button
                  type="button"
                  variant={
                    activeSection === "profile" ? "secondary" : "outline"
                  }
                  size="sm"
                  aria-label="Edit Profile"
                  onClick={() => onRequestSectionChange("profile")}
                >
                  <PencilIcon data-icon="inline-start" />
                  Edit
                </Button>
              </SectionRowShell>
            </li>
          </ul>

          <DndContext
            id="resume-section-outline"
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={visibleSectionKeys}
              strategy={verticalListSortingStrategy}
            >
              <ul className="mt-1.5 flex flex-col gap-1.5">
                {visibleSectionKeys.map((sectionKey, visibleIndex) => (
                  <SortableSectionRow
                    key={sectionKey}
                    draft={draft}
                    active={activeSection === sectionKey}
                    sectionKey={sectionKey}
                    isFirstIncluded={visibleIndex === 0}
                    isLastIncluded={
                      visibleIndex === visibleSectionKeys.length - 1
                    }
                    onRequestSectionChange={onRequestSectionChange}
                    onMoveSection={onMoveSection}
                    onSetSectionVisibility={onSetSectionVisibility}
                  />
                ))}
              </ul>
            </SortableContext>
          </DndContext>
        </section>

        <section
          className="mt-4 border-t pt-4"
          aria-labelledby="available-sections-heading"
        >
          <SectionGroupHeader
            id="available-sections-heading"
            title="Available"
            count={hiddenSectionKeys.length}
          />
          {hiddenSectionKeys.length > 0 ? (
            <ul className="mt-2 flex flex-col gap-1.5">
              {hiddenSectionKeys.map((sectionKey) => (
                <AvailableSectionRow
                  key={sectionKey}
                  draft={draft}
                  sectionKey={sectionKey}
                  onSetSectionVisibility={onSetSectionVisibility}
                />
              ))}
            </ul>
          ) : (
            <p className="mt-2 rounded-md border border-dashed bg-muted/30 px-3 py-2 text-xs text-muted-foreground">
              Every resume section is currently included.
            </p>
          )}
        </section>
      </nav>
    </div>
  );
}

type SectionRowProps = {
  draft: ResumeDraft;
  active: boolean;
  sectionKey: ResumeSectionPanelKey;
  isFirstIncluded: boolean;
  isLastIncluded: boolean;
  onRequestSectionChange: (sectionKey: ResumeEditorPanelKey) => void;
  onMoveSection: (sectionKey: ResumeSectionPanelKey, direction: -1 | 1) => void;
  onSetSectionVisibility: (
    sectionKey: ResumeSectionPanelKey,
    visible: boolean,
  ) => void;
};

function SectionRowShell({
  active,
  children,
  className,
  sectionRowKey,
  style,
}: {
  active?: boolean;
  children: ReactNode;
  className?: string;
  sectionRowKey?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      data-active={active || undefined}
      data-section-row={sectionRowKey}
      className={cn(
        "group flex min-w-0 items-center gap-2 rounded-md border bg-background px-2 py-2 transition-colors",
        active
          ? "border-primary/30 bg-primary/5"
          : "border-border hover:border-muted-foreground/30",
        className,
      )}
      style={style}
    >
      {children}
    </div>
  );
}

function StaticControlSlot({ children }: { children: ReactNode }) {
  return (
    <span className="flex size-7 shrink-0 items-center justify-center rounded-md border bg-muted text-muted-foreground">
      {children}
    </span>
  );
}

function SectionRowText({ label, meta }: { label: string; meta: string }) {
  return (
    <span className="min-w-0 flex-1">
      <span className="block truncate text-sm font-medium">{label}</span>
      <span className="block truncate text-xs text-muted-foreground">
        {meta}
      </span>
    </span>
  );
}

function SectionGroupHeader({
  id,
  title,
  count,
}: {
  id: string;
  title: string;
  count: number;
}) {
  return (
    <div className="flex items-center justify-between gap-3 px-1">
      <h3 id={id} className="text-xs font-semibold uppercase tracking-wide">
        {title}
      </h3>
      <span className="rounded-full bg-muted px-2 py-0.5 text-[0.7rem] font-medium text-muted-foreground">
        {count}
      </span>
    </div>
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

function SortableSectionRow({
  draft,
  active,
  sectionKey,
  // isFirstIncluded,
  // isLastIncluded,
  onRequestSectionChange,
  // onMoveSection,
  onSetSectionVisibility,
}: SectionRowProps) {
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

  return (
    <li ref={setNodeRef} style={style}>
      <SectionRowShell
        active={active}
        sectionRowKey={sectionKey}
        className={cn(isDragging ? "relative z-50 shadow-xl" : "z-0")}
      >
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          aria-label={`Drag ${label}`}
          title={`Drag ${label}`}
          className="cursor-grab touch-none text-muted-foreground active:cursor-grabbing"
          {...attributes}
          {...listeners}
        >
          <GripVerticalIcon />
        </Button>

        <SectionRowText
          label={label}
          meta={getSectionMeta(draft, sectionKey)}
        />

        <ButtonGroup aria-label={`${label} controls`} className="shrink-0">
          <Button
            type="button"
            variant={active ? "secondary" : "outline"}
            size="sm"
            aria-label={`Edit ${label}`}
            onClick={() => onRequestSectionChange(sectionKey)}
          >
            <PencilIcon data-icon="inline-start" />
            Edit
          </Button>
          {/* <Button
            type="button"
            variant="outline"
            size="icon-sm"
            disabled={isFirstIncluded}
            aria-label={`Move ${label} up`}
            title={`Move ${label} up`}
            onClick={() => onMoveSection(sectionKey, -1)}
          >
            <ArrowUpIcon />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            disabled={isLastIncluded}
            aria-label={`Move ${label} down`}
            title={`Move ${label} down`}
            onClick={() => onMoveSection(sectionKey, 1)}
          >
            <ArrowDownIcon />
          </Button> */}
          <Button
            type="button"
            variant="destructive"
            size="icon-sm"
            aria-label={`Hide ${label}`}
            title={`Hide ${label}`}
            onClick={() => onSetSectionVisibility(sectionKey, false)}
          >
            <Trash2Icon />
          </Button>
        </ButtonGroup>
      </SectionRowShell>
    </li>
  );
}

function AvailableSectionRow({
  draft,
  sectionKey,
  onSetSectionVisibility,
}: {
  draft: ResumeDraft;
  sectionKey: ResumeSectionPanelKey;
  onSetSectionVisibility: (
    sectionKey: ResumeSectionPanelKey,
    visible: boolean,
  ) => void;
}) {
  const label = sectionLabels[sectionKey];

  return (
    <li>
      <SectionRowShell
        sectionRowKey={sectionKey}
        className="border-dashed bg-muted/25 text-muted-foreground"
      >
        <StaticControlSlot>
          <EyeOffIcon className="size-4" />
        </StaticControlSlot>
        <SectionRowText
          label={label}
          meta={getSectionMeta(draft, sectionKey)}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          aria-label={`Add ${label}`}
          onClick={() => onSetSectionVisibility(sectionKey, true)}
        >
          <PlusIcon data-icon="inline-start" />
          Add
        </Button>
      </SectionRowShell>
    </li>
  );
}
