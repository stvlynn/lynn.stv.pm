import { describe, expect, it } from 'vitest';
import { DomainError } from '../shared';
import { formatTimecode, VideoFormat } from './video-format';

const delivery = { width: 1920, height: 1080, fps: 24, durationSeconds: 157, frames: 3768, audio: 'AAC' };

describe('VideoFormat', () => {
  it('accepts a frame count equal to fps × duration', () => {
    expect(VideoFormat.of(delivery).runtime).toBe('2:37');
  });

  it('rejects a frame count that does not match the runtime', () => {
    expect(() => VideoFormat.of({ ...delivery, frames: 3767 })).toThrow(DomainError);
  });

  it('rejects non-16:9 deliveries', () => {
    expect(() => VideoFormat.of({ ...delivery, height: 1200 })).toThrow(DomainError);
  });
});

describe('formatTimecode', () => {
  it('formats minutes, seconds and frames', () => {
    expect(formatTimecode(62)).toBe('1:02');
    expect(formatTimecode(18.5, 24)).toBe('0:18.12');
  });
});
