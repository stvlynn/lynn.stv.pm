export const paths = {
  home: '/',
  character: '/character',
  wardrobe: '/wardrobe',
  gallery: '/gallery',
  ui: '/specs/ui',
  sticker: '/specs/stickers',
  pv: '/specs/pv',
} as const;

export type SectionId = Exclude<keyof typeof paths, 'home'>;
