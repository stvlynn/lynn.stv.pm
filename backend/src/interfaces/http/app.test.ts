import type {
  ApiEnvelope,
  CharacterProfileDto,
  OutfitDto,
  PvSpecDto,
  StickerSpecDto,
  UiSpecDto,
} from '@lynn/contracts';
import { describe, expect, it } from 'vitest';
import { buildDependencies } from '../../composition';
import { MemoryLogger } from '../../infrastructure/logging/logger';
import { createApp } from './app';

const logger = new MemoryLogger();
const app = createApp(buildDependencies(undefined, logger));

async function getJson<T>(path: string, init?: RequestInit): Promise<{ status: number; body: ApiEnvelope<T> }> {
  const response = await app.request(path, init);
  return { status: response.status, body: (await response.json()) as ApiEnvelope<T> };
}

describe('content API', () => {
  it('serves the character profile with every blueprint trait', async () => {
    const { status, body } = await getJson<CharacterProfileDto>('/api/v1/character');
    expect(status).toBe(200);
    expect(body.success).toBe(true);
    const ids = body.data?.traits.map((trait) => trait.id) ?? [];
    expect(ids).toEqual(expect.arrayContaining(['beret', 'ribbon', 'glasses', 'bow', 'clasps', 'loafers']));
  });

  it('resolves token-bound swatches from the token package', async () => {
    const { body } = await getJson<CharacterProfileDto>('/api/v1/character');
    const ribbon = body.data?.palette.find((swatch) => swatch.token === '--lynn-ribbon');
    expect(ribbon?.hex).toBe('#2e5fa8');
  });

  it('lists the canonical outfit first', async () => {
    const { body } = await getJson<OutfitDto[]>('/api/v1/outfits');
    expect(body.data?.[0]?.canonical).toBe(true);
    expect(body.data).toHaveLength(6);
  });

  it('returns 404 in the envelope for an unknown outfit', async () => {
    const { status, body } = await getJson<OutfitDto>('/api/v1/outfits/ball-gown');
    expect(status).toBe(404);
    expect(body.error?.code).toBe('OUTFIT_NOT_FOUND');
  });

  it('returns 400 for a malformed id', async () => {
    const { status, body } = await getJson<OutfitDto>('/api/v1/outfits/Not%20A%20Slug');
    expect(status).toBe(400);
    expect(body.error?.code).toBe('VALIDATION_FAILED');
  });

  it('reports contrast for both themes, with body text passing AA', async () => {
    const { body } = await getJson<UiSpecDto>('/api/v1/specs/ui');
    const checks = body.data?.contrast ?? [];
    expect(checks.filter((check) => check.theme === 'dark')).toHaveLength(checks.length / 2);
    for (const check of checks.filter((candidate) => candidate.foreground === 'text')) {
      expect(check.ratio).toBeGreaterThanOrEqual(4.5);
    }
  });

  it('serves the sticker spec with a filled example prompt', async () => {
    const { body } = await getJson<StickerSpecDto>('/api/v1/specs/sticker');
    expect(body.data?.promptExample).toContain('干饭');
    expect(body.data?.stickers.length).toBeGreaterThan(50);
  });

  it('composes a sticker prompt and rejects an overlong caption', async () => {
    const post = (payload: unknown) =>
      getJson<{ prompt: string }>('/api/v1/specs/sticker/prompts', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload),
      });
    const created = await post({ text: '摸鱼', action: '趴在桌上' });
    expect(created.status).toBe(201);
    expect(created.body.data?.prompt).toContain('摸鱼');
    const rejected = await post({ text: '这是一个非常非常非常长的标题', action: '挥手' });
    expect(rejected.status).toBe(422);
    expect(rejected.body.error?.code).toBe('STICKER_CAPTION_TOO_LONG');
    const invalid = await post({ text: '' });
    expect(invalid.status).toBe(400);
  });

  it('formats PV still timecodes in frames', async () => {
    const { body } = await getJson<PvSpecDto>('/api/v1/specs/pv');
    expect(body.data?.format.frames).toBe(3768);
    expect(body.data?.stills[0]?.timecode).toBe('0:12.00');
  });

  it('answers unknown API routes with the envelope', async () => {
    const { status, body } = await getJson<never>('/api/v1/nothing');
    expect(status).toBe(404);
    expect(body.success).toBe(false);
  });

  it('echoes a valid correlation id and logs the request', async () => {
    const response = await app.request('/health', { headers: { 'x-request-id': 'test-request-0001' } });
    expect(response.headers.get('x-request-id')).toBe('test-request-0001');
    expect(logger.entries.some((entry) => entry.fields.requestId === 'test-request-0001')).toBe(true);
  });
});
