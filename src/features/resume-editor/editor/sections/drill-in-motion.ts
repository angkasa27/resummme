import { motionTokens } from "@/lib/motion-tokens";

// Direction-aware "filmstrip" slide: both panels translate the full width in
// lockstep (no overlay/parallax), like a native push or a presentation deck.
// `dir` > 0 = forward (new in from the right), < 0 = back (new in from the left).
export const slideVariants = {
  enter: (dir: number) => ({ x: dir >= 0 ? "100%" : "-100%" }),
  center: { x: "0%" },
  exit: (dir: number) => ({ x: dir >= 0 ? "-100%" : "100%" }),
};

export const fadeVariants = {
  enter: { opacity: 0 },
  center: { opacity: 1 },
  exit: { opacity: 0 },
};

// Tween (not spring) so the two filmstrip panels stay perfectly in sync; tokens
// keep the timing consistent with the rest of the app.
export const slideTransition = {
  duration: motionTokens.duration.normal,
  ease: motionTokens.easing.smooth,
};

export const reducedTransition = { duration: motionTokens.duration.fast };
