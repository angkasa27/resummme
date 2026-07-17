"use client";

import { useState } from "react";

/**
 * Shared +1/-1 slide-direction state for the drill-in `AnimatePresence` blocks.
 * +1 = navigating forward (into a form), -1 = back (out to the list).
 */
export function useDirection(initial = 1) {
  const [direction, setDirection] = useState(initial);
  return {
    direction,
    forward: () => setDirection(1),
    backward: () => setDirection(-1),
    set: setDirection,
  };
}
