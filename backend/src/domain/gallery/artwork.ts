import { invariant, type MediaAsset, type Orientation, type Slug, type Swatch } from '../shared';

export interface ArtworkProps {
  readonly id: Slug;
  readonly code: string;
  readonly title: string;
  readonly caption: string;
  readonly mood: string;
  readonly image: MediaAsset;
  readonly palette: readonly Swatch[];
  readonly motifs: readonly string[];
}

/** A finished illustration in the official art book. */
export class Artwork {
  private constructor(private readonly props: ArtworkProps) {}

  static create(props: ArtworkProps): Artwork {
    invariant(/^AR-\d{2}$/.test(props.code), 'ARTWORK_CODE_FORMAT', `Artwork code must look like AR-01: ${props.code}`);
    invariant(
      props.palette.length >= 3 && props.palette.length <= 6,
      'ARTWORK_PALETTE_SIZE',
      `Artwork ${props.code} palette must hold 3 to 6 swatches`,
    );
    return new Artwork(props);
  }

  get id(): Slug {
    return this.props.id;
  }

  get code(): string {
    return this.props.code;
  }

  get title(): string {
    return this.props.title;
  }

  get caption(): string {
    return this.props.caption;
  }

  get mood(): string {
    return this.props.mood;
  }

  get image(): MediaAsset {
    return this.props.image;
  }

  get palette(): readonly Swatch[] {
    return this.props.palette;
  }

  get motifs(): readonly string[] {
    return this.props.motifs;
  }

  get orientation(): Orientation {
    return this.props.image.orientation;
  }
}
