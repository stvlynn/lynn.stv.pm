import { describe, expect, it } from 'vitest';
import { figureCamera } from './camera';
import { figureViewOrder, figureViews } from './views';

describe('trait camera', () => {
  it('centers every visible trait across all four views', () => {
    for (const view of figureViewOrder) {
      const figure = figureViews[view];
      for (const [id, anchor] of Object.entries(figure.anchors)) {
        const camera = figureCamera(figure, id);
        expect(anchor.x * camera.scale + camera.x).toBeCloseTo(205);
        expect(anchor.y * camera.scale + camera.y).toBeCloseTo(740);
        expect(camera.scale).toBeGreaterThan(1);
      }
    }
  });

  it('restores the full drawing and rejects occluded targets', () => {
    expect(figureCamera(figureViews.front, null)).toEqual({ x: 0, y: 0, scale: 1 });
    expect(() => figureCamera(figureViews.back, 'glasses')).toThrow('hidden or unknown trait');
    expect(() => figureCamera(figureViews.front, 'unknown')).toThrow('hidden or unknown trait');
  });
});
