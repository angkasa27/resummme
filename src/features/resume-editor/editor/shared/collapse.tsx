"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";
import { cssBezier, motionTokens } from "@/lib/motion-tokens";

type CollapseProps = {
  open: boolean;
  children: ReactNode;
  className?: string;
  durationMs?: number;
};

/** Token-driven defaults for the disclosure: `normal` is the skill's
 *  accordion/card-expand duration, `sharp` its symmetric in-out easing. */
const DEFAULT_DURATION_MS = motionTokens.duration.normal * 1000;
const COLLAPSE_EASE = cssBezier(motionTokens.easing.sharp);

/** Mount, then (after a paint of the collapsed 0fr state) flip to 1fr so the
 *  grid-track transition actually runs. Returns the effect cleanup. */
function runOpenTransition(
  setMounted: (mounted: boolean) => void,
  setExpanded: (expanded: boolean) => void,
  reduceMotion: boolean | null,
) {
  let raf2 = 0;
  const raf1 = requestAnimationFrame(() => {
    setMounted(true);
    if (reduceMotion) {
      setExpanded(true);
    } else {
      raf2 = requestAnimationFrame(() => setExpanded(true));
    }
  });
  return () => {
    cancelAnimationFrame(raf1);
    cancelAnimationFrame(raf2);
  };
}

/** Collapse the grid track, then unmount children once the animation (or,
 *  under reduced motion, immediately) finishes. Returns the effect cleanup. */
function runCloseTransition(
  setMounted: (mounted: boolean) => void,
  setExpanded: (expanded: boolean) => void,
  reduceMotion: boolean | null,
  durationMs: number,
) {
  const raf1 = requestAnimationFrame(() => setExpanded(false));
  const timer = window.setTimeout(
    () => setMounted(false),
    reduceMotion ? 0 : durationMs,
  );
  return () => {
    cancelAnimationFrame(raf1);
    clearTimeout(timer);
  };
}

/**
 * Height reveal that animates smoothly for content of *any* (even dynamic)
 * height, using the CSS `grid-template-rows: 0fr → 1fr` technique — unlike a
 * measured `height: auto` animation, it never snaps when the body is tall or
 * mounts asynchronously (rich-text editors, large sections). Children mount on
 * open and unmount after the close animation. Reused by the section accordion
 * and the collection item cards so disclosure feels identical everywhere.
 */
export function Collapse({
  open,
  children,
  className,
  durationMs = DEFAULT_DURATION_MS,
}: CollapseProps) {
  const reduceMotion = useReducedMotion();
  const [mounted, setMounted] = useState(open);
  const [expanded, setExpanded] = useState(open);

  useEffect(() => {
    return open
      ? runOpenTransition(setMounted, setExpanded, reduceMotion)
      : runCloseTransition(setMounted, setExpanded, reduceMotion, durationMs);
  }, [open, reduceMotion, durationMs]);

  if (!mounted) return null;

  return (
    <div
      data-state={expanded ? "open" : "closed"}
      className={cn(
        "grid transition-[grid-template-rows]",
        expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
      )}
      style={{
        transitionDuration: `${reduceMotion ? 0 : durationMs}ms`,
        transitionTimingFunction: COLLAPSE_EASE,
      }}
    >
      <div
        className={cn(
          "min-h-0 overflow-hidden transition-opacity",
          expanded ? "opacity-100" : "opacity-0",
          className,
        )}
        style={{
          transitionDuration: `${reduceMotion ? 0 : Math.round(durationMs * 0.8)}ms`,
          transitionTimingFunction: COLLAPSE_EASE,
        }}
      >
        {children}
      </div>
    </div>
  );
}
