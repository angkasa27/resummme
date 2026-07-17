"use client";

import { useMemo } from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

/**
 * Form spacing lives here, not at call sites.
 *
 * The scale is 4 / 8 / 16 / 24:
 *   4px  — inside a field: control → error/description (`Field`, `FieldContent`)
 *   8px  — attached meta: a legend and the fields it heads (`FieldSet`)
 *   16px — between fields (`FieldGroup`)
 *   24px — between groups (owned by the surface, e.g. `flex flex-col gap-6`)
 *
 * 16px between fields is a floor, not a preference: a floated label is 16.5px
 * tall and hangs 8.25px above its control's border, so 12px collides with the
 * field above.
 */
function FieldSet({ className, ...props }: React.ComponentProps<"fieldset">) {
  return (
    <fieldset
      data-slot="field-set"
      className={cn(
        "flex flex-col gap-2 has-[>[data-slot=checkbox-group]]:gap-3 has-[>[data-slot=radio-group]]:gap-3",
        className,
      )}
      {...props}
    />
  );
}

/**
 * Heads a group of related controls.
 *
 * Defaults to `legend` (16px semibold) — one step above a `FieldLabel` (14px
 * medium) in both size and weight. Weight alone was tried and isn't enough: at
 * the same size, a 600 heading sitting 8px above a 500 label reads as two
 * labels, not a hierarchy. `label` (14px semibold) exists for a nested subgroup;
 * nothing needs it yet.
 */
function FieldLegend({
  className,
  variant = "legend",
  ...props
}: React.ComponentProps<"legend"> & { variant?: "legend" | "label" }) {
  return (
    <legend
      data-slot="field-legend"
      data-variant={variant}
      className={cn(
        // No margin: FieldSet's gap owns the distance to the fields below.
        "flex items-center gap-2 font-semibold data-[variant=label]:text-sm data-[variant=legend]:text-base",
        className,
      )}
      {...props}
    />
  );
}

const fieldGroupVariants = cva(
  "group/field-group @container/field-group w-full gap-4 data-[slot=checkbox-group]:gap-3",
  {
    variants: {
      layout: {
        stack: "flex flex-col",
        // One gap on both axes — see the scale note above. Splits to two
        // columns against the nearest `@container/fields`, so each surface
        // measures the box its fields actually sit in (an item card's body is
        // inset further than the panel's scroll box).
        grid: "grid grid-cols-1 @field-2col/fields:grid-cols-2",
      },
    },
    defaultVariants: {
      layout: "stack",
    },
  },
);

function FieldGroup({
  className,
  layout,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof fieldGroupVariants>) {
  return (
    <div
      data-slot="field-group"
      className={cn(fieldGroupVariants({ layout }), className)}
      {...props}
    />
  );
}

const fieldVariants = cva(
  "group/field flex w-full gap-1 data-[invalid=true]:text-destructive",
  {
    variants: {
      orientation: {
        vertical: "flex-col *:w-full [&>.sr-only]:w-auto",
        horizontal:
          "flex-row items-center has-[>[data-slot=field-content]]:items-start *:data-[slot=field-label]:flex-auto has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px",
        responsive:
          "flex-col *:w-full @md/field-group:flex-row @md/field-group:items-center @md/field-group:*:w-auto @md/field-group:has-[>[data-slot=field-content]]:items-start @md/field-group:*:data-[slot=field-label]:flex-auto [&>.sr-only]:w-auto @md/field-group:has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px",
      },
    },
    defaultVariants: {
      orientation: "vertical",
    },
  },
);

function Field({
  className,
  orientation = "vertical",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof fieldVariants>) {
  return (
    <div
      role="group"
      data-slot="field"
      data-orientation={orientation}
      className={cn(fieldVariants({ orientation }), className)}
      {...props}
    />
  );
}

function FieldContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="field-content"
      className={cn(
        "group/field-content flex flex-1 flex-col gap-1 leading-snug",
        className,
      )}
      {...props}
    />
  );
}

function FieldLabel({
  className,
  ...props
}: React.ComponentProps<typeof Label>) {
  return (
    <Label
      data-slot="field-label"
      className={cn(
        "group/field-label peer/field-label flex w-fit gap-2 leading-snug group-data-[disabled=true]/field:opacity-50 has-data-checked:border-primary/30 has-data-checked:bg-primary/5 has-[>[data-slot=field]]:rounded-md has-[>[data-slot=field]]:border *:data-[slot=field]:p-3 dark:has-data-checked:border-primary/20 dark:has-data-checked:bg-primary/10",
        "has-[>[data-slot=field]]:w-full has-[>[data-slot=field]]:flex-col",
        className,
      )}
      {...props}
    />
  );
}

function FieldDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="field-description"
      className={cn(
        "text-left text-sm leading-normal font-normal text-muted-foreground group-has-data-horizontal/field:text-balance [[data-variant=legend]+&]:-mt-1.5",
        "last:mt-0 nth-last-2:-mt-1",
        "[&>a]:underline [&>a]:underline-offset-4 [&>a:hover]:text-primary",
        className,
      )}
      {...props}
    />
  );
}


function computeFieldErrorContent(
  children: React.ReactNode,
  errors: Array<{ message?: string } | undefined> | undefined,
): React.ReactNode {
  if (children) {
    return children;
  }

  if (!errors?.length) {
    return null;
  }

  const uniqueErrors = [
    ...new Map(errors.map((error) => [error?.message, error])).values(),
  ];

  if (uniqueErrors?.length == 1) {
    return uniqueErrors[0]?.message;
  }

  return (
    <ul className="ml-4 flex list-disc flex-col gap-1">
      {uniqueErrors.map(
        (error, index) =>
          error?.message && <li key={index}>{error.message}</li>,
      )}
    </ul>
  );
}

function FieldError({
  className,
  children,
  errors,
  ...props
}: React.ComponentProps<"div"> & {
  errors?: Array<{ message?: string } | undefined>;
}) {
  const content = useMemo(
    () => computeFieldErrorContent(children, errors),
    [children, errors],
  );

  if (!content) {
    return null;
  }

  return (
    <div
      role="alert"
      data-slot="field-error"
      className={cn("text-sm font-normal text-destructive", className)}
      {...props}
    >
      {content}
    </div>
  );
}

export {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLegend,
  FieldSet,
  FieldContent,
};
