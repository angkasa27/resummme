"use client";

import { useMemo, useState } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  HistoryIcon,
  PlusIcon,
  Trash2Icon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { ConfirmDeleteDialog } from "@/components/ui/confirm-delete-dialog";
import { collectionSectionConfigs } from "@/features/resume-editor/editor/sections/config/collection-section-config";
import type { CollectionSectionKey } from "@/features/resume-editor/domain/sections/section-metadata";
import { normalizeCollectionItem } from "@/features/resume-editor/domain/sections/normalize-collection-item";
import { collectionSectionFormSchemaMap } from "@/features/resume-editor/forms/collection-section-form-schema-map";
import { createFormSchemaResolver } from "@/features/resume-editor/forms/schemas/create-form-schema-resolver";
import { useAutoSave } from "@/features/resume-editor/forms/use-auto-save";
import { useSyncedFormValues } from "@/features/resume-editor/forms/use-synced-form-values";
import { CollectionItemFields } from "@/features/resume-editor/editor/sections/collection-item-fields";
import { EditorCard } from "@/features/resume-editor/editor/sections/editor-card";
import { sortResumeItems } from "@/features/resume-editor/editor/sections/sort-resume-items";
import type { ResumeDraft } from "@/features/resume-editor/domain/schema";

type CollectionSectionFormValues = {
  items: ResumeDraft["sections"][CollectionSectionKey]["items"];
};

type CollectionSectionPanelProps = {
  draft: ResumeDraft;
  sectionKey: CollectionSectionKey;
  onSave: (sectionValue: ResumeDraft["sections"][CollectionSectionKey]) => void;
};

export function CollectionSectionPanel({
  draft,
  sectionKey,
  onSave,
}: CollectionSectionPanelProps) {
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
  const currentItems = useWatch({
    control,
    name: "items",
  });
  const items = useFieldArray({
    control,
    name: "items",
    keyName: "fieldKey",
  });

  const [shrunkIds, setShrunkIds] = useState<Set<string>>(
    () => new Set(items.fields.slice(1).map((f) => f.fieldKey)),
  );
  const [pendingDeleteIndex, setPendingDeleteIndex] = useState<number | null>(null);

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
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  return (
    <EditorCard
      title={config.title}
      meta={
        <div className="flex items-center gap-2">
          {config.fields.some((f) => f.kind === "dateRange") && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-6 px-2 text-[10px]"
              onClick={() => {
                const dateRangeField = config.fields.find(
                  (f) => f.kind === "dateRange",
                );
                if (dateRangeField && dateRangeField.kind === "dateRange") {
                  const sorted = sortResumeItems(
                    form.getValues().items as unknown as Record<
                      string,
                      unknown
                    >[],
                    dateRangeField.startName,
                    dateRangeField.endName,
                  );
                  form.setValue(
                    "items",
                    sorted as unknown as CollectionSectionFormValues["items"],
                    { shouldDirty: true },
                  );
                }
              }}
            >
              <HistoryIcon className="mr-1 size-3" />
              Auto-sort
            </Button>
          )}
          <Badge variant="secondary">
            {currentItems?.length ?? 0} item
            {(currentItems?.length ?? 0) === 1 ? "" : "s"}
          </Badge>
        </div>
      }
    >
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
              className="flex flex-col rounded-lg border border-border shadow-[inset_0_1px_0_rgba(255,255,255,0.75)] overflow-hidden"
            >
              <div className="flex items-center justify-between gap-3 bg-background px-3 py-2">
                <div className="flex items-center gap-1 min-w-0">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    className="shrink-0"
                    onClick={() => toggleShrunk(field.fieldKey)}
                  >
                    {shrunkIds.has(field.fieldKey) ? (
                      <ChevronRightIcon className="size-4" />
                    ) : (
                      <ChevronDownIcon className="size-4" />
                    )}
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
              {!shrunkIds.has(field.fieldKey) && (
                <div className="p-3 border-t bg-muted/50">
                  <CollectionItemFields
                    config={config}
                    form={form}
                    index={index}
                  />
                </div>
              )}{" "}
            </section>
          ))}
        </div>
      )}

      <Button
        type="button"
        className="mt-3 w-full"
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
    </EditorCard>
  );
}
