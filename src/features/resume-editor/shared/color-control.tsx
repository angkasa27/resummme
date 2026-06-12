"use client";

import { useState } from "react";
import { HexColorPicker } from "react-colorful";
import { PaletteIcon } from "lucide-react";

import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  DEFAULT_ACCENT,
  isValidAccentHex,
} from "@/features/resume-editor/domain/presentation/pdf-presentation";

export const ACCENT_SWATCHES: ReadonlyArray<{ name: string; hex: string }> = [
  { name: "Slate", hex: "#1f2937" },
  { name: "Blue", hex: "#2563eb" },
  { name: "Indigo", hex: "#4f46e5" },
  { name: "Violet", hex: "#7c3aed" },
  { name: "Cyan", hex: "#0891b2" },
  { name: "Teal", hex: "#0d9488" },
  { name: "Emerald", hex: "#059669" },
  { name: "Amber", hex: "#d97706" },
  { name: "Red", hex: "#dc2626" },
  { name: "Rose", hex: "#e11d48" },
];

type ColorControlProps = {
  value: string;
  onChange: (next: string) => void;
  label?: string;
  /** Renders an "Auto" swatch ahead of the presets; used to clear the value. */
  allowAuto?: {
    active: boolean;
    onSelect: () => void;
  };
};

export function ColorControl({
  value,
  onChange,
  label = "Color",
  allowAuto,
}: ColorControlProps) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const [hexDraft, setHexDraft] = useState(value);

  function commitHex(raw: string) {
    const trimmed = raw.trim();
    const normalized = trimmed.startsWith("#") ? trimmed : `#${trimmed}`;
    if (isValidAccentHex(normalized)) {
      onChange(normalized);
      setHexDraft(normalized);
    } else {
      setHexDraft(value);
    }
  }

  const matchedSwatch = ACCENT_SWATCHES.find(
    (swatch) => swatch.hex.toLowerCase() === value.toLowerCase(),
  );

  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <div className="flex gap-1.5 flex-wrap">
        {allowAuto ? (
          <button
            type="button"
            aria-label={`${label} auto`}
            aria-pressed={allowAuto.active}
            onClick={allowAuto.onSelect}
            className={cn(
              "size-7 rounded-md border border-black/10 bg-muted text-[10px] font-semibold text-muted-foreground transition-transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
              allowAuto.active && "ring-2 ring-offset-2 ring-foreground/60",
            )}
          >
            A
          </button>
        ) : null}
        {ACCENT_SWATCHES.map((swatch) => {
          const isActive = !allowAuto?.active && matchedSwatch?.hex === swatch.hex;
          return (
            <button
              key={swatch.hex}
              type="button"
              aria-label={`${label} ${swatch.name}`}
              aria-pressed={isActive}
              onClick={() => onChange(swatch.hex)}
              className={cn(
                "size-7 rounded-md border border-black/10 transition-transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
                isActive && "ring-2 ring-offset-2 ring-foreground/60",
              )}
              style={{ backgroundColor: swatch.hex }}
            />
          );
        })}
        <Popover
          open={pickerOpen}
          onOpenChange={(open) => {
            setPickerOpen(open);
            if (open) setHexDraft(value);
          }}
        >
          <PopoverTrigger
            render={
              <button
                type="button"
                aria-label="Custom color"
                aria-pressed={!allowAuto?.active && !matchedSwatch}
                className={cn(
                  "relative size-7 rounded-md transition-transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1",
                  !allowAuto?.active &&
                    !matchedSwatch &&
                    "ring-2 ring-offset-2 ring-foreground/60",
                )}
                style={{
                  background: matchedSwatch
                    ? "conic-gradient(from 0deg, #ef4444, #eab308, #22c55e, #06b6d4, #6366f1, #ec4899, #ef4444)"
                    : value,
                }}
              />
            }
          />
          <PopoverContent
            align="end"
            sideOffset={8}
            className="w-auto p-3 gap-3"
          >
            <HexColorPicker
              color={value}
              onChange={onChange}
              style={{ width: 200, height: 160 }}
            />
            <div className="flex items-center gap-2">
              <PaletteIcon className="size-4 text-muted-foreground" />
              <Input
                value={hexDraft}
                onChange={(event) => setHexDraft(event.target.value)}
                onBlur={(event) => commitHex(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    commitHex(event.currentTarget.value);
                  }
                }}
                spellCheck={false}
                className="font-mono uppercase"
                placeholder={DEFAULT_ACCENT}
              />
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
