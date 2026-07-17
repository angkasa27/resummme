import { cn } from "@/lib/utils";

type FieldLabelTextProps = {
  label: string;
  /** Marks the field as skippable. Declared per field in the section configs. */
  optional?: boolean;
  className?: string;
};

export function FieldLabelText({
  label,
  optional = false,
  className,
}: FieldLabelTextProps) {
  return (
    <span className={cn("inline-flex items-center gap-1", className)}>
      <span>{label}</span>
      {optional ? (
        <span className="text-muted-foreground/70">(optional)</span>
      ) : null}
    </span>
  );
}
