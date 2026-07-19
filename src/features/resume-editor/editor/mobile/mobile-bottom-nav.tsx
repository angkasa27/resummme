"use client";

import type { ReactNode, Ref } from "react";
import { SwatchBookIcon } from "lucide-react";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SquarePenIcon as AnimatedSquarePen } from "@/components/ui/square-pen";
import { EyeIcon as AnimatedEye } from "@/components/ui/eye";
import { TelescopeIcon as AnimatedTelescope } from "@/components/ui/telescope";
import type { AnimatedIconHandle } from "@/components/ui/animated-icon";
import {
  NAV_ICON_SIZE as ICON_SIZE,
  NavIcon,
  PopIcon,
} from "@/features/resume-editor/editor/shared/nav-icon";
import { cn } from "@/lib/utils";

export type EditorTab = "edit" | "preview" | "design" | "insights";

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
                // eslint-disable-next-line no-restricted-syntax
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
