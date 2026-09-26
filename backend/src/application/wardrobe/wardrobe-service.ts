import type { OutfitDto } from '@lynn/contracts';
import { type Outfit, type OutfitRepository, orderWardrobe } from '../../domain/wardrobe';
import { NotFoundError, toMediaDto, toSwatchDto } from '../shared';

const toOutfitDto = (outfit: Outfit): OutfitDto => ({
  id: outfit.id.value,
  code: outfit.code,
  name: outfit.name,
  occasion: outfit.occasion,
  summary: outfit.summary,
  canonical: outfit.canonical,
  image: toMediaDto(outfit.image),
  garments: outfit.garments.map((garment) => ({ ...garment })),
  palette: outfit.palette.map(toSwatchDto),
  source: outfit.source,
});

export class ListOutfits {
  constructor(private readonly outfits: OutfitRepository) {}

  async execute(): Promise<OutfitDto[]> {
    return orderWardrobe(await this.outfits.list()).map(toOutfitDto);
  }
}

export class GetOutfit {
  constructor(private readonly outfits: OutfitRepository) {}

  async execute(id: string): Promise<OutfitDto> {
    const outfit = await this.outfits.findById(id);
    if (!outfit) {
      throw new NotFoundError('OUTFIT_NOT_FOUND', `No outfit with id "${id}"`);
    }
    return toOutfitDto(outfit);
  }
}
