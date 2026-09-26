import { paths } from './routes.ts';

export const site = {
  origin: 'https://lynn.stv.pm',
  name: 'Lynn · Character Standard',
  creator: '@stv_lynn',
  image: '/media/social/lynn-standard.png',
  imageAlt: 'Lynn in her navy sailor uniform, beside the Lynn Character Standard wordmark.',
  imageWidth: 1200,
  imageHeight: 630,
} as const;

export const pageMetadata: Record<string, { title: string; description: string }> = {
  [paths.home]: {
    title: site.name,
    description:
      'Lynn — the character standard: identity, wardrobe, art book, and the UI, sticker and PV specifications.',
  },
  [paths.character]: {
    title: 'Character · Lynn',
    description:
      'The identity traits, proportions, palette and drawing principles that define Lynn, with an annotated character turnaround.',
  },
  [paths.wardrobe]: {
    title: 'Wardrobe · Lynn',
    description:
      'Six sanctioned outfits for Lynn: the canonical sailor uniform and five alternate looks, with garment and color references.',
  },
  [paths.gallery]: {
    title: 'Art book · Lynn',
    description: 'Finished illustrations of Lynn, collected in an art book with full-size artwork views.',
  },
  [paths.ui]: {
    title: 'UI specification · Lynn',
    description:
      'The live Lynn design system: color tokens, contrast, typography, spacing, motion and interface components.',
  },
  [paths.sticker]: {
    title: 'Sticker specification · Lynn',
    description:
      'The Lynn sticker collection, canvas and safe-area rules, and a prompt composer for consistent character stickers.',
  },
  [paths.pv]: {
    title: 'PV specification · Lynn',
    description:
      'Lynn animation production standards: delivery format, character and costume rules, pipeline and Trick Heart stills.',
  },
};

export function getPageMetadata(pathname: string) {
  const path = pathname.replace(/\/+$/, '') || '/';
  const page = Object.hasOwn(pageMetadata, path) ? pageMetadata[path] : undefined;
  const title = page?.title ?? 'No such sheet · Lynn';
  const description = page?.description ?? 'The requested sheet is not part of the Lynn character standard.';
  return {
    title,
    canonical: new URL(path, site.origin).href,
    meta: {
      description: description,
      'og:type': 'website',
      'og:site_name': site.name,
      'og:title': title,
      'og:description': description,
      'og:url': new URL(path, site.origin).href,
      'og:locale': 'en_US',
      'og:image': new URL(site.image, site.origin).href,
      'og:image:type': 'image/png',
      'og:image:width': String(site.imageWidth),
      'og:image:height': String(site.imageHeight),
      'og:image:alt': site.imageAlt,
      'twitter:card': 'summary_large_image',
      'twitter:site': site.creator,
      'twitter:creator': site.creator,
      'twitter:title': title,
      'twitter:description': description,
      'twitter:image': new URL(site.image, site.origin).href,
      'twitter:image:alt': site.imageAlt,
      robots: page ? 'index, follow' : 'noindex, follow',
    },
  };
}
