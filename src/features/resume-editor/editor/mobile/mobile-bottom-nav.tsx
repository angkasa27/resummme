"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  type ReactNode,
  type Ref,
} from "react";
import { motion, useAnimationControls, useReducedMotion } from "motion/react";
import { SwatchBookIcon, type LucideIcon } from "lucide-react";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SquarePenIcon as AnimatedSquarePen } from "@/components/ui/square-pen";
import { EyeIcon as AnimatedEye } from "@/components/ui/eye";
import { TelescopeIcon as AnimatedTelescope } from "@/components/ui/telescope";
import type { AnimatedIconHandle } from "@/components/ui/animated-icon";
import { cn } from "@/lib/utils";
import { motionTokens } from "@/lib/motion-tokens";

export type EditorTab = "edit" | "preview" | "design" | "insights";

const ICON_SIZE = 20;

/**
 * Fallback for lucide icons without a `@lucide-animated` equivalent (Design's
 * swatch-book): a scale-pop that mirrors the animated-icon handle so every nav
 * icon shares one interface.
 */
const PopIcon = forwardRef<
  AnimatedIconHandle,
  { icon: LucideIcon; size?: number }
>(({ icon: Icon, size = ICON_SIZE }, ref) => {
  const controls = useAnimationControls();
  useImperativeHandle(ref, () => ({
    startAnimation: () => controls.start({ scale: [1, 0.85, 1.12, 1] }),
    stopAnimation: () => controls.set({ scale: 1 }),
  }));
  return (
    <motion.span
      className="inline-flex"
      animate={controls}
      transition={{ duration: motionTokens.duration.normal }}
    >
      <Icon size={size} />
    </motion.span>
  );
});
PopIcon.displayName = "PopIcon";

/**
 * Owns the icon handle and replays its animation when the tab becomes active.
 * Resets first so one-shot icons (e.g. telescope, which tilts and holds) replay
 * on every selection instead of only the first.
 */
function NavIcon({
  active,
  render,
}: {
  active: boolean;
  render: (ref: Ref<AnimatedIconHandle>) => ReactNode;
}) {
  const ref = useRef<AnimatedIconHandle>(null);
  const reduceMotion = useReducedMotion();
  useEffect(() => {
    if (reduceMotion) return;
    if (active) {
      ref.current?.stopAnimation();
      const id = requestAnimationFrame(() => ref.current?.startAnimation());
      return () => cancelAnimationFrame(id);
    }
    ref.current?.stopAnimation();
  }, [active, reduceMotion]);
  return (
    <span className="flex size-6 items-center justify-center">
      {render(ref)}
    </span>
  );
}

type NavItem = {
  key: EditorTab;
  label: string;
  render: (ref: Ref<AnimatedIconHandle>) => ReactNode;
};

const ITEMS: NavItem[] = [
  {
    key: "preview",
    label: "Preview",
    render: (ref) => <AnimatedEye ref={ref} size={ICON_SIZE} />,
  },
  {
    key: "edit",
    label: "Edit",
    render: (ref) => <AnimatedSquarePen ref={ref} size={ICON_SIZE} />,
  },
  {
    key: "design",
    label: "Design",
    render: (ref) => <PopIcon ref={ref} icon={SwatchBookIcon} />,
  },
  {
    key: "insights",
    label: "Insights",
    render: (ref) => <AnimatedTelescope ref={ref} size={ICON_SIZE} />,
  },
];

type MobileBottomNavProps = {
  value: EditorTab;
  onChange: (tab: EditorTab) => void;
};

/**
 * Floating pill bottom navigation — detached from the content and centered above
 * the bottom edge. Reuses the `Tabs` sliding-pill indicator (one primary pill
 * that springs between items) and fires the active tab's animated lucide icon.
 */
export function MobileBottomNav({ value, onChange }: MobileBottomNavProps) {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30 flex justify-center pb-4">
      <Tabs
        value={value}
        onValueChange={(next) => onChange(next as EditorTab)}
        className="pointer-events-auto w-auto"
      >
        <TabsList
          pillClassName="rounded-full bg-primary"
          className="h-auto! gap-1 rounded-full border bg-background p-1! shadow-lg grid! grid-cols-4!"
        >
          {ITEMS.map(({ key, label, render }) => (
            <TabsTrigger
              key={key}
              value={key}
              className={cn(
                "h-auto flex-none flex-col rounded-full px-4 pt-0.5 pb-1.5 text-[10px] leading-none gap-0",
                "text-muted-foreground hover:text-foreground",
                "data-active:text-primary-foreground! dark:data-active:text-primary-foreground!",
              )}
            >
              <NavIcon active={value === key} render={render} />
              {label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
}
