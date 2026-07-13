"use client";

import { useReducedMotion } from "motion/react";

import { motionTokens, springs } from "@/lib/motion-tokens";

/**
 * Shared enter/exit motion for items that appear/disappear in a list under
 * `AnimatePresence` — collection item cards and (opacity-only) section rows.
 *
 * Deliberately transform/opacity only (no `height`/`layout` animation), so it
 * stays cheap inside deeply-nested forms and never fights dnd-kit's own
 * transform. Reduced motion collapses to a short opacity-only fade.
 */
export function useListItemMotion() {
  const reduce = useReducedMotion();

  if (reduce) {
    return {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      transition: { duration: motionTokens.duration.fast },
    } as const;
  }

  return {
    initial: { opacity: 0, y: motionTokens.distance.sm },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, scale: motionTokens.scale.subtle },
    transition: springs.gentle,
  } as const;
}
