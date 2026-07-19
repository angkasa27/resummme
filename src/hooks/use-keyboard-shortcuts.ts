"use client";

import { useEffect, useRef } from "react";

type ShortcutHandler = (event: KeyboardEvent) => void;

export type KeyboardShortcutMap = Record<
  string,
  | ShortcutHandler
  | {
      handler: ShortcutHandler;
      preventDefault?: boolean;
      ignoreInputFocus?: boolean;
    }
>;

const IS_MAC =
  typeof navigator !== "undefined" && navigator.platform.includes("Mac");
const MOD_KEY = IS_MAC ? "metaKey" : ("ctrlKey" as "metaKey" | "ctrlKey");

function isInputFocused(): boolean {
  const tag = document.activeElement?.tagName;
  if (!tag) return false;
  if (tag === "INPUT" || tag === "TEXTAREA") return true;
  if ((document.activeElement as HTMLElement | null)?.isContentEditable)
    return true;
  return false;
}

const MODIFIER_TOKENS = new Set(["mod", "shift", "alt"]);
// "?" / "/" / "+" are typed WITH shift on many layouts, so a combo author can
// write just the symbol and the shortcut still fires when shiftKey is set.
const SHIFT_TOLERANT_KEYS = new Set(["?", "/", "+"]);

type ParsedCombo = {
  key: string;
  hasMod: boolean;
  hasShift: boolean;
  hasAlt: boolean;
};

function parseCombo(combo: string): ParsedCombo {
  // Split on "+", but the key itself may *be* "+" (which the naive split
  // would otherwise swallow as an empty separator) — only the leading
  // recognized modifier tokens are consumed; everything else re-joins as key.
  const tokens = combo.toLowerCase().split("+");
  let modifierCount = 0;
  while (
    modifierCount < tokens.length - 1 &&
    MODIFIER_TOKENS.has(tokens[modifierCount])
  ) {
    modifierCount++;
  }
  const modifiers = tokens.slice(0, modifierCount);
  return {
    key: tokens.slice(modifierCount).join("+"),
    hasMod: modifiers.includes("mod"),
    hasShift: modifiers.includes("shift"),
    hasAlt: modifiers.includes("alt"),
  };
}

function modifiersMatch(event: KeyboardEvent, combo: ParsedCombo): boolean {
  if (combo.hasMod !== event[MOD_KEY]) return false;
  if (combo.hasAlt !== event.altKey) return false;
  if (combo.hasShift) return event.shiftKey;
  if (!event.shiftKey) return true;
  return SHIFT_TOLERANT_KEYS.has(combo.key);
}

function matchesCombo(event: KeyboardEvent, combo: string): boolean {
  // Some autofill/extension-dispatched KeyboardEvents omit `key` entirely.
  if (!event.key) return false;
  const parsed = parseCombo(combo);
  if (event.key.toLowerCase() !== parsed.key) return false;
  return modifiersMatch(event, parsed);
}

type NormalizedShortcut = {
  handler: ShortcutHandler;
  preventDefault: boolean;
  ignoreInputFocus: boolean;
};

function normalizeShortcutEntry(
  entry: KeyboardShortcutMap[string],
): NormalizedShortcut {
  if (typeof entry === "function") {
    return { handler: entry, preventDefault: true, ignoreInputFocus: false };
  }
  return {
    handler: entry.handler,
    preventDefault: entry.preventDefault ?? true,
    ignoreInputFocus: entry.ignoreInputFocus ?? false,
  };
}

function dispatchShortcut(
  event: KeyboardEvent,
  shortcuts: KeyboardShortcutMap,
) {
  for (const [combo, entry] of Object.entries(shortcuts)) {
    if (!matchesCombo(event, combo)) continue;

    const { handler, preventDefault, ignoreInputFocus } =
      normalizeShortcutEntry(entry);

    if (!ignoreInputFocus && isInputFocused()) continue;

    if (preventDefault) event.preventDefault();
    handler(event);
    return;
  }
}

export function useKeyboardShortcuts(shortcuts: KeyboardShortcutMap) {
  const shortcutsRef = useRef(shortcuts);

  useEffect(() => {
    shortcutsRef.current = shortcuts;
  });

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      dispatchShortcut(event, shortcutsRef.current);
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);
}
