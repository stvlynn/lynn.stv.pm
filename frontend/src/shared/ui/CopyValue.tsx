import { ActionSwapIcon } from '@/components/motion/action-swap';
import type { ReactNode } from 'react';
import { t } from '../i18n';
import { useCopy } from '../lib';
import { Icon } from './Icon';
import styles from './CopyValue.module.css';

interface CopyValueProps {
  readonly value: string;
  readonly children?: ReactNode;
}

/** Inline button that copies a token value and confirms with a check. */
export function CopyValue({ value, children }: CopyValueProps) {
  const { copied, copy } = useCopy();
  return (
    <button
      type="button"
      className={styles.button}
      onClick={() => void copy(value)}
      aria-label={`${copied ? t('common.copied') : t('common.copy')} ${value}`}
    >
      {children ?? value}
      <ActionSwapIcon value={copied ? 'check' : 'copy'} className={copied ? styles.done : styles.icon}>
        <Icon name={copied ? 'check' : 'copy'} size={14} />
      </ActionSwapIcon>
    </button>
  );
}
