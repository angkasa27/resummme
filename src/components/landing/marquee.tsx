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
    let next = x.get() + dir * speed * (delta / 1000);
    // Keep the offset within (-copyWidth, 0]; the second copy makes the wrap seamless.
    if (next <= -copyWidth) next += copyWidth;
    else if (next > 0) next -= copyWidth;
    x.set(next);
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
