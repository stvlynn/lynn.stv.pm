import { HexColor } from './hex-color';

/** A named color chip, optionally bound to a design token. */
export class Swatch {
  private constructor(
    public readonly label: string,
    public readonly color: HexColor,
    public readonly token: string | null,
  ) {}

  static of(label: string, hex: string, token: string | null = null): Swatch {
    return new Swatch(label, HexColor.of(hex), token);
  }
}
