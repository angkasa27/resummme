"use client";

import { useMemo, useState } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
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
import { ConfirmDeleteDialog } from "@/components/ui/confirm-delete-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { collectionSectionConfigs } from "@/features/resume-editor/domain/sections/collection-section-config";
import type { CollectionSectionKey } from "@/features/resume-editor/domain/sections/section-metadata";
import { normalizeCollectionItem } from "@/features/resume-editor/domain/sections/normalize-collection-item";
import { collectionSectionFormSchemaMap } from "@/features/resume-editor/forms/collection-section-form-schema-map";
import { createFormSchemaResolver } from "@/features/resume-editor/forms/schemas/create-form-schema-resolver";
import { useAutoSave } from "@/features/resume-editor/forms/use-auto-save";
import { useSyncedFormValues } from "@/features/resume-editor/forms/use-synced-form-values";
import { CollectionItemFields } from "@/features/resume-editor/shared/fields/collection-item-fields";
import { Collapse } from "@/features/resume-editor/shared/collapse";
import { sortResumeItems } from "@/features/resume-editor/domain/sections/sort-resume-items";
import type { ResumeDraft } from "@/features/resume-editor/domain/schema";
import { cn } from "@/lib/utils";

type CollectionSectionFormValues = {
  items: ResumeDraft["sections"][CollectionSectionKey]["items"];
};

type CollectionSectionBodyProps = {
  draft: ResumeDraft;
  sectionKey: CollectionSectionKey;
  onSave: (sectionValue: ResumeDraft["sections"][CollectionSectionKey]) => void;
  /** Hides the whole section (keeps its data). Rendered as the toolbar's
   * "Remove section" action; omitted when the section can't be removed. */
  onRemoveSection?: () => void;
};

/**
 * Headerless collection editor (item cards with collapse/move/delete, auto-sort,
 * add, auto-save). Used inside the desktop accordion and the mobile full-screen
 * form — the surrounding row/header supplies the section title.
 */
export function CollectionSectionBody({
  draft,
  sectionKey,
  onSave,
  onRemoveSection,
}: CollectionSectionBodyProps) {
  const config = collectionSectionConfigs[sectionKey];
  const sectionValue = draft.sections[sectionKey];
  const formValues = useMemo<CollectionSectionFormValues>(
    () => ({
      items:
        sectionValue.items.length > 0
          ? (sectionValue.items.map((item) =>
              normalizeCollectionItem(item, config.createItem()),
            ) as unknown as CollectionSectionFormValues["items"])
          : ([
              config.createItem(),
            ] as unknown as CollectionSectionFormValues["items"]),
    }),
    [config, sectionValue.items],
  );
  const form = useForm<CollectionSectionFormValues>({
    resolver: createFormSchemaResolver<CollectionSectionFormValues>(
      collectionSectionFormSchemaMap[sectionKey],
    ),
    defaultValues: formValues,
    mode: "onBlur",
    reValidateMode: "onChange",
  });
  const { control } = form;
  const currentItems = useWatch({ control, name: "items" });
  const items = useFieldArray({ control, name: "items", keyName: "fieldKey" });

  const [shrunkIds, setShrunkIds] = useState<Set<string>>(
    () => new Set(items.fields.slice(1).map((f) => f.fieldKey)),
  );
  const [pendingDeleteIndex, setPendingDeleteIndex] = useState<number | null>(
    null,
  );

  useSyncedFormValues(form, formValues);
  useAutoSave(form, (values) => {
    onSave({
      ...sectionValue,
      items: values.items.map((item) =>
        normalizeCollectionItem(item, config.createItem()),
      ),
    } as ResumeDraft["sections"][CollectionSectionKey]);
  });

  function toggleShrunk(id: string) {
    setShrunkIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const dateRangeField = config.fields.find((f) => f.kind === "dateRange");

  function autoSort() {
    if (!dateRangeField || dateRangeField.kind !== "dateRange") return;
    const sorted = sortResumeItems(
      form.getValues().items as unknown as Record<string, unknown>[],
      dateRangeField.startName,
      dateRangeField.endName,
    );
    form.setValue(
      "items",
      sorted as unknown as CollectionSectionFormValues["items"],
      { shouldDirty: true },
    );
  }

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
          {items.fields.map((field, index) => (
            <section
              key={field.fieldKey}
              data-testid="collection-item-card"
              className="flex flex-col overflow-hidden rounded-lg border border-border shadow-[inset_0_1px_0_rgba(255,255,255,0.75)]"
            >
              <div className="flex items-center justify-between gap-3 bg-background px-3 py-2">
                <div className="flex min-w-0 items-center gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    className="shrink-0"
                    onClick={() => toggleShrunk(field.fieldKey)}
                  >
                    <ChevronRightIcon
                      className={cn(
                        "size-4 transition-transform duration-200",
                        !shrunkIds.has(field.fieldKey) && "rotate-90",
                      )}
                    />
                  </Button>
                  <button
                    type="button"
                    className="truncate text-left text-sm font-semibold"
                    onClick={() => toggleShrunk(field.fieldKey)}
                  >
                    {(() => {
                      const item = currentItems?.[index] as Record<
                        string,
                        unknown
                      >;
                      const representativeValue = (item?.companyName ||
                        item?.projectName ||
                        item?.name ||
                        item?.title ||
                        item?.certificationName ||
                        item?.language ||
                        item?.categoryName ||
                        item?.organizationName) as string | undefined;
                      return (
                        representativeValue ||
                        `${config.itemTitle} ${index + 1}`
                      );
                    })()}
                  </button>
                </div>
                <ButtonGroup
                  aria-label={`${config.itemTitle} ${index + 1} actions`}
                >
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
                    disabled={items.fields.length === 1}
                    aria-label={`Remove ${config.itemTitle.toLowerCase()} ${index + 1}`}
                    title={`Remove ${config.itemTitle.toLowerCase()} ${index + 1}`}
                    onClick={() =>
                      items.fields.length > 1 && setPendingDeleteIndex(index)
                    }
                    className="border! border-l-0! border-border!"
                  >
                    <Trash2Icon />
                  </Button>
                </ButtonGroup>
              </div>
              <Collapse open={!shrunkIds.has(field.fieldKey)}>
                <div className="border-t bg-muted/50 p-3">
                  <CollectionItemFields
                    config={config}
                    form={form}
                    index={index}
                  />
                </div>
              </Collapse>
            </section>
          ))}
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
    </div>
  );
}
