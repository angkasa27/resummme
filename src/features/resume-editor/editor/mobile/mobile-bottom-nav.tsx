"use client";

import {
  EyeIcon,
  SquarePenIcon,
  SwatchBookIcon,
  TelescopeIcon,
  type LucideIcon,
} from "lucide-react";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

export type EditorTab = "edit" | "preview" | "design" | "insights";

type NavItem = {
  key: EditorTab;
  label: string;
  icon: LucideIcon;
};

const ITEMS: NavItem[] = [
  { key: "preview", label: "Preview", icon: EyeIcon },
  { key: "edit", label: "Edit", icon: SquarePenIcon },
  { key: "design", label: "Design", icon: SwatchBookIcon },
  { key: "insights", label: "Insights", icon: TelescopeIcon },
];

type MobileBottomNavProps = {
  value: EditorTab;
  onChange: (tab: EditorTab) => void;
};

/**
 * Floating pill bottom navigation — detached from the content and centered above
 * the bottom edge. Reuses the `Tabs` sliding-pill indicator (one primary pill
 * that springs between items).
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
          pillClassName="rounded-full bg-primary/10"
          className="h-auto! gap-1 rounded-full border bg-background p-1! shadow-lg grid! grid-cols-4!"
        >
          {ITEMS.map(({ key, label, icon: Icon }) => (
            <TabsTrigger
              key={key}
              value={key}
              className={cn(
                // eslint-disable-next-line no-restricted-syntax
                "h-auto flex-none flex-col rounded-full px-4 pt-0.5 pb-1.5 text-[10px] leading-none gap-0",
                "text-muted-foreground hover:text-foreground",
                "data-active:text-primary! dark:data-active:text-text-primary!",
              )}
            >
              <Icon className="size-5 m-1" />
              {label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
}
