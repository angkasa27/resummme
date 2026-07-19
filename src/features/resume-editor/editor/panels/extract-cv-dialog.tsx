"use client";

import { useId, useRef, useState } from "react";
import type { ChangeEvent, DragEvent, ReactNode } from "react";
import {
  FileTextIcon,
  SparklesIcon,
  UploadCloudIcon,
  XIcon,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import {
  DialogHeaderRow,
  DialogHeaderSection,
} from "@/features/resume-editor/editor/shared/dialog-header";
import { cn } from "@/lib/utils";

type ExtractCvDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (file: File) => void;
  isMobile?: boolean;
};

export function ExtractCvDialog({
  open,
  onOpenChange,
  onSubmit,
  isMobile,
}: ExtractCvDialogProps) {
  const body = (
    <ExtractCvBody
      onSubmit={(file) => {
        onSubmit(file);
        onOpenChange(false);
      }}
      onClose={() => onOpenChange(false)}
    />
  );

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent
          side="bottom"
          showCloseButton={false}
          className="flex max-h-[92dvh] flex-col rounded-t-xl gap-4 p-3"
        >
          <div className="mx-auto h-1 w-10 shrink-0 rounded-full bg-border" />
          <DialogHeaderSection
            icon={<SparklesIcon className="size-4 text-primary" />}
            title="Extract from PDF"
            description="Upload an existing resume. We'll parse the content."
            onClose={() => onOpenChange(false)}
          />
          {body}
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} className="sm:max-w-lg">
        <DialogHeaderRow
          icon={<SparklesIcon className="size-4 text-primary" />}
          title="Extract from PDF"
          description="Upload an existing resume. We'll parse the content and populate the editor."
          onClose={() => onOpenChange(false)}
        />
        {body}
      </DialogContent>
    </Dialog>
  );
}

type ExtractCvBodyProps = {
  onSubmit: (file: File) => void;
  onClose: () => void;
};

function ExtractCvBody({ onSubmit, onClose }: ExtractCvBodyProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const inputId = useId();

  function pickFile(candidate: File | undefined | null) {
    if (!candidate) return;
    if (
      candidate.type !== "application/pdf" &&
      !candidate.name.toLowerCase().endsWith(".pdf")
    ) {
      toast.error("Please select a PDF file.");
      return;
    }
    setFile(candidate);
  }

  function onInputChange(event: ChangeEvent<HTMLInputElement>) {
    pickFile(event.target.files?.[0]);
    event.target.value = "";
  }

  function onDrop(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    setIsDragOver(false);
    pickFile(event.dataTransfer.files?.[0]);
  }

  return (
    <div className="flex flex-col gap-4">
      <label
        htmlFor={inputId}
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={onDrop}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed px-4 py-8 text-center text-sm transition-colors",
          isDragOver
            ? "border-primary bg-primary/5 text-foreground"
            : "border-border bg-muted/30 text-muted-foreground hover:border-foreground/30 hover:bg-muted/50",
        )}
      >
        <UploadCloudIcon className="size-7" />
        <div className="flex flex-col gap-1">
          <span className="font-medium text-foreground">
            Drop your PDF here, or click to browse
          </span>
          <span className="text-xs">PDF only · max ~10MB</span>
        </div>
        <input
          ref={inputRef}
          id={inputId}
          type="file"
          accept="application/pdf,.pdf"
          className="sr-only"
          onChange={onInputChange}
        />
      </label>

      {file ? (
        <SelectedFileRow file={file} onClear={() => setFile(null)} />
      ) : null}

      <div className="flex justify-end gap-2 pt-1">
        <Button type="button" variant="outline" size="sm" onClick={onClose}>
          Cancel
        </Button>
        <Button
          type="button"
          variant="ai"
          size="sm"
          disabled={!file}
          onClick={() => file && onSubmit(file)}
        >
          <SparklesIcon data-icon="inline-start" />
          Extract
        </Button>
      </div>
    </div>
  );
}

function SelectedFileRow({
  file,
  onClear,
}: {
  file: File;
  onClear: () => void;
}): ReactNode {
  const sizeKb = file.size / 1024;
  const sizeLabel =
    sizeKb >= 1024
      ? `${(sizeKb / 1024).toFixed(1)} MB`
      : `${Math.round(sizeKb)} KB`;
  return (
    <div className="flex items-center gap-2 rounded-md border bg-muted/30 px-3 py-2 text-sm">
      <FileTextIcon className="size-4 shrink-0 text-muted-foreground" />
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="truncate font-medium">{file.name}</span>
        <span className="text-xs text-muted-foreground">{sizeLabel}</span>
      </div>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        aria-label="Remove file"
        onClick={onClear}
      >
        <XIcon />
      </Button>
    </div>
  );
}
