/**
 * Non-color scales: typography, space, radius, elevation and motion.
 */

export interface ScalarToken {
  readonly name: string;
  readonly cssVar: string;
  readonly value: string;
  readonly description: string;
}

export interface FontFamilyToken extends ScalarToken {
  readonly family: string;
  readonly specimen: string;
}

export interface TypeStyleToken {
  readonly name: string;
  readonly cssVar: string;
  readonly family: string;
  readonly size: string;
  readonly leading: string;
  readonly tracking: string;
  readonly weight: number;
  readonly transform?: 'uppercase';
  readonly description: string;
}

export interface EasingToken extends ScalarToken {
  /** Cubic-bezier control points, for animation libraries. */
  readonly points: readonly [number, number, number, number];
}

export const fontFamilies: readonly FontFamilyToken[] = [
  {
    name: 'display',
    cssVar: '--font-display',
    family: 'Instrument Serif',
    value: '"Instrument Serif", "Iowan Old Style", "Songti SC", "Noto Serif CJK SC", serif',
    description: 'Wordmark, page titles, pull quotes. Condensed, high contrast, set large.',
    specimen: 'Lynn, drawn in quiet ink',
  },
  {
    name: 'text',
    cssVar: '--font-text',
    family: 'Newsreader',
    value: '"Newsreader Variable", "Iowan Old Style", Georgia, "Songti SC", "Noto Serif CJK SC", serif',
    description: 'Reading text. Optical sizing keeps it sharp from captions to headings.',
    specimen: 'A silver-white bob, a black beret, a cornflower ribbon.',
  },
  {
    name: 'mono',
    cssVar: '--font-mono',
    family: 'IBM Plex Mono',
    value: '"IBM Plex Mono", ui-monospace, "SF Mono", Menlo, monospace',
    description: 'Annotations, token names, values and timecodes.',
    specimen: 'DWG LYN-001 · SCALE 1:8 · 24 FPS',
  },
  {
    name: 'ui',
    cssVar: '--font-ui',
    family: 'Cal Sans UI',
    value: '"Cal Sans UI", ui-sans-serif, system-ui, sans-serif',
    description: 'Product interface face of the Navy Ink UI kit. Dense and even at 13–14px.',
    specimen: 'Pick a time that works for you',
  },
  {
    name: 'ui-mono',
    cssVar: '--font-ui-mono',
    family: 'Paper Mono',
    value: '"Paper Mono", ui-monospace, "SF Mono", monospace',
    description: 'Numerics and code inside the UI kit.',
    specimen: '09:30 · 30m · v1.4.0',
  },
];

export const typeStyles: readonly TypeStyleToken[] = [
  {
    name: 'display-xl',
    cssVar: '--type-display-xl',
    family: 'display',
    size: 'clamp(5rem, 2.5rem + 12vw, 13rem)',
    leading: '0.82',
    tracking: '-0.03em',
    weight: 400,
    description: 'The wordmark on the drawing sheet.',
  },
  {
    name: 'display',
    cssVar: '--type-display',
    family: 'display',
    size: 'clamp(3rem, 1.8rem + 4.6vw, 6rem)',
    leading: '0.92',
    tracking: '-0.02em',
    weight: 400,
    description: 'Page titles.',
  },
  {
    name: 'title',
    cssVar: '--type-title',
    family: 'display',
    size: 'clamp(2rem, 1.5rem + 1.8vw, 3rem)',
    leading: '1.02',
    tracking: '-0.01em',
    weight: 400,
    description: 'Section titles.',
  },
  {
    name: 'heading',
    cssVar: '--type-heading',
    family: 'text',
    size: '1.375rem',
    leading: '1.25',
    tracking: '-0.005em',
    weight: 500,
    description: 'Card and block headings.',
  },
  {
    name: 'lead',
    cssVar: '--type-lead',
    family: 'text',
    size: 'clamp(1.1875rem, 1.05rem + 0.5vw, 1.4375rem)',
    leading: '1.5',
    tracking: '0em',
    weight: 400,
    description: 'Opening paragraph of a page.',
  },
  {
    name: 'body',
    cssVar: '--type-body',
    family: 'text',
    size: '1.0625rem',
    leading: '1.62',
    tracking: '0em',
    weight: 400,
    description: 'Default reading size.',
  },
  {
    name: 'small',
    cssVar: '--type-small',
    family: 'text',
    size: '0.9375rem',
    leading: '1.5',
    tracking: '0em',
    weight: 400,
    description: 'Descriptions under headings.',
  },
  {
    name: 'annotation',
    cssVar: '--type-annotation',
    family: 'mono',
    size: '0.6875rem',
    leading: '1.4',
    tracking: '0.08em',
    weight: 400,
    transform: 'uppercase',
    description: 'Drawing callouts, labels and table headers.',
  },
];

