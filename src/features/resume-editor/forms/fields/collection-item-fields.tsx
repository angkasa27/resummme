"use client";

import { type ReactNode } from "react";
import { Controller, useWatch, type UseFormReturn } from "react-hook-form";

import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
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
import { FIELD_CONTROL_CLASS } from "@/features/resume-editor/forms/fields/field-control";
import { fieldSpanByKind } from "@/features/resume-editor/forms/fields/field-layout";
import { MonthYearPicker } from "@/features/resume-editor/forms/fields/month-year-picker";
import { parseMonthYear } from "@/features/resume-editor/domain/month-year";
import type { ResumeDraft } from "@/features/resume-editor/domain/schema";
import { cn } from "@/lib/utils";

type CollectionSectionFormValues = {
  items: ResumeDraft["sections"][CollectionSectionKey]["items"];
};

type RenderCollectionItemFieldsProps = {
  config: CollectionSectionConfigMap[CollectionSectionKey];
  form: UseFormReturn<CollectionSectionFormValues>;
  index: number;
};

/** Most field kinds share the simple `{ name, placeholder? }` shape; only
 * `dateRange` deviates (see `renderDateRangeField`). */
type SimpleItemFieldConfig = ItemFieldConfig & {
  name: string;
  placeholder?: string;
  optional?: boolean;
};

function asSimpleFieldConfig(
  fieldConfig: ItemFieldConfig,
): SimpleItemFieldConfig {
  return fieldConfig as SimpleItemFieldConfig;
}

/** Attributes for `renderTextField`'s `<Input>` that vary by kind. */
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

