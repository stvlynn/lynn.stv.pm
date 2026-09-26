import type { UiSpecDto } from '@lynn/contracts';
import type { TokenCatalogSource } from '../../domain/design-system';

export class GetUiSpec {
  constructor(private readonly source: TokenCatalogSource) {}

  async execute(): Promise<UiSpecDto> {
    const catalog = await this.source.load();
    const tokens = catalog.snapshot;
    return {
      principles: tokens.principles.map((principle) => ({ ...principle })),
      ramps: tokens.ramps.map((ramp) => ({
        id: ramp.id,
        name: ramp.name,
        description: ramp.description,
        steps: ramp.steps.map((step) => ({
          step: step.step,
          cssVar: step.cssVar,
          oklch: step.oklch,
          hex: step.hex.value,
        })),
      })),
      semantic: tokens.semantic.map((token) => ({
        name: token.name,
        cssVar: token.cssVar,
        description: token.description,
        light: token.light.label,
        dark: token.dark.label,
        lightHex: token.light.hex.value,
        darkHex: token.dark.hex.value,
      })),
      contrast: catalog.contrastReport(),
      fonts: tokens.fonts.map((font) => ({ ...font })),
      typeStyles: tokens.typeStyles.map((style) => ({ ...style })),
      space: tokens.space.map((token) => ({ ...token })),
      radii: tokens.radii.map((token) => ({ ...token })),
      shadows: tokens.shadows.map((token) => ({ ...token })),
      durations: tokens.durations.map((token) => ({ ...token })),
      easings: tokens.easings.map((token) => ({
        ...token,
        points: [...token.points] as [number, number, number, number],
      })),
      motion: tokens.motion.map((token) => ({ ...token })),
    };
  }
}
