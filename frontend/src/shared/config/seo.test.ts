import { describe, expect, it } from 'vitest';
import { paths } from './routes';
import { getPageMetadata, pageMetadata, site } from './seo';

describe('page metadata', () => {
  it('covers every public route with distinct titles and absolute share URLs', () => {
    expect(Object.keys(pageMetadata).sort()).toEqual(Object.values(paths).sort());
    const titles = new Set<string>();
    for (const path of Object.values(paths)) {
      const metadata = getPageMetadata(path);
      titles.add(metadata.title);
      expect(metadata.canonical).toBe(new URL(path, site.origin).href);
      expect(metadata.meta['og:url']).toBe(metadata.canonical);
      expect(metadata.meta['twitter:title']).toBe(metadata.title);
      expect(metadata.meta['og:image']).toBe('https://lynn.stv.pm/media/social/lynn-standard.png');
      expect(metadata.meta['og:image:alt']).not.toBe('');
    }
    expect(titles.size).toBe(Object.values(paths).length);
  });

  it('normalizes trailing slashes and marks unknown routes as non-indexable', () => {
    expect(getPageMetadata('/character/')).toEqual(getPageMetadata('/character'));
    expect(getPageMetadata('/missing').meta.robots).toBe('noindex, follow');
    expect(getPageMetadata('/constructor').meta.robots).toBe('noindex, follow');
  });
});
