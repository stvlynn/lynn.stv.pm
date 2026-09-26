import type { PvSpecDto } from '@lynn/contracts';
import type { PvGuideRepository } from '../../domain/pv';
import { toMediaDto, toRuleDto } from '../shared';

export class GetPvSpec {
  constructor(private readonly guides: PvGuideRepository) {}

  async execute(): Promise<PvSpecDto> {
    const guide = await this.guides.get();
    const spec = guide.snapshot;
    return {
      title: spec.title,
      titleNative: spec.titleNative,
      credit: spec.credit,
      summary: spec.summary,
      format: {
        width: spec.format.width,
        height: spec.format.height,
        fps: spec.format.fps,
        durationSeconds: spec.format.durationSeconds,
        frames: spec.format.frames,
        audio: spec.format.audio,
        runtime: spec.format.runtime,
      },
      identityLock: [...spec.identityLock],
      costumes: spec.costumes.map((costume) => ({ ...costume, garments: [...costume.garments] })),
      costumeSheet: toMediaDto(spec.costumeSheet),
      rules: spec.rules.map(toRuleDto),
      pipeline: spec.pipeline.map((step) => ({ ...step })),
      stills: spec.stills.map((still) => ({
        id: still.id,
        timecode: guide.timecodeOf(still),
        caption: still.caption,
        image: toMediaDto(still.image),
      })),
      excerpt: { ...spec.excerpt },
    };
  }
}
