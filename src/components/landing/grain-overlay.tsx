/**
 * Full-page film-grain texture. A static, fixed, non-interactive overlay that
 * sits just above the page background and below content, adding subtle tooth so
 * the flat white sections don't read as empty. Pure CSS — an inline SVG
 * fractal-noise data URI tiled at low opacity, no JS and negligible cost.
 */
const NOISE_SVG = encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="url(#n)"/></svg>`,
);

export function GrainOverlay() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 opacity-[0.035] mix-blend-multiply"
      style={{
        backgroundImage: `url("data:image/svg+xml,${NOISE_SVG}")`,
        backgroundSize: "160px 160px",
      }}
    />
  );
}
