"use client";

import { XIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

type DialogHeaderSectionProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClose: () => void;
};

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
