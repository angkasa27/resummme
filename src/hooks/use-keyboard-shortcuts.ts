"use client";

import { useEffect, useRef } from "react";

type ShortcutHandler = (event: KeyboardEvent) => void;

export type KeyboardShortcutMap = Record<
  string,
  | ShortcutHandler
  | { handler: ShortcutHandler; preventDefault?: boolean; ignoreInputFocus?: boolean }
>;

const IS_MAC = typeof navigator !== "undefined" && navigator.platform.includes("Mac");
const MOD_KEY = IS_MAC ? "metaKey" : "ctrlKey" as "metaKey" | "ctrlKey";

function isInputFocused(): boolean {
  const tag = document.activeElement?.tagName;
  if (!tag) return false;
  if (tag === "INPUT" || tag === "TEXTAREA") return true;
  if ((document.activeElement as HTMLElement | null)?.isContentEditable) return true;
  return false;
}

function matchesCombo(event: KeyboardEvent, combo: string): boolean {
  const parts = combo.toLowerCase().split("+");
  const key = parts.at(-1)!;

  if (event.key.toLowerCase() !== key) return false;

  const hasMod = parts.includes("mod");
  const hasShift = parts.includes("shift");
  const hasAlt = parts.includes("alt");

  if (hasMod && !event[MOD_KEY]) return false;
  if (!hasMod && event[MOD_KEY]) return false;
  if (hasShift && !event.shiftKey) return false;
  if (!hasShift && event.shiftKey && key !== "?" && key !== "/" && key !== "+") return false;
  if (hasAlt && !event.altKey) return false;
  if (!hasAlt && event.altKey) return false;

  return true;
}

export function useKeyboardShortcuts(shortcuts: KeyboardShortcutMap) {
  const shortcutsRef = useRef(shortcuts);

  useEffect(() => {
    shortcutsRef.current = shortcuts;
  });

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const current = shortcutsRef.current;

      for (const [combo, entry] of Object.entries(current)) {
        if (!matchesCombo(event, combo)) continue;

        const handler = typeof entry === "function" ? entry : entry.handler;
        const preventDefault = typeof entry === "function" ? true : (entry.preventDefault ?? true);
        const ignoreInputFocus = typeof entry === "function" ? false : (entry.ignoreInputFocus ?? false);

        if (!ignoreInputFocus && isInputFocused()) continue;

        if (preventDefault) event.preventDefault();
        handler(event);
        return;
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);
}
