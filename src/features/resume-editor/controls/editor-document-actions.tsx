"use client";

import { DownloadIcon, SparklesIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { cn } from "@/lib/utils";

export type EditorDocumentActionsProps = {
  onExtractCv: () => void;
  onImportJson: () => void;
  onExport: () => void;
  onExportPdf: () => void;
  isExportingPdf?: boolean;
  isImportingPdf?: boolean;
  className?: string;
};

/** Extract / Import / Export / Download buttons shared by the control panel and
 * the mobile Sections drawer. */
export function EditorDocumentActions({
  onExtractCv,
  onImportJson,
  onExport,
  onExportPdf,
  isExportingPdf = false,
  isImportingPdf = false,
  className,
}: EditorDocumentActionsProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <Button
        type="button"
        variant="ai"
        size="lg"
        className="w-full justify-center font-medium"
        disabled={isImportingPdf}
        onClick={onExtractCv}
      >
        <SparklesIcon data-icon="inline-start" />
        Extract from PDF
      </Button>
      <ButtonGroup className="w-full">
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={onImportJson}
          className="flex-1"
        >
          Import JSON
        </Button>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={onExport}
          className="flex-1"
        >
          Export JSON
        </Button>
      </ButtonGroup>
      <Button
        type="button"
        size="sm"
        variant="outline"
        disabled={isExportingPdf}
        onClick={onExportPdf}
      >
        <DownloadIcon data-icon="inline-start" />
        {isExportingPdf ? "Generating PDF…" : "Download PDF"}
      </Button>
    </div>
  );
}
