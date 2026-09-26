import { ThemeToggle } from 'features/switch-theme';
import { Link } from 'react-router';
import { paths } from 'shared/config';
import { t } from 'shared/i18n';
import { NavigationList } from './NavigationList';
import styles from './Sidebar.module.css';

export function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <Link to={paths.home} className={styles.brand}>
        <span className={styles.wordmark}>{t('brand.wordmark')}</span>
        <span className={styles.standard}>{t('brand.standard')}</span>
      </Link>
      <NavigationList />
      <div className={styles.footer}>
        <ThemeToggle />
      </div>
    </aside>
  );
}
