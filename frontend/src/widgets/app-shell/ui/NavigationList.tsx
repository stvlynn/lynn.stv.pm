import { motion } from 'motion/react';
import { NavLink } from 'react-router';
import { navigation } from 'shared/config';
import { t } from 'shared/i18n';
import { duration, ease } from 'shared/lib';
import styles from './Sidebar.module.css';

const groups = [
  { id: 'standard', label: null },
  { id: 'specs', label: 'nav.specs' },
] as const;

interface NavigationListProps {
  readonly layoutId: string;
  readonly onNavigate?: () => void;
}

export function NavigationList({ layoutId, onNavigate }: NavigationListProps) {
  return (
    <nav aria-label={t('nav.label')} className={styles.nav}>
      {groups.map((group) => (
        <div key={group.id}>
          {group.label ? <p className={styles.groupLabel}>{t(group.label)}</p> : null}
          <ul className={styles.list}>
            {navigation
              .filter((item) => item.group === group.id)
              .map((item) => (
                <li key={item.id}>
                  <NavLink to={item.to} end className={styles.link} onClick={onNavigate}>
                    {({ isActive }) => (
                      <>
                        {isActive ? (
                          <motion.span
                            layoutId={layoutId}
                            className={styles.indicator}
                            transition={{ duration: duration.base, ease: ease.out }}
                          />
                        ) : null}
                        <span className={styles.linkLabel}>{t(item.label)}</span>
                        <span className={styles.code}>{item.code}</span>
                      </>
                    )}
                  </NavLink>
                </li>
              ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}
