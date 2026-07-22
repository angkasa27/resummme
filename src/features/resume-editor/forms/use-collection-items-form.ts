import { useMemo, useState } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";

import { collectionSectionConfigs } from "@/features/resume-editor/domain/sections/collection-section-config";
import type { CollectionSectionKey } from "@/features/resume-editor/domain/sections/section-metadata";
import { normalizeCollectionItem } from "@/features/resume-editor/domain/sections/normalize-collection-item";
import { collectionSectionFormSchemaMap } from "@/features/resume-editor/forms/collection-section-form-schema-map";
import { createFormSchemaResolver } from "@/features/resume-editor/forms/schemas/create-form-schema-resolver";
import type { ResumeDraft } from "@/features/resume-editor/domain/schema";

export type CollectionItemsFormValues = {
  items: ResumeDraft["sections"][CollectionSectionKey]["items"];
};

/** Item field names, in priority order, used to label a collapsed item card. */
const summaryFieldNames = [
  "companyName",
  "projectName",
  "name",
  "title",
  "certificationName",
  "language",
  "categoryName",
  "organizationName",
] as const;

/**
 * First non-empty representative value for a collection item (e.g. the company
 * or project name), falling back to a positional label like "Experience 2".
 */
export function getCollectionItemSummary(
  item: Record<string, unknown> | undefined,
  itemTitle: string,
  index: number,
): string {
  for (const name of summaryFieldNames) {
    const value = item?.[name];
    if (value) return value as string;
  }
  return `${itemTitle} ${index + 1}`;
}

/**
 * Shared state and handlers for a collection section editor: the react-hook-form
 * field array, per-item collapse tracking, pending-delete index, list motion,
 * and save normalization. The surrounding surface owns persistence and layout.
 * Auto-sort lives on the store — it fires from the section list, where no form
 * is mounted.
 */
export function useCollectionItemsForm(
  draft: ResumeDraft,
  sectionKey: CollectionSectionKey,
) {
  const config = collectionSectionConfigs[sectionKey];
  const sectionValue = draft.sections[sectionKey];

  const formValues = useMemo<CollectionItemsFormValues>(
    () => ({
      items:
        sectionValue.items.length > 0
          ? (sectionValue.items.map((item) =>
              normalizeCollectionItem(item, config.createItem()),
            ) as unknown as CollectionItemsFormValues["items"])
          : ([
              config.createItem(),
            ] as unknown as CollectionItemsFormValues["items"]),
    }),
    [config, sectionValue.items],
  );

  const form = useForm<CollectionItemsFormValues>({
    resolver: createFormSchemaResolver<CollectionItemsFormValues>(
      collectionSectionFormSchemaMap[sectionKey],
    ),
    defaultValues: formValues,
    mode: "onBlur",
    reValidateMode: "onChange",
  });
  const { control } = form;
  const currentItems = useWatch({ control, name: "items" });
  const items = useFieldArray({ control, name: "items", keyName: "fieldKey" });

  // Keyed by the item's own id, not react-hook-form's `fieldKey`: RHF mints a
  // fresh fieldKey on `move()`, so tracking by it silently re-opens every card
  // the moment you reorder.
  const [collapsedIds, setCollapsedIds] = useState<Set<string>>(
    () => new Set(items.fields.slice(1).map((f) => f.id)),
  );
  const [pendingDeleteIndex, setPendingDeleteIndex] = useState<number | null>(
    null,
  );

  function toggleCollapsed(id: string) {
    setCollapsedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function collapseItem(id: string) {
    setCollapsedIds((prev) => (prev.has(id) ? prev : new Set(prev).add(id)));
  }

  /** Normalizes edited form items back into a persistable section value. */
  function toSectionValue(values: CollectionItemsFormValues) {
    return {
      ...sectionValue,
      items: values.items.map((item) =>
        normalizeCollectionItem(item, config.createItem()),
      ),
    } as ResumeDraft["sections"][CollectionSectionKey];
  }

  return {
    config,
    form,
    formValues,
    currentItems,
    items,
    collapsedIds,
    toggleCollapsed,
    collapseItem,
    pendingDeleteIndex,
    setPendingDeleteIndex,
    toSectionValue,
  };
}
