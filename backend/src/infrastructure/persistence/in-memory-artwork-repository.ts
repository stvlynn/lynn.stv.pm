import { Artwork, type ArtworkRepository } from '../../domain/gallery';
import { Slug } from '../../domain/shared';
import { artworkContent } from '../content/gallery.content';
import { toMedia, toSwatch } from './content-mapping';

export class InMemoryArtworkRepository implements ArtworkRepository {
  private readonly artworks = artworkContent.map((record) =>
    Artwork.create({
      ...record,
      id: Slug.of(record.id),
      image: toMedia(record.image),
      palette: record.palette.map(toSwatch),
      motifs: [...record.motifs],
    }),
  );

  async list(): Promise<readonly Artwork[]> {
    return this.artworks;
  }

  async findById(id: string): Promise<Artwork | null> {
    return this.artworks.find((artwork) => artwork.id.value === id) ?? null;
  }
}
