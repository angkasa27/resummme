"use client";

import {
  DownloadIcon,
  EllipsisVerticalIcon,
  PrinterIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ImportMenu } from "@/features/resume-editor/legacy/import-menu";

type ResumeEditorShellActionsProps = {
  onImportJson: () => void;
  onImportPdf: () => void;
  onExport: () => void;
  onExportPdf: () => void;
  isExportingPdf?: boolean;
  isImportingPdf?: boolean;
};

export function ResumeEditorShellActions({
  onImportJson,
  onImportPdf,
  onExport,
  onExportPdf,
  isExportingPdf = false,
  isImportingPdf = false,
}: ResumeEditorShellActionsProps) {
  return (
    <div className="ml-auto flex items-center gap-1.5">
      <div className="hidden items-center gap-1.5 sm:flex">
        <ImportMenu
          onImportJson={onImportJson}
          onImportPdf={onImportPdf}
          disabled={isImportingPdf}
          align="end"
        />
        <Button type="button" variant="outline" size="sm" onClick={onExport}>
          <DownloadIcon data-icon="inline-start" />
          Export
        </Button>
        <Button
          type="button"
          size="sm"
          disabled={isExportingPdf}
          onClick={onExportPdf}
        >
          <PrinterIcon data-icon="inline-start" />
          {isExportingPdf ? "Exporting..." : "Export PDF"}
        </Button>
      </div>

      <div className="sm:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label="More actions"
              />
            }
          >
            <EllipsisVerticalIcon />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" sideOffset={8}>
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={onImportJson}>
                Import JSON
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onImportPdf}>
                Import PDF
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onExport}>
                <DownloadIcon />
                Export
              </DropdownMenuItem>
              <DropdownMenuItem disabled={isExportingPdf} onClick={onExportPdf}>
                <PrinterIcon />
                {isExportingPdf ? "Exporting..." : "Export PDF"}
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
