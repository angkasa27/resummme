/**
 * Shared motion tokens + spring presets (motion-foundations skill).
 *
 * Every animated component pulls its duration, easing, distance, scale, and
 * spring config from here — no hardcoded numbers in component files. Keeps the
 * whole app's motion consistent and tunable from one place.
 */

/** Cubic-bezier easing tuple, as motion's `Easing` bezier definition expects. */
type Bezier = [number, number, number, number];

export const motionTokens = {
  duration: {
    instant: 0.08,
    fast: 0.18,
    normal: 0.35,
    slow: 0.6,
    /** Hero/landing entrances that want extra weight (frame reveal). */
    deliberate: 0.8,
    crawl: 1.0,
  },
  easing: {
    /** Decelerate — entrances, slides landing softly. */
    smooth: [0.22, 1, 0.36, 1] as Bezier,
    /** Strong decelerate (expo-out) — landing reveals, blur-up entrances. */
    expo: [0.16, 1, 0.3, 1] as Bezier,
    /** Standard in-out — symmetric reveals (accordion), tab/page slides. */
    sharp: [0.4, 0, 0.2, 1] as Bezier,
    /** Slight overshoot — playful pops. */
    bounce: [0.34, 1.56, 0.64, 1] as Bezier,
    linear: [0, 0, 1, 1] as Bezier,
  },
  distance: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 48,
  },
  scale: {
    subtle: 0.98,
    press: 0.95,
    pop: 1.04,
  },
};

export const springs = {
  snappy: { type: "spring", stiffness: 300, damping: 30 },
  gentle: { type: "spring", stiffness: 120, damping: 14 },
  bouncy: { type: "spring", stiffness: 400, damping: 10 },
  instant: { type: "spring", stiffness: 600, damping: 35 },
  release: { type: "spring", stiffness: 200, damping: 20, restDelta: 0.001 },
  /** Sliding tab/segment indicator — quick settle with a hint of bounce. */
  pill: { type: "spring", stiffness: 360, damping: 30 },
} as const;

/** Render an easing tuple as a CSS `cubic-bezier(...)` string for CSS-driven
 *  transitions (e.g. the grid-rows `Collapse`), so they track the same tokens. */
export function cssBezier(easing: Bezier): string {
  return `cubic-bezier(${easing.join(", ")})`;
}
