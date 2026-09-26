import type { Plugin } from 'vite';
import { getPageMetadata, pageMetadata } from './src/shared/config/seo.ts';

const escapeHtml = (value: string) => value.replace(/[&<>"']/g, (character) => `&#${character.charCodeAt(0)};`);

export function renderMetadata(path: string): string {
  const { title, canonical, meta } = getPageMetadata(path);
  return [
    `<title>${escapeHtml(title)}</title>`,
    `<link rel="canonical" href="${escapeHtml(canonical)}" data-seo />`,
    ...Object.entries(meta).map(
      ([key, value]) =>
        `<meta ${key.startsWith('og:') ? 'property' : 'name'}="${key}" content="${escapeHtml(value)}" data-seo />`,
    ),
  ].join('\n');
}

/** Emit crawler-readable HTML for each public route, using the built SPA entry. */
export function seoPlugin(): Plugin {
  return {
    name: 'lynn-seo',
    enforce: 'post',
    transformIndexHtml(html, context) {
      const path = new URL(context.originalUrl ?? '/', 'http://localhost').pathname;
      return html.replace('<!-- page-metadata -->', `<!-- seo:start -->${renderMetadata(path)}<!-- seo:end -->`);
    },
    generateBundle(_options, bundle) {
      const entry = bundle['index.html'];
      if (!entry || entry.type !== 'asset' || typeof entry.source !== 'string') {
        throw new Error('The built SPA entry is required to emit page metadata.');
      }
      for (const path of Object.keys(pageMetadata)) {
        if (path === '/') continue;
        this.emitFile({
          type: 'asset',
          fileName: `${path.slice(1)}/index.html`,
          source: entry.source.replace(/<!-- seo:start -->[\s\S]*?<!-- seo:end -->/, renderMetadata(path)),
        });
      }
    },
  };
}
