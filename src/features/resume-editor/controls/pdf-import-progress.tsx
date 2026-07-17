"use client";

import { Loader2Icon, SparklesIcon } from "lucide-react";

import { Dialog, DialogContent } from "@/components/ui/dialog";

import { useRotatingMessage } from "@/features/resume-editor/ui/use-rotating-message";

const PROGRESS_MESSAGES = [
  "Extracting PDF data…",
  "Reading your experience…",
  "Matching sections…",
  "Cleaning up formatting…",
  "Polishing the details…",
  "Almost done…",
];

export function PdfImportProgress({ open }: { open: boolean }) {
  const message = useRotatingMessage(PROGRESS_MESSAGES, 4000);

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent showCloseButton={false} className="gap-0 sm:max-w-sm">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="relative grid size-14 place-items-center rounded-full bg-primary/10 text-primary">
            <SparklesIcon className="size-6" />
            <Loader2Icon className="absolute inset-0 size-14 animate-spin text-primary/40" />
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-sm font-medium text-foreground">{message}</p>
            <p className="text-xs text-muted-foreground">
              This may take a few seconds.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
