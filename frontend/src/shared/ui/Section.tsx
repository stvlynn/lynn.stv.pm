import type { ReactNode } from 'react';
import { Reveal } from './Reveal';
import styles from './Section.module.css';

interface SectionProps {
  readonly id: string;
  readonly title: string;
  /** Drawing reference printed on the right edge, e.g. "CHR-01.3". */
  readonly code?: string;
  readonly aside?: string;
  readonly children: ReactNode;
}

export function Section({ id, title, code, aside, children }: SectionProps) {
  const headingId = `${id}-title`;
  return (
    <section id={id} aria-labelledby={headingId} className={styles.section}>
      <Reveal as="header" className={styles.header}>
        <h2 id={headingId} className={styles.title}>
          {title}
        </h2>
        {code ? <span className={styles.code}>{code}</span> : null}
      </Reveal>
      {aside ? <p className={styles.aside}>{aside}</p> : null}
      {children}
    </section>
  );
}
