import { describe, expect, it } from 'vitest';
import { DomainError } from './domain-error';
import { HexColor } from './hex-color';
import { MediaAsset } from './media-asset';
import { Slug } from './slug';

describe('HexColor', () => {
  it('normalizes to lowercase', () => {
    expect(HexColor.of('#2E5FA8').value).toBe('#2e5fa8');
  });

  it('rejects shorthand and named colors', () => {
    expect(() => HexColor.of('#fff')).toThrow(DomainError);
    expect(() => HexColor.of('navy')).toThrow(DomainError);
  });

  it('computes WCAG luminance at the extremes', () => {
    expect(HexColor.of('#ffffff').luminance()).toBeCloseTo(1, 5);
    expect(HexColor.of('#000000').luminance()).toBeCloseTo(0, 5);
  });
});

describe('Slug', () => {
  it('accepts kebab-case', () => {
    expect(Slug.of('crowd-in-the-rain').value).toBe('crowd-in-the-rain');
  });

  it('rejects spaces and capitals', () => {
    expect(() => Slug.of('Crowd in rain')).toThrow(DomainError);
  });
});

describe('MediaAsset', () => {
  const base = { src: '/media/a.webp', width: 900, height: 1400, alt: 'A drawing' };

  it('derives orientation from its dimensions', () => {
    expect(MediaAsset.of(base).orientation).toBe('portrait');
    expect(MediaAsset.of({ ...base, width: 1600, height: 900 }).orientation).toBe('landscape');
    expect(MediaAsset.of({ ...base, width: 512, height: 512 }).orientation).toBe('square');
  });

  it('requires alt text and the media root', () => {
    expect(() => MediaAsset.of({ ...base, alt: ' ' })).toThrow(DomainError);
    expect(() => MediaAsset.of({ ...base, src: 'https://example.com/a.webp' })).toThrow(DomainError);
  });
});
