"use client";

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
} from "motion/react";

import { useIsMobile } from "@/hooks/use-mobile";

export function LandingBody({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();
  const isMobile = useIsMobile();
  const parallax = !reduce && !isMobile;

  const spotlightX = useMotionValue(-1);
  const spotlightY = useMotionValue(-1);

  return (
    <div
      className="relative"
      onPointerMove={
        parallax
          ? (e) => {
              if (e.pointerType !== "mouse") return;
              const rect = e.currentTarget.getBoundingClientRect();
              spotlightX.set(e.clientX - rect.left);
              spotlightY.set(e.clientY - rect.top);
            }
          : undefined
      }
    >
      {parallax && <Spotlight x={spotlightX} y={spotlightY} />}
      {children}
    </div>
  );
}

function Spotlight({
  x,
  y,
}: {
  x: ReturnType<typeof useMotionValue<number>>;
  y: ReturnType<typeof useMotionValue<number>>;
}) {
  const background = useMotionTemplate`radial-gradient(420px 420px at ${x}px ${y}px, rgba(139, 92, 246, 0.10), transparent 70%)`;
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute inset-0 -z-10"
      style={{ background }}
    />
  );
}
