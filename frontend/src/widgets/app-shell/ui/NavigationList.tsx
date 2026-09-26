import { NavLink } from 'react-router';
import { navigation } from 'shared/config';
import { t } from 'shared/i18n';
import { SharedLayoutBg } from 'shared/ui';
import styles from './Sidebar.module.css';

const groups = [
  { id: 'standard', label: null },
  { id: 'specs', label: 'nav.specs' },
] as const;

interface NavigationListProps {
  readonly onNavigate?: () => void;
}

export function NavigationList({ onNavigate }: NavigationListProps) {
  return (
    <nav aria-label={t('nav.label')} className={styles.nav}>
      {groups.map((group) => (
        <div key={group.id}>
          {group.label ? <p className={styles.groupLabel}>{t(group.label)}</p> : null}
          <SharedLayoutBg
            as="ul"
            inset={0}
            pillClassName="rounded-[var(--radius-xl)] bg-muted/70"
            pillContainerClassName="inset-y-auto top-0 h-9"
            className={styles.list}
          >
            {navigation
              .filter((item) => item.group === group.id)
              .map((item) => (
                <li key={item.id}>
                  <NavLink to={item.to} end className={styles.link} onClick={onNavigate}>
                    <span>{t(item.label)}</span>
                    <span className={styles.code}>{item.code}</span>
                  </NavLink>
                </li>
              ))}
          </SharedLayoutBg>
        </div>
      ))}
    </nav>
  );
}
