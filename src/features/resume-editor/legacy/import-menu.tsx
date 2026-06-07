"use client";

import { ChevronDownIcon, FileJsonIcon, FileTextIcon, UploadIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type ImportMenuProps = {
  onImportJson: () => void;
  onImportPdf: () => void;
  disabled?: boolean;
  align?: "start" | "center" | "end";
  compact?: boolean;
};

export function ImportMenu({
  onImportJson,
  onImportPdf,
  disabled = false,
  align = "start",
  compact = false,
}: ImportMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            type="button"
            variant="outline"
            size={compact ? "icon-sm" : "sm"}
            disabled={disabled}
            aria-label="Import resume"
          />
        }
      >
        {compact ? <UploadIcon /> : <UploadIcon data-icon="inline-start" />}
        {!compact ? "Import" : null}
        {!compact ? <ChevronDownIcon data-icon="inline-end" /> : null}
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align} sideOffset={8} className="w-48">
        <DropdownMenuItem onClick={onImportJson}>
          <FileJsonIcon />
          Import JSON
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onImportPdf}>
          <FileTextIcon />
          Import PDF
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