export function CollectionItemFields({
  config,
  form,
  index,
}: RenderCollectionItemFieldsProps) {
  const { control, formState, getFieldState, register, setValue } = form;

  // One subscription for the whole item instead of a `watch()` per field —
  // every renderer below reads its value(s) off this instead of resubscribing.
  const itemValues = useWatch({ control, name: `items.${index}` as const }) as
    | Record<string, unknown>
    | undefined;

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
  // resolve the loosely-typed config, the RHF path, its live field state, and
  // the layout derived from its kind.
  function resolveField(_fieldConfig: ItemFieldConfig, fieldIndex: number) {
    const fieldConfig = asSimpleFieldConfig(_fieldConfig);
    const fieldName = `items.${fieldIndex}.${fieldConfig.name}` as const;
    const fieldState = gdfs(fieldName);
    return {
      fieldConfig,
      fieldName,
      fieldState,
      span: fieldSpanByKind[fieldConfig.kind],
    };
  }

  function renderTextField(_fieldConfig: ItemFieldConfig, fieldIndex: number) {
    const { fieldConfig, fieldName, fieldState, span } = resolveField(
      _fieldConfig,
      fieldIndex,
    );
    const inputAttrs = getTextInputAttrs(
      fieldConfig.kind as "text" | "email" | "url",
    );

    return (
      <Field
        key={fieldName}
        className={span === 2 ? "col-span-full" : undefined}
        data-invalid={fieldState.invalid || undefined}
      >
        <FieldContent>
          <Input
            id={fieldName}
            {...inputAttrs}
            placeholder={fieldConfig.placeholder ?? fieldConfig.label}
            aria-label={fieldConfig.label}
            aria-invalid={fieldState.invalid || undefined}
            className={FIELD_CONTROL_CLASS}
            {...reg(fieldName as never)}
          />
          <FieldError errors={[fieldState.error]} />
        </FieldContent>
      </Field>
    );
  }

  function renderMonthYearField(
    _fieldConfig: ItemFieldConfig,
    fieldIndex: number,
  ) {
    const { fieldConfig, fieldName, fieldState, span } = resolveField(
      _fieldConfig,
      fieldIndex,
    );

    return (
      <Field
        key={fieldName}
        className={span === 2 ? "col-span-full" : undefined}
        data-invalid={fieldState.invalid || undefined}
      >
        {/* MonthYearPicker's trigger is a plain button with no aria-label prop
            of its own, so an sr-only label carries the accessible name. */}
        <FieldLabel htmlFor={fieldName} className="sr-only">
          {fieldConfig.label}
        </FieldLabel>
        <FieldContent>
          <Controller
            control={ctrl}
            name={fieldName as never}
            render={({ field }) => (
              <MonthYearPicker
                id={fieldName}
                value={field.value}
                placeholder={fieldConfig.label}
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
    const { fieldConfig, fieldName, fieldState, span } = resolveField(
      _fieldConfig,
      fieldIndex,
    );

    return (
      <Field
        key={fieldName}
        className={span === 2 ? "col-span-full" : undefined}
        data-invalid={fieldState.invalid || undefined}
      >
        <FieldContent>
          <Textarea
            id={fieldName}
            rows={3}
            placeholder={fieldConfig.placeholder ?? fieldConfig.label}
            aria-label={fieldConfig.label}
            aria-invalid={fieldState.invalid || undefined}
            // Same box as the rest, minus the single-line height.
            className={cn(FIELD_CONTROL_CLASS, "h-auto py-2")}
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
    const { fieldConfig, fieldName, fieldState, span } = resolveField(
      _fieldConfig,
      fieldIndex,
    );

    return (
      <Field
        key={fieldName}
        className={span === 2 ? "col-span-full" : undefined}
        data-invalid={fieldState.invalid || undefined}
      >
        <FieldContent>
          <Controller
            control={ctrl}
            name={fieldName as never}
            render={({ field }) => (
              <RichTextEditorWithImprove
                value={field.value}
                // No visible label: the guidance lives inside the empty editor
                // and `ariaLabel` carries the accessible name.
                ariaLabel={fieldConfig.label}
                placeholder={fieldConfig.placeholder ?? fieldConfig.label}
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
          <FieldError errors={[fieldState.error]} />
        </FieldContent>
      </Field>
    );
  }

  function renderStringArrayField(
    _fieldConfig: ItemFieldConfig,
    fieldIndex: number,
  ) {
    const { fieldConfig, fieldName, fieldState, span } = resolveField(
      _fieldConfig,
      fieldIndex,
    );

    return (
      <Field
        key={fieldName}
        className={span === 2 ? "col-span-full" : undefined}
        data-invalid={fieldState.invalid || undefined}
      >
        <FieldContent>
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
                placeholder={fieldConfig.placeholder ?? fieldConfig.label}
                ariaInvalid={fieldState.invalid}
                ariaLabel={fieldConfig.label}
              />
            )}
          />
          <FieldDescription>
            Press Enter or comma to add a skill. Backspace removes the last
            one.
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
    const { startName, endName } = fieldConfig as Extract<
      ItemFieldConfig,
      { kind: "dateRange" }
    >;
    const startFieldName = `items.${fieldIndex}.${startName}` as const;
    const endFieldName = `items.${fieldIndex}.${endName}` as const;
    const startValue = itemValues?.[startName] as unknown as string;
    const endValue = itemValues?.[endName] as unknown as string;
    const startFieldState = gdfs(startFieldName);
    const endFieldState = gdfs(endFieldName);
    const isCurrent = endValue === "current";

    // Spans the outer row, then splits start/end across the same grid — so the
    // two pickers line up with the single-column fields above them.
    return (
      <FieldGroup
        key={`${startFieldName}-${endFieldName}`}
        layout="grid"
        className={
          fieldSpanByKind[fieldConfig.kind] === 2 ? "col-span-full" : undefined
        }
      >
        <Field data-invalid={startFieldState.invalid || undefined}>
          <FieldLabel htmlFor={startFieldName} className="sr-only">
            Start date
          </FieldLabel>
          <FieldContent>
            <Controller
              control={ctrl}
              name={startFieldName as never}
              render={({ field }) => (
                <MonthYearPicker
                  id={startFieldName}
                  value={field.value}
                  placeholder="Start date"
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
          <FieldLabel htmlFor={endFieldName} className="sr-only">
            End date
          </FieldLabel>
          <FieldContent>
            <Controller
              control={ctrl}
              name={endFieldName as never}
              render={({ field }) => (
                <MonthYearPicker
                  id={endFieldName}
                  value={isCurrent ? "" : field.value}
                  placeholder={isCurrent ? "Current" : "End date"}
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
      </FieldGroup>
    );
  }

  function renderProficiencyField(
    _fieldConfig: ItemFieldConfig,
    fieldIndex: number,
  ) {
    const { fieldConfig, fieldName, fieldState, span } = resolveField(
      _fieldConfig,
      fieldIndex,
    );

    return (
      <Field
        key={fieldName}
        className={span === 2 ? "col-span-full" : undefined}
        data-invalid={fieldState.invalid || undefined}
      >
        <FieldContent>
          <Controller
            control={ctrl}
            name={fieldName as never}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger
                  className={FIELD_CONTROL_CLASS}
                  aria-label={fieldConfig.label}
                  aria-invalid={fieldState.invalid || undefined}
                >
                  <SelectValue placeholder={fieldConfig.label} />
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
    // Spacing comes from FieldGroup, not from here — see ui/field.tsx. The
    // container it queries is the item body, not the scroll box: the grid has
    // to measure the box it actually lives in.
    <FieldGroup layout="grid">
      {config.fields.map((fieldConfig) => {
        const renderFn = renderField[fieldConfig.kind];
        if (renderFn) return renderFn(fieldConfig, index);
        return null;
      })}
    </FieldGroup>
  );
}
