import { PvGuide, type PvGuideRepository, VideoFormat } from '../../domain/pv';
import { pvGuideContent } from '../content/pv.content';
import { toMedia } from './content-mapping';

export class InMemoryPvGuideRepository implements PvGuideRepository {
  private readonly guide = PvGuide.create({
    ...pvGuideContent,
    format: VideoFormat.of({ ...pvGuideContent.format }),
    identityLock: [...pvGuideContent.identityLock],
    costumes: pvGuideContent.costumes.map((costume) => ({ ...costume, garments: [...costume.garments] })),
    costumeSheet: toMedia(pvGuideContent.costumeSheet),
    rules: pvGuideContent.rules.map((rule) => ({ ...rule })),
    pipeline: pvGuideContent.pipeline.map((step) => ({ ...step })),
    stills: pvGuideContent.stills.map((still) => ({ ...still, image: toMedia(still.image) })),
    excerpt: { ...pvGuideContent.excerpt },
  });

  async get(): Promise<PvGuide> {
    return this.guide;
  }
}
