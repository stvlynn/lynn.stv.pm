import type { ComposeStickerPromptResponse, StickerSpecDto } from '@lynn/contracts';
import { MAX_CAPTION_LENGTH, type StickerGuideRepository, type StickerRepository } from '../../domain/sticker';
import { toMediaDto, toRuleDto, toSwatchDto } from '../shared';

export class GetStickerSpec {
  constructor(
    private readonly guides: StickerGuideRepository,
    private readonly stickers: StickerRepository,
  ) {}

  async execute(): Promise<StickerSpecDto> {
    const [guide, stickers] = await Promise.all([this.guides.get(), this.stickers.list()]);
    const spec = guide.snapshot;
    return {
      summary: spec.summary,
      canvas: {
        width: spec.canvas.width,
        height: spec.canvas.height,
        format: spec.canvas.format,
        background: toSwatchDto(spec.canvas.background),
        outline: spec.canvas.outline,
        safeArea: spec.canvas.safeArea,
      },
      rules: spec.rules.map(toRuleDto),
      promptTemplate: spec.promptTemplate,
      promptExample: guide.examplePrompt(),
      promptExampleInput: { ...spec.promptExample },
      maxCaptionLength: MAX_CAPTION_LENGTH,
      license: spec.license,
      channels: spec.channels.map((channel) => ({ ...channel })),
      stickers: stickers.map((sticker) => ({
        id: sticker.id.value,
        title: sticker.title,
        kind: sticker.kind,
        image: toMediaDto(sticker.image),
      })),
    };
  }
}

export interface ComposeStickerPromptCommand {
  readonly text: string;
  readonly action: string;
}

export class ComposeStickerPrompt {
  constructor(private readonly guides: StickerGuideRepository) {}

  async execute(command: ComposeStickerPromptCommand): Promise<ComposeStickerPromptResponse> {
    const guide = await this.guides.get();
    return { prompt: guide.composePrompt(command.text, command.action) };
  }
}
