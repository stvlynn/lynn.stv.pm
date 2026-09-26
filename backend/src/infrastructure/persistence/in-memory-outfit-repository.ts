import { Slug } from '../../domain/shared';
import { Outfit, type OutfitRepository } from '../../domain/wardrobe';
import { outfitContent } from '../content/wardrobe.content';
import { toMedia, toSwatch } from './content-mapping';

export class InMemoryOutfitRepository implements OutfitRepository {
  private readonly outfits = outfitContent.map((record) =>
    Outfit.create({
      ...record,
      id: Slug.of(record.id),
      image: toMedia(record.image),
      garments: record.garments.map((garment) => ({ ...garment })),
      palette: record.palette.map(toSwatch),
    }),
  );

  async list(): Promise<readonly Outfit[]> {
    return this.outfits;
  }

  async findById(id: string): Promise<Outfit | null> {
    return this.outfits.find((outfit) => outfit.id.value === id) ?? null;
  }
}
