import type { Artwork } from './artwork';

export interface ArtworkRepository {
  list(): Promise<readonly Artwork[]>;
  findById(id: string): Promise<Artwork | null>;
}