export const space: readonly ScalarToken[] = [
  ['1', '0.25rem', 'Hairline gaps between glyph and icon.'],
  ['2', '0.5rem', 'Inline gaps.'],
  ['3', '0.75rem', 'Tight stacks.'],
  ['4', '1rem', 'Default stack.'],
  ['6', '1.5rem', 'Card padding.'],
  ['8', '2rem', 'Between related blocks.'],
  ['12', '3rem', 'Between groups.'],
  ['16', '4rem', 'Section rhythm.'],
  ['24', '6rem', 'Page sections.'],
  ['32', '8rem', 'Hero breathing room.'],
].map(([step, value, description]) => ({
  name: `space-${step}`,
  cssVar: `--space-${step}`,
  value: value as string,
  description: description as string,
}));

export const radii: readonly ScalarToken[] = [
  ['xs', '0.25rem', 'Swatch chips, keyboard keys.'],
  ['sm', '0.375rem', 'Badges and tags.'],
  ['md', '0.5rem', 'Small buttons.'],
  ['lg', '0.625rem', 'Buttons and inputs.'],
  ['xl', '0.875rem', 'Popovers and alerts.'],
  ['2xl', '1rem', 'Cards.'],
  ['full', '9999px', 'Pills and avatars.'],
].map(([step, value, description]) => ({
  name: `radius-${step}`,
  cssVar: `--radius-${step}`,
  value: value as string,
  description: description as string,
}));

export const shadows: readonly (ScalarToken & { readonly dark: string })[] = [
  {
    name: 'shadow-xs',
    cssVar: '--shadow-xs',
    value: '0 1px 2px -1px color-mix(in oklab, var(--ink-950) 8%, transparent)',
    dark: '0 1px 2px -1px rgb(0 0 0 / 0.4)',
    description: 'Resting controls.',
  },
  {
    name: 'shadow-sm',
    cssVar: '--shadow-sm',
    value:
      '0 1px 3px -1px color-mix(in oklab, var(--ink-950) 10%, transparent), 0 1px 2px -1px color-mix(in oklab, var(--ink-950) 6%, transparent)',
    dark: '0 1px 3px -1px rgb(0 0 0 / 0.5)',
    description: 'Cards at rest.',
  },
  {
    name: 'shadow-md',
    cssVar: '--shadow-md',
    value: '0 6px 16px -4px color-mix(in oklab, var(--ink-950) 14%, transparent)',
    dark: '0 8px 20px -6px rgb(0 0 0 / 0.55)',
    description: 'Hovered cards.',
  },
  {
    name: 'shadow-lg',
    cssVar: '--shadow-lg',
    value: '0 18px 44px -12px color-mix(in oklab, var(--ink-950) 22%, transparent)',
    dark: '0 22px 50px -14px rgb(0 0 0 / 0.65)',
    description: 'Lightbox and popovers.',
  },
  {
    name: 'shadow-border',
    cssVar: '--shadow-border',
    value: '0 0 0 1px rgb(0 0 0 / 0.06), 0 1px 2px -1px rgb(0 0 0 / 0.06), 0 2px 4px 0 rgb(0 0 0 / 0.04)',
    dark: '0 0 0 1px rgb(255 255 255 / 0.08)',
    description: 'Shadow as border for surfaces over imagery.',
  },
];

export const durations: readonly ScalarToken[] = [
  ['instant', '90ms', 'Press feedback.'],
  ['quick', '160ms', 'Hover and color changes.'],
  ['base', '260ms', 'Enter and exit of small elements.'],
  ['slow', '480ms', 'Page transitions and large surfaces.'],
  ['drawn', '2600ms', 'Line-art stroke drawing on the drawing sheet.'],
].map(([step, value, description]) => ({
  name: `duration-${step}`,
  cssVar: `--duration-${step}`,
  value: value as string,
  description: description as string,
}));

export const easings: readonly EasingToken[] = [
  {
    name: 'ease-out',
    cssVar: '--ease-out',
    points: [0.2, 0, 0, 1],
    value: 'cubic-bezier(0.2, 0, 0, 1)',
    description: 'Default for enters and presses. Fast start, long settle.',
  },
  {
    name: 'ease-in-out',
    cssVar: '--ease-in-out',
    points: [0.65, 0, 0.35, 1],
    value: 'cubic-bezier(0.65, 0, 0.35, 1)',
    description: 'Elements moving between two resting places.',
  },
  {
    name: 'ease-emphasized',
    cssVar: '--ease-emphasized',
    points: [0.05, 0.7, 0.1, 1],
    value: 'cubic-bezier(0.05, 0.7, 0.1, 1)',
    description: 'Hero reveals and the stroke drawing.',
  },
  {
    name: 'ease-overshoot',
    cssVar: '--ease-overshoot',
    points: [0.34, 1.56, 0.64, 1],
    value: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    description: 'Sticker pops. Never on text or layout.',
  },
];

export const motionConstants: readonly ScalarToken[] = [
  {
    name: 'press-scale',
    cssVar: '--press-scale',
    value: '0.96',
    description: 'Scale on :active. Never below 0.95.',
  },
  {
    name: 'stagger',
    cssVar: '--stagger',
    value: '70ms',
    description: 'Delay between chunks of a staggered enter.',
  },
];
