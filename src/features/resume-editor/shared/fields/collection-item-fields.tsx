"use client";

import { Controller, type UseFormReturn } from "react-hook-form";
import {
  AtSignIcon,
  BadgeCheckIcon,
  BriefcaseBusinessIcon,
  Building2Icon,
  GaugeIcon,
  GlobeIcon,
  GraduationCapIcon,
  HashIcon,
  InfoIcon,
  LanguagesIcon,
  LinkIcon,
  MailIcon,
  MapPinIcon,
  TagIcon,
  TypeIcon,
  type LucideIcon,
} from "lucide-react";

import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
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
import { TagInput } from "@/components/ui/tag-input";
import { type CollectionSectionConfigMap } from "@/features/resume-editor/domain/sections/collection-section-config";
import {
  languageProficiencyOptions,
  type CollectionSectionKey,
} from "@/features/resume-editor/domain/sections/section-metadata";
import { RichTextEditorWithImprove } from "@/features/resume-editor/shared/rich-text/improve-with-ai-dialog";
import { FieldLabelText } from "@/features/resume-editor/shared/fields/field-label-text";
import { MonthYearPicker } from "@/features/resume-editor/shared/fields/month-year-picker";
import { parseMonthYear } from "@/features/resume-editor/domain/month-year";
import type { ResumeDraft } from "@/features/resume-editor/domain/schema";

type CollectionSectionFormValues = {
  items: ResumeDraft["sections"][CollectionSectionKey]["items"];
};

type RenderCollectionItemFieldsProps = {
  config: CollectionSectionConfigMap[CollectionSectionKey];
  form: UseFormReturn<CollectionSectionFormValues>;
  index: number;
};

/** Semantic icon shown inside text/email/url fields (matches the profile form). */
const fieldIconByName: Record<string, LucideIcon> = {
  companyName: Building2Icon,
  organizationName: Building2Icon,
  issuingOrganization: Building2Icon,
  issuer: Building2Icon,
  publisher: Building2Icon,
  name: Building2Icon,
  position: BriefcaseBusinessIcon,
  location: MapPinIcon,
  categoryName: TagIcon,
  projectName: GlobeIcon,
  degree: GraduationCapIcon,
  gpa: GaugeIcon,
  certificationName: BadgeCheckIcon,
  credentialId: HashIcon,
  language: LanguagesIcon,
  background: InfoIcon,
  contactDetails: AtSignIcon,
};

function getFieldIcon(kind: string, name: string): LucideIcon {
  if (kind === "url") return LinkIcon;
  if (kind === "email") return MailIcon;
  return fieldIconByName[name] ?? TypeIcon;
}

