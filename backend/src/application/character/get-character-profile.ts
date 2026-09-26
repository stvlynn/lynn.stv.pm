import type { CharacterProfileDto } from '@lynn/contracts';
import type { CharacterRepository } from '../../domain/character';
import { toMediaDto, toSwatchDto } from '../shared';

export class GetCharacterProfile {
  constructor(private readonly characters: CharacterRepository) {}

  async execute(): Promise<CharacterProfileDto> {
    const character = await this.characters.get();
    return {
      name: character.name,
      tagline: character.tagline,
      summary: character.summary,
      credits: character.credits.map((credit) => ({ ...credit })),
      facts: character.facts.map((fact) => ({ ...fact })),
      pillars: character.pillars.map((pillar) => ({ id: pillar.id.value, title: pillar.title, body: pillar.body })),
      traits: character.traits.map((trait) => ({
        id: trait.id.value,
        part: trait.part,
        label: trait.label,
        detail: trait.detail,
        swatch: trait.swatch ? toSwatchDto(trait.swatch) : null,
      })),
      palette: character.palette.map(toSwatchDto),
      proportion: { ...character.proportion },
      referenceSheet: toMediaDto(character.referenceSheet),
      doNot: [...character.doNot],
    };
  }
}
