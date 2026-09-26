import { describe, expect, it } from 'vitest';
import { LABEL_GAP, placeCallouts } from './layout';

describe('placeCallouts', () => {
  it('keeps labels on one side at least LABEL_GAP apart', () => {
    const placed = placeCallouts([
      { id: 'hair', code: 'a', label: 'Hair' },
      { id: 'hair-tips', code: 'b', label: 'Tips' },
      { id: 'glasses', code: 'c', label: 'Glasses' },
    ]);
    const ys = placed.filter((item) => item.anchor.side === 'left').map((item) => item.labelY);
    for (let index = 1; index < ys.length; index += 1) {
      expect((ys[index] ?? 0) - (ys[index - 1] ?? 0)).toBeGreaterThanOrEqual(LABEL_GAP);
    }
  });

  it('skips traits the drawing has no anchor for', () => {
    expect(placeCallouts([{ id: 'tail', code: 'x', label: 'Tail' }])).toEqual([]);
  });
});
