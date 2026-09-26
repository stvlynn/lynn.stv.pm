import type { Character } from './character';

export interface CharacterRepository {
  get(): Promise<Character>;
}
