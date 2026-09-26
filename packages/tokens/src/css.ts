import { ramps } from './palette';
import { baseColors, componentAliases, referenceCss, semanticColors } from './semantic';
import { durations, easings, fontFamilies, motionConstants, radii, shadows, space, typeStyles } from './scales';

const declaration = (name: string, value: string): string => `  ${name}: ${value};`;

function rampDeclarations(): string[] {
  const lines = Object.entries(baseColors).map(([step, hex]) => declaration(`--base-${step}`, hex));
  for (const ramp of ramps) {
    for (const step of ramp.steps) {
      lines.push(declaration(`--${ramp.id}-${step.step}`, step.oklch));
    }
  }
  return lines;
}

function typeDeclarations(): string[] {
  const lines = fontFamilies.map((font) => declaration(font.cssVar, font.value));
  for (const style of typeStyles) {
    lines.push(declaration(`${style.cssVar}-size`, style.size));
    lines.push(declaration(`${style.cssVar}-leading`, style.leading));
    lines.push(declaration(`${style.cssVar}-tracking`, style.tracking));
  }
  return lines;
}

/**
 * Serializes every token to CSS custom properties. Light values live on
 * `:root`; dark values override them under `[data-theme='dark']`.
 */
export function buildTokenCss(): string {
  const scalars = [...space, ...radii, ...durations, ...easings, ...motionConstants];
  const root = [
    ...rampDeclarations(),
    ...typeDeclarations(),
    ...scalars.map((token) => declaration(token.cssVar, token.value)),
    ...shadows.map((token) => declaration(token.cssVar, token.value)),
    ...semanticColors.map((token) => declaration(token.cssVar, referenceCss(token.light))),
    ...Object.entries(componentAliases).map(([name, value]) => declaration(name, value)),
    declaration('color-scheme', 'light'),
  ];
  const dark = [
    ...semanticColors.map((token) => declaration(token.cssVar, referenceCss(token.dark))),
    ...shadows.map((token) => declaration(token.cssVar, token.dark)),
    declaration('color-scheme', 'dark'),
  ];
  return `:root {\n${root.join('\n')}\n}\n:root[data-theme='dark'] {\n${dark.join('\n')}\n}\n`;
}
