import type { Sticker } from './sticker';
import type { StickerGuide } from './sticker-guide';

export interface StickerRepository {
  list(): Promise<readonly Sticker[]>;
}

export interface StickerGuideRepository {
  get(): Promise<StickerGuide>;
}
