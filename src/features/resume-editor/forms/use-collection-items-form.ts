import { useMemo, useState } from "react";
import { useFieldArray, useForm, useWatch, type Resolver } from "react-hook-form";

import { collectionSectionConfigs } from "@/features/resume-editor/domain/sections/collection-section-config";
import type { CollectionSectionKey } from "@/features/resume-editor/domain/sections/section-metadata";
import { normalizeCollectionItem } from "@/features/resume-editor/domain/sections/normalize-collection-item";
import { collectionSectionFormSchemaMap } from "@/features/resume-editor/forms/collection-section-form-schema-map";
import { zodResolver } from "@hookform/resolvers/zod";
import type { ResumeDraft } from "@/features/resume-editor/domain/schema";

type CollectionItemsFormValues = {
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

/** First non-empty representative value for an item (e.g. company name), else a positional label like "Experience 2". */
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

/** A form row is a real item only if it carries an id — see `toSectionValue`. */
function isRealItem(item: unknown): boolean {
  return Boolean((item as { id?: string } | undefined)?.id);
}

/**
 * Shared state and handlers for a collection section editor: the field array,
 * collapse tracking, pending-delete index, and save normalization.
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
    resolver: zodResolver(collectionSectionFormSchemaMap[sectionKey]) as Resolver<CollectionItemsFormValues>,
    defaultValues: formValues,
    mode: "onBlur",
    reValidateMode: "onChange",
  });
  const { control } = form;
  const currentItems = useWatch({ control, name: "items" });
  const items = useFieldArray({ control, name: "items", keyName: "fieldKey" });

  // Single-open accordion, keyed by the item's id, not RHF's `fieldKey`:
  // `move()` mints a fresh one, so tracking by it would silently re-open every
  // card on reorder. Clicking the open card closes it — zero-open is allowed.
  const [openId, setOpenId] = useState<string | null>(
    () => items.fields[0]?.id ?? null,
  );
  const [pendingDeleteIndex, setPendingDeleteIndex] = useState<number | null>(
    null,
  );

  // A freshly added item opens (closing the previous one) so it's ready to edit.
  // Driven by the add itself, never by a growing `fields.length`: a re-seed
  // (undo, redo, import) rebuilds the array too, and would yank the open card
  // to the end of the list. Returns the new id so callers can focus it.
  function addItem() {
    const item = config.createItem() as { id: string };
    items.append(item as never);
    setOpenId(item.id);
    return item.id;
  }

  function toggleOpen(id: string) {
    setOpenId((prev) => (prev === id ? null : id));
  }

  function collapseAll() {
    setOpenId(null);
  }

  function toSectionValue(values: CollectionItemsFormValues) {
    return {
      ...sectionValue,
      // Invariant 3: a removed row lives on through its exit animation and writes
      // a partial back into the spliced-out index. Normalizing that resurrects it.
      items: values.items
        .filter(isRealItem)
        .map((item) => normalizeCollectionItem(item, config.createItem())),
    } as ResumeDraft["sections"][CollectionSectionKey];
  }

  return {
    config,
    form,
    formValues,
    currentItems,
    items,
    addItem,
    openId,
    toggleOpen,
    collapseAll,
    pendingDeleteIndex,
    setPendingDeleteIndex,
    toSectionValue,
  };
}
