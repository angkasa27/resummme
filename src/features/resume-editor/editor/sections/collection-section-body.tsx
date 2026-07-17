"use client";

import { closestCenter, DndContext } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { AnimatePresence } from "motion/react";
import { PlusIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { CollectionSectionKey } from "@/features/resume-editor/domain/sections/section-metadata";
import { useAutoSave } from "@/features/resume-editor/forms/use-auto-save";
import { CollectionItemFields } from "@/features/resume-editor/forms/fields/collection-item-fields";
import { CollectionItemDeleteDialog } from "@/features/resume-editor/forms/collection-item-delete-dialog";
import {
  getCollectionItemSummary,
  useCollectionItemsForm,
} from "@/features/resume-editor/forms/use-collection-items-form";
import { CollectionItemRow } from "@/features/resume-editor/editor/sections/collection-item-row";
import { useDndReorder } from "@/features/resume-editor/editor/sections/use-dnd-reorder";
import type { ResumeDraft } from "@/features/resume-editor/domain/schema";

type CollectionSectionBodyProps = {
  draft: ResumeDraft;
  sectionKey: CollectionSectionKey;
  onSave: (sectionValue: ResumeDraft["sections"][CollectionSectionKey]) => void;
};

/**
 * Headerless collection editor: drag-sortable item rows that expand to their
 * fields, plus add and auto-save. The section's own actions (auto-sort, remove)
 * live on its row in the section list, not in here.
 */
export function CollectionSectionBody({
  draft,
  sectionKey,
  onSave,
}: CollectionSectionBodyProps) {
  const {
    config,
    form,
    currentItems,
    items,
    collapsedIds,
    toggleCollapsed,
    collapseItem,
    pendingDeleteIndex,
    setPendingDeleteIndex,
    toSectionValue,
  } = useCollectionItemsForm(draft, sectionKey);

  useAutoSave(form, (values) => {
    onSave(toSectionValue(values));
  });

  // Reorder stays in react-hook-form. Routing it through the store would feed
  // `useSyncedFormValues` a changed draft, which resets the form: that drops
  // keystrokes still inside the autosave debounce, regenerates every fieldKey
  // (losing collapse state and churning the dnd-kit ids mid-drop). `items.move`
  // marks the form dirty, so autosave commits it and undo still covers it.
  const { sensors, onDragEnd } = useDndReorder<string>((activeId, overId) => {
    const from = items.fields.findIndex((f) => f.id === activeId);
    const to = items.fields.findIndex((f) => f.id === overId);
    if (from < 0 || to < 0) return;
    items.move(from, to);
  });

  return (
    <div className="flex flex-col gap-2">
      {items.fields.length === 0 ? (
        <div className="rounded-md border border-dashed px-4 py-6 text-center text-sm text-muted-foreground">
          No items added yet. Add the first entry to bring this section into the
          preview.
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          // Collapse the item being dragged: an expanded card is ~600px tall,
          // which makes it unwieldy to drop and leaves keyboard reordering
          // unable to step past its neighbour at all.
          onDragStart={(event) => collapseItem(String(event.active.id))}
          onDragEnd={onDragEnd}
        >
          <SortableContext
            items={items.fields.map((field) => field.id)}
            strategy={verticalListSortingStrategy}
          >
            {/* Row list — 8px, same as the section list. */}
            <div className="flex flex-col gap-2">
              <AnimatePresence initial={false}>
                {items.fields.map((field, index) => (
                  <CollectionItemRow
                    key={field.id}
                    itemId={field.id}
                    summary={getCollectionItemSummary(
                      currentItems?.[index] as Record<string, unknown>,
                      config.itemTitle,
                      index,
                    )}
                    itemTitle={config.itemTitle}
                    open={!collapsedIds.has(field.id)}
                    onToggle={() => toggleCollapsed(field.id)}
                    onRequestDelete={() => setPendingDeleteIndex(index)}
                    deleteDisabled={items.fields.length === 1}
                  >
                    <CollectionItemFields
                      config={config}
                      form={form}
                      index={index}
                    />
                  </CollectionItemRow>
                ))}
              </AnimatePresence>
            </div>
          </SortableContext>
        </DndContext>
      )}

      <Button
        type="button"
        className="w-full"
        onClick={() => items.append(config.createItem() as never)}
      >
        <PlusIcon data-icon="inline-start" />
        {config.addLabel}
      </Button>
      <CollectionItemDeleteDialog
        pendingDeleteIndex={pendingDeleteIndex}
        onOpenChange={setPendingDeleteIndex}
        onRemove={items.remove}
        itemTitle={config.itemTitle}
      />
    </div>
  );
}
