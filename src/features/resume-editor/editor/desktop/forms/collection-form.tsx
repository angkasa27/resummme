"use client";

import { useEffect, useId, useMemo, useState } from "react";
import { ConfirmDeleteDialog } from "@/components/ui/confirm-delete-dialog";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
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
import { collectionSectionConfigs } from "@/features/resume-editor/domain/sections/collection-section-config";
import { collectionSectionFormSchemaMap } from "@/features/resume-editor/forms/collection-section-form-schema-map";
import { createFormSchemaResolver } from "@/features/resume-editor/forms/schemas/create-form-schema-resolver";
import { useSyncedFormValues } from "@/features/resume-editor/forms/use-synced-form-values";
import { CollectionItemFields } from "@/features/resume-editor/forms/fields/collection-item-fields";
import { useListItemMotion } from "@/features/resume-editor/ui/list-motion";
import { sortResumeItems } from "@/features/resume-editor/domain/sections/sort-resume-items";
import { normalizeCollectionItem } from "@/features/resume-editor/domain/sections/normalize-collection-item";
import type { CollectionSectionKey } from "@/features/resume-editor/domain/sections/section-metadata";
import type { ResumeDraft } from "@/features/resume-editor/domain/schema";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type CollectionFormValues = {
  items: ResumeDraft["sections"][CollectionSectionKey]["items"];
};

type DesktopCollectionFormProps = {
  draft: ResumeDraft;
  sectionKey: CollectionSectionKey;
  onSave: (value: ResumeDraft["sections"][CollectionSectionKey]) => void;
  onCancel: () => void;
  onClose: () => void;
  onDirtyChange?: (dirty: boolean) => void;
};

export function DesktopCollectionForm({
  draft,
  sectionKey,
  onSave,
  onCancel,
  onClose,
  onDirtyChange,
}: DesktopCollectionFormProps) {
  const config = collectionSectionConfigs[sectionKey];
  const sectionValue = draft.sections[sectionKey];

  const formValues = useMemo<CollectionFormValues>(
    () => ({
      items:
        sectionValue.items.length > 0
          ? (sectionValue.items.map((item) =>
              normalizeCollectionItem(item, config.createItem()),
            ) as unknown as CollectionFormValues["items"])
          : ([config.createItem()] as unknown as CollectionFormValues["items"]),
    }),
    [config, sectionValue.items],
  );

  const form = useForm<CollectionFormValues>({
    resolver: createFormSchemaResolver<CollectionFormValues>(
      collectionSectionFormSchemaMap[sectionKey],
    ),
    defaultValues: formValues,
    mode: "onBlur",
    reValidateMode: "onChange",
  });
  const { control } = form;
  const currentItems = useWatch({ control, name: "items" });
  const items = useFieldArray({
    control,
    name: "items",
    keyName: "fieldKey",
  });

  const [collapsedIds, setCollapsedIds] = useState<Set<string>>(
    () => new Set(items.fields.slice(1).map((f) => f.fieldKey)),
  );
  const [pendingDeleteIndex, setPendingDeleteIndex] = useState<number | null>(
    null,
  );
  const itemMotion = useListItemMotion();

  useSyncedFormValues(form, formValues);

  const formId = useId();
  const { formState, handleSubmit } = form;

  useEffect(() => {
    onDirtyChange?.(formState.isDirty);
  }, [formState.isDirty, onDirtyChange]);

  function handleSave(values: CollectionFormValues) {
    onSave({
      ...sectionValue,
      items: values.items.map((item) =>
        normalizeCollectionItem(item, config.createItem()),
      ),
    } as ResumeDraft["sections"][CollectionSectionKey]);
    onClose();
  }

  function toggleCollapsed(id: string) {
    setCollapsedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  const dateRangeField = config.fields.find((f) => f.kind === "dateRange");

  function handleAutoSort() {
    if (!dateRangeField || dateRangeField.kind !== "dateRange") return;
    const sorted = sortResumeItems(
      form.getValues().items as unknown as Record<string, unknown>[],
      dateRangeField.startName,
      dateRangeField.endName,
    );
    form.setValue("items", sorted as unknown as CollectionFormValues["items"], {
      shouldDirty: true,
    });
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
                      onClick={handleAutoSort}
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
              {items.fields.map((field, index) => {
                const item = currentItems?.[index] as Record<string, unknown>;
                const summary =
                  ((item?.companyName ||
                    item?.projectName ||
                    item?.name ||
                    item?.title ||
                    item?.certificationName ||
                    item?.language ||
                    item?.categoryName ||
                    item?.organizationName) as string | undefined) ||
                  `${config.itemTitle} ${index + 1}`;
                const isCollapsed = collapsedIds.has(field.fieldKey);

                return (
                  <motion.section
                    key={field.fieldKey}
                    data-testid="collection-item-card"
                    {...itemMotion}
                    className="overflow-hidden rounded-md border bg-background/50"
                  >
                    <div className="flex items-center justify-between gap-2 px-2 py-1.5">
                      <button
                        type="button"
                        className="flex min-w-0 flex-1 items-center gap-1 text-left"
                        onClick={() => toggleCollapsed(field.fieldKey)}
                      >
                        {isCollapsed ? (
                          <ChevronRightIcon className="size-4 shrink-0 text-muted-foreground" />
                        ) : (
                          <ChevronDownIcon className="size-4 shrink-0 text-muted-foreground" />
                        )}
                        <span className="truncate text-sm font-medium">
                          {summary}
                        </span>
                      </button>
                      <ButtonGroup
                        aria-label={`${config.itemTitle} ${index + 1} actions`}
                      >
                        <Button
                          type="button"
                          variant="outline"
                          size="icon-sm"
                          disabled={index === 0}
                          aria-label={`Move up`}
                          onClick={() =>
                            index > 0 && items.move(index, index - 1)
                          }
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
                            index < items.fields.length - 1 &&
                            items.move(index, index + 1)
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
                          onClick={() =>
                            items.fields.length > 1 &&
                            setPendingDeleteIndex(index)
                          }
                        >
                          <Trash2Icon className="text-destructive" />
                        </Button>
                      </ButtonGroup>
                    </div>
                    {!isCollapsed ? (
                      <div className="border-t bg-muted/40 p-3">
                        <CollectionItemFields
                          config={config}
                          form={
                            form as unknown as Parameters<
                              typeof CollectionItemFields
                            >[0]["form"]
                          }
                          index={index}
                        />
                      </div>
                    ) : null}
                  </motion.section>
                );
              })}
            </AnimatePresence>
          </div>
        )}
        <ConfirmDeleteDialog
          open={pendingDeleteIndex !== null}
          onOpenChange={(open) => {
            if (!open) setPendingDeleteIndex(null);
          }}
          onConfirm={() => {
            if (pendingDeleteIndex !== null) items.remove(pendingDeleteIndex);
          }}
          title={`Remove ${config.itemTitle.toLowerCase()}?`}
          description="This item will be permanently removed from the section."
        />
      </FormShell>
    </form>
  );
}
