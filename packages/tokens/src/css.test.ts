import { describe, expect, it } from 'vitest';
import { buildTokenCss } from './css';
import { ramps } from './palette';
import { resolveHex, semanticColors } from './semantic';

describe('buildTokenCss', () => {
  const css = buildTokenCss();

  it('declares every ramp step', () => {
    for (const ramp of ramps) {
      for (const step of ramp.steps) {
        expect(css).toContain(`--${ramp.id}-${step.step}: ${step.oklch};`);
      }
    }
  });

  it('overrides every semantic color in the dark theme', () => {
    const dark = css.split(":root[data-theme='dark']")[1] ?? '';
    for (const token of semanticColors) {
      expect(dark).toContain(`${token.cssVar}:`);
    }
  });

  it('mixes translucent references toward transparent', () => {
    expect(css).toContain('--color-border: color-mix(in oklab, var(--ink-900) 10%, transparent);');
  });
});

describe('resolveHex', () => {
  it('resolves every semantic reference to a hex value', () => {
    for (const token of semanticColors) {
      expect(resolveHex(token.light)).toMatch(/^#[0-9a-f]{6}$/);
      expect(resolveHex(token.dark)).toMatch(/^#[0-9a-f]{6}$/);
    }
  });
});
