"use client";

import { useEffect, useId } from "react";
import type { UseFieldArrayReturn, UseFormReturn } from "react-hook-form";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowDownIcon,
  ArrowDownNarrowWide,
  ArrowUpIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  PlusIcon,
  Trash2Icon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";

import { FormShell } from "@/features/resume-editor/editor/desktop/forms/form-shell";
import { SectionIcon } from "@/features/resume-editor/ui/section-icons";
import type { CollectionSectionConfigMap } from "@/features/resume-editor/domain/sections/collection-section-config";
import { CollectionItemFields } from "@/features/resume-editor/forms/fields/collection-item-fields";
import { CollectionItemDeleteDialog } from "@/features/resume-editor/forms/collection-item-delete-dialog";
import {
  getCollectionItemSummary,
  useCollectionItemsForm,
  type CollectionItemsFormValues,
} from "@/features/resume-editor/forms/use-collection-items-form";
import { useListItemMotion } from "@/features/resume-editor/ui/list-motion";
import type { CollectionSectionKey } from "@/features/resume-editor/domain/sections/section-metadata";
import type { ResumeDraft } from "@/features/resume-editor/domain/schema";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type DesktopCollectionFormProps = {
  draft: ResumeDraft;
  sectionKey: CollectionSectionKey;
  onSave: (value: ResumeDraft["sections"][CollectionSectionKey]) => void;
  onCancel: () => void;
  onClose: () => void;
  onDirtyChange?: (dirty: boolean) => void;
};

type ItemFieldArray = UseFieldArrayReturn<
  CollectionItemsFormValues,
  "items",
  "fieldKey"
>;

type DesktopCollectionItemCardProps = {
  index: number;
  config: CollectionSectionConfigMap[CollectionSectionKey];
  currentItems: CollectionItemsFormValues["items"] | undefined;
  items: ItemFieldArray;
  isCollapsed: boolean;
  onToggleCollapsed: () => void;
  onRequestDelete: () => void;
  itemMotion: ReturnType<typeof useListItemMotion>;
  form: UseFormReturn<CollectionItemsFormValues>;
};

function DesktopCollectionItemCard({
  index,
  config,
  currentItems,
  items,
  isCollapsed,
  onToggleCollapsed,
  onRequestDelete,
  itemMotion,
  form,
}: DesktopCollectionItemCardProps) {
  const summary = getCollectionItemSummary(
    currentItems?.[index] as Record<string, unknown>,
    config.itemTitle,
    index,
  );

  return (
    <motion.section
      data-testid="collection-item-card"
      {...itemMotion}
      className="overflow-hidden rounded-md border bg-background/50"
    >
      <div className="flex items-center justify-between gap-2 px-2 py-1.5">
        <button
          type="button"
          className="flex min-w-0 flex-1 items-center gap-1 text-left"
          onClick={onToggleCollapsed}
        >
          {isCollapsed ? (
            <ChevronRightIcon className="size-4 shrink-0 text-muted-foreground" />
          ) : (
            <ChevronDownIcon className="size-4 shrink-0 text-muted-foreground" />
          )}
          <span className="truncate text-sm font-medium">{summary}</span>
        </button>
        <ButtonGroup aria-label={`${config.itemTitle} ${index + 1} actions`}>
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            disabled={index === 0}
            aria-label={`Move up`}
            onClick={() => index > 0 && items.move(index, index - 1)}
          >
            <ArrowUpIcon />
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon-sm"
            disabled={index === items.fields.length - 1}
            aria-label={`Move down`}
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
            aria-label={`Remove`}
            disabled={items.fields.length === 1}
            className="border border-border! border-l-0"
            onClick={() => items.fields.length > 1 && onRequestDelete()}
          >
            <Trash2Icon className="text-destructive" />
          </Button>
        </ButtonGroup>
      </div>
      {!isCollapsed ? (
        <div className="border-t bg-muted/40 p-3">
          <CollectionItemFields config={config} form={form} index={index} />
        </div>
      ) : null}
    </motion.section>
  );
}

export function DesktopCollectionForm({
  draft,
  sectionKey,
  onSave,
  onCancel,
  onClose,
  onDirtyChange,
}: DesktopCollectionFormProps) {
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

  const formId = useId();
  const { formState, handleSubmit } = form;

  useEffect(() => {
    onDirtyChange?.(formState.isDirty);
  }, [formState.isDirty, onDirtyChange]);

  function handleSave(values: CollectionItemsFormValues) {
    onSave(toSectionValue(values));
    onClose();
  }

  return (
    <form
      id={formId}
      onSubmit={handleSubmit(handleSave)}
      className="flex h-full min-h-0 flex-col"
    >
      <FormShell
        title={config.title}
        icon={<SectionIcon sectionKey={sectionKey} />}
        formId={formId}
        isDirty={formState.isDirty}
        isSaving={formState.isSubmitting}
        meta={
          <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
            {currentItems?.length ?? 0} item
            {(currentItems?.length ?? 0) === 1 ? "" : "s"}
          </span>
        }
        headerActions={
          <>
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
                      <ArrowDownNarrowWide data-icon="inline-start" />
                      Auto-sort
                    </Button>
                  }
                />
                <TooltipContent>Sort items by date range</TooltipContent>
              </Tooltip>
            ) : null}
            <Button
              type="button"
              size="sm"
              onClick={() => items.append(config.createItem() as never)}
            >
              <PlusIcon data-icon="inline-start" />
              {config.addLabel}
            </Button>
          </>
        }
        onCancel={onCancel}
      >
        {items.fields.length === 0 ? (
          <div className="rounded-md border border-dashed px-4 py-6 text-center text-sm text-muted-foreground">
            No items added yet.
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            <AnimatePresence initial={false}>
              {items.fields.map((field, index) => (
                <DesktopCollectionItemCard
                  key={field.fieldKey}
                  index={index}
                  config={config}
                  currentItems={currentItems}
                  items={items}
                  isCollapsed={collapsedIds.has(field.fieldKey)}
                  onToggleCollapsed={() => toggleCollapsed(field.fieldKey)}
                  onRequestDelete={() => setPendingDeleteIndex(index)}
                  itemMotion={itemMotion}
                  form={form}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
        <CollectionItemDeleteDialog
          pendingDeleteIndex={pendingDeleteIndex}
          onOpenChange={setPendingDeleteIndex}
          onRemove={items.remove}
          itemTitle={config.itemTitle}
        />
      </FormShell>
    </form>
  );
}
