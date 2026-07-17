"use client"

import { Separator as SeparatorPrimitive } from "@base-ui/react/separator"

import { cn } from "@/lib/utils"

type SeparatorProps = SeparatorPrimitive.Props & {
  /** Bleeds beyond the parent's padding so the line stretches edge-to-edge. */
  fullBleed?: boolean;
};

function Separator({
  className,
  orientation = "horizontal",
  fullBleed,
  ...props
}: SeparatorProps) {
  return (
    <SeparatorPrimitive
      data-slot="separator"
      orientation={orientation}
      className={cn(
        "shrink-0 bg-border data-horizontal:h-px data-horizontal:w-full data-vertical:w-px data-vertical:self-stretch",
        fullBleed && "my-2 -mx-2 w-[calc(100%+(var(--spacing)*4))]!",
        className
      )}
      {...props}
    />
  )
}

export { Separator }
