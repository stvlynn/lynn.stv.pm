import type { Trait } from '../model/types';
import type { CalloutInput } from 'shared/ui';

/** Numbers each trait like a drawing balloon: "01 · Headwear". */
export const toCallouts = (traits: readonly Trait[]): CalloutInput[] =>
  traits.map((trait, index) => ({
    id: trait.id,
    code: `${String(index + 1).padStart(2, '0')} · ${trait.part}`,
    label: trait.label,
  }));
