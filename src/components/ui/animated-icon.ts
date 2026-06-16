/**
 * Shared imperative handle exposed by every animated icon (the vendored lucide
 * icons and the local `PopIcon` fallback). Callers ref one of these and drive
 * the icon's animation on hover / tab activation. Centralized so consumers
 * (`mobile-bottom-nav`, landing `features`, …) don't each redeclare the shape.
 */
export type AnimatedIconHandle = {
  startAnimation: () => void;
  stopAnimation: () => void;
};
