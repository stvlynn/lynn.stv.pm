import { rampValue } from './palette';

/**
 * Semantic color tokens. Components style against these names only; the
 * light ("whiteprint") and dark ("blueprint") themes differ here and nowhere
 * else.
 */

export interface ColorReference {
  readonly ramp: string;
  readonly step: string;
  /** Opacity in percent, mixed toward transparent. Omitted means opaque. */
  readonly alpha?: number;
}

export interface SemanticColorToken {
  readonly name: string;
  readonly cssVar: string;
  readonly description: string;
  readonly light: ColorReference;
  readonly dark: ColorReference;
}

const ref = (ramp: string, step: string, alpha?: number): ColorReference =>
  alpha === undefined ? { ramp, step } : { ramp, step, alpha };

export const semanticColors: readonly SemanticColorToken[] = [
  {
    name: 'bg',
    cssVar: '--color-bg',
    description: 'Page field. Silver-white paper, or navy blueprint stock.',
    light: ref('ink', '50'),
    dark: ref('ink', '950'),
  },
  {
    name: 'surface',
    cssVar: '--color-surface',
    description: 'Cards and panels that lift off the field.',
    light: ref('base', 'white'),
    dark: ref('ink', '900'),
  },
  {
    name: 'surface-muted',
    cssVar: '--color-surface-muted',
    description: 'Recessed wells, code blocks, quiet fills.',
    light: ref('ink', '100'),
    dark: ref('ink', '800'),
  },
  {
    name: 'text',
    cssVar: '--color-text',
    description: 'Primary reading color.',
    light: ref('ink', '800'),
    dark: ref('ink', '100'),
  },
  {
    name: 'text-muted',
    cssVar: '--color-text-muted',
    description: 'Secondary copy and descriptions. Passes AA on bg.',
    light: ref('ink', '600'),
    dark: ref('ink', '400'),
  },
  {
    name: 'text-subtle',
    cssVar: '--color-text-subtle',
    description: 'Decorative marks on the drawing sheet. Never the only carrier of information.',
    light: ref('ink', '500'),
    dark: ref('ink', '500'),
  },
  {
    name: 'border',
    cssVar: '--color-border',
    description: 'Hairline separators.',
    light: ref('ink', '900', 10),
    dark: ref('base', 'white', 9),
  },
  {
    name: 'border-strong',
    cssVar: '--color-border-strong',
    description: 'Input outlines and emphasized rules.',
    light: ref('ink', '900', 18),
    dark: ref('base', 'white', 18),
  },
  {
    name: 'ink',
    cssVar: '--color-ink',
    description: 'The weighty primary action.',
    light: ref('ink', '800'),
    dark: ref('ink', '100'),
  },
  {
    name: 'ink-contrast',
    cssVar: '--color-ink-contrast',
    description: 'Text placed on the ink action.',
    light: ref('ink', '50'),
    dark: ref('ink', '900'),
  },
  {
    name: 'accent',
    cssVar: '--color-accent',
    description: 'Cornflower. Links, focus, selection, one hero moment per view.',
    light: ref('corn', '600'),
    dark: ref('corn', '400'),
  },
  {
    name: 'accent-contrast',
    cssVar: '--color-accent-contrast',
    description: 'Text placed on the accent.',
    light: ref('base', 'white'),
    dark: ref('ink', '950'),
  },
  {
    name: 'accent-soft',
    cssVar: '--color-accent-soft',
    description: 'Selected rows, active navigation, washes.',
    light: ref('corn', '500', 10),
    dark: ref('corn', '400', 16),
  },
  {
    name: 'danger',
    cssVar: '--color-danger',
    description: 'Invalid input and destructive confirmation.',
    light: ref('signal', 'danger'),
    dark: ref('signal', 'danger-soft'),
  },
  {
    name: 'success',
    cssVar: '--color-success',
    description: 'Confirmed input.',
    light: ref('signal', 'success'),
    dark: ref('signal', 'success-soft'),
  },
  {
    name: 'blueprint-line',
    cssVar: '--color-blueprint-line',
    description: 'Dimension lines, leaders and callout rules.',
    light: ref('corn', '600', 80),
    dark: ref('corn', '200', 80),
  },
  {
    name: 'blueprint-grid',
    cssVar: '--color-blueprint-grid',
    description: 'Minor drafting grid.',
    light: ref('corn', '500', 7),
    dark: ref('corn', '300', 7),
  },
  {
    name: 'blueprint-grid-major',
    cssVar: '--color-blueprint-grid-major',
    description: 'Major drafting grid, every fifth line.',
    light: ref('corn', '500', 14),
    dark: ref('corn', '300', 13),
  },
  {
    name: 'figure-line',
    cssVar: '--color-figure-line',
    description: 'Stroke of the line-art figure on the drawing sheet.',
    light: ref('ink', '800'),
    dark: ref('corn', '50'),
  },
];

/** The pairs whose contrast the UI spec reports, as [foreground, background]. */
export const contrastPairs: readonly (readonly [string, string])[] = [
  ['text', 'bg'],
  ['text-muted', 'bg'],
  ['text-subtle', 'bg'],
  ['text', 'surface'],
  ['ink-contrast', 'ink'],
  ['accent', 'bg'],
  ['accent-contrast', 'accent'],
];

export const baseColors: Readonly<Record<string, string>> = {
  white: '#ffffff',
  black: '#070f21',
};

/** Hex value of a reference, ignoring alpha. */
export function resolveHex(reference: ColorReference): string {
  if (reference.ramp === 'base') {
    const hex = baseColors[reference.step];
    if (!hex) {
      throw new Error(`Unknown base color: ${reference.step}`);
    }
    return hex;
  }
  return rampValue(reference.ramp, reference.step).hex;
}

export function referenceVar(reference: ColorReference): string {
  return `--${reference.ramp}-${reference.step}`;
}

export function referenceCss(reference: ColorReference): string {
  const variable = `var(${referenceVar(reference)})`;
  return reference.alpha === undefined ? variable : `color-mix(in oklab, ${variable} ${reference.alpha}%, transparent)`;
}

export function referenceLabel(reference: ColorReference): string {
  const base = `${reference.ramp}-${reference.step}`;
  return reference.alpha === undefined ? base : `${base} · ${reference.alpha}%`;
}

/**
 * The shadcn/beUI token contract, bound to Lynn's semantic tokens. beUI
 * components style against these names; they carry no values of their own.
 */
export const componentAliases: Readonly<Record<string, string>> = {
  '--background': 'var(--color-bg)',
  '--foreground': 'var(--color-text)',
  '--card': 'var(--color-surface)',
  '--card-foreground': 'var(--color-text)',
  '--popover': 'var(--color-surface)',
  '--popover-foreground': 'var(--color-text)',
  '--primary': 'var(--color-ink)',
  '--primary-foreground': 'var(--color-ink-contrast)',
  '--secondary': 'var(--color-surface-muted)',
  '--secondary-foreground': 'var(--color-text)',
  '--muted': 'var(--color-surface-muted)',
  '--muted-foreground': 'var(--color-text-muted)',
  '--accent': 'var(--color-accent-soft)',
  '--accent-foreground': 'var(--color-text)',
  '--destructive': 'var(--color-danger)',
  '--border': 'var(--color-border-strong)',
  '--input': 'var(--color-border-strong)',
  '--ring': 'var(--color-accent)',
};
