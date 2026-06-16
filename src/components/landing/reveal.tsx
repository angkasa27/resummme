"use client";

import {
  motion,
  useReducedMotion,
  type HTMLMotionProps,
  type Variants,
} from "motion/react";

import { motionTokens } from "@/lib/motion-tokens";

/** Blur radius for the landing "blur-up" entrances — a deliberate landing-only
 *  effect (the token set covers transform/opacity, not filter blur). */
const BLUR = 10;

/** Creative entrance: rises and clears from a blur (not a plain fade). */
export const blurUp: Variants = {
  hidden: { opacity: 0, y: motionTokens.distance.lg, filter: `blur(${BLUR}px)` },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: motionTokens.duration.slow,
      ease: motionTokens.easing.expo,
    },
  },
};

/** Parent that cascades its <RevealItem> children in DOM order on scroll-in. */
export const staggerContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

/** Single element that reveals once when scrolled into view. */
export function Reveal({
  delay = 0,
  children,
  ...rest
}: HTMLMotionProps<"div"> & { delay?: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={
        reduce
          ? false
          : {
              opacity: 0,
              y: motionTokens.distance.lg,
              filter: `blur(${BLUR}px)`,
            }
      }
      whileInView={
        reduce ? undefined : { opacity: 1, y: 0, filter: "blur(0px)" }
      }
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{
        duration: motionTokens.duration.slow,
        delay,
        ease: motionTokens.easing.expo,
      }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

/** Container that triggers a staggered cascade of its <RevealItem> children. */
export function RevealStagger({ children, ...rest }: HTMLMotionProps<"div">) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      variants={reduce ? undefined : staggerContainer}
      initial={reduce ? false : "hidden"}
      whileInView={reduce ? undefined : "show"}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

/** Child of <RevealStagger>; uses the shared blur-up variant. */
export function RevealItem({ children, ...rest }: HTMLMotionProps<"div">) {
  const reduce = useReducedMotion();
  return (
    <motion.div variants={reduce ? undefined : blurUp} {...rest}>
      {children}
    </motion.div>
  );
}
