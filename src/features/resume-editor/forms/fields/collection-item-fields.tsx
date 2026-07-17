"use client";

import { type ReactNode } from "react";
import { Controller, type UseFormReturn } from "react-hook-form";

import { FieldDescription, FieldGroup } from "@/components/ui/field";
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
import {
  fieldLabelVariantByKind,
  fieldSpanByKind,
} from "@/features/resume-editor/forms/fields/field-layout";
import { FloatingField } from "@/features/resume-editor/forms/fields/floating-field";
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

/**
 * A resting label sits where the placeholder would, so the placeholder only
 * appears once the label has floated out of the way. Keeping the attribute (vs
 * dropping it) means the hint still shows at the one moment it helps.
 */
const HIDE_PLACEHOLDER_UNTIL_FOCUS =
  "placeholder:text-transparent focus:placeholder:text-muted-foreground";

function isFilled(value: unknown) {
  if (Array.isArray(value)) return value.length > 0;
  return value !== undefined && value !== null && value !== "";
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
      variant: fieldLabelVariantByKind[fieldConfig.kind],
      filled: isFilled(watch(fieldName as never)),
    };
  }

  function renderTextField(_fieldConfig: ItemFieldConfig, fieldIndex: number) {
    const { fieldConfig, fieldName, fieldState, span, variant, filled } =
      resolveField(_fieldConfig, fieldIndex);
    const inputAttrs = getTextInputAttrs(
      fieldConfig.kind as "text" | "email" | "url",
    );

    return (
      <FloatingField
        key={fieldName}
        htmlFor={fieldName}
        label={fieldConfig.label}
        optional={fieldConfig.optional}
        invalid={fieldState.invalid}
        error={fieldState.error}
        span={span}
        variant={variant}
        filled={filled}
      >
        <Input
          id={fieldName}
          {...inputAttrs}
          placeholder={fieldConfig.placeholder}
          aria-invalid={fieldState.invalid || undefined}
          className={cn(FIELD_CONTROL_CLASS, HIDE_PLACEHOLDER_UNTIL_FOCUS)}
          {...reg(fieldName as never)}
        />
      </FloatingField>
    );
  }

  function renderMonthYearField(
    _fieldConfig: ItemFieldConfig,
    fieldIndex: number,
  ) {
    const { fieldConfig, fieldName, fieldState, span, variant, filled } =
      resolveField(_fieldConfig, fieldIndex);

    return (
      <FloatingField
        key={fieldName}
        htmlFor={fieldName}
        label={fieldConfig.label}
        optional={fieldConfig.optional}
        invalid={fieldState.invalid}
        error={fieldState.error}
        span={span}
        variant={variant}
        filled={filled}
      >
        <Controller
          control={ctrl}
          name={fieldName as never}
          render={({ field }) => (
            <MonthYearPicker
              id={fieldName}
              value={field.value}
              // The label owns the empty state for button-triggered controls.
              placeholder=""
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
      </FloatingField>
    );
  }

  function renderTextareaField(
    _fieldConfig: ItemFieldConfig,
    fieldIndex: number,
  ) {
    const { fieldConfig, fieldName, fieldState, span, variant, filled } =
      resolveField(_fieldConfig, fieldIndex);

    return (
      <FloatingField
        key={fieldName}
        htmlFor={fieldName}
        label={fieldConfig.label}
        optional={fieldConfig.optional}
        invalid={fieldState.invalid}
        error={fieldState.error}
        span={span}
        variant={variant}
        filled={filled}
      >
        <Textarea
          id={fieldName}
          rows={3}
          placeholder={fieldConfig.placeholder}
          aria-invalid={fieldState.invalid || undefined}
          // Same box as the rest, minus the single-line height.
          className={cn(FIELD_CONTROL_CLASS, "h-auto py-2")}
          {...reg(fieldName as never)}
        />
      </FloatingField>
    );
  }

  function renderRichTextField(
    _fieldConfig: ItemFieldConfig,
    fieldIndex: number,
  ) {
    const { fieldConfig, fieldName, fieldState, span, variant, filled } =
      resolveField(_fieldConfig, fieldIndex);

    return (
      <FloatingField
        key={fieldName}
        label={fieldConfig.label}
        optional={fieldConfig.optional}
        invalid={fieldState.invalid}
        error={fieldState.error}
        span={span}
        variant={variant}
        filled={filled}
      >
        <Controller
          control={ctrl}
          name={fieldName as never}
          render={({ field }) => (
            <RichTextEditorWithImprove
              value={field.value}
              // No visible label: the guidance lives inside the empty editor
              // and `ariaLabel` carries the accessible name.
              ariaLabel={fieldConfig.label}
              placeholder={fieldConfig.placeholder}
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
      </FloatingField>
    );
  }

  function renderStringArrayField(
    _fieldConfig: ItemFieldConfig,
    fieldIndex: number,
  ) {
    const { fieldConfig, fieldName, fieldState, span, variant, filled } =
      resolveField(_fieldConfig, fieldIndex);

    return (
      <FloatingField
        key={fieldName}
        htmlFor={fieldName}
        label={fieldConfig.label}
        optional={fieldConfig.optional}
        invalid={fieldState.invalid}
        error={fieldState.error}
        span={span}
        variant={variant}
        filled={filled}
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
              placeholder={filled ? fieldConfig.placeholder : ""}
              ariaInvalid={fieldState.invalid}
              ariaLabel={fieldConfig.label}
            />
          )}
        />
      </FloatingField>
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
    const startValue = watch(startFieldName as never) as unknown as string;
    const endValue = watch(endFieldName as never) as unknown as string;
    const startFieldState = gdfs(startFieldName);
    const endFieldState = gdfs(endFieldName);
    const isCurrent = endValue === "current";

    return (
      <div
        key={`${startFieldName}-${endFieldName}`}
        className="col-span-full grid gap-x-3 gap-y-5 @field-2col/item-fields:grid-cols-2"
      >
        <FloatingField
          htmlFor={startFieldName}
          label="Start date"
          invalid={startFieldState.invalid}
          error={startFieldState.error}
          filled={isFilled(startValue)}
        >
          <Controller
            control={ctrl}
            name={startFieldName as never}
            render={({ field }) => (
              <MonthYearPicker
                id={startFieldName}
                value={field.value}
                placeholder=""
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
        </FloatingField>

        <FloatingField
          htmlFor={endFieldName}
          label="End date"
          invalid={endFieldState.invalid}
          error={endFieldState.error}
          // "Current" renders as the picker's placeholder with an empty value,
          // so float the label off it explicitly.
          filled={isCurrent || isFilled(endValue)}
          description={
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
          }
        >
          <Controller
            control={ctrl}
            name={endFieldName as never}
            render={({ field }) => (
              <MonthYearPicker
                id={endFieldName}
                value={isCurrent ? "" : field.value}
                placeholder={isCurrent ? "Current" : ""}
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
        </FloatingField>
      </div>
    );
  }

  function renderProficiencyField(
    _fieldConfig: ItemFieldConfig,
    fieldIndex: number,
  ) {
    const { fieldConfig, fieldName, fieldState, span, variant, filled } =
      resolveField(_fieldConfig, fieldIndex);

    return (
      <FloatingField
        key={fieldName}
        label={fieldConfig.label}
        invalid={fieldState.invalid}
        error={fieldState.error}
        span={span}
        variant={variant}
        filled={filled}
      >
        <Controller
          control={ctrl}
          name={fieldName as never}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger
                className={FIELD_CONTROL_CLASS}
                aria-invalid={fieldState.invalid || undefined}
              >
                <SelectValue placeholder="" />
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
      </FloatingField>
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
    // `gap-y-5` (not 3) so a floated label overhanging the top border never
    // collides with the field above. The container is the item body, not the
    // scroll box — the grid has to measure the box it actually lives in.
    <FieldGroup className="grid grid-cols-1 gap-x-3 gap-y-5 @field-2col/item-fields:grid-cols-2">
      {config.fields.map((fieldConfig) => {
        const renderFn = renderField[fieldConfig.kind];
        if (renderFn) return renderFn(fieldConfig, index);
        return null;
      })}
    </FieldGroup>
  );
}
