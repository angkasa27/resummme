import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import {
  useKeyboardShortcuts,
  type KeyboardShortcutMap,
} from "@/hooks/use-keyboard-shortcuts";

// NOTE: jsdom reports navigator.platform === "", so IS_MAC is false and the
// "mod" token resolves to `ctrlKey`. Every test here presses ctrl for "mod".
// If this hook ever hard-coded metaKey instead of the platform lookup, these
// ctrl-based tests would fail — which is the point.

const focusables: HTMLElement[] = [];

function dispatchKey(init: KeyboardEventInit): KeyboardEvent {
  const event = new KeyboardEvent("keydown", {
    bubbles: true,
    cancelable: true,
    ...init,
  });
  act(() => {
    window.dispatchEvent(event);
  });
  return event;
}

/** Focus a real element so `document.activeElement` reflects the input guard. */
function focusElement(el: HTMLElement) {
  document.body.appendChild(el);
  el.focus();
  focusables.push(el);
}

function focusInput() {
  focusElement(document.createElement("input"));
}

function focusTextarea() {
  focusElement(document.createElement("textarea"));
}

function focusContentEditable() {
  // jsdom does not implement isContentEditable, so we simulate it. The element
  // still needs a tabindex to become the real activeElement in jsdom.
  const el = document.createElement("div");
  el.setAttribute("tabindex", "-1");
  Object.defineProperty(el, "isContentEditable", {
    value: true,
    configurable: true,
  });
  focusElement(el);
}

afterEach(() => {
  for (const el of focusables.splice(0)) {
    el.blur();
    el.remove();
  }
  // Ensure focus is not left on a stale node between tests.
  (document.activeElement as HTMLElement | null)?.blur();
});

function mount(shortcuts: KeyboardShortcutMap) {
  return renderHook(
    (props: KeyboardShortcutMap) => useKeyboardShortcuts(props),
    {
      initialProps: shortcuts,
    },
  );
}

