import { invariant } from './domain-error';

export type Orientation = 'portrait' | 'landscape' | 'square';

/** A published image or video under the site's `/media/` root. */
export class MediaAsset {
  private constructor(
    public readonly src: string,
    public readonly width: number,
    public readonly height: number,
    public readonly alt: string,
  ) {}

  static of(props: { src: string; width: number; height: number; alt: string }): MediaAsset {
    invariant(props.src.startsWith('/media/'), 'INVALID_MEDIA', `Media must live under /media/: ${props.src}`);
    invariant(
      Number.isInteger(props.width) && Number.isInteger(props.height) && props.width > 0 && props.height > 0,
      'INVALID_MEDIA',
      `Media dimensions must be positive integers: ${props.src}`,
    );
    invariant(props.alt.trim().length > 0, 'INVALID_MEDIA', `Media needs alt text: ${props.src}`);
    return new MediaAsset(props.src, props.width, props.height, props.alt);
  }

  get orientation(): Orientation {
    const ratio = this.width / this.height;
    if (ratio > 1.05) return 'landscape';
    if (ratio < 0.95) return 'portrait';
    return 'square';
  }
}
