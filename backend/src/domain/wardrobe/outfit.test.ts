import { describe, expect, it } from 'vitest';
import { DomainError, MediaAsset, Slug, Swatch } from '../shared';
import { Outfit, type OutfitProps, orderWardrobe } from './outfit';

const make = (overrides: Partial<OutfitProps>): Outfit =>
  Outfit.create({
    id: Slug.of('look'),
    code: 'OF-02',
    name: 'Look',
    occasion: 'Any',
    summary: 'A look',
    canonical: false,
    image: MediaAsset.of({ src: '/media/o.webp', width: 400, height: 1400, alt: 'A look' }),
    garments: [{ slot: 'Top', name: 'Blouse' }],
    palette: [Swatch.of('Ink', '#222d42')],
    source: 'Test',
    ...overrides,
  });

describe('Outfit', () => {
  it('requires at least one garment', () => {
    expect(() => make({ garments: [] })).toThrow(DomainError);
  });

  it('requires an OF-nn code', () => {
    expect(() => make({ code: 'X1' })).toThrow(DomainError);
  });
});

describe('orderWardrobe', () => {
  it('lists the canonical outfit first, then by code', () => {
    const ordered = orderWardrobe([
      make({ code: 'OF-03', id: Slug.of('c') }),
      make({ code: 'OF-02', id: Slug.of('b') }),
      make({ code: 'OF-01', id: Slug.of('a'), canonical: true }),
    ]);
    expect(ordered.map((outfit) => outfit.code)).toEqual(['OF-01', 'OF-02', 'OF-03']);
  });

  it('rejects a wardrobe without exactly one canonical outfit', () => {
    expect(() => orderWardrobe([make({})])).toThrow(DomainError);
  });
});
