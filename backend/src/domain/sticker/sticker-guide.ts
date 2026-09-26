import { DomainError, invariant, type Rule, type Swatch } from '../shared';

export interface Channel {
  readonly name: string;
  readonly url: string;
}

export interface StickerCanvas {
  readonly width: number;
  readonly height: number;
  readonly format: string;
  readonly background: Swatch;
  readonly outline: string;
  /** Inset in pixels that text and limbs must stay inside. */
  readonly safeArea: number;
}

export interface StickerGuideProps {
  readonly summary: string;
  readonly canvas: StickerCanvas;
  readonly rules: readonly Rule[];
  readonly promptTemplate: string;
  readonly promptExample: { readonly text: string; readonly action: string };
  readonly license: string;
  readonly channels: readonly Channel[];
}

export const PROMPT_TEXT_SLOT = '{text}';
export const PROMPT_ACTION_SLOT = '{action}';
export const MAX_CAPTION_LENGTH = 12;

/** Aggregate root: how a Lynn sticker is drawn, captioned and published. */
export class StickerGuide {
  private constructor(private readonly props: StickerGuideProps) {}

  static create(props: StickerGuideProps): StickerGuide {
    const { canvas } = props;
    invariant(canvas.width === canvas.height, 'STICKER_CANVAS_SQUARE', 'The sticker canvas must be square');
    invariant(canvas.width >= 512, 'STICKER_CANVAS_SIZE', 'The sticker canvas must be at least 512px');
    invariant(
      canvas.safeArea > 0 && canvas.safeArea * 2 < canvas.width,
      'STICKER_SAFE_AREA',
      'The safe area must leave drawable space',
    );
    invariant(
      props.promptTemplate.includes(PROMPT_TEXT_SLOT) && props.promptTemplate.includes(PROMPT_ACTION_SLOT),
      'STICKER_PROMPT_SLOTS',
      'The prompt template must contain {text} and {action}',
    );
    return new StickerGuide(props);
  }

  get snapshot(): StickerGuideProps {
    return this.props;
  }

  /** Fills the generation prompt for one sticker. */
  composePrompt(text: string, action: string): string {
    const caption = text.trim();
    const pose = action.trim();
    if (caption.length === 0 || pose.length === 0) {
      throw new DomainError('STICKER_PROMPT_EMPTY', 'A sticker needs both a caption and an action');
    }
    if ([...caption].length > MAX_CAPTION_LENGTH) {
      throw new DomainError(
        'STICKER_CAPTION_TOO_LONG',
        `A caption holds at most ${MAX_CAPTION_LENGTH} characters so it stays legible at 128px`,
      );
    }
    return this.props.promptTemplate.replace(PROMPT_TEXT_SLOT, caption).replace(PROMPT_ACTION_SLOT, pose);
  }

  examplePrompt(): string {
    return this.composePrompt(this.props.promptExample.text, this.props.promptExample.action);
  }
}
