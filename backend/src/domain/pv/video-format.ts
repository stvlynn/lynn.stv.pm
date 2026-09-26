import { invariant } from '../shared';

/** Delivery format of a PV. Frame count must equal fps × duration. */
export class VideoFormat {
  private constructor(
    public readonly width: number,
    public readonly height: number,
    public readonly fps: number,
    public readonly durationSeconds: number,
    public readonly frames: number,
    public readonly audio: string,
  ) {}

  static of(props: {
    width: number;
    height: number;
    fps: number;
    durationSeconds: number;
    frames: number;
    audio: string;
  }): VideoFormat {
    invariant(props.fps > 0 && props.durationSeconds > 0, 'PV_FORMAT_RANGE', 'fps and duration must be positive');
    invariant(
      Math.round(props.fps * props.durationSeconds) === props.frames,
      'PV_FRAME_COUNT',
      `Frame count ${props.frames} does not match ${props.fps} fps × ${props.durationSeconds} s`,
    );
    invariant(props.width * 9 === props.height * 16, 'PV_ASPECT', 'A PV is delivered at 16:9');
    return new VideoFormat(props.width, props.height, props.fps, props.durationSeconds, props.frames, props.audio);
  }

  /** Runtime as m:ss. */
  get runtime(): string {
    return formatTimecode(this.durationSeconds);
  }
}

/** Formats seconds as m:ss, or m:ss.ff frames when fps is given. */
export function formatTimecode(seconds: number, fps?: number): string {
  invariant(seconds >= 0, 'PV_TIMECODE_NEGATIVE', 'Timecodes cannot be negative');
  const whole = Math.floor(seconds);
  const minutes = Math.floor(whole / 60);
  const rest = String(whole % 60).padStart(2, '0');
  if (fps === undefined) {
    return `${minutes}:${rest}`;
  }
  const frame = String(Math.round((seconds - whole) * fps)).padStart(2, '0');
  return `${minutes}:${rest}.${frame}`;
}
