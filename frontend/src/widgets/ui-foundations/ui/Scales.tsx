import type { ScalarTokenDto } from '@lynn/contracts';
import { toPixels } from 'entities/design-token';
import { motion, useReducedMotion } from 'motion/react';
import { duration, ease } from 'shared/lib';
import { CopyValue, Reveal } from 'shared/ui';
import styles from './Foundations.module.css';

export function SpaceScale({ tokens }: { readonly tokens: readonly ScalarTokenDto[] }) {
  const reduced = useReducedMotion();
  const largest = Math.max(...tokens.map((token) => toPixels(token.value)));
  return (
    <div className={styles.spaceList}>
      {tokens.map((token, index) => (
        <div key={token.name} className={styles.spaceRow}>
          <span className={styles.mono}>
            <CopyValue value={`var(${token.cssVar})`}>{token.name}</CopyValue>
          </span>
          <span className={`${styles.mono} ${styles.muted}`}>{toPixels(token.value)}px</span>
          <motion.span
            className={styles.spaceBar}
            style={{ width: `${(toPixels(token.value) / largest) * 100}%` }}
            initial={reduced ? false : { scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: duration.slow, ease: ease.out, delay: index * 0.04 }}
            title={token.description}
          />
        </div>
      ))}
    </div>
  );
}

export function RadiusScale({ tokens }: { readonly tokens: readonly ScalarTokenDto[] }) {
  return (
    <div className={styles.radii}>
      {tokens.map((token, index) => (
        <Reveal key={token.name} index={index} className={styles.radiusCard}>
          <span className={styles.radiusShape} style={{ borderTopLeftRadius: `var(${token.cssVar})` }} />
          <span className={styles.mono}>
            <CopyValue value={`var(${token.cssVar})`}>{token.name}</CopyValue>
          </span>
          <span className={`${styles.mono} ${styles.muted}`}>{token.value}</span>
        </Reveal>
      ))}
    </div>
  );
}

export function ElevationScale({ tokens }: { readonly tokens: readonly ScalarTokenDto[] }) {
  return (
    <div className={styles.shadows}>
      {tokens.map((token, index) => (
        <Reveal key={token.name} index={index} className={styles.shadowCard}>
          <span className={styles.shadowSurface} style={{ boxShadow: `var(${token.cssVar})` }} />
          <span className={styles.mono}>
            <CopyValue value={`var(${token.cssVar})`}>{token.name}</CopyValue>
          </span>
          <span className={styles.muted}>{token.description}</span>
        </Reveal>
      ))}
    </div>
  );
}
