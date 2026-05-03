"use client";

import {
  DownloadIcon,
  EllipsisIcon,
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

type EditorNavbarProps = {
  onOpenImportPicker: () => void;
  onExport: () => void;
  onPrint: () => void;
};

export function EditorNavbar({
  onOpenImportPicker,
  onExport,
  onPrint,
}: EditorNavbarProps) {
  return (
    <header className="border-b bg-background print:hidden">
      <div className="mx-auto flex h-14 max-w-[1500px] items-center justify-between gap-3 px-3 sm:px-4">
        <h1 className="truncate text-base font-semibold tracking-tight sm:text-lg">
          Resume Editor
        </h1>

        <div className="hidden items-center gap-2 md:flex">
          <Button type="button" variant="outline" size="sm" onClick={onOpenImportPicker}>
            <UploadIcon data-icon="inline-start" />
            Import
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={onExport}>
            <DownloadIcon data-icon="inline-start" />
            Export
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onPrint}
          >
            <PrinterIcon data-icon="inline-start" />
            Print / PDF
          </Button>
        </div>

        <div className="md:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger
              render={<Button variant="outline" size="icon-sm" aria-label="More actions" />}
            >
              <EllipsisIcon />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" sideOffset={8}>
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={onOpenImportPicker}>
                  <UploadIcon />
                  Import
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onExport}>
                  <DownloadIcon />
                  Export
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onPrint}>
                  <PrinterIcon />
                  Print / PDF
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
