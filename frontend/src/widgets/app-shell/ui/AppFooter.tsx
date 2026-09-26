import { t } from 'shared/i18n';
import { Icon } from 'shared/ui';
import styles from './AppFooter.module.css';

const links = {
  github: 'https://github.com/stvlynn/lynn.stv.pm',
  sticker: 'https://sticker.stv.pm',
  home: 'https://stv.pm',
  twitter: 'https://x.com/stv_lynn',
} as const;

export function AppFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.primary}>
          <div>
            <p className={styles.eyebrow}>{t('footer.eyebrow')}</p>
            <h2 className={styles.title}>{t('footer.title')}</h2>
          </div>
          <a className={styles.github} href={links.github} target="_blank" rel="noopener noreferrer">
            {t('footer.github')}
            <Icon name="arrowUpRight" />
          </a>
        </div>
        <div className={styles.secondary}>
          <nav aria-label={t('footer.friends')} className={styles.linkGroup}>
            <span className={styles.label}>{t('footer.friends')}</span>
            <a href={links.sticker} target="_blank" rel="noopener noreferrer">
              {t('footer.sticker')}
            </a>
            <a href={links.home} target="_blank" rel="noopener noreferrer">
              {t('footer.home')}
            </a>
          </nav>
          <nav aria-label={t('footer.social')} className={styles.linkGroup}>
            <span className={styles.label}>{t('footer.social')}</span>
            <a href={links.twitter} target="_blank" rel="noopener noreferrer">
              {t('footer.twitter')}
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
}
