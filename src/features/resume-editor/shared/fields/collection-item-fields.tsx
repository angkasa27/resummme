"use client";

import { type ReactNode } from "react";
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
import { type CollectionSectionConfigMap, type ItemFieldConfig } from "@/features/resume-editor/domain/sections/collection-section-config";
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

  type RenderFieldFn = (
    fieldConfig: ItemFieldConfig,
    fieldIndex: number,
  ) => ReactNode;

  // Renderers below close over these form helpers directly (like `watch`
  // already does), so the dispatch passes only the varying inputs.
  const ctrl = control;
  const sv = setValue;
  const fs = formState;
  const reg = register;
  const gdfs = getDynamicFieldState;

  function renderTextField(_fieldConfig: ItemFieldConfig, fieldIndex: number) {
    const fieldConfig = _fieldConfig as ItemFieldConfig & { name: string; placeholder?: string };
    const fieldName = `items.${fieldIndex}.${fieldConfig.name}` as const;
    const fieldState = gdfs(fieldName);
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
              type={fieldConfig.kind === "text" ? "text" : fieldConfig.kind}
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
              {...reg(fieldName as never)}
            />
          </InputGroup>
          <FieldError errors={[fieldState.error]} />
        </FieldContent>
      </Field>
    );
  }

  function renderMonthYearField(
    _fieldConfig: ItemFieldConfig,
    fieldIndex: number,
  ) {
    const fieldConfig = _fieldConfig as ItemFieldConfig & { name: string; placeholder?: string };
    const fieldName = `items.${fieldIndex}.${fieldConfig.name}` as const;
    const fieldState = gdfs(fieldName);

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
            control={ctrl}
            name={fieldName as never}
            render={({ field }) => (
              <MonthYearPicker
                id={fieldName}
                value={field.value}
                placeholder={fieldConfig.placeholder}
                ariaInvalid={fieldState.invalid}
                onChange={(value) =>
                  sv(fieldName as never, value as never, {
                    shouldDirty: true,
                    shouldValidate: fs.isSubmitted,
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

  function renderTextareaField(
    _fieldConfig: ItemFieldConfig,
    fieldIndex: number,
  ) {
    const fieldConfig = _fieldConfig as ItemFieldConfig & { name: string; placeholder?: string };
    const fieldName = `items.${fieldIndex}.${fieldConfig.name}` as const;
    const fieldState = gdfs(fieldName);

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
            {...reg(fieldName as never)}
          />
          <FieldError errors={[fieldState.error]} />
        </FieldContent>
      </Field>
    );
  }

  function renderRichTextField(
    _fieldConfig: ItemFieldConfig,
    fieldIndex: number,
  ) {
    const fieldConfig = _fieldConfig as ItemFieldConfig & { name: string; placeholder?: string };
    const fieldName = `items.${fieldIndex}.${fieldConfig.name}` as const;
    const fieldState = gdfs(fieldName);

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
            control={ctrl}
            name={fieldName as never}
            render={({ field }) => (
              <RichTextEditorWithImprove
                value={field.value}
                ariaLabel={fieldConfig.label}
                invalid={fieldState.invalid}
                onChange={(value) =>
                  sv(fieldName as never, value as never, {
                    shouldDirty: true,
                    shouldValidate: fs.isSubmitted,
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

  function renderStringArrayField(
    _fieldConfig: ItemFieldConfig,
    fieldIndex: number,
  ) {
    const fieldConfig = _fieldConfig as ItemFieldConfig & { name: string; placeholder?: string };
    const fieldName = `items.${fieldIndex}.${fieldConfig.name}` as const;
    const fieldState = gdfs(fieldName);

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
            control={ctrl}
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

  function renderDateRangeField(
    fieldConfig: ItemFieldConfig,
    fieldIndex: number,
  ) {
    const { startName, endName, startPlaceholder, endPlaceholder } =
      fieldConfig as Extract<ItemFieldConfig, { kind: "dateRange" }>;
    const startFieldName = `items.${fieldIndex}.${startName}` as const;
    const endFieldName = `items.${fieldIndex}.${endName}` as const;
    const startValue = watch(startFieldName as never) as unknown as string;
    const endValue = watch(endFieldName as never) as unknown as string;
    const startFieldState = gdfs(startFieldName);
    const endFieldState = gdfs(endFieldName);
    const isCurrent = endValue === "current";

    return (
      <div
        key={`${startFieldName}-${endFieldName}`}
        className="grid gap-3 @sm/form:col-span-2 @sm/form:grid-cols-2"
      >
        <Field data-invalid={startFieldState.invalid || undefined}>
          <FieldLabel htmlFor={startFieldName}>
            <FieldLabelText label="Start date" />
          </FieldLabel>
          <FieldContent>
            <Controller
              control={ctrl}
              name={startFieldName as never}
              render={({ field }) => (
                <MonthYearPicker
                  id={startFieldName}
                  value={field.value}
                  placeholder={startPlaceholder ?? "Jan 2024"}
                  ariaInvalid={startFieldState.invalid}
                  onChange={(value) => {
                    const nextStartDate = parseMonthYear(value);
                    const currentEndDate = parseMonthYear(endValue);

                    sv(startFieldName as never, value as never, {
                      shouldDirty: true,
                      shouldValidate: fs.isSubmitted,
                    });

                    if (
                      endValue !== "current" &&
                      nextStartDate &&
                      currentEndDate &&
                      currentEndDate.getTime() <= nextStartDate.getTime()
                    ) {
                      sv(endFieldName as never, "" as never, {
                        shouldDirty: true,
                        shouldValidate: fs.isSubmitted,
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
          <FieldLabel htmlFor={endFieldName}>
            <FieldLabelText label="End date" />
          </FieldLabel>
          <FieldContent>
            <Controller
              control={ctrl}
              name={endFieldName as never}
              render={({ field }) => (
                <MonthYearPicker
                  id={endFieldName}
                  value={isCurrent ? "" : field.value}
                  placeholder={endPlaceholder ?? "Current"}
                  disabled={isCurrent}
                  ariaInvalid={endFieldState.invalid}
                  minValueExclusive={startValue}
                  onChange={(value) =>
                    sv(endFieldName as never, value as never, {
                      shouldDirty: true,
                      shouldValidate: fs.isSubmitted,
                    })
                  }
                />
              )}
            />
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Switch
                checked={isCurrent}
                onCheckedChange={(checked) =>
                  sv(
                    endFieldName as never,
                    (checked ? "current" : "") as never,
                    {
                      shouldDirty: true,
                      shouldValidate: fs.isSubmitted,
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

  function renderProficiencyField(
    _fieldConfig: ItemFieldConfig,
    fieldIndex: number,
  ) {
    const fieldConfig = _fieldConfig as ItemFieldConfig & { name: string; placeholder?: string };
    const fieldName = `items.${fieldIndex}.${fieldConfig.name}` as const;
    const fieldState = gdfs(fieldName);

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
            control={ctrl}
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

  const renderField: Record<string, RenderFieldFn> = {
    text: renderTextField,
    email: renderTextField,
    url: renderTextField,
    monthYear: renderMonthYearField,
    textarea: renderTextareaField,
    richText: renderRichTextField,
    stringArray: renderStringArrayField,
    dateRange: renderDateRangeField,
    proficiency: renderProficiencyField,
  };

  return (
    <FieldGroup className="grid grid-cols-1 gap-3 @sm/form:grid-cols-2">
      {config.fields.map((fieldConfig) => {
        const renderFn = renderField[fieldConfig.kind];
        if (renderFn) return renderFn(fieldConfig, index);
        return null;
      })}
    </FieldGroup>
  );
}
