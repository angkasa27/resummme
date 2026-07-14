"use client";

import { useRef, type ReactNode } from "react";
import {
  motion,
  useAnimationFrame,
  useInView,
  useMotionValue,
  useReducedMotion,
} from "motion/react";

import { cn } from "@/lib/utils";

/** Advance `current` by `delta`, wrapping into `(-copyWidth, 0]` so the
 *  second copy makes the loop seamless. */
function wrapMarqueeOffset(
  current: number,
  delta: number,
  copyWidth: number,
): number {
  const next = current + delta;
  if (next <= -copyWidth) return next + copyWidth;
  if (next > 0) return next - copyWidth;
  return next;
}

type MarqueeProps = {
  children: ReactNode;
  /** Pixels per second. */
  speed?: number;
  direction?: "left" | "right";
  pauseOnHover?: boolean;
  className?: string;
};

/**
 * Seamless infinite marquee. Renders the children twice; a per-frame ticker
 * translates the track and wraps at exactly one copy's width, so the loop has
 * no visible seam. Reduced-motion renders a static (non-scrolling) row.
 */
export function Marquee({
  children,
  speed = 40,
  direction = "left",
  pauseOnHover = true,
  className,
}: MarqueeProps) {
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const hovering = useRef(false);
  const dir = direction === "left" ? -1 : 1;
  // Only run the per-frame ticker while the row is on (or near) screen, so it
  // doesn't burn the main thread while below the fold during initial load.
  const inView = useInView(containerRef, { margin: "200px" });

  useAnimationFrame((_, delta) => {
    if (reduce || !inView || (pauseOnHover && hovering.current)) return;
    const copyWidth = copyRef.current?.offsetWidth ?? 0;
    if (copyWidth === 0) return;
    x.set(wrapMarqueeOffset(x.get(), dir * speed * (delta / 1000), copyWidth));
  });

  return (
    <div
      ref={containerRef}
      className={cn("overflow-hidden", className)}
      onMouseEnter={() => (hovering.current = true)}
      onMouseLeave={() => (hovering.current = false)}
    >
      <motion.div className="flex w-max" style={{ x }}>
        <div ref={copyRef} className="flex shrink-0 gap-5 pr-5">
          {children}
        </div>
        <div className="flex shrink-0 gap-5 pr-5" aria-hidden>
          {children}
        </div>
      </motion.div>
    </div>
  );
}
