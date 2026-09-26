import { Character, type CharacterRepository } from '../../domain/character';
import { Slug } from '../../domain/shared';
import { characterContent } from '../content/character.content';
import { toMedia, toSwatch } from './content-mapping';

export class InMemoryCharacterRepository implements CharacterRepository {
  private readonly character = Character.create({
    name: characterContent.name,
    tagline: characterContent.tagline,
    summary: characterContent.summary,
    credits: characterContent.credits.map((credit) => ({ ...credit })),
    facts: characterContent.facts.map((fact) => ({ ...fact })),
    pillars: characterContent.pillars.map((pillar) => ({ ...pillar, id: Slug.of(pillar.id) })),
    traits: characterContent.traits.map((trait) => ({
      ...trait,
      id: Slug.of(trait.id),
      swatch: trait.swatch ? toSwatch(trait.swatch) : null,
    })),
    palette: characterContent.palette.map(toSwatch),
    proportion: { ...characterContent.proportion },
    referenceSheet: toMedia(characterContent.referenceSheet),
    doNot: [...characterContent.doNot],
  });

  async get(): Promise<Character> {
    return this.character;
  }
}
