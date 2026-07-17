"use client";

import type { UseFieldArrayReturn, UseFormReturn } from "react-hook-form";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowDownIcon,
  ArrowDownNarrowWide,
  ArrowUpIcon,
  ChevronRightIcon,
  PlusIcon,
  Trash2Icon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { CollectionSectionConfigMap } from "@/features/resume-editor/domain/sections/collection-section-config";
import type { CollectionSectionKey } from "@/features/resume-editor/domain/sections/section-metadata";
import { useAutoSave } from "@/features/resume-editor/forms/use-auto-save";
import { CollectionItemFields } from "@/features/resume-editor/forms/fields/collection-item-fields";
import { CollectionItemDeleteDialog } from "@/features/resume-editor/forms/collection-item-delete-dialog";
import {
  getCollectionItemSummary,
  useCollectionItemsForm,
  type CollectionItemsFormValues,
} from "@/features/resume-editor/forms/use-collection-items-form";
import { Collapse } from "@/features/resume-editor/ui/collapse";
import { useListItemMotion } from "@/features/resume-editor/ui/list-motion";
import type { ResumeDraft } from "@/features/resume-editor/domain/schema";
import { cn } from "@/lib/utils";

type CollectionSectionBodyProps = {
  draft: ResumeDraft;
  sectionKey: CollectionSectionKey;
  onSave: (sectionValue: ResumeDraft["sections"][CollectionSectionKey]) => void;
  /** Hides the whole section (keeps its data). Rendered as the toolbar's
   * "Remove section" action; omitted when the section can't be removed. */
  onRemoveSection?: () => void;
};

type ItemFieldArray = UseFieldArrayReturn<
  CollectionItemsFormValues,
  "items",
  "fieldKey"
>;

type CollectionItemCardProps = {
  index: number;
  config: CollectionSectionConfigMap[CollectionSectionKey];
  currentItems: CollectionItemsFormValues["items"] | undefined;
  items: ItemFieldArray;
  isShrunk: boolean;
  onToggleShrunk: () => void;
  onRequestDelete: () => void;
  itemMotion: ReturnType<typeof useListItemMotion>;
  form: UseFormReturn<CollectionItemsFormValues>;
};

function CollectionItemCard({
  index,
  config,
  currentItems,
  items,
  isShrunk,
  onToggleShrunk,
  onRequestDelete,
  itemMotion,
  form,
}: CollectionItemCardProps) {
  const summary = getCollectionItemSummary(
    currentItems?.[index] as Record<string, unknown>,
    config.itemTitle,
    index,
  );

  return (
    <motion.section
      data-testid="collection-item-card"
      {...itemMotion}
      className="flex flex-col overflow-hidden rounded-lg border border-border shadow-[inset_0_1px_0_rgba(255,255,255,0.75)]"
    >
      <div className="flex items-center justify-between gap-3 bg-background px-3 py-2">
        <div className="flex min-w-0 items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="shrink-0"
            onClick={onToggleShrunk}
          >
            <ChevronRightIcon
              className={cn(
                "size-4 transition-transform duration-200",
                !isShrunk && "rotate-90",
              )}
            />
          </Button>
          <button
            type="button"
            className="truncate text-left text-sm font-semibold"
            onClick={onToggleShrunk}
          >
            {summary}
          </button>
        </div>
        <ButtonGroup aria-label={`${config.itemTitle} ${index + 1} actions`}>
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            disabled={index === 0}
            aria-label={`Move ${config.itemTitle.toLowerCase()} ${index + 1} up`}
            title={`Move ${config.itemTitle.toLowerCase()} ${index + 1} up`}
            onClick={() => index > 0 && items.move(index, index - 1)}
          >
            <ArrowUpIcon />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            disabled={index === items.fields.length - 1}
            aria-label={`Move ${config.itemTitle.toLowerCase()} ${index + 1} down`}
            title={`Move ${config.itemTitle.toLowerCase()} ${index + 1} down`}
            onClick={() =>
              index < items.fields.length - 1 && items.move(index, index + 1)
            }
          >
            <ArrowDownIcon />
          </Button>
          <Button
            type="button"
            variant="destructive"
            size="icon-sm"
            disabled={items.fields.length === 1}
            aria-label={`Remove ${config.itemTitle.toLowerCase()} ${index + 1}`}
            title={`Remove ${config.itemTitle.toLowerCase()} ${index + 1}`}
            onClick={() => items.fields.length > 1 && onRequestDelete()}
            className="border! border-l-0! border-border!"
          >
            <Trash2Icon />
          </Button>
        </ButtonGroup>
      </div>
      <Collapse open={!isShrunk}>
        <div className="border-t bg-muted/50 p-3">
          <CollectionItemFields config={config} form={form} index={index} />
        </div>
      </Collapse>
    </motion.section>
  );
}

/**
 * Headerless collection editor (item cards with collapse/move/delete, auto-sort,
 * add, auto-save). Used inside the desktop sidebar and the mobile full-screen
 * form — the surrounding drill-in header supplies the section title.
 */
export function CollectionSectionBody({
  draft,
  sectionKey,
  onSave,
  onRemoveSection,
}: CollectionSectionBodyProps) {
  const {
    config,
    form,
    currentItems,
    items,
    collapsedIds,
    toggleCollapsed,
    pendingDeleteIndex,
    setPendingDeleteIndex,
    itemMotion,
    dateRangeField,
    autoSort,
    toSectionValue,
  } = useCollectionItemsForm(draft, sectionKey);

  useAutoSave(form, (values) => {
    onSave(toSectionValue(values));
  });

  return (
    <div className="flex flex-col gap-3">
      {/* Section toolbar: Auto-sort (when items carry a date range) + Remove.
          The section row already shows the item count. */}
      {dateRangeField || onRemoveSection ? (
        <div className="flex items-center gap-2">
          {dateRangeField ? (
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={autoSort}
                    aria-label="Auto-sort items by date range"
                  >
                    <ArrowDownNarrowWide />
                    Auto-sort
                  </Button>
                }
              />
              <TooltipContent>Sort items by date range</TooltipContent>
            </Tooltip>
          ) : null}
          {onRemoveSection ? (
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="ml-auto"
              onClick={onRemoveSection}
            >
              <Trash2Icon />
              Remove section
            </Button>
          ) : null}
        </div>
      ) : null}

      {items.fields.length === 0 ? (
        <div className="rounded-md border border-dashed px-4 py-6 text-center text-sm text-muted-foreground">
          No items added yet. Add the first entry to bring this section into the
          preview.
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <AnimatePresence initial={false}>
            {items.fields.map((field, index) => (
              <CollectionItemCard
                key={field.fieldKey}
                index={index}
                config={config}
                currentItems={currentItems}
                items={items}
                isShrunk={collapsedIds.has(field.fieldKey)}
                onToggleShrunk={() => toggleCollapsed(field.fieldKey)}
                onRequestDelete={() => setPendingDeleteIndex(index)}
                itemMotion={itemMotion}
                form={form}
              />
            ))}
          </AnimatePresence>
        </div>
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
