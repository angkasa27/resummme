"use client";

import { createContext, useContext, useId, useState } from "react";
import { Tabs as TabsPrimitive } from "@base-ui/react/tabs";
import { cva, type VariantProps } from "class-variance-authority";
import { motion, useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";
import { motionTokens, springs } from "@/lib/motion-tokens";

const DEFAULT_PILL = "bg-background shadow-sm dark:bg-input/30";

/** The active tab value, so each trigger knows whether to host the pill. */
const TabsValueContext = createContext<string>("");

/** Per-list pill config. The active trigger renders the pill as its own
 *  `inset-0` background; a list-unique `layoutId` makes motion slide it between
 *  triggers via transforms (no width/height animation, no measurement). The
 *  unique id also keeps sibling Tabs instances from sharing one pill. */
type PillContextValue = {
  pillClassName: string;
  showPill: boolean;
  layoutId: string;
};
const TabsPillContext = createContext<PillContextValue | null>(null);

function Tabs({
  className,
  orientation = "horizontal",
  value,
  defaultValue,
  onValueChange,
  ...props
}: TabsPrimitive.Root.Props) {
  // Mirror base-ui's value so triggers can read the active tab during render.
  // Controlled lists pass `value`; uncontrolled lists track it here.
  const [internalValue, setInternalValue] = useState<string>(
    typeof defaultValue === "string" ? defaultValue : "",
  );
  const activeValue = value !== undefined ? String(value) : internalValue;

  return (
    <TabsValueContext.Provider value={activeValue}>
      <TabsPrimitive.Root
        data-slot="tabs"
        data-orientation={orientation}
        className={cn(
          "group/tabs flex gap-2 data-horizontal:flex-col",
          className,
        )}
        value={value}
        defaultValue={defaultValue}
        onValueChange={(next, details) => {
          setInternalValue(String(next));
          onValueChange?.(next, details);
        }}
        {...props}
      />
    </TabsValueContext.Provider>
  );
}

const tabsListVariants = cva(
  "group/tabs-list relative inline-flex w-fit items-center justify-center rounded-lg p-[3px] text-muted-foreground group-data-horizontal/tabs:h-9 group-data-vertical/tabs:h-fit group-data-vertical/tabs:flex-col data-[variant=line]:rounded-none",
  {
    variants: {
      variant: {
        default: "bg-muted",
        line: "gap-1 bg-transparent",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function TabsList({
  className,
  variant = "default",
  pillClassName = DEFAULT_PILL,
  ...props
}: TabsPrimitive.List.Props &
  VariantProps<typeof tabsListVariants> & { pillClassName?: string }) {
  // One stable id per list — the pill's shared-layout namespace.
  const layoutId = useId();

  return (
    <TabsPillContext.Provider
      value={{ pillClassName, showPill: variant !== "line", layoutId }}
    >
      <TabsPrimitive.List
        data-slot="tabs-list"
        data-variant={variant}
        className={cn(tabsListVariants({ variant }), className)}
        {...props}
      />
    </TabsPillContext.Provider>
  );
}

function TabsTrigger({
  className,
  value,
  children,
  ...props
}: TabsPrimitive.Tab.Props) {
  const activeValue = useContext(TabsValueContext);
  const pill = useContext(TabsPillContext);
  const reduceMotion = useReducedMotion();
  const isActive = !!pill?.showPill && String(value) === activeValue;

  return (
    <TabsPrimitive.Tab
      data-slot="tabs-trigger"
      value={value}
      className={cn(
        // `relative` keeps trigger content above the absolute pill behind it.
        "relative z-10 inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap text-foreground/60 transition-colors group-data-vertical/tabs:w-full group-data-vertical/tabs:justify-start hover:text-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-1 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 aria-disabled:pointer-events-none aria-disabled:opacity-50 dark:text-muted-foreground dark:hover:text-foreground",
        // Active text color — the pill behind it supplies the background.
        "data-active:text-foreground dark:data-active:text-foreground",
        // Line variant keeps its CSS ::after underline instead of the pill.
        "group-data-[variant=line]/tabs-list:bg-transparent group-data-[variant=line]/tabs-list:data-active:bg-transparent dark:group-data-[variant=line]/tabs-list:data-active:border-transparent dark:group-data-[variant=line]/tabs-list:data-active:bg-transparent",
        "after:absolute after:bg-foreground after:opacity-0 after:transition-opacity group-data-horizontal/tabs:after:inset-x-0 group-data-horizontal/tabs:after:bottom-[-5px] group-data-horizontal/tabs:after:h-0.5 group-data-vertical/tabs:after:inset-y-0 group-data-vertical/tabs:after:-right-1 group-data-vertical/tabs:after:w-0.5 group-data-[variant=line]/tabs-list:data-active:after:opacity-100",
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    >
      {/* Sliding pill — only the active trigger hosts it; the shared `layoutId`
          animates it across triggers via transforms. Reduced motion snaps it
          in place (Rule 3). */}
      {isActive && pill ? (
        <motion.span
          aria-hidden
          layoutId={pill.layoutId}
          className={cn("absolute inset-0 -z-10 rounded-md", pill.pillClassName)}
          transition={reduceMotion ? { duration: 0 } : springs.pill}
        />
      ) : null}
      {children}
    </TabsPrimitive.Tab>
  );
}

function TabsContent({
  className,
  children,
  ...props
}: TabsPrimitive.Panel.Props) {
  const reduceMotion = useReducedMotion();
  return (
    <TabsPrimitive.Panel
      data-slot="tabs-content"
      className={cn("flex-1 text-sm outline-none", className)}
      {...props}
    >
      {/* Enter animation on each tab change — base-ui unmounts the inactive
          panel, so the active one mounts fresh and this fades/slides it in.
          Reduced motion drops the transform to an opacity-only fade. */}
      <motion.div
        initial={{ opacity: 0, y: reduceMotion ? 0 : motionTokens.distance.sm }}
        animate={{ opacity: 1, y: 0 }}
        transition={
          reduceMotion
            ? { duration: motionTokens.duration.fast }
            : {
                duration: motionTokens.duration.normal,
                ease: motionTokens.easing.smooth,
              }
        }
      >
        {children}
      </motion.div>
    </TabsPrimitive.Panel>
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent, tabsListVariants };
