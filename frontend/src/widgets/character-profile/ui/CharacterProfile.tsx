import type { CharacterProfile as Profile } from 'entities/character';
import { t } from 'shared/i18n';
import { CharacterPrompt } from 'features/copy-character-prompt';
import { Reveal, Section, Swatch } from 'shared/ui';
import styles from './CharacterProfile.module.css';

export function CharacterOverview({ profile }: { readonly profile: Profile }) {
  return (
    <Section id="specification" title={t('character.facts')} code="CHR-01.1">
      <div className={styles.overview}>
        <Reveal>
          <dl className={styles.facts}>
            {profile.facts.map((fact) => (
              <div key={fact.label} className={styles.factRow}>
                <dt>{fact.label}</dt>
                <dd>{fact.value}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
        <Reveal index={1}>
          <ul className={styles.credits} aria-label={t('character.credits')}>
            {profile.credits.map((credit) => (
              <li key={credit.role} className={styles.credit}>
                <span className={styles.role}>{credit.role}</span>
                {credit.url ? (
                  <a href={credit.url} target="_blank" rel="noreferrer">
                    {credit.name}
                  </a>
                ) : (
                  <span>{credit.name}</span>
                )}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </Section>
  );
}

export function CharacterPrinciples({ profile }: { readonly profile: Profile }) {
  return (
    <Section id="principles" title={t('character.pillars')} code="CHR-01.2">
      <div className={styles.pillars}>
        {profile.pillars.map((pillar, index) => (
          <Reveal key={pillar.id} index={index} className={styles.pillar}>
            <h3>{pillar.title}</h3>
            <p>{pillar.body}</p>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

export function CharacterPalette({ profile }: { readonly profile: Profile }) {
  return (
    <Section id="palette" title={t('character.palette')} code="CHR-01.4">
      <div className={styles.palette}>
        {profile.palette.map((swatch, index) => (
          <Reveal key={swatch.label} index={index}>
            <Swatch color={swatch.hex} label={swatch.label} value={swatch.token ?? swatch.hex} copyable />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

export function CharacterDrawingPrompt({ profile }: { readonly profile: Profile }) {
  return (
    <Section id="drawing-prompt" title={t('character.prompt')} code="CHR-01.5">
      <CharacterPrompt profile={profile} />
    </Section>
  );
}
