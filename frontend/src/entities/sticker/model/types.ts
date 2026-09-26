import type { StickerDto, StickerSpecDto } from '@lynn/contracts';

export type Sticker = StickerDto;
export type StickerSpec = StickerSpecDto;
export type StickerFilter = 'all' | Sticker['kind'];
