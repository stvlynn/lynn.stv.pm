type Points = readonly [number, number, number, number];

const component = (t: number, p1: number, p2: number): number =>
  3 * (1 - t) ** 2 * t * p1 + 3 * (1 - t) * t ** 2 * p2 + t ** 3;

/**
 * Samples a CSS cubic-bezier as `count + 1` points (x = time, y = progress),
 * for drawing the curve.
 */
export function sampleBezier(points: Points, count = 48): { x: number; y: number }[] {
  const [x1, y1, x2, y2] = points;
  return Array.from({ length: count + 1 }, (_, index) => {
    const t = index / count;
    return { x: component(t, x1, x2), y: component(t, y1, y2) };
  });
}

/** Converts a CSS length token such as "1.5rem" to pixels at a 16px root. */
export function toPixels(value: string): number {
  if (value.endsWith('rem')) return Number.parseFloat(value) * 16;
  if (value.endsWith('px')) return Number.parseFloat(value);
  throw new Error(`Unsupported length: ${value}`);
}
