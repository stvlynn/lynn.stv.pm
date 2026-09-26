import type { FigureGeometry } from './figure';

const DETAIL_SCALE: Readonly<Record<string, number>> = {
  beret: 3.2,
  ribbon: 4,
  hair: 3,
  'hair-tips': 4,
  'hair-clip': 5,
  glasses: 4.5,
  eyes: 5,
  collar: 3.4,
  bow: 4,
  'name-bar': 5,
  clasps: 4.2,
  skirt: 2.5,
  socks: 3.2,
  loafers: 3.2,
};

/** Center the selected anatomical anchor in the unchanged SVG viewport. */
export function figureCamera(figure: FigureGeometry, focusId: string | null) {
  if (focusId === null) return { x: 0, y: 0, scale: 1 };
  const anchor = figure.anchors[focusId];
  const scale = DETAIL_SCALE[focusId];
  if (!anchor || scale === undefined) throw new Error(`Cannot focus hidden or unknown trait: ${focusId}`);
  return {
    scale,
    x: 205 - anchor.x * scale,
    y: 740 - anchor.y * scale,
  };
}
