"use client";

import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { Tabs as TabsPrimitive } from "@base-ui/react/tabs";
import { cva, type VariantProps } from "class-variance-authority";
import { motion } from "motion/react";

import { cn } from "@/lib/utils";

const DEFAULT_PILL = "bg-background shadow-sm dark:bg-input/30";

/** The active tab value, so the list can find the trigger to track. */
const TabsValueContext = createContext<string>("");

/** Lets each trigger hand its DOM node to the list for measurement. */
const TabsRegisterContext = createContext<
  ((value: string, node: HTMLElement | null) => void) | null
>(null);

function Tabs({
  className,
  orientation = "horizontal",
  value,
  defaultValue,
  onValueChange,
  ...props
}: TabsPrimitive.Root.Props) {
  // Mirror base-ui's value so the list can read the active tab during render.
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
        className={cn("group/tabs flex gap-2 data-horizontal:flex-col", className)}
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

type IndicatorRect = {
  left: number;
  top: number;
  width: number;
  height: number;
};

function TabsList({
  className,
  variant = "default",
  pillClassName = DEFAULT_PILL,
  children,
  ...props
}: TabsPrimitive.List.Props &
  VariantProps<typeof tabsListVariants> & { pillClassName?: string }) {
  const activeValue = useContext(TabsValueContext);
  const containerRef = useRef<HTMLDivElement>(null);
  const nodesRef = useRef(new Map<string, HTMLElement>());
  const [indicator, setIndicator] = useState<IndicatorRect | null>(null);

  const register = useCallback((value: string, node: HTMLElement | null) => {
    if (node) nodesRef.current.set(value, node);
    else nodesRef.current.delete(value);
  }, []);

  // Measure the active trigger relative to the list, so a single persistent
  // pill can slide to it. Tracking by value (not by element) keeps this stable
  // even when a trigger swaps its element type (button <-> link) on activation.
  const measure = useCallback(() => {
    const container = containerRef.current;
    const node = nodesRef.current.get(activeValue);
    if (!container || !node) return;
    const c = container.getBoundingClientRect();
    const n = node.getBoundingClientRect();
    setIndicator({
      left: n.left - c.left,
      top: n.top - c.top,
      width: n.width,
      height: n.height,
    });
  }, [activeValue]);

  useLayoutEffect(() => {
    measure();
    const container = containerRef.current;
    if (!container || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(measure);
    observer.observe(container);
    return () => observer.disconnect();
  }, [measure]);

  return (
    <TabsRegisterContext.Provider value={register}>
      <TabsPrimitive.List
        ref={containerRef}
        data-slot="tabs-list"
        data-variant={variant}
        className={cn(tabsListVariants({ variant }), className)}
        {...props}
      >
        {variant !== "line" && indicator && (
          <motion.span
            aria-hidden
            className={cn("absolute left-0 top-0 rounded-md", pillClassName)}
            // initial={false}: appear in place on first paint, slide thereafter.
            initial={false}
            animate={{
              x: indicator.left,
              y: indicator.top,
              width: indicator.width,
              height: indicator.height,
            }}
            transition={{ type: "spring", bounce: 0.15, duration: 0.35 }}
          />
        )}
        {children}
      </TabsPrimitive.List>
    </TabsRegisterContext.Provider>
  );
}

function TabsTrigger({
  className,
  value,
  ...props
}: TabsPrimitive.Tab.Props) {
  const register = useContext(TabsRegisterContext);

  return (
    <TabsPrimitive.Tab
      ref={(node) => register?.(String(value), node)}
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
    />
  );
}

function TabsContent({ className, ...props }: TabsPrimitive.Panel.Props) {
  return (
    <TabsPrimitive.Panel
      data-slot="tabs-content"
      className={cn("flex-1 text-sm outline-none", className)}
      {...props}
    />
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent, tabsListVariants };
