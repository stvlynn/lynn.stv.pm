import { describe, expect, it } from 'vitest';
import type { DrawingPhase, PenStroke } from './figure';
import { INK_DURATION, schedulePenStrokes } from './stroke-timeline';

const stroke = (phase: DrawingPhase, length = 10): PenStroke => ({ phase, length, width: 3, d: 'M0 0L10 0' });

describe('pen stroke scheduling', () => {
  it('finishes the silhouette before construction and facial details even with shuffled input', () => {
    const timeline = schedulePenStrokes([stroke('details'), stroke('structure'), stroke('contour')]);
    expect(timeline.map(({ stroke }) => stroke.phase)).toEqual(['contour', 'structure', 'details']);
    for (let index = 1; index < timeline.length; index++) {
      expect(timeline[index].delay).toBeGreaterThan(timeline[index - 1].delay + timeline[index - 1].duration);
    }
    const last = timeline.at(-1)!;
    expect(last.delay + last.duration).toBeCloseTo(INK_DURATION);
  });

  it('lifts the pen between separate strokes and spends longer on long lines', () => {
    const [short, long] = schedulePenStrokes([stroke('contour'), stroke('contour', 40)]);
    expect(long.delay).toBeGreaterThan(short.delay + short.duration);
    expect(long.duration / short.duration).toBeCloseTo(4);
  });

  it('handles absent phases without invalid timing', () => {
    expect(schedulePenStrokes([])).toEqual([]);
    const [detail] = schedulePenStrokes([stroke('details')]);
    expect(Number.isFinite(detail.duration)).toBe(true);
    expect(detail.delay + detail.duration).toBeCloseTo(INK_DURATION);
  });
});
