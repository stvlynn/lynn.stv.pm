import { ThemeToggle } from 'features/switch-theme';
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router';
import { paths } from 'shared/config';
import { t } from 'shared/i18n';
import { Button, Drawer, Icon } from 'shared/ui';
import styles from './MobileBar.module.css';
import { NavigationList } from './NavigationList';

/** Compact header with the section list in a beUI drawer. */
export function MobileBar() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => setOpen(false), [pathname]);

  return (
    <>
      <header className={styles.bar}>
        <Link to={paths.home} className={styles.brand}>
          {t('brand.wordmark')}
        </Link>
        <div className={styles.actions}>
          <ThemeToggle />
          <Button
            variant="ghost"
            size="small"
            iconOnly
            aria-label={t('nav.open')}
            aria-expanded={open}
            onClick={() => setOpen(true)}
          >
            <Icon name="menu" />
          </Button>
        </div>
      </header>
      <Drawer open={open} onOpenChange={setOpen} side="left" ariaLabel={t('nav.label')} className={styles.sheet}>
        <Button
          variant="ghost"
          size="small"
          iconOnly
          className={styles.close}
          aria-label={t('nav.close')}
          onClick={() => setOpen(false)}
        >
          <Icon name="close" />
        </Button>
        <NavigationList layoutId="mobile-indicator" onNavigate={() => setOpen(false)} />
      </Drawer>
    </>
  );
}
