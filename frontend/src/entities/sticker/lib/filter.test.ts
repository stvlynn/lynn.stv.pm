import { describe, expect, it } from 'vitest';
import type { Sticker } from '../model/types';
import { displayTitle, filterStickers } from './filter';

const sticker = (id: string, title: string, kind: Sticker['kind']): Sticker => ({
  id,
  title,
  kind,
  image: { src: `/media/stickers/${id}.webp`, width: 320, height: 320, alt: title },
});

const set = [
  sticker('a', '干饭', 'caption'),
  sticker('b', 'bubble_tea', 'expression'),
  sticker('c', 'ChatGPT', 'caption'),
];

describe('filterStickers', () => {
  it('filters by kind', () => {
    expect(filterStickers(set, 'expression', '').map((item) => item.id)).toEqual(['b']);
  });

  it('searches titles case-insensitively', () => {
    expect(filterStickers(set, 'all', 'chat').map((item) => item.id)).toEqual(['c']);
    expect(filterStickers(set, 'all', '干').map((item) => item.id)).toEqual(['a']);
  });
});

describe('displayTitle', () => {
  it('replaces underscores', () => {
    expect(displayTitle(set[1] as Sticker)).toBe('bubble tea');
  });
});
