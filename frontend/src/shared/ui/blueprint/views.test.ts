import { describe, expect, it } from 'vitest';
import { FIGURE_HEIGHT, FIGURE_WIDTH } from './figure';
import { LABEL_GAP, placeCallouts } from './layout';
import { figureViewOrder, figureViews, viewForTrait } from './views';

describe('character view annotations', () => {
  it('uses the selected drawing anchors and keeps labels separated in every view', () => {
    const callouts = Object.keys(figureViews.front.anchors).map((id) => ({ id, code: id, label: id }));
    for (const view of figureViewOrder) {
      const anchors = figureViews[view].anchors;
      const placed = placeCallouts(callouts, anchors);
      expect(placed).toHaveLength(Object.keys(anchors).length);
      for (const item of placed) {
        expect(item.anchor.x).toBeGreaterThanOrEqual(0);
        expect(item.anchor.x).toBeLessThanOrEqual(FIGURE_WIDTH);
        expect(item.anchor.y).toBeGreaterThanOrEqual(0);
        expect(item.anchor.y).toBeLessThanOrEqual(FIGURE_HEIGHT);
      }
      for (const side of ['left', 'right']) {
        const labels = placed.filter((item) => item.anchor.side === side);
        for (let index = 1; index < labels.length; index++) {
          expect(labels[index].labelY - labels[index - 1].labelY).toBeGreaterThanOrEqual(LABEL_GAP);
        }
      }
    }
  });

  it('omits occluded facial and chest traits from the back view', () => {
    const ids = ['eyes', 'glasses', 'bow', 'name-bar', 'clasps'];
    const callouts = ids.map((id) => ({ id, code: id, label: id }));
    expect(placeCallouts(callouts, figureViews.back.anchors)).toEqual([]);
  });

  it('reveals a hidden trait without turning away from already visible traits', () => {
    expect(viewForTrait('back', 'glasses')).toBe('front');
    expect(viewForTrait('right', 'name-bar')).toBe('front');
    expect(viewForTrait('back', 'ribbon')).toBe('back');
    expect(viewForTrait('left', 'glasses')).toBe('left');
  });
});
