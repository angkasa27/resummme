import { cva } from "class-variance-authority";

const toggleVariants = cva(
  "group/toggle inline-flex items-center justify-center gap-1 rounded-md text-sm font-medium whitespace-nowrap transition-[color,box-shadow] outline-none hover:bg-muted hover:text-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 aria-pressed:bg-muted dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        outline: "border border-input bg-transparent shadow-xs hover:bg-muted",
        // The `ai` treatment mirrors the `ai` Button variant: a plain outlined
        // control until pressed, then the violet→indigo gradient. Base-ui
        // reflects both `data-[state=on]` and `aria-pressed`; cover both so the
        // gradient wins over the base `aria-pressed:bg-muted`.
        ai: "border border-input bg-transparent shadow-xs data-[state=on]:border-violet-500 data-[state=on]:bg-gradient-to-br data-[state=on]:from-violet-500 data-[state=on]:to-indigo-600 data-[state=on]:text-white aria-pressed:border-violet-500 aria-pressed:bg-gradient-to-br aria-pressed:from-violet-500 aria-pressed:to-indigo-600 aria-pressed:text-white",
      },
      size: {
        default:
          "h-9 min-w-9 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        sm: "h-8 min-w-8 px-2.5 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5",
        lg: "h-10 min-w-10 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export { toggleVariants }
