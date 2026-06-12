"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Tracks an element's content-box width via ResizeObserver. Used for
 * container-driven layout that must respond to the element's own width rather
 * than the viewport (e.g. a resizable pane's toolbar). Returns `0` until the
 * first measurement so callers can treat "unmeasured" as their default state.
 */
export function useElementWidth<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const update = () => setWidth(element.clientWidth);
    update();

    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", update);
      return () => window.removeEventListener("resize", update);
    }

    const observer = new ResizeObserver(update);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return [ref, width] as const;
}
