"use client";

import { useMemo } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { ArrowDownIcon, ArrowUpIcon, PlusIcon, Trash2Icon } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { collectionSectionConfigs } from "@/features/resume-editor/config/collection-section-config";
import type { CollectionSectionKey } from "@/features/resume-editor/config/section-metadata";
import { useSectionFormState } from "@/features/resume-editor/hooks/use-section-form-state";
import { createSchemaResolver } from "@/features/resume-editor/lib/form-resolver";
import { collectionSectionFormSchemaMap } from "@/features/resume-editor/lib/section-schemas";
import { CollectionItemFields } from "@/features/resume-editor/sections/collection-item-fields";
import { EditorCard } from "@/features/resume-editor/sections/editor-card";
import type { ResumeDraft } from "@/lib/resume/schema";

type CollectionSectionFormValues = {
  items: ResumeDraft["sections"][CollectionSectionKey]["items"];
};

type CollectionSectionPanelProps = {
  draft: ResumeDraft;
  sectionKey: CollectionSectionKey;
  onBack: () => void;
  onDirtyChange: (isDirty: boolean) => void;
  onSave: (sectionValue: ResumeDraft["sections"][CollectionSectionKey]) => void;
};

export function CollectionSectionPanel({
  draft,
  sectionKey,
  onBack,
  onDirtyChange,
  onSave,
}: CollectionSectionPanelProps) {
  const config = collectionSectionConfigs[sectionKey];
  const sectionValue = draft.sections[sectionKey];
  const formValues = useMemo(
    () => ({
      items: sectionValue.items,
    }),
    [sectionValue.items],
  );
  const form = useForm<CollectionSectionFormValues>({
    resolver: createSchemaResolver<CollectionSectionFormValues>(
      collectionSectionFormSchemaMap[sectionKey],
    ),
    defaultValues: formValues,
    mode: "onSubmit",
    reValidateMode: "onChange",
  });
  const { control, handleSubmit, reset, formState } = form;
  const currentItems = useWatch({
    control,
    name: "items",
  });
  const items = useFieldArray({
    control,
    name: "items",
  });

  useSectionFormState({
    formIsDirty: formState.isDirty,
    onDirtyChange,
    reset,
    values: formValues,
  });

  return (
    <EditorCard
      title={config.title}
      onBack={onBack}
      meta={
        <Badge variant="secondary">
          {currentItems?.length ?? 0} item
          {(currentItems?.length ?? 0) === 1 ? "" : "s"}
        </Badge>
      }
      onSave={handleSubmit((values) => {
        const nextSectionValue = {
          ...sectionValue,
          items: values.items,
        };

        onSave(
          nextSectionValue as ResumeDraft["sections"][CollectionSectionKey],
        );
        reset(values);
        toast.success(`${config.title} saved.`);
      })}
    >
      {items.fields.length === 0 ? (
        <div className="py-6 text-sm text-muted-foreground">
          No items added.
        </div>
      ) : (
        <div className="flex flex-col divide-y">
          {items.fields.map((field, index) => (
            <section
              key={field.id}
              className="flex flex-col gap-4 py-5 first:pt-0 last:pb-0"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">
                    {config.itemTitle} {index + 1}
                  </span>
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
                    onClick={() => items.fields.length > 1 && items.remove(index)}
                  >
                    <Trash2Icon />
                  </Button>
                </ButtonGroup>
              </div>

              <CollectionItemFields config={config} form={form} index={index} />
            </section>
          ))}
        </div>
      )}

      <Button
        type="button"
        className="mt-4 w-full"
        onClick={() => items.append(config.createItem() as never)}
      >
        <PlusIcon data-icon="inline-start" />
        {config.addLabel}
      </Button>
    </EditorCard>
  );
}
