import type { Trait } from '../model/types';

/** Groups traits by body part, preserving first-seen order. */
export function groupTraitsByPart(traits: readonly Trait[]): { part: string; traits: Trait[] }[] {
  const groups = new Map<string, Trait[]>();
  for (const trait of traits) {
    const group = groups.get(trait.part) ?? [];
    group.push(trait);
    groups.set(trait.part, group);
  }
  return [...groups].map(([part, items]) => ({ part, traits: items }));
}
