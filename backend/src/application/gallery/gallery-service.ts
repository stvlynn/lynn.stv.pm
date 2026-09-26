import type { ArtworkDto } from '@lynn/contracts';
import type { Artwork, ArtworkRepository } from '../../domain/gallery';
import { NotFoundError, toMediaDto, toSwatchDto } from '../shared';

const toArtworkDto = (artwork: Artwork): ArtworkDto => ({
  id: artwork.id.value,
  code: artwork.code,
  title: artwork.title,
  caption: artwork.caption,
  mood: artwork.mood,
  image: toMediaDto(artwork.image),
  palette: artwork.palette.map(toSwatchDto),
  motifs: [...artwork.motifs],
  orientation: artwork.orientation,
});

export class ListArtworks {
  constructor(private readonly artworks: ArtworkRepository) {}

  async execute(): Promise<ArtworkDto[]> {
    const artworks = await this.artworks.list();
    return [...artworks].sort((a, b) => a.code.localeCompare(b.code)).map(toArtworkDto);
  }
}

export class GetArtwork {
  constructor(private readonly artworks: ArtworkRepository) {}

  async execute(id: string): Promise<ArtworkDto> {
    const artwork = await this.artworks.findById(id);
    if (!artwork) {
      throw new NotFoundError('ARTWORK_NOT_FOUND', `No artwork with id "${id}"`);
    }
    return toArtworkDto(artwork);
  }
}
