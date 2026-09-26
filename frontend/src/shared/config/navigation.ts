import type { MessageKey } from '../i18n';
import { paths, type SectionId } from './routes';

export interface NavigationItem {
  readonly id: SectionId | 'home';
  readonly to: string;
  readonly label: MessageKey;
  /** Drawing number printed beside the label. */
  readonly code: string;
  readonly group: 'standard' | 'specs';
}

export const navigation: readonly NavigationItem[] = [
  { id: 'home', to: paths.home, label: 'nav.home', code: 'LYN-00', group: 'standard' },
  { id: 'character', to: paths.character, label: 'nav.character', code: 'CHR-01', group: 'standard' },
  { id: 'wardrobe', to: paths.wardrobe, label: 'nav.wardrobe', code: 'WRD-02', group: 'standard' },
  { id: 'gallery', to: paths.gallery, label: 'nav.gallery', code: 'ART-03', group: 'standard' },
  { id: 'ui', to: paths.ui, label: 'nav.ui', code: 'SPC-04', group: 'specs' },
  { id: 'sticker', to: paths.sticker, label: 'nav.sticker', code: 'SPC-05', group: 'specs' },
  { id: 'pv', to: paths.pv, label: 'nav.pv', code: 'SPC-06', group: 'specs' },
];
