"use client";

import { createContext, useContext } from "react";

/**
 * Carries the store's external-replacement `revision` (see the store field) to
 * the drill-in without threading it through every layer. The open section form
 * is keyed by it, so a genuine draft replacement (import/undo/redo) remounts and
 * re-seeds the form, while the form's own autosave (which never bumps revision)
 * leaves it mounted and untouched.
 *
 * Defaults to `0`, so a form rendered outside a provider (tests, standalone)
 * simply never remounts from this.
 */
export const EditorRevisionContext = createContext(0);

export function useEditorRevision(): number {
  return useContext(EditorRevisionContext);
}
