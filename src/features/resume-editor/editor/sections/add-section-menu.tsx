"use client";

import { PlusIcon } from "lucide-react";
import type { ComponentProps } from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SectionIcon } from "@/features/resume-editor/editor/shared/section-icons";
import {
  sectionLabels,
  type CollectionSectionKey,
} from "@/features/resume-editor/domain/sections/section-metadata";

type AddSectionMenuProps = {
  hiddenKeys: CollectionSectionKey[];
  onAdd: (sectionKey: CollectionSectionKey) => void;
  /** Trigger button style. */
  triggerVariant?: ComponentProps<typeof Button>["variant"];
};

/**
 * "Add section" dropdown listing the hidden collection sections. Renders nothing
 * when every section is already visible. Shared by both editor surfaces.
 */
export function AddSectionMenu({
  hiddenKeys,
  onAdd,
  triggerVariant = "default",
}: AddSectionMenuProps) {
  if (hiddenKeys.length === 0) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button type="button" variant={triggerVariant} className="w-full">
            <PlusIcon data-icon="inline-start" />
            Add section
          </Button>
        }
      />
      <DropdownMenuContent align="start" className="w-56">
        {hiddenKeys.map((key) => (
          <DropdownMenuItem key={key} onClick={() => onAdd(key)}>
            <span className="flex [&_svg]:size-4">
              <SectionIcon sectionKey={key} />
            </span>
            {sectionLabels[key]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
