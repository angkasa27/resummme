import { cn } from "@/lib/utils";

type FieldLabelTextProps = {
  label: string;
  className?: string;
};

export function FieldLabelText({
  label,
  className,
}: FieldLabelTextProps) {
  return (
    <span className={cn("inline-flex items-center gap-1.5", className)}>
      <span>{label}</span>
    </span>
  );
}
