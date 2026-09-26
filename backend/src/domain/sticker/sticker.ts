import { invariant, type MediaAsset, type Slug } from '../shared';

export type StickerKind = 'caption' | 'expression';

export class Sticker {
  private constructor(
    public readonly id: Slug,
    public readonly title: string,
    public readonly kind: StickerKind,
    public readonly image: MediaAsset,
  ) {}

  static create(props: { id: Slug; title: string; kind: StickerKind; image: MediaAsset }): Sticker {
    invariant(props.image.orientation === 'square', 'STICKER_NOT_SQUARE', `Sticker ${props.id.value} must be square`);
    return new Sticker(props.id, props.title, props.kind, props.image);
  }
}