export function CollectionItemFields({
  config,
  form,
  index,
}: RenderCollectionItemFieldsProps) {
  const { control, formState, getFieldState, register, setValue, watch } = form;

  function getDynamicFieldState(fieldName: string) {
    return getFieldState(fieldName as never, formState);
  }

  return (
    <FieldGroup className="grid grid-cols-1 gap-3 @sm/form:grid-cols-2">
      {config.fields.map((fieldConfig) => {
        if (
          fieldConfig.kind === "text" ||
          fieldConfig.kind === "email" ||
          fieldConfig.kind === "url"
        ) {
          const fieldName = `items.${index}.${fieldConfig.name}` as const;
          const fieldState = getDynamicFieldState(fieldName);
          const FieldIcon = getFieldIcon(fieldConfig.kind, fieldConfig.name);

          return (
            <Field
              key={fieldName}
              className="@sm/form:col-span-2"
              data-invalid={fieldState.invalid || undefined}
            >
              <FieldLabel htmlFor={fieldName}>
                <FieldLabelText label={fieldConfig.label} />
              </FieldLabel>
              <FieldContent>
                <InputGroup className="bg-background!">
                  <InputGroupAddon>
                    <FieldIcon />
                  </InputGroupAddon>
                  <InputGroupInput
                    id={fieldName}
                    type={fieldConfig.kind}
                    inputMode={
                      fieldConfig.kind === "email"
                        ? "email"
                        : fieldConfig.kind === "url"
                          ? "url"
                          : undefined
                    }
                    autoComplete={
                      fieldConfig.kind === "email"
                        ? "email"
                        : fieldConfig.kind === "url"
                          ? "url"
                          : undefined
                    }
                    spellCheck={fieldConfig.kind === "text"}
                    autoCapitalize={
                      fieldConfig.kind === "email" || fieldConfig.kind === "url"
                        ? "none"
                        : undefined
                    }
                    autoCorrect={
                      fieldConfig.kind === "email" || fieldConfig.kind === "url"
                        ? "off"
                        : undefined
                    }
                    placeholder={fieldConfig.placeholder}
                    aria-invalid={fieldState.invalid || undefined}
                    {...register(fieldName as never)}
                  />
                </InputGroup>
                <FieldError errors={[fieldState.error]} />
              </FieldContent>
            </Field>
          );
        }

        if (fieldConfig.kind === "monthYear") {
          const fieldName = `items.${index}.${fieldConfig.name}` as const;
          const fieldState = getDynamicFieldState(fieldName);

          return (
            <Field
              key={fieldName}
              className="@sm/form:col-span-2"
              data-invalid={fieldState.invalid || undefined}
            >
              <FieldLabel htmlFor={fieldName}>
                <FieldLabelText label={fieldConfig.label} />
              </FieldLabel>
              <FieldContent>
                <Controller
                  control={control}
                  name={fieldName as never}
                  render={({ field }) => (
                    <MonthYearPicker
                      id={fieldName}
                      value={field.value}
                      placeholder={fieldConfig.placeholder}
                      ariaInvalid={fieldState.invalid}
                      onChange={(value) =>
                        setValue(fieldName as never, value as never, {
                          shouldDirty: true,
                          shouldValidate: formState.isSubmitted,
                        })
                      }
                    />
                  )}
                />
                <FieldError errors={[fieldState.error]} />
              </FieldContent>
            </Field>
          );
        }

        if (fieldConfig.kind === "textarea") {
          const fieldName = `items.${index}.${fieldConfig.name}` as const;
          const fieldState = getDynamicFieldState(fieldName);

          return (
            <Field
              key={fieldName}
              className="@sm/form:col-span-2"
              data-invalid={fieldState.invalid || undefined}
            >
              <FieldLabel htmlFor={fieldName}>
                <FieldLabelText label={fieldConfig.label} />
              </FieldLabel>
              <FieldContent>
                <Textarea
                  id={fieldName}
                  rows={3}
                  placeholder={fieldConfig.placeholder}
                  aria-invalid={fieldState.invalid || undefined}
                  className="not-disabled:bg-background!"
                  {...register(fieldName as never)}
                />
                <FieldError errors={[fieldState.error]} />
              </FieldContent>
            </Field>
          );
        }

        if (fieldConfig.kind === "richText") {
          const fieldName = `items.${index}.${fieldConfig.name}` as const;
          const fieldState = getDynamicFieldState(fieldName);

          return (
            <Field
              key={fieldName}
              className="@sm/form:col-span-2"
              data-invalid={fieldState.invalid || undefined}
            >
              <FieldLabel>
                <FieldLabelText label={fieldConfig.label} />
              </FieldLabel>
              <FieldContent>
                <Controller
                  control={control}
                  name={fieldName as never}
                  render={({ field }) => (
                    <RichTextEditorWithImprove
                      value={field.value}
                      ariaLabel={fieldConfig.label}
                      invalid={fieldState.invalid}
                      onChange={(value) =>
                        setValue(fieldName as never, value as never, {
                          shouldDirty: true,
                          shouldValidate: formState.isSubmitted,
                        })
                      }
                    />
                  )}
                />
                {fieldConfig.placeholder ? (
                  <FieldDescription>{fieldConfig.placeholder}</FieldDescription>
                ) : null}
                <FieldError errors={[fieldState.error]} />
              </FieldContent>
            </Field>
          );
        }

        if (fieldConfig.kind === "stringArray") {
          const fieldName = `items.${index}.${fieldConfig.name}` as const;
          const fieldState = getDynamicFieldState(fieldName);

          return (
            <Field
              key={fieldName}
              className="@sm/form:col-span-2"
              data-invalid={fieldState.invalid || undefined}
            >
              <FieldLabel htmlFor={fieldName}>
                <FieldLabelText label={fieldConfig.label} />
              </FieldLabel>
              <FieldContent>
                <Controller
                  control={control}
                  name={fieldName as never}
                  render={({ field }) => (
                    <TagInput
                      id={fieldName}
                      value={
                        Array.isArray(field.value)
                          ? (field.value as string[])
                          : []
                      }
                      onChange={(next) => field.onChange(next)}
                      placeholder={fieldConfig.placeholder}
                      ariaInvalid={fieldState.invalid}
                      ariaLabel={fieldConfig.label}
                    />
                  )}
                />
                <FieldDescription>
                  Press Enter or comma to add a skill. Backspace removes the
                  last one.
                </FieldDescription>
                <FieldError errors={[fieldState.error]} />
              </FieldContent>
            </Field>
          );
        }

        if (fieldConfig.kind === "dateRange") {
          const startName = `items.${index}.${fieldConfig.startName}` as const;
          const endName = `items.${index}.${fieldConfig.endName}` as const;
          const startValue = watch(startName as never) as unknown as string;
          const endValue = watch(endName as never) as unknown as string;
          const startFieldState = getDynamicFieldState(startName);
          const endFieldState = getDynamicFieldState(endName);
          const isCurrent = endValue === "current";

          return (
            <div
              key={`${startName}-${endName}`}
              className="grid gap-3 @sm/form:col-span-2 @sm/form:grid-cols-2"
            >
              <Field data-invalid={startFieldState.invalid || undefined}>
                <FieldLabel htmlFor={startName}>
                  <FieldLabelText label="Start date" />
                </FieldLabel>
                <FieldContent>
                  <Controller
                    control={control}
                    name={startName as never}
                    render={({ field }) => (
                      <MonthYearPicker
                        id={startName}
                        value={field.value}
                        placeholder={fieldConfig.startPlaceholder ?? "Jan 2024"}
                        ariaInvalid={startFieldState.invalid}
                        onChange={(value) => {
                          const nextStartDate = parseMonthYear(value);
                          const currentEndDate = parseMonthYear(endValue);

                          setValue(startName as never, value as never, {
                            shouldDirty: true,
                            shouldValidate: formState.isSubmitted,
                          });

                          if (
                            endValue !== "current" &&
                            nextStartDate &&
                            currentEndDate &&
                            currentEndDate.getTime() <= nextStartDate.getTime()
                          ) {
                            setValue(endName as never, "" as never, {
                              shouldDirty: true,
                              shouldValidate: formState.isSubmitted,
                            });
                          }
                        }}
                      />
                    )}
                  />
                  <FieldError errors={[startFieldState.error]} />
                </FieldContent>
              </Field>

              <Field data-invalid={endFieldState.invalid || undefined}>
                <FieldLabel htmlFor={endName}>
                  <FieldLabelText label="End date" />
                </FieldLabel>
                <FieldContent>
                  <Controller
                    control={control}
                    name={endName as never}
                    render={({ field }) => (
                      <MonthYearPicker
                        id={endName}
                        value={isCurrent ? "" : field.value}
                        placeholder={fieldConfig.endPlaceholder ?? "Current"}
                        disabled={isCurrent}
                        ariaInvalid={endFieldState.invalid}
                        minValueExclusive={startValue}
                        onChange={(value) =>
                          setValue(endName as never, value as never, {
                            shouldDirty: true,
                            shouldValidate: formState.isSubmitted,
                          })
                        }
                      />
                    )}
                  />
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Switch
                      checked={isCurrent}
                      onCheckedChange={(checked) =>
                        setValue(
                          endName as never,
                          (checked ? "current" : "") as never,
                          {
                            shouldDirty: true,
                            shouldValidate: formState.isSubmitted,
                          },
                        )
                      }
                    />
                    <span>Mark this role as current</span>
                  </div>
                  <FieldError errors={[endFieldState.error]} />
                </FieldContent>
              </Field>
            </div>
          );
        }

        if (fieldConfig.kind === "proficiency") {
          const fieldName = `items.${index}.${fieldConfig.name}` as const;
          const fieldState = getDynamicFieldState(fieldName);

          return (
            <Field
              key={fieldName}
              className="@sm/form:col-span-2"
              data-invalid={fieldState.invalid || undefined}
            >
              <FieldLabel>
                <FieldLabelText label={fieldConfig.label} />
              </FieldLabel>
              <FieldContent>
                <Controller
                  control={control}
                  name={fieldName as never}
                  render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger
                        className="w-full not-disabled:bg-background"
                        aria-invalid={fieldState.invalid || undefined}
                      >
                        <SelectValue placeholder="Select proficiency level" />
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
                <FieldError errors={[fieldState.error]} />
              </FieldContent>
            </Field>
          );
        }

        return null;
      })}
    </FieldGroup>
  );
}
