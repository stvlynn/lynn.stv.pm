import type { RuleDto } from '@lynn/contracts';
import { t } from '../../i18n';
import { cn } from '../../lib';
import { Icon, type IconName } from '../Icon';
import { Reveal } from '../Reveal';
import styles from './RuleList.module.css';

const marks: Record<RuleDto['verdict'], IconName> = { do: 'check', dont: 'cross', note: 'dot' };

/** Do / don't / note cards used by every specification sheet. */
export function RuleList({ rules }: { readonly rules: readonly RuleDto[] }) {
  return (
    <ul className={styles.list}>
      {rules.map((rule, index) => (
        <Reveal as="li" key={rule.id} index={index % 3}>
          <article className={cn(styles.rule, styles[rule.verdict])}>
            <span className={styles.verdict}>
              <span className={styles.mark}>
                <Icon name={marks[rule.verdict]} size={12} />
              </span>
              {t(`verdict.${rule.verdict}`)}
            </span>
            <h3 className={styles.title}>{rule.title}</h3>
            <p className={styles.body}>{rule.body}</p>
          </article>
        </Reveal>
      ))}
    </ul>
  );
}
