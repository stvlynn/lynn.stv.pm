import { describe, expect, it } from 'vitest';
import { DomainError, Swatch } from '../shared';
import { StickerGuide, type StickerGuideProps } from './sticker-guide';

const props: StickerGuideProps = {
  summary: 'Chibi Lynn',
  canvas: {
    width: 512,
    height: 512,
    format: 'PNG',
    background: Swatch.of('Field', '#f0f0f0'),
    outline: 'White',
    safeArea: 24,
  },
  rules: [],
  promptTemplate: 'Caption "{text}", pose {action}.',
  promptExample: { text: '干饭', action: 'eating happily' },
  license: 'CC BY 4.0',
  channels: [],
};

describe('StickerGuide', () => {
  it('fills both prompt slots', () => {
    expect(StickerGuide.create(props).composePrompt(' 摸鱼 ', 'napping')).toBe('Caption "摸鱼", pose napping.');
  });

  it('counts caption length in characters, not bytes', () => {
    const guide = StickerGuide.create(props);
    expect(() => guide.composePrompt('一二三四五六七八九十一二', 'waving')).not.toThrow();
    expect(() => guide.composePrompt('一二三四五六七八九十一二三', 'waving')).toThrow(DomainError);
  });

  it('rejects empty input', () => {
    expect(() => StickerGuide.create(props).composePrompt('', 'waving')).toThrow(DomainError);
  });

  it('requires a square canvas and both template slots', () => {
    expect(() => StickerGuide.create({ ...props, canvas: { ...props.canvas, height: 256 } })).toThrow(DomainError);
    expect(() => StickerGuide.create({ ...props, promptTemplate: 'No slots' })).toThrow(DomainError);
  });
});
