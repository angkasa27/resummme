"use client";

import {
  DownloadIcon,
  EllipsisVerticalIcon,
  PrinterIcon,
  UploadIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type ResumeEditorShellActionsProps = {
  onImport: () => void;
  onExport: () => void;
  onExportPdf: () => void;
};

export function ResumeEditorShellActions({
  onImport,
  onExport,
  onExportPdf,
}: ResumeEditorShellActionsProps) {
  return (
    <div className="ml-auto flex items-center gap-1.5">
      <div className="hidden items-center gap-1.5 sm:flex">
        <Button type="button" variant="outline" size="sm" onClick={onImport}>
          <UploadIcon data-icon="inline-start" />
          Import
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={onExport}>
          <DownloadIcon data-icon="inline-start" />
          Export
        </Button>
        <Button type="button" size="sm" onClick={onExportPdf}>
          <PrinterIcon data-icon="inline-start" />
          Export PDF
        </Button>
      </div>

      <div className="sm:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="ghost" size="icon-sm" aria-label="More actions" />
            }
          >
            <EllipsisVerticalIcon />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" sideOffset={8}>
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={onImport}>
                <UploadIcon />
                Import
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onExport}>
                <DownloadIcon />
                Export
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onExportPdf}>
                <PrinterIcon />
                Export PDF
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
