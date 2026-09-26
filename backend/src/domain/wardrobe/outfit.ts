import { invariant, type MediaAsset, type Slug, type Swatch } from '../shared';

export interface Garment {
  readonly slot: string;
  readonly name: string;
}

export interface OutfitProps {
  readonly id: Slug;
  readonly code: string;
  readonly name: string;
  readonly occasion: string;
  readonly summary: string;
  readonly canonical: boolean;
  readonly image: MediaAsset;
  readonly garments: readonly Garment[];
  readonly palette: readonly Swatch[];
  readonly source: string;
}

/** One sanctioned look. Identity traits stay fixed; only garments change. */
export class Outfit {
  private constructor(private readonly props: OutfitProps) {}

  static create(props: OutfitProps): Outfit {
    invariant(props.garments.length > 0, 'OUTFIT_GARMENTS_REQUIRED', `Outfit ${props.code} lists no garments`);
    invariant(/^OF-\d{2}$/.test(props.code), 'OUTFIT_CODE_FORMAT', `Outfit code must look like OF-01: ${props.code}`);
    invariant(props.palette.length > 0, 'OUTFIT_PALETTE_REQUIRED', `Outfit ${props.code} needs a palette`);
    return new Outfit(props);
  }

  get id(): Slug {
    return this.props.id;
  }

  get code(): string {
    return this.props.code;
  }

  get name(): string {
    return this.props.name;
  }

  get occasion(): string {
    return this.props.occasion;
  }

  get summary(): string {
    return this.props.summary;
  }

  get canonical(): boolean {
    return this.props.canonical;
  }

  get image(): MediaAsset {
    return this.props.image;
  }

  get garments(): readonly Garment[] {
    return this.props.garments;
  }

  get palette(): readonly Swatch[] {
    return this.props.palette;
  }

  get source(): string {
    return this.props.source;
  }
}

/** The wardrobe must contain exactly one canonical outfit, listed first. */
export function orderWardrobe(outfits: readonly Outfit[]): Outfit[] {
  const canonical = outfits.filter((outfit) => outfit.canonical);
  invariant(canonical.length === 1, 'WARDROBE_CANONICAL', 'The wardrobe needs exactly one canonical outfit');
  return [...outfits].sort((a, b) => Number(b.canonical) - Number(a.canonical) || a.code.localeCompare(b.code));
}
