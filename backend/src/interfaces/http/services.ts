import type { GetCharacterProfile } from '../../application/character';
import type { GetUiSpec } from '../../application/design-system';
import type { GetArtwork, ListArtworks } from '../../application/gallery';
import type { GetPvSpec } from '../../application/pv';
import type { Logger } from '../../application/shared';
import type { ComposeStickerPrompt, GetStickerSpec } from '../../application/sticker';
import type { GetOutfit, ListOutfits } from '../../application/wardrobe';

/** Everything the HTTP adapter needs, wired in the composition root. */
export interface HttpDependencies {
  readonly logger: Logger;
  readonly staticDir?: string | undefined;
  readonly services: {
    readonly getCharacterProfile: GetCharacterProfile;
    readonly listOutfits: ListOutfits;
    readonly getOutfit: GetOutfit;
    readonly listArtworks: ListArtworks;
    readonly getArtwork: GetArtwork;
    readonly getUiSpec: GetUiSpec;
    readonly getStickerSpec: GetStickerSpec;
    readonly composeStickerPrompt: ComposeStickerPrompt;
    readonly getPvSpec: GetPvSpec;
  };
}
