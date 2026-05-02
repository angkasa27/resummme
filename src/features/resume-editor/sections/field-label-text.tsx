import { cn } from "@/lib/utils";

type FieldLabelTextProps = {
  label: string;
  optional?: boolean;
  className?: string;
};

export function FieldLabelText({
  label,
  optional = false,
  className,
}: FieldLabelTextProps) {
  return (
    <span className={cn("inline-flex items-center gap-1.5", className)}>
      <span>{label}</span>
      {optional ? (
        <span className="text-xs font-normal text-muted-foreground">(Optional)</span>
      ) : (
        <span className="text-destructive" aria-hidden="true">
          *
        </span>
      )}
    </span>
  );
}
