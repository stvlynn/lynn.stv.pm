import { invariant, type MediaAsset, type Rule } from '../shared';
import { formatTimecode, type VideoFormat } from './video-format';

export interface Costume {
  readonly id: string;
  readonly role: string;
  readonly garments: readonly string[];
}

export interface PipelineStep {
  readonly id: string;
  readonly title: string;
  readonly body: string;
}

export interface Still {
  readonly id: string;
  readonly atSeconds: number;
  readonly caption: string;
  readonly image: MediaAsset;
}

export interface PvGuideProps {
  readonly title: string;
  readonly titleNative: string;
  readonly credit: string;
  readonly summary: string;
  readonly format: VideoFormat;
  readonly identityLock: readonly string[];
  readonly costumes: readonly Costume[];
  readonly costumeSheet: MediaAsset;
  readonly rules: readonly Rule[];
  readonly pipeline: readonly PipelineStep[];
  readonly stills: readonly Still[];
  readonly excerpt: { readonly src: string; readonly poster: string };
}

/** Aggregate root: production rules for a Lynn music video. */
export class PvGuide {
  private constructor(private readonly props: PvGuideProps) {}

  static create(props: PvGuideProps): PvGuide {
    invariant(props.costumes.length >= 1, 'PV_COSTUME_REQUIRED', 'A PV locks at least one costume');
    for (const still of props.stills) {
      invariant(
        still.atSeconds <= props.format.durationSeconds,
        'PV_STILL_RANGE',
        `Still ${still.id} lies outside the runtime`,
      );
    }
    return new PvGuide(props);
  }

  get snapshot(): PvGuideProps {
    return this.props;
  }

  timecodeOf(still: Still): string {
    return formatTimecode(still.atSeconds, this.props.format.fps);
  }
}
