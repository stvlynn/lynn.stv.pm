import type { Sticker, StickerFilter } from '../model/types';

/** Filters by kind and by a case-insensitive title search. */
export function filterStickers(stickers: readonly Sticker[], filter: StickerFilter, query: string): Sticker[] {
  const needle = query.trim().toLocaleLowerCase();
  return stickers.filter(
    (sticker) =>
      (filter === 'all' || sticker.kind === filter) &&
      (needle.length === 0 || sticker.title.toLocaleLowerCase().includes(needle)),
  );
}

/** Stickers titles use underscores for spaces in the source set. */
export const displayTitle = (sticker: Sticker): string => sticker.title.replaceAll('_', ' ');
