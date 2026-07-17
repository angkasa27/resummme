"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  type ReactNode,
  type Ref,
} from "react";
import { motion, useAnimationControls, useReducedMotion } from "motion/react";
import type { LucideIcon } from "lucide-react";

import type { AnimatedIconHandle } from "@/components/ui/animated-icon";
import { motionTokens } from "@/lib/motion-tokens";

export const NAV_ICON_SIZE = 20;

/**
 * Fallback for lucide icons without a `@lucide-animated` equivalent (Design's
 * swatch-book): a scale-pop that mirrors the animated-icon handle so every nav
 * icon shares one interface.
 */
export const PopIcon = forwardRef<
  AnimatedIconHandle,
  { icon: LucideIcon; size?: number }
>(({ icon: Icon, size = NAV_ICON_SIZE }, ref) => {
  const controls = useAnimationControls();
  useImperativeHandle(ref, () => ({
    startAnimation: () => controls.start({ scale: [1, 0.85, 1.12, 1] }),
    stopAnimation: () => controls.set({ scale: 1 }),
  }));
  return (
    <motion.span
      className="inline-flex"
      animate={controls}
      transition={{ duration: motionTokens.duration.normal }}
    >
      <Icon size={size} />
    </motion.span>
  );
});
PopIcon.displayName = "PopIcon";

/**
 * Owns the icon handle and replays its animation when the item becomes active.
 * Resets first so one-shot icons (e.g. telescope, which tilts and holds) replay
 * on every selection instead of only the first. Shared by the mobile bottom nav
 * and the desktop rail so both fire the same icon behaviour.
 */
export function NavIcon({
  active,
  render,
}: {
  active: boolean;
  render: (ref: Ref<AnimatedIconHandle>) => ReactNode;
}) {
  const ref = useRef<AnimatedIconHandle>(null);
  const reduceMotion = useReducedMotion();
  useEffect(() => {
    if (reduceMotion) return;
    if (active) {
      ref.current?.stopAnimation();
      const id = requestAnimationFrame(() => ref.current?.startAnimation());
      return () => cancelAnimationFrame(id);
    }
    ref.current?.stopAnimation();
  }, [active, reduceMotion]);
  return (
    <span className="flex size-6 items-center justify-center">
      {render(ref)}
    </span>
  );
}
