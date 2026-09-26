import {
  contrastPairs,
  durations,
  easings,
  fontFamilies,
  motionConstants,
  radii,
  ramps,
  referenceLabel,
  resolveHex,
  semanticColors,
  shadows,
  space,
  typeStyles,
  type ColorReference,
} from '@lynn/tokens';
import { TokenCatalog, type TokenCatalogSource, type ThemedValue } from '../../domain/design-system';
import { HexColor } from '../../domain/shared';
import { uiPrincipleContent } from '../content/ui-principles.content';

const themed = (reference: ColorReference): ThemedValue => ({
  label: referenceLabel(reference),
  hex: HexColor.of(resolveHex(reference)),
  alpha: reference.alpha ?? null,
});

/** Adapter: reads the `@lynn/tokens` package into the domain catalog. */
export class TokensPackageCatalogSource implements TokenCatalogSource {
  private readonly catalog: TokenCatalog;

  constructor() {
    this.catalog = TokenCatalog.create({
      principles: uiPrincipleContent.map((principle) => ({ ...principle })),
      ramps: ramps.map((ramp) => ({
        id: ramp.id,
        name: ramp.name,
        description: ramp.description,
        steps: ramp.steps.map((step) => ({
          step: step.step,
          cssVar: `--${ramp.id}-${step.step}`,
          oklch: step.oklch,
          hex: HexColor.of(step.hex),
        })),
      })),
      semantic: semanticColors.map((token) => ({
        name: token.name,
        cssVar: token.cssVar,
        description: token.description,
        light: themed(token.light),
        dark: themed(token.dark),
      })),
      contrastPairs,
      fonts: fontFamilies.map((font) => ({
        name: font.name,
        cssVar: font.cssVar,
        family: font.family,
        stack: font.value,
        description: font.description,
        specimen: font.specimen,
      })),
      typeStyles: typeStyles.map((style) => ({
        name: style.name,
        cssVar: style.cssVar,
        family: style.family,
        size: style.size,
        leading: style.leading,
        tracking: style.tracking,
        weight: style.weight,
        uppercase: style.transform === 'uppercase',
        description: style.description,
      })),
      space,
      radii,
      shadows: shadows.map(({ name, cssVar, value, description }) => ({ name, cssVar, value, description })),
      durations,
      easings,
      motion: motionConstants,
    });
  }

  async load(): Promise<TokenCatalog> {
    return this.catalog;
  }
}

/** Resolves a token-bound swatch, e.g. `--lynn-ribbon`, to its hex value. */
export function hexForToken(cssVar: string): string {
  for (const ramp of ramps) {
    for (const step of ramp.steps) {
      if (`--${ramp.id}-${step.step}` === cssVar) {
        return step.hex;
      }
    }
  }
  throw new Error(`Content references an unknown color token: ${cssVar}`);
}
