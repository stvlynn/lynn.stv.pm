import { invariant } from './domain-error';

const HEX_PATTERN = /^#[0-9a-f]{6}$/;

export interface Rgb {
  readonly r: number;
  readonly g: number;
  readonly b: number;
}

/** An opaque sRGB color written as lowercase `#rrggbb`. */
export class HexColor {
  private constructor(public readonly value: string) {}

  static of(value: string): HexColor {
    const normalized = value.toLowerCase();
    invariant(HEX_PATTERN.test(normalized), 'INVALID_COLOR', `Not a #rrggbb color: "${value}"`);
    return new HexColor(normalized);
  }

  toRgb(): Rgb {
    return {
      r: Number.parseInt(this.value.slice(1, 3), 16),
      g: Number.parseInt(this.value.slice(3, 5), 16),
      b: Number.parseInt(this.value.slice(5, 7), 16),
    };
  }

  /** WCAG 2.x relative luminance. */
  luminance(): number {
    const { r, g, b } = this.toRgb();
    const channel = (value: number): number => {
      const c = value / 255;
      return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
    };
    return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
  }
}
