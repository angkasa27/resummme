"use client";

import { Controller, type UseFormReturn } from "react-hook-form";

import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  type CollectionSectionConfigMap,
} from "@/features/resume-editor/config/collection-section-config";
import {
  languageProficiencyOptions,
  type CollectionSectionKey,
} from "@/features/resume-editor/config/section-metadata";
import { RichTextEditor } from "@/features/resume-editor/rich-text/rich-text-editor";
import type { ResumeDraft } from "@/lib/resume/schema";

type RenderCollectionItemFieldsProps = {
  config: CollectionSectionConfigMap[CollectionSectionKey];
  control: UseFormReturn<ResumeDraft["sections"][CollectionSectionKey]>["control"];
  register: UseFormReturn<ResumeDraft["sections"][CollectionSectionKey]>["register"];
  watch: UseFormReturn<ResumeDraft["sections"][CollectionSectionKey]>["watch"];
  setValue: UseFormReturn<ResumeDraft["sections"][CollectionSectionKey]>["setValue"];
  index: number;
};

export function CollectionItemFields({
  config,
  control,
  register,
  watch,
  setValue,
  index,
}: RenderCollectionItemFieldsProps) {
  return (
    <FieldGroup>
      {config.fields.map((fieldConfig) => {
        if (
          fieldConfig.kind === "text" ||
          fieldConfig.kind === "email" ||
          fieldConfig.kind === "url" ||
          fieldConfig.kind === "monthYear"
        ) {
          const fieldName = `items.${index}.${fieldConfig.name}` as const;

          return (
            <Field key={fieldName}>
              <FieldLabel htmlFor={fieldName}>{fieldConfig.label}</FieldLabel>
              <Input
                id={fieldName}
                type={fieldConfig.kind === "monthYear" ? "text" : fieldConfig.kind}
                placeholder={
                  fieldConfig.placeholder ??
                  (fieldConfig.kind === "monthYear" ? "Apr 2025" : undefined)
                }
                {...register(fieldName as never)}
              />
            </Field>
          );
        }

        if (fieldConfig.kind === "textarea") {
          const fieldName = `items.${index}.${fieldConfig.name}` as const;

          return (
            <Field key={fieldName}>
              <FieldLabel htmlFor={fieldName}>{fieldConfig.label}</FieldLabel>
              <Textarea
                id={fieldName}
                rows={3}
                placeholder={fieldConfig.placeholder}
                {...register(fieldName as never)}
              />
            </Field>
          );
        }

        if (fieldConfig.kind === "richText") {
          const fieldName = `items.${index}.${fieldConfig.name}` as const;

          return (
            <Field key={fieldName}>
              <FieldLabel>{fieldConfig.label}</FieldLabel>
              <Controller
                control={control}
                name={fieldName as never}
                render={({ field }) => (
                  <RichTextEditor value={field.value} onChange={field.onChange} />
                )}
              />
            </Field>
          );
        }

        if (fieldConfig.kind === "stringArray") {
          const fieldName = `items.${index}.${fieldConfig.name}` as const;

          return (
            <Field key={fieldName}>
              <FieldLabel htmlFor={fieldName}>{fieldConfig.label}</FieldLabel>
              <Controller
                control={control}
                name={fieldName as never}
                render={({ field }) => (
                  <Textarea
                    id={fieldName}
                    rows={3}
                    placeholder={fieldConfig.placeholder}
                    value={
                      Array.isArray(field.value)
                        ? (field.value as string[]).join(", ")
                        : ""
                    }
                    onChange={(event) =>
                      field.onChange(
                        event.target.value
                          .split(",")
                          .map((value) => value.trim())
                          .filter(Boolean)
                      )
                    }
                  />
                )}
              />
              <FieldDescription>Separate each item with a comma.</FieldDescription>
            </Field>
          );
        }

        if (fieldConfig.kind === "dateRange") {
          const startName = `items.${index}.${fieldConfig.startName}` as const;
          const endName = `items.${index}.${fieldConfig.endName}` as const;
          const endValue = watch(endName as never) as unknown as string;
          const isCurrent = endValue === "current";

          return (
            <div key={`${startName}-${endName}`} className="grid gap-4 md:grid-cols-2">
              <Field>
                <FieldLabel htmlFor={startName}>{fieldConfig.label} start</FieldLabel>
                <Input id={startName} placeholder="Apr 2025" {...register(startName as never)} />
              </Field>
              <Field>
                <FieldLabel htmlFor={endName}>{fieldConfig.label} end</FieldLabel>
                <Input
                  id={endName}
                  placeholder="Apr 2026"
                  disabled={isCurrent}
                  {...register(endName as never)}
                />
                <div className="mt-2 flex items-center gap-2">
                  <Switch
                    checked={isCurrent}
                    onCheckedChange={(checked) =>
                      setValue(endName as never, (checked ? "current" : "") as never, {
                        shouldDirty: true,
                      })
                    }
                  />
                  <span className="text-sm text-muted-foreground">Current</span>
                </div>
              </Field>
            </div>
          );
        }

        if (fieldConfig.kind === "proficiency") {
          const fieldName = `items.${index}.${fieldConfig.name}` as const;

          return (
            <Field key={fieldName}>
              <FieldLabel>{fieldConfig.label}</FieldLabel>
              <Controller
                control={control}
                name={fieldName as never}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select proficiency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {languageProficiencyOptions.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
            </Field>
          );
        }

        return null;
      })}
    </FieldGroup>
  );
}
