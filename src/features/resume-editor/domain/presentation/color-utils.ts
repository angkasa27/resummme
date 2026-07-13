export const hexColorPattern = /^#[0-9a-fA-F]{6}$/;

function parseHex(hex: string): [number, number, number] {
  if (!hexColorPattern.test(hex)) return [0, 0, 0];
  return [
    parseInt(hex.slice(1, 3), 16),
    parseInt(hex.slice(3, 5), 16),
    parseInt(hex.slice(5, 7), 16),
  ];
}

function toHex(r: number, g: number, b: number): string {
  const channel = (value: number) =>
    Math.round(Math.min(255, Math.max(0, value)))
      .toString(16)
      .padStart(2, "0");
  return `#${channel(r)}${channel(g)}${channel(b)}`;
}

/** Mixes two hex colors; weight 0 returns `a`, weight 1 returns `b`. */
export function mixHex(a: string, b: string, weight: number): string {
  const w = Math.min(1, Math.max(0, weight));
  const [ar, ag, ab] = parseHex(a);
  const [br, bg, bb] = parseHex(b);
  return toHex(
    ar + (br - ar) * w,
    ag + (bg - ag) * w,
    ab + (bb - ab) * w,
  );
}

/** Lightens a hex color toward white; whiteRatio 0 keeps the color, 1 is white. */
export function tintHex(hex: string, whiteRatio: number): string {
  return mixHex(hex, "#ffffff", whiteRatio);
}

/**
 * Picks a readable text color for content rendered on a solid `hex` fill.
 * Uses WCAG relative luminance; light fills get dark text and vice versa.
 */
export function readableTextOn(hex: string): string {
  const [r, g, b] = parseHex(hex);
  const linear = (value: number) => {
    const c = value / 255;
    return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  };
  const luminance =
    0.2126 * linear(r) + 0.7152 * linear(g) + 0.0722 * linear(b);
  return luminance > 0.55 ? "#111827" : "#ffffff";
}
