"use client";

import { useState, type MouseEvent } from "react";
import Image from "next/image";
import Link from "next/link";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { PresetSwatch } from "@/features/resume-editor/editor/panels/preset-swatch";
import type { PdfLayoutId } from "@/features/resume-editor/domain/presentation/pdf-presentation";
import {
  layoutLabel,
  templateLabel,
  type ResumeTemplatePreset,
} from "@/features/resume-editor/domain/presentation/template-presets";
import { FOCUS_RING_CLASS } from "@/features/resume-editor/forms/fields/field-control";
import { cn } from "@/lib/utils";

/** Browsable grid card, one per layout. A swatch picks which preset the card
 *  shows and opens; the carousel's card is marquee-shaped and label-on-hover. */
export function TemplateCard({
  layoutId,
  presets,
}: {
  layoutId: PdfLayoutId;
  presets: ReadonlyArray<ResumeTemplatePreset>;
}) {
  // Null until a swatch is clicked: ringing the first preset on all 25 cards
  // would put a selection on a page where nothing has been chosen yet.
  const [picked, setPicked] = useState<number | null>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  const [confirming, setConfirming] = useState(false);
  const shown = hovered ?? picked ?? 0;
  const href = `/editor?template=${presets[shown].id}`;
  const name = layoutLabel(layoutId);
  const label = templateLabel(presets[shown]);

  // A stray tap while comparing styles must not leave the page, so a plain
  // click asks first. Modified clicks (new tab, new window) still just open.
  const confirmOpen = (event: MouseEvent) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    setConfirming(true);
  };

  return (
    <div className="flex flex-col gap-2 sm:gap-3">
      <Link
        href={href}
        onClick={confirmOpen}
        aria-label={`Open ${label} in the editor`}
        className={cn("rounded-xl", FOCUS_RING_CLASS)}
      >
        <div className="relative aspect-[1/1.414] overflow-hidden rounded-xl border bg-background">
          {/* Every preset stays mounted and cross-fades: swapping one src
              would flash blank while the next image loads. */}
          {presets.map((preset, index) => (
            <Image
              key={preset.id}
              src={`/templates/${preset.id}.webp`}
              alt={index === shown ? `${templateLabel(preset)} resume template` : ""}
              fill
              sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 260px"
              className={cn(
                "object-cover object-top transition-opacity duration-300",
                index === shown ? "opacity-100" : "opacity-0",
              )}
              loading="lazy"
              quality={80}
            />
          ))}
        </div>
      </Link>
      <div className="flex items-center justify-between gap-2">
        <Link
          href={href}
          onClick={confirmOpen}
          tabIndex={-1}
          className="min-w-0 truncate text-sm font-semibold tracking-tight"
        >
          {name}
        </Link>
        <div
          role="group"
          aria-label={`${name} styles`}
          className="flex shrink-0 items-center gap-1.5"
          onPointerLeave={() => setHovered(null)}
        >
          {presets.map((preset, index) => (
            <PresetSwatch
              key={preset.id}
              preset={preset}
              active={index === picked}
              onPreview={(on) => setHovered(on ? index : null)}
              onApply={() => setPicked(index)}
            />
          ))}
        </div>
      </div>
      <Dialog open={confirming} onOpenChange={setConfirming}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Open &quot;{label}&quot; in the editor?</DialogTitle>
            <DialogDescription>
              The editor opens with this template applied. You can switch
              templates there any time.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose
              render={<Button variant="ghost" size="sm" />}
              className="sm:mr-auto"
            >
              Keep browsing
            </DialogClose>
            <Link href={href} className={buttonVariants({ size: "sm" })}>
              Open editor
            </Link>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
