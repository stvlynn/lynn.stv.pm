import { describe, expect, it } from 'vitest';
import { t } from './translate';

describe('t', () => {
  it('reads nested keys', () => {
    expect(t('nav.character')).toBe('Character');
  });

  it('fills placeholders', () => {
    expect(t('sticker.composerCount', { count: 3, max: 12 })).toBe('3 / 12');
  });
});
