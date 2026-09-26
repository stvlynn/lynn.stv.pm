import { describe, expect, it } from 'vitest';
import { HexColor } from '../shared';
import { composite, contrastRatio, gradeContrast } from './contrast';

describe('contrastRatio', () => {
  it('is 21 for black on white, regardless of order', () => {
    expect(contrastRatio(HexColor.of('#000000'), HexColor.of('#ffffff'))).toBe(21);
    expect(contrastRatio(HexColor.of('#ffffff'), HexColor.of('#000000'))).toBe(21);
  });

  it('is 1 for identical colors', () => {
    expect(contrastRatio(HexColor.of('#3f7ad4'), HexColor.of('#3f7ad4'))).toBe(1);
  });
});

describe('gradeContrast', () => {
  it('maps ratios to WCAG grades', () => {
    expect(gradeContrast(7.1)).toBe('AAA');
    expect(gradeContrast(4.5)).toBe('AA');
    expect(gradeContrast(3.2)).toBe('AA Large');
    expect(gradeContrast(2.9)).toBe('Fail');
  });
});

describe('composite', () => {
  it('blends a translucent foreground over the background', () => {
    expect(composite(HexColor.of('#000000'), 50, HexColor.of('#ffffff')).value).toBe('#808080');
  });
});
