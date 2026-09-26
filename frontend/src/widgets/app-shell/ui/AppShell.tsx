import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useRef } from 'react';
import { useLocation, useOutlet } from 'react-router';
import { t } from 'shared/i18n';
import { duration, ease } from 'shared/lib';
import styles from './AppShell.module.css';
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
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
      <DrawingFrame />
    </div>
  );
}
