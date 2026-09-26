import type { CharacterProfile } from 'entities/character';
import { t } from 'shared/i18n';

/** Build from the current profile so the drawing instructions cannot drift from it. */
export function composeCharacterPrompt(profile: CharacterProfile): string {
  const values: Record<string, string> = {
    name: profile.name,
    tagline: profile.tagline,
    traits: profile.traits.map((trait) => `- ${trait.label}: ${trait.detail}`).join('\n'),
    proportion: `${profile.proportion.headsTall} ${t('blueprint.heads')}. ${profile.proportion.note}`,
    palette: profile.palette.map((swatch) => `- ${swatch.label}: ${swatch.hex}`).join('\n'),
    principles: profile.pillars.map((pillar) => `- ${pillar.title}: ${pillar.body}`).join('\n'),
    restrictions: profile.doNot.map((rule) => `- ${rule}`).join('\n'),
  };
  return t('character.promptTemplate', values);
}
