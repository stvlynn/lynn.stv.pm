import { MediaAsset, Swatch } from '../../domain/shared';
import { hexForToken } from '../design-system/tokens-package-catalog-source';

export type SwatchRecord = { readonly label: string } & (
  { readonly token: string; readonly hex?: never } | { readonly hex: string; readonly token?: never }
);

export interface MediaRecord {
  readonly src: string;
  readonly width: number;
  readonly height: number;
  readonly alt: string;
}

export const toSwatch = (record: SwatchRecord): Swatch =>
  record.token === undefined
    ? Swatch.of(record.label, record.hex)
    : Swatch.of(record.label, hexForToken(record.token), record.token);

export const toMedia = (record: MediaRecord): MediaAsset => MediaAsset.of({ ...record });
