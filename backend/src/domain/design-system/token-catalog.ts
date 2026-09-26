import { type HexColor, invariant } from '../shared';
import { composite, type ContrastGrade, contrastRatio, gradeContrast } from './contrast';

export type Theme = 'light' | 'dark';

export interface RampStep {
  readonly step: string;
  readonly cssVar: string;
  readonly oklch: string;
  readonly hex: HexColor;
}

export interface Ramp {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly steps: readonly RampStep[];
}

export interface ThemedValue {
  readonly label: string;
  readonly hex: HexColor;
  /** Percent opacity, or null when opaque. */
  readonly alpha: number | null;
}

export interface SemanticColor {
  readonly name: string;
  readonly cssVar: string;
  readonly description: string;
  readonly light: ThemedValue;
  readonly dark: ThemedValue;
}

export interface FontFamily {
  readonly name: string;
  readonly cssVar: string;
  readonly family: string;
  readonly stack: string;
  readonly description: string;
  readonly specimen: string;
}

export interface TypeStyle {
  readonly name: string;
  readonly cssVar: string;
  readonly family: string;
  readonly size: string;
  readonly leading: string;
  readonly tracking: string;
  readonly weight: number;
  readonly uppercase: boolean;
  readonly description: string;
}

export interface ScalarToken {
  readonly name: string;
  readonly cssVar: string;
  readonly value: string;
  readonly description: string;
}

export interface EasingToken extends ScalarToken {
  readonly points: readonly [number, number, number, number];
}

export interface Principle {
  readonly id: string;
  readonly title: string;
  readonly body: string;
}

export interface ContrastCheck {
  readonly foreground: string;
  readonly background: string;
  readonly theme: Theme;
  readonly ratio: number;
  readonly grade: ContrastGrade;
}

export interface TokenCatalogProps {
  readonly principles: readonly Principle[];
  readonly ramps: readonly Ramp[];
  readonly semantic: readonly SemanticColor[];
  readonly contrastPairs: readonly (readonly [string, string])[];
  readonly fonts: readonly FontFamily[];
  readonly typeStyles: readonly TypeStyle[];
  readonly space: readonly ScalarToken[];
  readonly radii: readonly ScalarToken[];
  readonly shadows: readonly ScalarToken[];
  readonly durations: readonly ScalarToken[];
  readonly easings: readonly EasingToken[];
  readonly motion: readonly ScalarToken[];
}

/** Aggregate root: the full token set of Lynn's UI specification. */
export class TokenCatalog {
  private constructor(private readonly props: TokenCatalogProps) {}

  static create(props: TokenCatalogProps): TokenCatalog {
    const names = props.semantic.map((token) => token.name);
    for (const [foreground, background] of props.contrastPairs) {
      invariant(
        names.includes(foreground) && names.includes(background),
        'TOKEN_PAIR_UNKNOWN',
        `Contrast pair references an unknown token: ${foreground} on ${background}`,
      );
    }
    for (const easing of props.easings) {
      const [x1, , x2] = easing.points;
      invariant(
        x1 >= 0 && x1 <= 1 && x2 >= 0 && x2 <= 1,
        'TOKEN_EASING_RANGE',
        `Easing ${easing.name} x control points must be within [0, 1]`,
      );
    }
    return new TokenCatalog(props);
  }

  get snapshot(): TokenCatalogProps {
    return this.props;
  }

  /** Contrast of every declared pair, in both themes. */
  contrastReport(): ContrastCheck[] {
    const themes: Theme[] = ['light', 'dark'];
    return themes.flatMap((theme) =>
      this.props.contrastPairs.map(([foregroundName, backgroundName]) => {
        const foreground = this.semantic(foregroundName)[theme];
        const background = this.semantic(backgroundName)[theme];
        invariant(background.alpha === null, 'TOKEN_BACKGROUND_TRANSLUCENT', `${backgroundName} must be opaque`);
        const visible =
          foreground.alpha === null ? foreground.hex : composite(foreground.hex, foreground.alpha, background.hex);
        const ratio = contrastRatio(visible, background.hex);
        return { foreground: foregroundName, background: backgroundName, theme, ratio, grade: gradeContrast(ratio) };
      }),
    );
  }

  private semantic(name: string): SemanticColor {
    const token = this.props.semantic.find((candidate) => candidate.name === name);
    invariant(token, 'TOKEN_UNKNOWN', `Unknown semantic token: ${name}`);
    return token;
  }
}
