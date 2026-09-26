import type { CharacterProfile as Profile } from 'entities/character';
import { t } from 'shared/i18n';
import { FigureDrawing, Icon, Reveal, Section, Swatch, TiltCard } from 'shared/ui';
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

export function CharacterProportion({ profile }: { readonly profile: Profile }) {
  return (
    <Section id="proportion" title={t('character.proportion')} code="CHR-01.5">
      <div className={styles.proportion}>
        <div className={styles.proportionDrawing}>
          <FigureDrawing
            label={t('blueprint.figureLabel')}
            dimensions={{
              unit: t('blueprint.headUnit'),
              centerline: t('blueprint.centerline'),
              heads: t('blueprint.heads'),
            }}
          />
        </div>
        <Reveal>
          <p className={styles.proportionValue}>
            {profile.proportion.headsTall} {t('blueprint.heads')}
          </p>
          <p className={styles.proportionNote}>{profile.proportion.note}</p>
        </Reveal>
      </div>
    </Section>
  );
}

export function CharacterReference({ profile }: { readonly profile: Profile }) {
  const sheet = profile.referenceSheet;
  return (
    <Section id="reference" title={t('character.reference')} code="CHR-01.6">
      <div className={styles.reference}>
        <TiltCard max={7} className={styles.referenceFrame}>
          <img
            src={sheet.src}
            alt={sheet.alt}
            width={sheet.width}
            height={sheet.height}
            loading="lazy"
            decoding="async"
            className={styles.referenceImage}
          />
        </TiltCard>
        <div>
          <h3 className={styles.role}>{t('character.doNot')}</h3>
          <ul className={styles.never}>
            {profile.doNot.map((rule, index) => (
              <Reveal as="li" key={rule} index={index} className={styles.neverItem}>
                <span className={styles.cross}>
                  <Icon name="cross" size={12} />
                </span>
                <span>{rule}</span>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
