import { describe, expect, it } from 'vitest';
import { sampleBezier, toPixels } from './bezier';

describe('sampleBezier', () => {
  it('starts at the origin and ends at (1, 1)', () => {
    const samples = sampleBezier([0.2, 0, 0, 1], 10);
    expect(samples[0]).toEqual({ x: 0, y: 0 });
    expect(samples.at(-1)?.x).toBeCloseTo(1);
    expect(samples.at(-1)?.y).toBeCloseTo(1);
  });

  it('overshoots above 1 for the overshoot curve', () => {
    const peak = Math.max(...sampleBezier([0.34, 1.56, 0.64, 1]).map((sample) => sample.y));
    expect(peak).toBeGreaterThan(1);
  });
});

describe('toPixels', () => {
  it('converts rem and px', () => {
    expect(toPixels('1.5rem')).toBe(24);
    expect(toPixels('12px')).toBe(12);
  });
});
