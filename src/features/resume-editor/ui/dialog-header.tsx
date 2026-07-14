"use client";

import { XIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

type DialogHeaderSectionProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClose: () => void;
};

/** Plain (non-`Dialog`) header row — used inside the mobile `Sheet` variant,
 *  which doesn't carry the Dialog's `aria-labelledby`/`aria-describedby` wiring. */
export function DialogHeaderSection({
  icon,
  title,
  description,
  onClose,
}: DialogHeaderSectionProps) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="flex flex-col gap-0.5">
        <h2 className="flex items-center gap-2 text-base font-medium">
          {icon}
          {title}
        </h2>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        aria-label="Close"
        onClick={onClose}
      >
        <XIcon />
      </Button>
    </div>
  );
}

type DialogHeaderRowProps = {
  icon: React.ReactNode;
  title: string;
  description: React.ReactNode;
  onClose: () => void;
  className?: string;
};

/** Desktop `Dialog` header row: same layout as {@link DialogHeaderSection},
 *  built on `DialogTitle`/`DialogDescription` so the dialog's a11y wiring
 *  (aria-labelledby/aria-describedby) stays intact. */
export function DialogHeaderRow({
  icon,
  title,
  description,
  onClose,
  className,
}: DialogHeaderRowProps) {
  return (
    <DialogHeader
      className={cn("flex-row items-start justify-between gap-3", className)}
    >
      <div className="flex flex-col gap-1">
        <DialogTitle className="flex items-center gap-2">
          {icon}
          {title}
        </DialogTitle>
        <DialogDescription>{description}</DialogDescription>
      </div>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        aria-label="Close"
        onClick={onClose}
      >
        <XIcon />
      </Button>
    </DialogHeader>
  );
}
