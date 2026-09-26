import type { ScalarTokenDto } from '@lynn/contracts';
import { type EasingToken, sampleBezier } from 'entities/design-token';
import { motion, useAnimate, useReducedMotion } from 'motion/react';
import { useState } from 'react';
import { t } from 'shared/i18n';
import { duration as durationPreset, ease } from 'shared/lib';
import { Reveal } from 'shared/ui';
import styles from './Foundations.module.css';

const SIZE = 120;
const PAD = 12;
const TRAVEL_MS = 900;

/** Draws the curve; clicking plays a puck along a track with the same easing. */
function EasingCard({ token, index }: { readonly token: EasingToken; readonly index: number }) {
  const reduced = useReducedMotion();
  const [scope, animate] = useAnimate<HTMLButtonElement>();
  const [runs, setRuns] = useState(0);
  const samples = sampleBezier(token.points);
  const minY = Math.min(0, ...samples.map((sample) => sample.y));
  const maxY = Math.max(1, ...samples.map((sample) => sample.y));
  const span = maxY - minY;
  const toX = (x: number) => PAD + x * (SIZE - PAD * 2);
  const toY = (y: number) => SIZE - PAD - ((y - minY) / span) * (SIZE - PAD * 2);
  const d = samples
    .map((sample, i) => `${i === 0 ? 'M' : 'L'} ${toX(sample.x).toFixed(2)} ${toY(sample.y).toFixed(2)}`)
    .join(' ');

  const play = async () => {
    setRuns((count) => count + 1);
    if (reduced) return;
    const width = scope.current?.querySelector<HTMLElement>('[data-track]')?.offsetWidth ?? 0;
    const travel = width - 24;
    await animate('[data-puck]', { x: [0, travel] }, { duration: TRAVEL_MS / 1000, ease: [...token.points] });
    await animate('[data-puck]', { x: 0 }, { duration: durationPreset.base, ease: ease.inOut });
  };

  return (
    <Reveal index={index}>
      <button
        ref={scope}
        type="button"
        className={styles.easing}
        onClick={() => void play()}
        aria-label={`${t('common.play')} ${token.name}`}
      >
        <span className={styles.label}>{token.name}</span>
        <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className={styles.curve} aria-hidden="true">
          <path
            className={styles.curveGrid}
            d={`M ${PAD} ${toY(0)} H ${SIZE - PAD} M ${PAD} ${toY(1)} H ${SIZE - PAD} M ${toX(0)} ${PAD} V ${SIZE - PAD} M ${toX(1)} ${PAD} V ${SIZE - PAD}`}
          />
          <motion.path
            key={runs}
            className={styles.curvePath}
            d={d}
            initial={reduced ? false : { pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: TRAVEL_MS / 1000, ease: 'linear' }}
          />
        </svg>
        <span className={styles.track} data-track>
          <span className={styles.puck} data-puck />
        </span>
        <span className={`${styles.mono} ${styles.muted}`}>{token.value}</span>
        <span className={styles.muted}>{token.description}</span>
      </button>
    </Reveal>
  );
}

export function EasingBoard({ easings }: { readonly easings: readonly EasingToken[] }) {
  return (
    <div className={styles.easings}>
      {easings.map((token, index) => (
        <EasingCard key={token.name} token={token} index={index} />
      ))}
    </div>
  );
}

export function DurationScale({ tokens }: { readonly tokens: readonly ScalarTokenDto[] }) {
  const reduced = useReducedMotion();
  const [runs, setRuns] = useState(0);
  const longest = Math.max(...tokens.map((token) => Number.parseFloat(token.value)));
  return (
    <button
      type="button"
      className={styles.easing}
      onClick={() => setRuns((count) => count + 1)}
      aria-label={t('ui.playHint')}
    >
      <span className={styles.durations}>
        {tokens.map((token) => {
          const ms = Number.parseFloat(token.value);
          return (
            <span key={token.name} className={styles.durationRow}>
              <span className={styles.mono}>{token.name}</span>
              <span className={`${styles.mono} ${styles.muted}`}>{token.value}</span>
              <span className={styles.durationTrack}>
                <motion.span
                  key={runs}
                  className={styles.durationFill}
                  style={{ width: `${(ms / longest) * 100}%` }}
                  initial={reduced ? false : { scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: runs === 0 }}
                  transition={{ duration: ms / 1000, ease: ease.out }}
                />
              </span>
            </span>
          );
        })}
      </span>
      <span className={styles.muted}>{t('ui.playHint')}</span>
    </button>
  );
}
