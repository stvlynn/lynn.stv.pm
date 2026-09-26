import { GetCharacterProfile } from './application/character';
import { GetUiSpec } from './application/design-system';
import { GetArtwork, ListArtworks } from './application/gallery';
import { GetPvSpec } from './application/pv';
import type { Logger } from './application/shared';
import { ComposeStickerPrompt, GetStickerSpec } from './application/sticker';
import { GetOutfit, ListOutfits } from './application/wardrobe';
import type { Env } from './infrastructure/config/env';
import { TokensPackageCatalogSource } from './infrastructure/design-system/tokens-package-catalog-source';
import { JsonLogger } from './infrastructure/logging/logger';
import { InMemoryArtworkRepository } from './infrastructure/persistence/in-memory-artwork-repository';
import { InMemoryCharacterRepository } from './infrastructure/persistence/in-memory-character-repository';
import { InMemoryOutfitRepository } from './infrastructure/persistence/in-memory-outfit-repository';
import { InMemoryPvGuideRepository } from './infrastructure/persistence/in-memory-pv-guide-repository';
import {
  InMemoryStickerGuideRepository,
  InMemoryStickerRepository,
} from './infrastructure/persistence/in-memory-sticker-repository';
import type { HttpDependencies } from './interfaces/http';

/** Composition root: the only place that knows every concrete class. */
export function buildDependencies(env: Env, logger: Logger = new JsonLogger(env.LOG_LEVEL)): HttpDependencies {
  const outfits = new InMemoryOutfitRepository();
  const artworks = new InMemoryArtworkRepository();
  const stickerGuides = new InMemoryStickerGuideRepository();
  return {
    logger,
    staticDir: env.STATIC_DIR,
    services: {
      getCharacterProfile: new GetCharacterProfile(new InMemoryCharacterRepository()),
      listOutfits: new ListOutfits(outfits),
      getOutfit: new GetOutfit(outfits),
      listArtworks: new ListArtworks(artworks),
      getArtwork: new GetArtwork(artworks),
      getUiSpec: new GetUiSpec(new TokensPackageCatalogSource()),
      getStickerSpec: new GetStickerSpec(stickerGuides, new InMemoryStickerRepository()),
      composeStickerPrompt: new ComposeStickerPrompt(stickerGuides),
      getPvSpec: new GetPvSpec(new InMemoryPvGuideRepository()),
    },
  };
}
