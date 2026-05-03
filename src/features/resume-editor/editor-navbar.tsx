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
    <header className="sticky top-0 z-30 h-16 border-b bg-background/95 backdrop-blur print:hidden">
      <div className="mx-auto flex h-full max-w-[1720px] items-center justify-between gap-4 px-4 lg:px-6">
        <div className="min-w-0">
          <h1 className="truncate text-lg font-semibold">CV Editor</h1>
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <Button type="button" variant="outline" size="sm" onClick={onOpenImportPicker}>
            <UploadIcon data-icon="inline-start" />
            Import
          </Button>
          <Button type="button" variant="outline" size="sm" onClick={onExport}>
            <DownloadIcon data-icon="inline-start" />
            Export
          </Button>
          <Button type="button" size="sm" onClick={onPrint}>
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
