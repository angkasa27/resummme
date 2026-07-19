"use client";

import type { ReactNode } from "react";
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
import { languageProficiencyOptions } from "@/features/resume-editor/domain/sections/section-metadata";
import { RichTextEditorWithImprove } from "@/features/resume-editor/forms/rich-text/improve-with-ai-dialog";
import { FIELD_CONTROL_CLASS } from "@/features/resume-editor/forms/fields/field-control";
import { MonthYearPicker } from "@/features/resume-editor/forms/fields/month-year-picker";
import { parseMonthYear } from "@/features/resume-editor/domain/month-year";
import { cn } from "@/lib/utils";

/**
 * Reusable field atoms for a collection item form — one per control type,
 * lifted verbatim from the old kind-dispatched renderer. Each takes the item
 * form plus its RHF field name(s); `className` is the only layout knob (merged
 * onto the atom's root `Field`), so a section composing these decides span
 * per field instead of deriving it from a "kind".
 */

// `UseFormReturn`'s own generic is invariant enough that a bare reference
// rejects every concrete `CollectionSectionFormValues` shape a section form
// actually has (RHF's `watch`/`setValue` are typed contravariantly). `any`
// here is the deliberate type-erasure seam so one set of atoms — and one
// dispatch map — can serve all ten differently-shaped item forms.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ItemForm = UseFormReturn<any>;

type FieldAtomProps = {
  form: ItemForm;
  name: string;
  label: string;
  placeholder?: string;
  className?: string;
};

