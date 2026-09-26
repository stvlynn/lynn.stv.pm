import type { TokenCatalog } from './token-catalog';

/** Port: where the token catalog is read from. */
export interface TokenCatalogSource {
  load(): Promise<TokenCatalog>;
}
