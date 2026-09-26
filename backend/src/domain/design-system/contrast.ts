import { HexColor } from '../shared';

export type ContrastGrade = 'AAA' | 'AA' | 'AA Large' | 'Fail';

/** Alpha-composites `foreground` at `alpha` percent over an opaque background. */
export function composite(foreground: HexColor, alpha: number, background: HexColor): HexColor {
  const top = foreground.toRgb();
  const bottom = background.toRgb();
  const a = alpha / 100;
  const mix = (f: number, b: number): string =>
    Math.round(f * a + b * (1 - a))
      .toString(16)
      .padStart(2, '0');
  return HexColor.of(`#${mix(top.r, bottom.r)}${mix(top.g, bottom.g)}${mix(top.b, bottom.b)}`);
}

/** WCAG 2.x contrast ratio, rounded to two decimals. */
export function contrastRatio(a: HexColor, b: HexColor): number {
  const [light, dark] = [a.luminance(), b.luminance()].sort((x, y) => y - x) as [number, number];
  return Math.round(((light + 0.05) / (dark + 0.05)) * 100) / 100;
}

export function gradeContrast(ratio: number): ContrastGrade {
  if (ratio >= 7) return 'AAA';
  if (ratio >= 4.5) return 'AA';
  if (ratio >= 3) return 'AA Large';
  return 'Fail';
}
