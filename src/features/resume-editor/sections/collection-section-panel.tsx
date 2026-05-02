"use client";

import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import { PlusIcon, SaveIcon, SquareXIcon, Trash2Icon } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { collectionSectionConfigs } from "@/features/resume-editor/config/collection-section-config";
import type { CollectionSectionKey } from "@/features/resume-editor/config/section-metadata";
import { useSectionFormState } from "@/features/resume-editor/hooks/use-section-form-state";
import { nextOrderValue } from "@/features/resume-editor/lib/draft-utils";
import { createSchemaResolver } from "@/features/resume-editor/lib/form-resolver";
import { collectionSectionSchemaMap } from "@/features/resume-editor/lib/section-schemas";
import { CollectionItemFields } from "@/features/resume-editor/sections/collection-item-fields";
import { EditorCard } from "@/features/resume-editor/sections/editor-card";
import { renderSectionIcon } from "@/features/resume-editor/sections/section-icons";
import type { ResumeDraft } from "@/lib/resume/schema";

type CollectionSectionPanelProps = {
  draft: ResumeDraft;
  sectionKey: CollectionSectionKey;
  isActive: boolean;
  isDirty: boolean;
  onRequestOpen: () => void;
  onDirtyChange: (isDirty: boolean) => void;
  onSave: (sectionValue: ResumeDraft["sections"][CollectionSectionKey]) => void;
};

export function CollectionSectionPanel({
  draft,
  sectionKey,
  isActive,
  isDirty,
  onRequestOpen,
  onDirtyChange,
  onSave,
}: CollectionSectionPanelProps) {
  const config = collectionSectionConfigs[sectionKey];
  const sectionValue = draft.sections[sectionKey];
  const form = useForm<ResumeDraft["sections"][CollectionSectionKey]>({
    resolver: createSchemaResolver<ResumeDraft["sections"][CollectionSectionKey]>(
      collectionSectionSchemaMap[sectionKey]
    ),
    defaultValues: sectionValue,
  });
  const { control, handleSubmit, register, reset, formState, watch, setValue } = form;
  const currentOrder = useWatch({
    control,
    name: "order",
  });
  const currentItems = useWatch({
    control,
    name: "items",
  });
  const items = useFieldArray({
    control,
    name: "items",
  });
  const maxOrder = Object.keys(draft.sections).length - 1;

  useSectionFormState({
    isActive,
    formIsDirty: formState.isDirty,
    onDirtyChange,
    reset,
    values: sectionValue,
  });

  return (
    <EditorCard
      isActive={isActive}
      isDirty={isDirty}
      icon={renderSectionIcon(sectionKey)}
      title={config.title}
      description={config.description}
      onRequestOpen={onRequestOpen}
      footerActions={
        <>
          <Button type="button" variant="outline" onClick={() => reset(sectionValue)}>
            <SquareXIcon data-icon="inline-start" />
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSubmit((values) => {
              onSave(values);
              reset(values);
              toast.success(`${config.title} saved.`);
            })}
          >
            <SaveIcon data-icon="inline-start" />
            Save Section
          </Button>
        </>
      }
    >
      <FieldGroup>
        <Field orientation="horizontal">
          <FieldLabel htmlFor={`${sectionKey}-visible`}>Show section</FieldLabel>
          <Controller
            control={control}
            name="visible"
            render={({ field }) => (
              <Switch
                id={`${sectionKey}-visible`}
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            )}
          />
        </Field>
        <Field>
          <FieldLabel>Section order</FieldLabel>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                setValue("order", nextOrderValue(currentOrder ?? 0, -1, maxOrder), {
                  shouldDirty: true,
                })
              }
            >
              Move up
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                setValue("order", nextOrderValue(currentOrder ?? 0, 1, maxOrder), {
                  shouldDirty: true,
                })
              }
            >
              Move down
            </Button>
            <Badge variant="secondary">Order {(currentOrder ?? 0) + 1}</Badge>
          </div>
        </Field>
      </FieldGroup>

      <Separator />

      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="text-sm text-muted-foreground">
            {(currentItems?.length ?? 0)} item{(currentItems?.length ?? 0) === 1 ? "" : "s"}
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => items.append(config.createItem() as never)}
          >
            <PlusIcon data-icon="inline-start" />
            {config.addLabel}
          </Button>
        </div>

        {items.fields.length === 0 ? (
          <Empty className="border">
            <EmptyHeader>
              <EmptyMedia variant="icon">{renderSectionIcon(sectionKey)}</EmptyMedia>
              <EmptyTitle>{config.emptyTitle}</EmptyTitle>
              <EmptyDescription>{config.emptyDescription}</EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button
                type="button"
                variant="outline"
                onClick={() => items.append(config.createItem() as never)}
              >
                <PlusIcon data-icon="inline-start" />
                {config.addLabel}
              </Button>
            </EmptyContent>
          </Empty>
        ) : (
          <div className="flex flex-col gap-4">
            {items.fields.map((field, index) => (
              <Card key={field.id} size="sm">
                <CardHeader>
                  <CardTitle>
                    {config.itemTitle} {index + 1}
                  </CardTitle>
                  <CardAction className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => index > 0 && items.move(index, index - 1)}
                    >
                      Move up
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        index < items.fields.length - 1 && items.move(index, index + 1)
                      }
                    >
                      Move down
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => items.remove(index)}
                    >
                      <Trash2Icon data-icon="inline-start" />
                      Remove
                    </Button>
                  </CardAction>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                  <CollectionItemFields
                    config={config}
                    control={control}
                    register={register}
                    watch={watch}
                    setValue={setValue}
                    index={index}
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </EditorCard>
  );
}