/** Attributes for `TextField`'s `<Input>` that vary by type. */
export function getTextInputAttrs(type: "text" | "email" | "url") {
  if (type === "email") {
    return {
      type: "email",
      inputMode: "email",
      autoComplete: "email",
      autoCapitalize: "none",
      autoCorrect: "off",
      spellCheck: false,
    } as const;
  }
  if (type === "url") {
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

export function TextField({
  form,
  name,
  label,
  placeholder,
  className,
  type = "text",
  prefix,
  suffix,
}: FieldAtomProps & {
  type?: "text" | "email" | "url";
  /** Leading icon or text — switches the control to `InputGroup` when set. */
  prefix?: ReactNode;
  /** Trailing icon or text — switches the control to `InputGroup` when set. */
  suffix?: ReactNode;
}) {
  const { register, formState, getFieldState } = form;
  const fieldState = getFieldState(name as never, formState);
  const inputAttrs = getTextInputAttrs(type);

  return (
    <Field className={className} data-invalid={fieldState.invalid || undefined}>
      <FieldContent>
        {prefix != null || suffix != null ? (
          <InputGroup>
            {prefix != null && <InputGroupAddon>{prefix}</InputGroupAddon>}
            <InputGroupInput
              id={name}
              {...inputAttrs}
              placeholder={placeholder ?? label}
              aria-label={label}
              aria-invalid={fieldState.invalid || undefined}
              {...register(name as never)}
            />
            {suffix != null && (
              <InputGroupAddon align="inline-end">{suffix}</InputGroupAddon>
            )}
          </InputGroup>
        ) : (
          <Input
            id={name}
            {...inputAttrs}
            placeholder={placeholder ?? label}
            aria-label={label}
            aria-invalid={fieldState.invalid || undefined}
            className={FIELD_CONTROL_CLASS}
            {...register(name as never)}
          />
        )}
        <FieldError errors={[fieldState.error]} />
      </FieldContent>
    </Field>
  );
}

export function TextareaField({
  form,
  name,
  label,
  placeholder,
  className,
}: FieldAtomProps) {
  const { register, formState, getFieldState } = form;
  const fieldState = getFieldState(name as never, formState);

  return (
    <Field className={className} data-invalid={fieldState.invalid || undefined}>
      <FieldContent>
        <Textarea
          id={name}
          rows={3}
          placeholder={placeholder ?? label}
          aria-label={label}
          aria-invalid={fieldState.invalid || undefined}
          // Same box as the rest, minus the single-line height.
          className={cn(FIELD_CONTROL_CLASS, "h-auto py-2")}
          {...register(name as never)}
        />
        <FieldError errors={[fieldState.error]} />
      </FieldContent>
    </Field>
  );
}

export function RichTextField({
  form,
  name,
  label,
  placeholder,
  className,
}: FieldAtomProps) {
  const { control, setValue, formState, getFieldState } = form;
  const fieldState = getFieldState(name as never, formState);

  return (
    <Field className={className} data-invalid={fieldState.invalid || undefined}>
      <FieldContent>
        <Controller
          control={control}
          name={name as never}
          render={({ field }) => (
            <RichTextEditorWithImprove
              value={field.value}
              // No visible label: the guidance lives inside the empty editor
              // and `ariaLabel` carries the accessible name.
              ariaLabel={label}
              placeholder={placeholder ?? label}
              invalid={fieldState.invalid}
              onChange={(value) =>
                setValue(name as never, value as never, {
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

export function MonthYearField({
  form,
  name,
  label,
  className,
}: Omit<FieldAtomProps, "placeholder">) {
  const { control, setValue, formState, getFieldState } = form;
  const fieldState = getFieldState(name as never, formState);

  return (
    <Field className={className} data-invalid={fieldState.invalid || undefined}>
      {/* MonthYearPicker's trigger is a plain button with no aria-label prop
          of its own, so an sr-only label carries the accessible name. */}
      <FieldLabel htmlFor={name} className="sr-only">
        {label}
      </FieldLabel>
      <FieldContent>
        <Controller
          control={control}
          name={name as never}
          render={({ field }) => (
            <MonthYearPicker
              id={name}
              value={field.value}
              placeholder={label}
              ariaInvalid={fieldState.invalid}
              onChange={(value) =>
                setValue(name as never, value as never, {
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

export function TagInputField({
  form,
  name,
  label,
  placeholder,
  className,
}: FieldAtomProps) {
  const { control, formState, getFieldState } = form;
  const fieldState = getFieldState(name as never, formState);

  return (
    <Field className={className} data-invalid={fieldState.invalid || undefined}>
      <FieldContent>
        <Controller
          control={control}
          name={name as never}
          render={({ field }) => (
            <TagInput
              id={name}
              value={
                Array.isArray(field.value) ? (field.value as string[]) : []
              }
              onChange={(next) => field.onChange(next)}
              placeholder={placeholder ?? label}
              ariaInvalid={fieldState.invalid}
              ariaLabel={label}
            />
          )}
        />
        <FieldDescription>
          Press Enter or comma to add a skill. Backspace removes the last one.
        </FieldDescription>
        <FieldError errors={[fieldState.error]} />
      </FieldContent>
    </Field>
  );
}

export function ProficiencyField({
  form,
  name,
  label,
  className,
}: Omit<FieldAtomProps, "placeholder">) {
  const { control, formState, getFieldState } = form;
  const fieldState = getFieldState(name as never, formState);

  return (
    <Field className={className} data-invalid={fieldState.invalid || undefined}>
      <FieldContent>
        <Controller
          control={control}
          name={name as never}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger
                className={FIELD_CONTROL_CLASS}
                aria-label={label}
                aria-invalid={fieldState.invalid || undefined}
              >
                <SelectValue placeholder={label} />
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

type MonthYearRangeFieldProps = {
  form: ItemForm;
  startName: string;
  endName: string;
  className?: string;
};

export function MonthYearRangeField({
  form,
  startName,
  endName,
  className,
}: MonthYearRangeFieldProps) {
  const { control, setValue, formState, getFieldState } = form;
  const startValue = useWatch({
    control,
    name: startName as never,
  }) as unknown as string | undefined;
  const endValue = useWatch({ control, name: endName as never }) as unknown as
    | string
    | undefined;
  const startFieldState = getFieldState(startName as never, formState);
  const endFieldState = getFieldState(endName as never, formState);
  const isCurrent = endValue === "current";

  // Spans the outer row, then splits start/end across the same grid — so the
  // two pickers line up with the single-column fields above them.
  return (
    <FieldGroup layout="grid" className={className}>
      <Field data-invalid={startFieldState.invalid || undefined}>
        <FieldLabel htmlFor={startName} className="sr-only">
          Start date
        </FieldLabel>
        <FieldContent>
          <Controller
            control={control}
            name={startName as never}
            render={({ field }) => (
              <MonthYearPicker
                id={startName}
                value={field.value}
                placeholder="Start date"
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
        <FieldLabel htmlFor={endName} className="sr-only">
          End date
        </FieldLabel>
        <FieldContent>
          <Controller
            control={control}
            name={endName as never}
            render={({ field }) => (
              <MonthYearPicker
                id={endName}
                value={isCurrent ? "" : field.value}
                placeholder={isCurrent ? "Current" : "End date"}
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
    </FieldGroup>
  );
}
