"use client";

import { useState, useId } from "react";
import type { KeyboardEvent } from "react";
import { XIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type TagInputProps = {
  id?: string;
  value: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
  ariaInvalid?: boolean;
  ariaLabel?: string;
  /** Characters that commit the current draft as a tag, in addition to Enter. */
  separators?: string[];
  /** Disallow duplicates (case-insensitive). Default true. */
  unique?: boolean;
  /** Max number of tags. Default unlimited. */
  maxTags?: number;
};

export function TagInput({
  id,
  value,
  onChange,
  placeholder,
  ariaInvalid,
  ariaLabel,
  separators = [",", "Enter"],
  unique = true,
  maxTags,
}: TagInputProps) {
  const [draft, setDraft] = useState("");
  const autoId = useId();
  const inputId = id ?? autoId;

  function commitDraft() {
    const trimmed = draft.trim().replace(/,+$/, "");
    if (!trimmed) {
      setDraft("");
      return;
    }
    if (unique) {
      const lower = trimmed.toLowerCase();
      if (value.some((existing) => existing.toLowerCase() === lower)) {
        setDraft("");
        return;
      }
    }
    if (maxTags !== undefined && value.length >= maxTags) {
      setDraft("");
      return;
    }
    onChange([...value, trimmed]);
    setDraft("");
  }

  function removeTagAt(index: number) {
    onChange(value.filter((_, i) => i !== index));
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (separators.includes(event.key)) {
      event.preventDefault();
      commitDraft();
      return;
    }
    if (event.key === "Backspace" && draft === "" && value.length > 0) {
      event.preventDefault();
      removeTagAt(value.length - 1);
    }
  }

  function handlePaste(event: React.ClipboardEvent<HTMLInputElement>) {
    const pasted = event.clipboardData.getData("text");
    if (!pasted.includes(",") && !pasted.includes("\n")) return;
    event.preventDefault();
    const parts = pasted
      .split(/[,\n]/)
      .map((part) => part.trim())
      .filter(Boolean);
    if (parts.length === 0) return;
    const next = [...value];
    for (const part of parts) {
      if (
        unique &&
        next.some((existing) => existing.toLowerCase() === part.toLowerCase())
      ) {
        continue;
      }
      if (maxTags !== undefined && next.length >= maxTags) break;
      next.push(part);
    }
    onChange(next);
    setDraft("");
  }

  return (
    <div
      role="group"
      aria-label={ariaLabel}
      data-invalid={ariaInvalid || undefined}
      className={cn(
        "flex min-h-9 flex-wrap items-center gap-1.5 rounded-md border border-input bg-background px-2 py-1.5 text-sm shadow-xs transition-[color,box-shadow] outline-none",
        "focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50",
        "data-invalid:border-destructive data-invalid:ring-destructive/20 dark:data-invalid:ring-destructive/40",
      )}
      onClick={(event) => {
        if (event.target === event.currentTarget) {
          (
            event.currentTarget.querySelector(
              `#${CSS.escape(inputId)}`,
            ) as HTMLInputElement | null
          )?.focus();
        }
      }}
    >
      {value.map((tag, index) => (
        <Badge
          key={`${tag}-${index}`}
          variant="secondary"
          className="h-6 gap-1 pr-1"
        >
          <span className="truncate max-w-[180px]">{tag}</span>
          <button
            type="button"
            aria-label={`Remove ${tag}`}
            className="grid size-3.5 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-muted-foreground/15 hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            onClick={(event) => {
              event.stopPropagation();
              removeTagAt(index);
            }}
          >
            <XIcon className="size-2.5" />
          </button>
        </Badge>
      ))}
      <input
        id={inputId}
        type="text"
        aria-invalid={ariaInvalid || undefined}
        className="min-w-[8ch] flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        placeholder={value.length === 0 ? placeholder : undefined}
        value={draft}
        spellCheck={false}
        onChange={(event) => setDraft(event.target.value)}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        onBlur={commitDraft}
      />
    </div>
  );
}
