import { type FigureGeometry, frontFigure } from './figure';
import { LINEART_PATHS as backPaths } from './generated/back';
import { LINEART_PATHS as leftPaths } from './generated/left';
import { LINEART_PATHS as rightPaths } from './generated/right';

// Open hair strokes and the face do not enclose filled ink contours.
// This continuous head silhouette includes those interior color regions.
const FRONT_HEAD_SILHOUETTE =
  'M 190 64 C 149 60 118 77 96 108 C 79 132 75 164 68 196 C 61 222 60 245 69 264 C 77 281 94 294 112 298 L 104 286 C 119 299 138 301 151 294 C 164 298 175 296 187 291 C 205 300 222 302 239 296 C 256 290 269 284 281 271 L 278 287 C 297 278 309 266 315 250 L 315 269 C 328 251 331 239 326 220 C 320 195 315 174 303 146 C 282 94 247 66 190 64 Z';

/** Angles are named by the direction the figure faces on the page. */
export const figureViews = {
  front: {
    ...frontFigure,
    silhouetteExtras: [FRONT_HEAD_SILHOUETTE],
    colorImage: { src: '/media/character/front-color.webp', x: -312, y: -13.75, width: 1024, height: 1536 },
  },
  left: {
    ...frontFigure,
    id: 'left',
    paths: leftPaths,
    colorImage: { src: '/media/character/left-color.webp', x: -312, y: -13.75, width: 1024, height: 1536 },
    glasses: [],
    centerX: 200,
    hem: { left: 28, right: 368, y: 858 },
    anchors: {
      beret: { x: 192, y: 32, side: 'left' },
      ribbon: { x: 321, y: 222, side: 'right' },
      hair: { x: 57, y: 149, side: 'left' },
      'hair-tips': { x: 123, y: 301, side: 'left' },
      'hair-clip': { x: 155, y: 134, side: 'right' },
      glasses: { x: 78, y: 207, side: 'left' },
      eyes: { x: 107, y: 194, side: 'right' },
      collar: { x: 168, y: 349, side: 'left' },
      bow: { x: 106, y: 395, side: 'right' },
      'name-bar': { x: 149, y: 419, side: 'right' },
      clasps: { x: 137, y: 557, side: 'right' },
      skirt: { x: 75, y: 751, side: 'left' },
      socks: { x: 218, y: 1334, side: 'left' },
      loafers: { x: 150, y: 1460, side: 'right' },
    },
  },
  back: {
    ...frontFigure,
    id: 'back',
    paths: backPaths,
    colorImage: { src: '/media/character/back-color.webp', x: -312, y: -13.75, width: 1024, height: 1536 },
    glasses: [],
    centerX: 200,
    hem: { left: 4, right: 392, y: 833 },
    anchors: {
      beret: { x: 183, y: 29, side: 'left' },
      ribbon: { x: 63, y: 181, side: 'right' },
      hair: { x: 137, y: 245, side: 'left' },
      'hair-tips': { x: 236, y: 275, side: 'left' },
      collar: { x: 199, y: 381, side: 'left' },
      skirt: { x: 86, y: 767, side: 'left' },
      socks: { x: 110, y: 1343, side: 'left' },
      loafers: { x: 190, y: 1467, side: 'right' },
    },
  },
  right: {
    ...frontFigure,
    id: 'right',
    paths: rightPaths,
    colorImage: { src: '/media/character/right-color.webp', x: -312, y: -13.75, width: 1024, height: 1536 },
    glasses: [],
    centerX: 200,
    hem: { left: 67, right: 370, y: 850 },
    anchors: {
      beret: { x: 147, y: 35, side: 'left' },
      ribbon: { x: 43, y: 204, side: 'right' },
      hair: { x: 139, y: 220, side: 'left' },
      'hair-tips': { x: 140, y: 285, side: 'left' },
      'hair-clip': { x: 205, y: 143, side: 'right' },
      glasses: { x: 272, y: 192, side: 'left' },
      eyes: { x: 250, y: 180, side: 'right' },
      collar: { x: 173, y: 345, side: 'left' },
      bow: { x: 283, y: 391, side: 'right' },
      clasps: { x: 292, y: 558, side: 'right' },
      skirt: { x: 124, y: 744, side: 'left' },
      socks: { x: 171, y: 1350, side: 'left' },
      loafers: { x: 280, y: 1470, side: 'right' },
    },
  },
} as const satisfies Readonly<Record<string, FigureGeometry>>;

export type FigureView = keyof typeof figureViews;
export const figureViewOrder: readonly FigureView[] = ['front', 'left', 'back', 'right'];

/** Keep the current view when possible; hidden traits use the original front view. */
export function viewForTrait(view: FigureView, traitId: string): FigureView {
  return traitId in figureViews[view].anchors ? view : 'front';
}
