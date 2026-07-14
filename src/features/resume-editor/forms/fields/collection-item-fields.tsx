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
import {
  type CollectionSectionConfigMap,
  type ItemFieldConfig,
} from "@/features/resume-editor/domain/sections/collection-section-config";
import {
  languageProficiencyOptions,
  type CollectionSectionKey,
} from "@/features/resume-editor/domain/sections/section-metadata";
import { RichTextEditorWithImprove } from "@/features/resume-editor/forms/rich-text/improve-with-ai-dialog";
import { FieldLabelText } from "@/features/resume-editor/forms/fields/field-label-text";
import { MonthYearPicker } from "@/features/resume-editor/forms/fields/month-year-picker";
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

/** Most field kinds share the simple `{ name, placeholder? }` shape; only
 * `dateRange` deviates (see `renderDateRangeField`). */
type SimpleItemFieldConfig = ItemFieldConfig & {
  name: string;
  placeholder?: string;
};

function asSimpleFieldConfig(
  fieldConfig: ItemFieldConfig,
): SimpleItemFieldConfig {
  return fieldConfig as SimpleItemFieldConfig;
}

/** Attributes for `renderTextField`'s `<InputGroupInput>` that vary by kind. */
function getTextInputAttrs(kind: "text" | "email" | "url") {
  if (kind === "email") {
    return {
      type: "email",
      inputMode: "email",
      autoComplete: "email",
      autoCapitalize: "none",
      autoCorrect: "off",
      spellCheck: false,
    } as const;
  }
  if (kind === "url") {
    return {
      type: "url",
      inputMode: "url",
      autoComplete: "url",
      autoCapitalize: "none",
      autoCorrect: "off",
      spellCheck: false,
    } as const;
  }
  return {
    type: "text",
    inputMode: undefined,
    autoComplete: undefined,
    autoCapitalize: undefined,
    autoCorrect: undefined,
    spellCheck: true,
  } as const;
}

type FieldShellProps = {
  label: string;
  htmlFor?: string;
  invalid: boolean;
  error?: { message?: string };
  description?: ReactNode;
  children: ReactNode;
};

/** Shared `Field`/`FieldLabel`/`FieldContent`/`FieldError` wrapper used by
 * every simple (non-dateRange) collection item field renderer below. */
function FieldShell({
  label,
  htmlFor,
  invalid,
  error,
  description,
  children,
}: FieldShellProps) {
  return (
    <Field className="@sm/form:col-span-2" data-invalid={invalid || undefined}>
      <FieldLabel htmlFor={htmlFor}>
        <FieldLabelText label={label} />
      </FieldLabel>
      <FieldContent>
        {children}
        {description}
        <FieldError errors={[error]} />
      </FieldContent>
    </Field>
  );
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

  // Shared preamble for every simple (non-dateRange) field renderer below:
  // resolve the loosely-typed config, the RHF path, and its live field state.
  function resolveField(_fieldConfig: ItemFieldConfig, fieldIndex: number) {
    const fieldConfig = asSimpleFieldConfig(_fieldConfig);
    const fieldName = `items.${fieldIndex}.${fieldConfig.name}` as const;
    const fieldState = gdfs(fieldName);
    return { fieldConfig, fieldName, fieldState };
  }

  function renderTextField(_fieldConfig: ItemFieldConfig, fieldIndex: number) {
    const { fieldConfig, fieldName, fieldState } = resolveField(
      _fieldConfig,
      fieldIndex,
    );
    const FieldIcon = getFieldIcon(fieldConfig.kind, fieldConfig.name);
    const inputAttrs = getTextInputAttrs(
      fieldConfig.kind as "text" | "email" | "url",
    );

    return (
      <FieldShell
        key={fieldName}
        htmlFor={fieldName}
        label={fieldConfig.label}
        invalid={fieldState.invalid}
        error={fieldState.error}
      >
        <InputGroup className="bg-background!">
          <InputGroupAddon>
            <FieldIcon />
          </InputGroupAddon>
          <InputGroupInput
            id={fieldName}
            {...inputAttrs}
            placeholder={fieldConfig.placeholder}
            aria-invalid={fieldState.invalid || undefined}
            {...reg(fieldName as never)}
          />
        </InputGroup>
      </FieldShell>
    );
  }

  function renderMonthYearField(
    _fieldConfig: ItemFieldConfig,
    fieldIndex: number,
  ) {
    const { fieldConfig, fieldName, fieldState } = resolveField(
      _fieldConfig,
      fieldIndex,
    );

    return (
      <FieldShell
        key={fieldName}
        htmlFor={fieldName}
        label={fieldConfig.label}
        invalid={fieldState.invalid}
        error={fieldState.error}
      >
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
      </FieldShell>
    );
  }

  function renderTextareaField(
    _fieldConfig: ItemFieldConfig,
    fieldIndex: number,
  ) {
    const { fieldConfig, fieldName, fieldState } = resolveField(
      _fieldConfig,
      fieldIndex,
    );

    return (
      <FieldShell
        key={fieldName}
        htmlFor={fieldName}
        label={fieldConfig.label}
        invalid={fieldState.invalid}
        error={fieldState.error}
      >
        <Textarea
          id={fieldName}
          rows={3}
          placeholder={fieldConfig.placeholder}
          aria-invalid={fieldState.invalid || undefined}
          className="not-disabled:bg-background!"
          {...reg(fieldName as never)}
        />
      </FieldShell>
    );
  }

  function renderRichTextField(
    _fieldConfig: ItemFieldConfig,
    fieldIndex: number,
  ) {
    const { fieldConfig, fieldName, fieldState } = resolveField(
      _fieldConfig,
      fieldIndex,
    );

    return (
      <FieldShell
        key={fieldName}
        label={fieldConfig.label}
        invalid={fieldState.invalid}
        error={fieldState.error}
        description={
          fieldConfig.placeholder ? (
            <FieldDescription>{fieldConfig.placeholder}</FieldDescription>
          ) : null
        }
      >
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
      </FieldShell>
    );
  }

  function renderStringArrayField(
    _fieldConfig: ItemFieldConfig,
    fieldIndex: number,
  ) {
    const { fieldConfig, fieldName, fieldState } = resolveField(
      _fieldConfig,
      fieldIndex,
    );

    return (
      <FieldShell
        key={fieldName}
        htmlFor={fieldName}
        label={fieldConfig.label}
        invalid={fieldState.invalid}
        error={fieldState.error}
        description={
          <FieldDescription>
            Press Enter or comma to add a skill. Backspace removes the last one.
          </FieldDescription>
        }
      >
        <Controller
          control={ctrl}
          name={fieldName as never}
          render={({ field }) => (
            <TagInput
              id={fieldName}
              value={
                Array.isArray(field.value) ? (field.value as string[]) : []
              }
              onChange={(next) => field.onChange(next)}
              placeholder={fieldConfig.placeholder}
              ariaInvalid={fieldState.invalid}
              ariaLabel={fieldConfig.label}
            />
          )}
        />
      </FieldShell>
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
    const { fieldConfig, fieldName, fieldState } = resolveField(
      _fieldConfig,
      fieldIndex,
    );

    return (
      <FieldShell
        key={fieldName}
        label={fieldConfig.label}
        invalid={fieldState.invalid}
        error={fieldState.error}
      >
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
      </FieldShell>
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
