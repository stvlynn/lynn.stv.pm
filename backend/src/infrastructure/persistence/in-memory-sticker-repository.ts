import { MediaAsset, Slug } from '../../domain/shared';
import { Sticker, StickerGuide, type StickerGuideRepository, type StickerRepository } from '../../domain/sticker';
import { stickerContent, stickerGuideContent } from '../content/sticker.content';
import { toSwatch } from './content-mapping';

const STICKER_EDGE = 320;

export class InMemoryStickerRepository implements StickerRepository {
  private readonly stickers = stickerContent.map(([id, title, kind]) =>
    Sticker.create({
      id: Slug.of(id),
      title,
      kind,
      image: MediaAsset.of({
        src: `/media/stickers/${id}.webp`,
        width: STICKER_EDGE,
        height: STICKER_EDGE,
        alt: `Lynn sticker: ${title}`,
      }),
    }),
  );

  async list(): Promise<readonly Sticker[]> {
    return this.stickers;
  }
}

export class InMemoryStickerGuideRepository implements StickerGuideRepository {
  private readonly guide = StickerGuide.create({
    ...stickerGuideContent,
    canvas: { ...stickerGuideContent.canvas, background: toSwatch(stickerGuideContent.canvas.background) },
    rules: stickerGuideContent.rules.map((rule) => ({ ...rule })),
    channels: stickerGuideContent.channels.map((channel) => ({ ...channel })),
    promptExample: { ...stickerGuideContent.promptExample },
  });

  async get(): Promise<StickerGuide> {
    return this.guide;
  }
}
