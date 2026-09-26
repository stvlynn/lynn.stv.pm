import { TextReveal } from '@/components/motion/text-reveal';
import { motion, useReducedMotion } from 'motion/react';
import type { ReactNode } from 'react';
import { duration, ease } from '../../lib';
import styles from './PageHeader.module.css';

interface PageHeaderProps {
  readonly title: string;
  readonly code: string;
  readonly lead?: ReactNode;
  readonly meta?: readonly string[];
}

/** Page title revealed word by word (beUI TextReveal) under its drawing number. */
export function PageHeader({ title, code, lead, meta = [] }: PageHeaderProps) {
  const reduced = useReducedMotion();
  return (
    <header className={styles.header}>
      <div className={styles.meta}>
        <span>{code}</span>
        {meta.map((item) => (
          <span key={item}>{item}</span>
        ))}
      </div>
      <TextReveal as="h1" text={title} className={styles.title} stagger={0.07} blur={8} yOffset="35%" />
      {lead ? (
        <motion.p
          className={styles.lead}
          initial={reduced ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: duration.slow, ease: ease.out, delay: 0.18 }}
        >
          {lead}
        </motion.p>
      ) : null}
    </header>
  );
}
