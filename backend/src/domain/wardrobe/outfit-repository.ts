import type { Outfit } from './outfit';

export interface OutfitRepository {
  list(): Promise<readonly Outfit[]>;
  findById(id: string): Promise<Outfit | null>;
}
