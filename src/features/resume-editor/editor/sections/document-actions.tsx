"use client";

import { FileDownIcon, FileUpIcon, SparklesIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";

type DocumentActionsProps = {
  onExtractCv: () => void;
  onImportJson: () => void;
  onExportJson: () => void;
  /** Extract is disabled while a PDF import is already running. */
  isImportingPdf?: boolean;
};

/**
 * Document-level actions at the top of the Edit list: seed the résumé from a
 * PDF, or move its JSON in and out. These act on the whole document, not a
 * section — Download PDF is the one that stays in the top bar as the primary
 * output. Kept here (not behind a menu) so the common entry points are visible.
 */
export function DocumentActions({
  onExtractCv,
  onImportJson,
  onExportJson,
  isImportingPdf,
}: DocumentActionsProps) {
  return (
    <div className="flex flex-col gap-2">
      <Button
        type="button"
        variant="ai"
        className="w-full"
        disabled={isImportingPdf}
        onClick={onExtractCv}
      >
        <SparklesIcon data-icon="inline-start" />
        Extract from PDF
      </Button>
      <ButtonGroup className="w-full">
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          onClick={onImportJson}
        >
          <FileUpIcon data-icon="inline-start" />
          Import JSON
        </Button>
        <Button
          type="button"
          variant="outline"
          className="flex-1"
          onClick={onExportJson}
        >
          <FileDownIcon data-icon="inline-start" />
          Export JSON
        </Button>
      </ButtonGroup>
    </div>
  );
}