describe("useKeyboardShortcuts", () => {
  describe("combo matching", () => {
    it("fires a mod+key shortcut only when the platform mod key is held", () => {
      // Why: save-style shortcuts (mod+s) are the primary use of this hook; a
      // bare keypress must not trigger them or every "s" typed would fire save.
      const handler = vi.fn();
      mount({ "mod+s": handler });

      dispatchKey({ key: "s" });
      expect(handler).not.toHaveBeenCalled();

      dispatchKey({ key: "s", ctrlKey: true });
      expect(handler).toHaveBeenCalledTimes(1);
    });

    it("does not fire a mod shortcut when the mod key is absent even with other modifiers", () => {
      // Why: the guard rejects a missing mod, protecting against alt+s etc.
      // being mistaken for the mod combo.
      const handler = vi.fn();
      mount({ "mod+s": handler });

      dispatchKey({ key: "s", altKey: true });
      expect(handler).not.toHaveBeenCalled();
    });

    it("rejects a bare-key shortcut when the mod key is unexpectedly held", () => {
      // Why: a plain "?" help shortcut must not fire on ctrl+? — an unexpected
      // mod means the user meant a different (browser) action.
      const handler = vi.fn();
      mount({ "?": handler });

      dispatchKey({ key: "?", ctrlKey: true });
      expect(handler).not.toHaveBeenCalled();

      dispatchKey({ key: "?" });
      expect(handler).toHaveBeenCalledTimes(1);
    });

    it("requires shift to be held for a shift+ combo", () => {
      // Why: mod+shift+z (redo) must be distinguishable from mod+z (undo).
      const redo = vi.fn();
      mount({ "mod+shift+z": redo });

      dispatchKey({ key: "z", ctrlKey: true });
      expect(redo).not.toHaveBeenCalled();

      dispatchKey({ key: "z", ctrlKey: true, shiftKey: true });
      expect(redo).toHaveBeenCalledTimes(1);
    });

    it("rejects an unexpected shift on a plain-letter combo", () => {
      // Why: mod+z (undo) must NOT fire when shift is also held, otherwise
      // mod+shift+z (redo) would trigger undo as well.
      const undo = vi.fn();
      mount({ "mod+z": undo });

      dispatchKey({ key: "z", ctrlKey: true, shiftKey: true });
      expect(undo).not.toHaveBeenCalled();

      dispatchKey({ key: "z", ctrlKey: true });
      expect(undo).toHaveBeenCalledTimes(1);
    });

    it("allows shift for shift-produced symbol keys without shift in the combo", () => {
      // Why: "?" / "/" / "+" are typed WITH shift on many layouts, so the combo
      // author writes just "?" but the event still arrives with shiftKey=true.
      // The guard must whitelist these so the help shortcut still fires.
      const help = vi.fn();
      const zoom = vi.fn();
      mount({ "?": help, "+": zoom });

      dispatchKey({ key: "?", shiftKey: true });
      expect(help).toHaveBeenCalledTimes(1);

      dispatchKey({ key: "+", shiftKey: true });
      expect(zoom).toHaveBeenCalledTimes(1);
    });

    it("requires alt to match exactly", () => {
      // Why: alt is part of the combo identity in both directions — a combo
      // without alt must not fire when alt is held, and vice versa.
      const withAlt = vi.fn();
      mount({ "alt+n": withAlt });

      dispatchKey({ key: "n" });
      expect(withAlt).not.toHaveBeenCalled();

      dispatchKey({ key: "n", altKey: true });
      expect(withAlt).toHaveBeenCalledTimes(1);
    });

    it("matches keys case-insensitively", () => {
      // Why: event.key is uppercase when shift is held / caps lock is on; combo
      // authors write lowercase, so matching must normalize case.
      const handler = vi.fn();
      mount({ "mod+s": handler });

      dispatchKey({ key: "S", ctrlKey: true });
      expect(handler).toHaveBeenCalledTimes(1);
    });
  });

  describe("input-focus guard", () => {
    it("does not fire while typing in an input", () => {
      // Why: THE critical safety behavior. mod+b, single-key shortcuts, etc.
      // must never hijack keystrokes while the user is editing a form field.
      const handler = vi.fn();
      mount({ "mod+s": handler });

      focusInput();
      dispatchKey({ key: "s", ctrlKey: true });
      expect(handler).not.toHaveBeenCalled();
    });

    it("does not fire while typing in a textarea", () => {
      const handler = vi.fn();
      mount({ "mod+s": handler });

      focusTextarea();
      dispatchKey({ key: "s", ctrlKey: true });
      expect(handler).not.toHaveBeenCalled();
    });

    it("does not fire while focus is in a contenteditable region", () => {
      const handler = vi.fn();
      mount({ "mod+s": handler });

      focusContentEditable();
      dispatchKey({ key: "s", ctrlKey: true });
      expect(handler).not.toHaveBeenCalled();
    });

    it("still fires when ignoreInputFocus is set even while an input is focused", () => {
      // Why: some global shortcuts (e.g. save) must work regardless of focus.
      // This opt-out is the intended escape hatch and must keep working.
      const handler = vi.fn();
      mount({ "mod+s": { handler, ignoreInputFocus: true } });

      focusInput();
      dispatchKey({ key: "s", ctrlKey: true });
      expect(handler).toHaveBeenCalledTimes(1);
    });

    it("fires normally when nothing is focused", () => {
      const handler = vi.fn();
      mount({ "mod+s": handler });

      dispatchKey({ key: "s", ctrlKey: true });
      expect(handler).toHaveBeenCalledTimes(1);
    });

    it("keeps scanning past a focus-blocked combo to a later ignoreInputFocus combo", () => {
      // Why: locks the `continue` (not `return`) behavior when a matching combo
      // is blocked by focus — a focus-guarded and a focus-ignoring handler for
      // the same chord must not shadow each other. A refactor to `return` here
      // would silently swallow the second handler.
      const guarded = vi.fn();
      const global = vi.fn();
      mount({
        "mod+s": guarded,
        "mod+shift+s": { handler: global, ignoreInputFocus: true },
      });

      focusInput();
      dispatchKey({ key: "s", ctrlKey: true, shiftKey: true });

      expect(guarded).not.toHaveBeenCalled();
      expect(global).toHaveBeenCalledTimes(1);
    });
  });

  describe("dispatch behavior", () => {
    it("calls preventDefault by default and passes the event to the handler", () => {
      // Why: shortcuts must suppress the browser default (mod+s = save page)
      // and hand the handler the originating event.
      const handler = vi.fn();
      mount({ "mod+s": handler });

      const event = dispatchKey({ key: "s", ctrlKey: true });

      expect(event.defaultPrevented).toBe(true);
      expect(handler).toHaveBeenCalledWith(event);
    });

    it("does not preventDefault when the entry opts out", () => {
      // Why: some shortcuts augment rather than replace the browser default
      // and must leave it intact.
      const handler = vi.fn();
      mount({ "mod+p": { handler, preventDefault: false } });

      const event = dispatchKey({ key: "p", ctrlKey: true });

      expect(handler).toHaveBeenCalledTimes(1);
      expect(event.defaultPrevented).toBe(false);
    });

    it("fires only the first matching combo and stops", () => {
      // Why: dispatch is first-match-wins; a second matching entry must not
      // also run, so ordering is a meaningful contract.
      const first = vi.fn();
      const second = vi.fn();
      mount({ "mod+s": first, "MOD+S": second });

      dispatchKey({ key: "s", ctrlKey: true });

      expect(first).toHaveBeenCalledTimes(1);
      expect(second).not.toHaveBeenCalled();
    });

    it("does nothing when no combo matches", () => {
      const handler = vi.fn();
      const event = { key: "s", ctrlKey: true };
      mount({ "mod+k": handler });

      const dispatched = dispatchKey(event);

      expect(handler).not.toHaveBeenCalled();
      expect(dispatched.defaultPrevented).toBe(false);
    });

    it("uses the latest handler after the shortcut map changes", () => {
      // Why: the hook stores shortcuts in a ref updated every render so callers
      // can pass fresh closures without re-subscribing the listener. A stale
      // handler here would fire outdated actions (e.g. save the wrong draft).
      const first = vi.fn();
      const second = vi.fn();
      const { rerender } = mount({ "mod+s": first });

      rerender({ "mod+s": second });
      dispatchKey({ key: "s", ctrlKey: true });

      expect(first).not.toHaveBeenCalled();
      expect(second).toHaveBeenCalledTimes(1);
    });

    it("detaches its listener on unmount", () => {
      // Why: a leaked keydown listener would keep firing stale handlers after
      // the editor tears down, and could double-fire across remounts.
      const handler = vi.fn();
      const { unmount } = mount({ "mod+s": handler });

      unmount();
      dispatchKey({ key: "s", ctrlKey: true });

      expect(handler).not.toHaveBeenCalled();
    });
  });
});
