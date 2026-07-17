"use client";

import {
  ChevronDownIcon,
  DownloadIcon,
  FileDownIcon,
  FileUpIcon,
  Loader,
  SparklesIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { EditorDocumentMenuControls } from "@/features/resume-editor/chrome/editor-header-store";
import { useIsMobile } from "@/hooks/use-mobile";

/**
 * Document-level actions in the top bar: extract, import/export JSON, download.
 * These live in the document chrome rather than the Edit sidebar — they act on
 * the whole resume, not on a section.
 */
export function EditorFileMenu({
  onExtractCv,
  onImportJson,
  onExportJson,
  onExportPdf,
  isExportingPdf,
  isImportingPdf,
}: EditorDocumentMenuControls) {
  const isMobile = useIsMobile();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            type="button"
            variant="outline"
            size={isMobile ? "icon-sm" : "sm"}
            aria-label="File"
          >
            {isMobile ? (
              <FileDownIcon />
            ) : (
              <>
                File
                <ChevronDownIcon data-icon="inline-end" />
              </>
            )}
          </Button>
        }
      />
      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuItem disabled={isImportingPdf} onClick={onExtractCv}>
          <SparklesIcon />
          Extract from PDF
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onImportJson}>
          <FileUpIcon />
          Import JSON
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onExportJson}>
          <FileDownIcon />
          Export JSON
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem disabled={isExportingPdf} onClick={onExportPdf}>
          {isExportingPdf ? (
            <Loader className="animate-spin" />
          ) : (
            <DownloadIcon />
          )}
          {isExportingPdf ? "Generating PDF…" : "Download PDF"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
