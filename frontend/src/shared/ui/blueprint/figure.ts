import { LINEART_HEIGHT, LINEART_PATHS } from './lineart';

/**
 * Geometry of the front-elevation line drawing, in figure units (the traced
 * line art is 400 units wide). See `lineart.ts` for the outlines.
 */

export const FIGURE_WIDTH = 400;
export const FIGURE_HEIGHT = LINEART_HEIGHT;

/** Crown of the skull (under the beret) and chin. */
export const HEAD_TOP = 62;
export const CHIN = 280;
export const HEAD_UNIT = CHIN - HEAD_TOP;
export const CENTER_X = 205;
export const HEM = { left: 6, right: 394, y: 830 } as const;

const circle = (cx: number, cy: number, r: number) =>
  `M ${cx - r} ${cy} a ${r} ${r} 0 1 0 ${r * 2} 0 a ${r} ${r} 0 1 0 ${-r * 2} 0`;

/**
 * The line-art source dropped the glasses, so they are drawn here as strokes
 * over the traced outlines: thin round lenses, bridge and temples.
 */
export const GLASSES_PATHS: readonly string[] = [
  circle(160, 213, 25),
  circle(233, 196, 27),
  'M 184 207 C 192 201 200 199 206 199',
  'M 259 190 L 287 183',
  'M 136 213 L 129 212',
];

export type CalloutSide = 'left' | 'right';

export interface TraitAnchor {
  readonly x: number;
  readonly y: number;
  readonly side: CalloutSide;
}

export interface FigureGeometry {
  readonly id: string;
  readonly paths: readonly string[];
  readonly glasses: readonly string[];
  readonly anchors: Readonly<Record<string, TraitAnchor>>;
  readonly headTop: number;
  readonly chin: number;
  readonly centerX: number;
  readonly hem: { readonly left: number; readonly right: number; readonly y: number };
  readonly silhouetteExtras?: readonly string[];
  readonly colorImage?: {
    readonly src: string;
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;
  };
}

/** Where each identity trait (by API trait id) sits on the drawing. */
export const traitAnchors: Readonly<Record<string, TraitAnchor>> = {
  beret: { x: 150, y: 30, side: 'left' },
  ribbon: { x: 350, y: 172, side: 'right' },
  hair: { x: 86, y: 150, side: 'left' },
  'hair-tips': { x: 76, y: 268, side: 'left' },
  'hair-clip': { x: 262, y: 142, side: 'right' },
  glasses: { x: 136, y: 214, side: 'left' },
  eyes: { x: 240, y: 196, side: 'right' },
  collar: { x: 128, y: 338, side: 'left' },
  bow: { x: 220, y: 380, side: 'right' },
  'name-bar': { x: 280, y: 404, side: 'right' },
  clasps: { x: 238, y: 536, side: 'right' },
  skirt: { x: 58, y: 740, side: 'left' },
  socks: { x: 202, y: 1334, side: 'left' },
  loafers: { x: 318, y: 1420, side: 'right' },
};

export const frontFigure: FigureGeometry = {
  id: 'front',
  paths: LINEART_PATHS,
  glasses: GLASSES_PATHS,
  anchors: traitAnchors,
  headTop: HEAD_TOP,
  chin: CHIN,
  centerX: CENTER_X,
  hem: HEM,
};
