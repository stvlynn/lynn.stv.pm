import { describe, expect, it } from 'vitest';
import { normalizeTilt } from './tilt';

describe('screen-relative tilt', () => {
  it('keeps the calibrated pose still and suppresses sensor jitter', () => {
    expect(normalizeTilt(0.2, -0.2, 0)).toEqual({ x: 0, y: 0 });
  });
  it('clamps extreme tilt and handles the beta wraparound', () => {
    expect(normalizeTilt(100, -80, 0)).toEqual({ x: -1, y: 1 });
    expect(normalizeTilt(-358, 0, 0).y).toBeCloseTo(0.1);
  });
  it('rotates both axes for either landscape orientation', () => {
    expect(normalizeTilt(20, 0, 90)).toEqual({ x: 1, y: 0 });
    expect(normalizeTilt(20, 0, 270)).toEqual({ x: -1, y: 0 });
  });
});
