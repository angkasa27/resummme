"use client";

import { useState } from "react";
import { HexColorPicker } from "react-colorful";
import { PaletteIcon } from "lucide-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  DEFAULT_ACCENT,
  isValidAccentHex,
} from "@/features/resume-editor/domain/presentation/pdf-presentation";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { FOCUS_RING_CLASS } from "@/features/resume-editor/forms/fields/field-control";

const ACCENT_SWATCHES: ReadonlyArray<{ name: string; hex: string }> = [
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
  /** Columns this control takes in the surrounding field grid. */
  span?: 1 | 2;
  /** Renders an "Auto" swatch ahead of the presets; used to clear the value. */
  allowAuto?: {
    active: boolean;
    onSelect: () => void;
  };
};

function isSwatchActive(
  swatch: { hex: string },
  matchedSwatch: { hex: string } | undefined,
  allowAuto: ColorControlProps["allowAuto"],
): boolean {
  return !allowAuto?.active && matchedSwatch?.hex === swatch.hex;
}

function ColorSwatchButton({
  swatch,
  label,
  isActive,
  onSelect,
}: {
  swatch: { name: string; hex: string };
  label: string;
  isActive: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={`${label} ${swatch.name}`}
      aria-pressed={isActive}
      onClick={onSelect}
      className={cn(
        "size-7 rounded-md border border-black/10 transition-transform hover:scale-110",
        FOCUS_RING_CLASS,
        "aria-pressed:ring-2 aria-pressed:ring-offset-2 aria-pressed:ring-offset-background aria-pressed:ring-foreground/60",
      )}
      style={{ backgroundColor: swatch.hex }}
    />
  );
}

export function ColorControl({
  value,
  onChange,
  label = "Color",
  span,
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
  const isCustomColorActive = !allowAuto?.active && !matchedSwatch;

  return (
    <Field className={span === 2 ? "col-span-full" : undefined}>
      {/* No htmlFor: the swatches are a group, each with its own aria-label. */}
      <FieldLabel>{label}</FieldLabel>
      <div className="flex flex-wrap gap-2">
        {allowAuto ? (
          <button
            type="button"
            aria-label={`${label} auto`}
            aria-pressed={allowAuto.active}
            onClick={allowAuto.onSelect}
            className={cn(
              "size-7 rounded-md border border-black/10 bg-muted text-xs font-semibold text-muted-foreground transition-transform hover:scale-110",
              FOCUS_RING_CLASS,
              "aria-pressed:ring-2 aria-pressed:ring-offset-2 aria-pressed:ring-offset-background aria-pressed:ring-foreground/60",
            )}
          >
            A
          </button>
        ) : null}
        {ACCENT_SWATCHES.map((swatch) => (
          <ColorSwatchButton
            key={swatch.hex}
            swatch={swatch}
            label={label}
            isActive={isSwatchActive(swatch, matchedSwatch, allowAuto)}
            onSelect={() => onChange(swatch.hex)}
          />
        ))}
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
                aria-pressed={isCustomColorActive}
                className={cn(
                  "relative size-7 rounded-md transition-transform hover:scale-110",
                  FOCUS_RING_CLASS,
                  "aria-pressed:ring-2 aria-pressed:ring-offset-2 aria-pressed:ring-offset-background aria-pressed:ring-foreground/60",
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
            className="w-auto gap-4 p-3"
          >
            <HexColorPicker
              color={value}
              onChange={onChange}
              style={{ width: "auto", height: 160 }}
            />
            <InputGroup>
              <InputGroupAddon>
                <PaletteIcon />
              </InputGroupAddon>
              <InputGroupInput
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
            </InputGroup>
          </PopoverContent>
        </Popover>
      </div>
    </Field>
  );
}
