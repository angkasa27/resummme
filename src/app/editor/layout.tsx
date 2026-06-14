"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";

import {
  EditorTopBar,
  type EditorView,
} from "@/features/resume-editor/shared/editor-top-bar";
import { useEditorHeaderStore } from "@/features/resume-editor/shared/editor-header-store";

export default function EditorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const routeView: EditorView = pathname?.includes("/canvas")
    ? "canvas"
    : "classic";

  // Optimistic active tab: switch on click so the pill animates immediately,
  // then reconcile with the route once the (async) navigation lands. Without
  // this the value would only flip after navigation commits — in the same
  // pass that swaps the page below — and the slide gets dropped. Reconciling
  // during render (React's "adjust state on prop change" pattern) avoids an
  // effect-driven cascading render.
  const [activeView, setActiveView] = useState<EditorView>(routeView);
  const [syncedRoute, setSyncedRoute] = useState(routeView);
  if (routeView !== syncedRoute) {
    setSyncedRoute(routeView);
    setActiveView(routeView);
  }

  const controls = useEditorHeaderStore();

  return (
    <div className="flex h-dvh flex-col">
      <EditorTopBar
        activeView={activeView}
        onSelectView={setActiveView}
        saveStatus={controls.saveStatus}
        canUndo={controls.canUndo}
        canRedo={controls.canRedo}
        onUndo={controls.onUndo}
        onRedo={controls.onRedo}
        actions={controls.actions}
        canvasHref={controls.canvasHref}
        classicHref={controls.classicHref}
      />
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        {children}
      </div>
    </div>
  );
}
