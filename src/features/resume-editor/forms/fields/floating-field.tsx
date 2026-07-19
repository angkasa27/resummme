"use client";

import type { ReactNode } from "react";

import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { FieldLabelText } from "@/features/resume-editor/forms/fields/field-label-text";
import { spanClassName } from "@/features/resume-editor/forms/fields/field-layout";
import { cn } from "@/lib/utils";

type FloatingFieldProps = {
  label: string;
  /** Real `<label for>`. Omit only when the control has no focusable id. */
  htmlFor?: string;
  /** Together with `:focus-within`, drives the floated state. */
  filled: boolean;
  /**
   * "float" rests the label inside the control; "stacked" sits it above;
   * "none" draws no label at all — for controls that carry their own hint and
   * their own accessible name (see `fieldLabelVariantByKind`).
   */
  variant?: "float" | "stacked" | "none";
  /** Columns in the item grid. */
  span?: 1 | 2;
  optional?: boolean;
  invalid?: boolean;
  error?: { message?: string };
  description?: ReactNode;
  children: ReactNode;
};

/**
 * Material-outlined field wrapper: the label rests inside an empty control and
 * floats onto its top border once focused or filled.
 *
 * `filled` is passed in rather than sniffed with `peer-placeholder-shown`
 * because that pseudo only exists for real inputs — MonthYear renders a button,
 * proficiency a select, stringArray a custom div. One explicit bit covers all
 * nine kinds identically; focus stays pure CSS since every one of those controls
 * takes real DOM focus inside this wrapper.
 *
 * The floated label paints a `bg-background` chip over the border, so whatever
 * surface hosts this field has to be `bg-background` too.
 */
export function FloatingField({
  label,
  htmlFor,
  filled,
  variant = "float",
  span = 1,
  optional,
  invalid,
  error,
  description,
  children,
}: FloatingFieldProps) {
  const labelNode = <FieldLabelText label={label} optional={optional} />;

  if (variant === "none") {
    return (
      <Field
        data-invalid={invalid || undefined}
        className={spanClassName(span)}
      >
        <FieldContent>
          {children}
          {description}
          <FieldError errors={[error]} />
        </FieldContent>
      </Field>
    );
  }

  if (variant === "stacked") {
    return (
      <Field
        data-invalid={invalid || undefined}
        className={spanClassName(span)}
      >
        <FieldLabel htmlFor={htmlFor}>{labelNode}</FieldLabel>
        <FieldContent>
          {children}
          {description}
          <FieldError errors={[error]} />
        </FieldContent>
      </Field>
    );
  }

  return (
    <Field
      data-invalid={invalid || undefined}
      className={spanClassName(span)}
    >
      <FieldContent>
        {/* The label must not be a direct child of `Field` — that applies
            `*:w-full`, which would stretch the absolute label past `left-2.5`. */}
        <div className="group/float relative" data-filled={filled || undefined}>
          {children}
          <FieldLabel
            htmlFor={htmlFor}
            // Resting, the label overlays the control, so clicks must fall
            // through to it; floated, it sits on the border. `htmlFor` is what
            // assistive tech reads, so this costs nothing there.
            className={cn(
              "pointer-events-none absolute left-2.5 z-10 max-w-[calc(100%-1.25rem)] truncate",
              "rounded-sm bg-background px-1 font-normal text-muted-foreground",
              "transition-all duration-150",
              "top-1/2 -translate-y-1/2 text-sm",
              "group-focus-within/float:top-0 group-focus-within/float:text-xs group-focus-within/float:text-foreground",
              "group-data-[filled]/float:top-0 group-data-[filled]/float:text-xs",
              invalid && "text-destructive",
            )}
          >
            {labelNode}
          </FieldLabel>
        </div>
        {description}
        <FieldError errors={[error]} />
      </FieldContent>
    </Field>
  );
}
