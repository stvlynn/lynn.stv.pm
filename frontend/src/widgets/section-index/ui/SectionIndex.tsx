import { useCharacterProfile } from 'features/explore-character';
import { Link } from 'react-router';
import { navigation } from 'shared/config';
import { t } from 'shared/i18n';
import { Icon, Reveal, Section, Skeleton } from 'shared/ui';
import styles from './SectionIndex.module.css';

const sheets = navigation.filter((item) => item.id !== 'home');

/** The rest of the set as linked sheets, followed by the four principles. */
export function SectionIndex() {
  const profile = useCharacterProfile();
  return (
    <>
      <Section id="set" title={t('home.indexTitle')} code="LYN-00.1">
        <ul className={styles.grid}>
          {sheets.map((item, index) => (
            <Reveal as="li" key={item.id} index={index}>
              <Link to={item.to} className={styles.card}>
                <span className={styles.top}>
                  <span>{item.code}</span>
                  <span className={styles.arrow}>
                    <Icon name="arrowUpRight" />
                  </span>
                </span>
                <h3 className={styles.title}>{t(item.label)}</h3>
                <p className={styles.body}>{item.id === 'home' ? null : t(`home.sheets.${item.id}`)}</p>
              </Link>
            </Reveal>
          ))}
        </ul>
      </Section>
      <Section id="principles" title={t('home.pillarsTitle')} code="LYN-00.2">
        {profile.data ? (
          <ul className={styles.pillars}>
            {profile.data.pillars.map((pillar, index) => (
              <Reveal as="li" key={pillar.id} index={index} className={styles.pillar}>
                <h3 className={styles.pillarTitle}>{pillar.title}</h3>
                <p className={styles.pillarBody}>{pillar.body}</p>
              </Reveal>
            ))}
          </ul>
        ) : (
          <Skeleton height="8rem" />
        )}
      </Section>
    </>
  );
}
