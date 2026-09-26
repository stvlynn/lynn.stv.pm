import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useRef } from 'react';
import { useLocation, useOutlet } from 'react-router';
import { t } from 'shared/i18n';
import { getPageMetadata } from 'shared/config';
import { duration, ease } from 'shared/lib';
import styles from './AppShell.module.css';
import { AppFooter } from './AppFooter';
import { DrawingFrame } from './DrawingFrame';
import { MobileBar } from './MobileBar';
import { Sidebar } from './Sidebar';

const MAIN_ID = 'main';

/** Viewport-filling layout. Only `main` scrolls; pages cross-fade between routes. */
export function AppShell() {
  const location = useLocation();
  const outlet = useOutlet();
  const main = useRef<HTMLElement>(null);

  useEffect(() => {
    const metadata = getPageMetadata(location.pathname);
    document.title = metadata.title;
    document.querySelector('link[data-seo][rel="canonical"]')?.setAttribute('href', metadata.canonical);
    for (const [key, value] of Object.entries(metadata.meta)) {
      const attribute = key.startsWith('og:') ? 'property' : 'name';
      document.querySelector(`meta[data-seo][${attribute}="${key}"]`)?.setAttribute('content', value);
    }
  }, [location.pathname]);

  useEffect(() => {
    main.current?.scrollTo({ top: 0, behavior: 'instant' });
  }, [location.pathname]);

  return (
    <div className={styles.shell}>
      <a href={`#${MAIN_ID}`} className={styles.skip}>
        {t('nav.skip')}
      </a>
      <Sidebar />
      <div className={styles.column}>
        <MobileBar />
        <main id={MAIN_ID} ref={main} tabIndex={-1} className={styles.main}>
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              className={styles.page}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0, transition: { duration: duration.slow, ease: ease.out } }}
              exit={{ opacity: 0, y: -8, transition: { duration: duration.quick, ease: ease.inOut } }}
            >
              {outlet}
              <AppFooter />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
      <DrawingFrame />
    </div>
  );
}
